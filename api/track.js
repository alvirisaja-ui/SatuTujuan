export default async function handler(req, res) {
  const { courier, awb } = req.query;

  if (!courier || !awb) {
    return res.status(400).json({ status: 400, message: 'Parameter courier dan awb wajib diisi.' });
  }

  // API Key Binderbyte kamu
  const API_KEY = 'sk_92yy1bvow5volp01dnvgispn6kcdrdepvhwbadydurjofbyhhlwy8gwetqusryo1';

  try {
    const response = await fetch(
      `https://api.binderbyte.com/v1/track?api_key=${API_KEY}&courier=${courier}&awb=${awb}`
    );
    const data = await response.json();

    // Kirim data mentah langsung dari Binderbyte ke frontend tanpa diubah tanggal/jamnya
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Gagal mengambil data dari server.' });
  }
}
