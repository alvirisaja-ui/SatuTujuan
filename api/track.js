export default async function handler(req, res) {
  const { courier, awb } = req.query;

  if (!courier || !awb) {
    return res.status(400).json({ status: 400, message: 'Parameter courier dan awb wajib diisi.' });
  }

  // Masukkan API Key Binderbyte Kamu di sini
  const API_KEY = process.env.BINDERBYTE_API_KEY || 'MASUKKAN_API_KEY_KAMU_DI_SINI';

  try {
    const response = await fetch(
      `https://api.binderbyte.com/v1/track?api_key=${API_KEY}&courier=${courier}&awb=${awb}`
    );
    const data = await response.json();

    // Kirim data MENTAH langsung ke frontend tanpa diubah/diolah tanggalnya sama sekali
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Gagal mengambil data dari server.' });
  }
}
