/**
 * VERITABANINA BAĞLANTI YARDIMCISI
 * 
 * MongoDB veritabanına bağlanmak için kullanılır.
 * Tek bir bağlantı örneği oluşturur (singleton pattern).
 */

import mongoose from 'mongoose';

// Bağlantı durumunu takip etmek için değişken
let isConnected = false;

/**
 * MongoDB'ye Bağlan
 * 
 * Eğer zaten bağlıysa tekrar bağlanmaz.
 * Bağlantı başarısız olursa hata fırlatır.
 */
export async function connectToDatabase(): Promise<void> {
  // Zaten bağlıysa tekrar bağlanma
  if (isConnected) {
    console.log('✅ Veritabanı zaten bağlı');
    return;
  }

  try {
    // MongoDB bağlantı URL'ini çevresel değişkenden al
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('❌ MONGODB_URI çevresel değişkeni tanımlanmamış!');
    }

    // MongoDB'ye bağlan
    await mongoose.connect(MONGODB_URI);

    isConnected = true;
    console.log('✅ MongoDB bağlantısı başarılı');
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error);
    throw error;
  }
}

/**
 * Bağlantıyı Kapat
 * 
 * Uygulama kapanırken veritabanı bağlantısını güvenli şekilde kapatır.
 */
export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('✅ MongoDB bağlantısı kapatıldı');
  } catch (error) {
    console.error('❌ MongoDB bağlantısını kapatırken hata:', error);
    throw error;
  }
}
