export default async function handler(req, res) {
  // Mengambil parameter dari frontend: asal, tujuan, berat (gram), dan kurir (opsional)
  const { origin, destination, weight, courier } = req.query;
  const API_KEY = 'sk_92yy1bvow5volp01dnvgispn6kcdrdepvhwbadydurjofbyhhlwy8gwetqusryo1';

  if (!origin || !destination || !weight) {
    return res.status(400).json({ status: 400, message: 'Kota asal, tujuan, dan berat wajib diisi.' });
  }

  try {
    // Kurir default jika tidak dipilih spesifik
    const courierParam = courier || 'jne,jnt,sicepat,anteraja,pos,tiki,wahana,lion,ninja';
    const response = await fetch(`https://api.binderbyte.com/v1/cost?api_key=${API_KEY}&origin=${origin}&destination=${destination}&weight=${weight}&courier=${courierParam}`);
    const data = await response.json();
    
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Gagal menghubungkan ke layanan ongkos kirim.' });
  }
}
