export default async function handler(req, res) {
  // Mengambil query dari frontend (resi & courier)
  const { courier, awb } = req.query;
  const API_KEY = 'sk_92yy1bvow5volp01dnvgispn6kcdrdepvhwbadydurjofbyhhlwy8gwetqusryo1';

  if (!courier || !awb) {
    return res.status(400).json({ status: 400, message: 'Nomor resi dan kurir wajib diisi.' });
  }

  try {
    const response = await fetch(`https://api.binderbyte.com/v1/track?api_key=${API_KEY}&courier=${courier}&awb=${awb}`);
    const data = await response.json();
    
    // Mengembalikan data Binderbyte ke frontend
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Gagal menghubungkan ke server pengiriman.' });
  }
}
