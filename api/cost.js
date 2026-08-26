export default async function handler(req, res) {
  const { origin, destination, weight, courier } = req.query;
  const API_KEY = 'sk_92yy1bvow5volp01dnvgispn6kcdrdepvhwbadydurjofbyhhlwy8gwetqusryo1';

  if (!origin || !destination || !weight) {
    return res.status(400).json({ status: 400, message: 'Kota asal, tujuan, dan berat wajib diisi.' });
  }

  try {
    // 1. Cari kode kecamatan asal & tujuan
    const [resOrigin, resDest] = await Promise.all([
      fetch(`https://api.binderbyte.com/v1/list/district?api_key=${API_KEY}&query=${encodeURIComponent(origin)}`),
      fetch(`https://api.binderbyte.com/v1/list/district?api_key=${API_KEY}&query=${encodeURIComponent(destination)}`)
    ]);

    const dataOrigin = await resOrigin.json();
    const dataDest = await resDest.json();

    if (!dataOrigin.data || dataOrigin.data.length === 0) {
      return res.status(404).json({ status: 404, message: `Kecamatan/Kota asal "${origin}" tidak ditemukan. Coba nama kecamatan.` });
    }
    if (!dataDest.data || dataDest.data.length === 0) {
      return res.status(404).json({ status: 404, message: `Kecamatan/Kota tujuan "${destination}" tidak ditemukan. Coba nama kecamatan.` });
    }

    // Ambil ID kecamatan pertama yang cocok
    const originId = dataOrigin.data[0].id;
    const destinationId = dataDest.data[0].id;

    // 2. Hitung ongkir menggunakan ID kecamatan
    const courierParam = courier || 'jne,jnt,sicepat,anteraja,pos,tiki,wahana,lion,ninja';
    const response = await fetch(`https://api.binderbyte.com/v1/cost?api_key=${API_KEY}&origin=${originId}&destination=${destinationId}&weight=${weight}&courier=${courierParam}`);
    const data = await response.json();
    
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Gagal menghubungkan ke layanan pengiriman.' });
  }
}
