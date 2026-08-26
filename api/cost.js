export default async function handler(req, res) {
  const { origin, destination, weight, courier } = req.query;
  const API_KEY = 'sk_92yy1bvow5volp01dnvgispn6kcdrdepvhwbadydurjofbyhhlwy8gwetqusryo1';

  if (!origin || !destination || !weight) {
    return res.status(400).json({ status: 400, message: 'Kota asal, tujuan, dan berat wajib diisi.' });
  }

  try {
    // Fungsi pencari ID kecamatan ke API Binderbyte
    async function getDistrictId(cityName) {
      const response = await fetch(`https://api.binderbyte.com/v1/list/district?api_key=${API_KEY}&query=${encodeURIComponent(cityName)}`);
      const result = await response.json();
      
      if (result.status === 200 && result.data && result.data.length > 0) {
        return result.data[0].id;
      }
      return null;
    }

    const originId = await getDistrictId(origin);
    const destinationId = await getDistrictId(destination);

    if (!originId) {
      return res.status(404).json({ status: 404, message: `Kecamatan asal "${origin}" tidak ditemukan. Gunakan nama kecamatan spesifik (Contoh: Coblong, Kebayoran Baru, Tebet).` });
    }
    if (!destinationId) {
      return res.status(404).json({ status: 404, message: `Kecamatan tujuan "${destination}" tidak ditemukan. Gunakan nama kecamatan spesifik (Contoh: Coblong, Kebayoran Baru, Tebet).` });
    }

    const courierParam = courier || 'jne,jnt,sicepat,anteraja,pos,tiki,wahana,lion,ninja';
    const costResponse = await fetch(`https://api.binderbyte.com/v1/cost?api_key=${API_KEY}&origin=${originId}&destination=${destinationId}&weight=${weight}&courier=${courierParam}`);
    const costData = await costResponse.json();
    
    return res.status(200).json(costData);

  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Gagal menghubungkan ke layanan pengiriman.' });
  }
}
