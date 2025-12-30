#!/usr/bin/env node
/**
 * Bulk product importer (NDJSON + optional .gz)
 * - Streams large files/URLs without loading into memory
 * - Batch upsert via bulkWrite
 * - Minimal required fields: name, brand, category, images, at least one price
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const zlib = require('zlib');
const axios = require('axios');
const mongoose = require('mongoose');

const DEFAULT_BATCH_SIZE = parseInt(process.env.IMPORT_BATCH_SIZE || '500', 10);

// Resolve Product model from existing schema
function getProductModel() {
  try {
    return mongoose.model('Product');
  } catch (err) {
    const ProductSchema = require('../server/routes/schemas/product');
    return mongoose.model('Product', ProductSchema);
  }
}

// Parse CLI args (very small helper)
function parseArgs() {
  const args = process.argv.slice(2);
  const out = { batch: DEFAULT_BATCH_SIZE, source: null };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if ((arg === '--source' || arg === '-s') && args[i + 1]) {
      out.source = args[i + 1];
      i += 1;
    } else if ((arg === '--batch' || arg === '-b') && args[i + 1]) {
      out.batch = Math.max(1, parseInt(args[i + 1], 10));
      i += 1;
    } else if (arg === '--help' || arg === '-h') {
      out.help = true;
    }
  }

  return out;
}

function printHelp() {
  console.log(`\nUsage: node scripts/import-products.js --source <path-or-url> [--batch 500]\n\n` +
    `Supported formats: NDJSON (.ndjson) optionally gzipped (.gz).\n` +
    `Each line must be a JSON object representing one product.\n` +
    `Batch upsert size defaults to ${DEFAULT_BATCH_SIZE}.\n` +
    `Example: node scripts/import-products.js --source https://example.com/products.ndjson.gz --batch 800\n`);
}

// Create a readable stream from file or URL
async function openStream(source) {
  const isHttp = /^https?:\/\//i.test(source);
  if (isHttp) {
    const response = await axios.get(source, { responseType: 'stream' });
    return response.data;
  }
  return fs.createReadStream(path.resolve(source));
}

function maybeGunzip(stream, source) {
  if (source.endsWith('.gz')) {
    return stream.pipe(zlib.createGunzip());
  }
  return stream;
}

// Convert a raw input object into our Product shape; return null to skip
function normalizeProduct(raw) {
  const name = raw.name || raw.title;
  const brand = raw.brand || raw.manufacturer;
  const category = raw.category || raw.categoryName || 'Diğer';

  if (!name || !brand) return null;

  const images = Array.isArray(raw.images) ? raw.images.filter(Boolean) : [];
  if (!images.length && raw.image) images.push(raw.image);
  if (!images.length) return null;

  // Prices: accept single or array
  const prices = [];
  const pushPrice = (p) => {
    if (!p) return;
    const priceNum = Number(p.price || p.amount || p.value);
    if (Number.isNaN(priceNum)) return;
    prices.push({
      siteName: p.siteName || p.vendor || p.seller || 'source',
      price: priceNum,
      url: p.url || p.link || p.href || 'https://example.com',
      inStock: p.inStock !== false,
      lastUpdated: p.lastUpdated ? new Date(p.lastUpdated) : new Date()
    });
  };

  if (Array.isArray(raw.prices)) raw.prices.forEach(pushPrice);
  else if (raw.price || raw.amount || raw.value) pushPrice(raw);

  if (!prices.length) return null;

  // Specifications: accept array of {name,value} or object map
  const specifications = [];
  if (Array.isArray(raw.specifications)) {
    raw.specifications.forEach((s) => {
      if (s && s.name && s.value) {
        specifications.push({
          name: String(s.name),
          value: String(s.value),
          category: s.category || category,
          unit: s.unit || undefined
        });
      }
    });
  } else if (raw.specifications && typeof raw.specifications === 'object') {
    Object.entries(raw.specifications).forEach(([key, val]) => {
      if (val === undefined || val === null) return;
      specifications.push({
        name: String(key),
        value: Array.isArray(val) ? val.join(', ') : String(val),
        category,
        unit: undefined
      });
    });
  }

  const description = raw.description || raw.summary || raw.overview || name;
  const model = raw.model || raw.sku || raw.mpn || '';

  return {
    name,
    description,
    category,
    subcategory: raw.subcategory || raw.categoryPath || '',
    brand,
    model,
    images,
    specifications,
    prices,
    ingredients: Array.isArray(raw.ingredients) ? raw.ingredients : [],
    rating: Number(raw.rating) || 0,
    reviewCount: Number(raw.reviewCount) || Number(raw.reviews) || 0
  };
}

function buildUpsert(doc) {
  // Upsert key: name+brand+model to avoid duplicates without needing sku field
  return {
    updateOne: {
      filter: {
        name: doc.name,
        brand: doc.brand,
        model: doc.model || null
      },
      update: { $set: doc },
      upsert: true
    }
  };
}

async function flushBatch(Product, ops, stats) {
  if (!ops.length) return;
  await Product.bulkWrite(ops, { ordered: false, writeConcern: { w: 1 } });
  stats.written += ops.length;
  ops.length = 0;
}

async function importNdjson({ source, batch }) {
  if (!source) throw new Error('Missing --source <path-or-url>');

  const Product = getProductModel();
  const rawStream = await openStream(source);
  const stream = maybeGunzip(rawStream, source);

  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  const ops = [];
  const stats = { read: 0, skipped: 0, written: 0 };

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    stats.read += 1;

    let raw;
    try {
      raw = JSON.parse(trimmed);
    } catch (err) {
      stats.skipped += 1;
      continue;
    }

    const doc = normalizeProduct(raw);
    if (!doc) {
      stats.skipped += 1;
      continue;
    }

    ops.push(buildUpsert(doc));

    if (ops.length >= batch) {
      await flushBatch(Product, ops, stats);
      process.stdout.write(`Processed: ${stats.read}, upserts: ${stats.written}, skipped: ${stats.skipped}\r`);
    }
  }

  if (ops.length) {
    await flushBatch(Product, ops, stats);
  }

  console.log(`\nDone. Read ${stats.read}, upserted ${stats.written}, skipped ${stats.skipped}.`);
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in environment');
  }

  const source = args.source;
  const batch = args.batch || DEFAULT_BATCH_SIZE;

  console.log(`\n📦 Import started\n- Source: ${source}\n- Batch size: ${batch}\n- DB: ${process.env.MONGODB_URI}\n`);

  await mongoose.connect(process.env.MONGODB_URI);

  try {
    await importNdjson({ source, batch });
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error('\nImport failed:', err.message);
  process.exit(1);
});
