export default async function handler(req, res) {
  // Atur Header CORS agar API tidak diblokir browser
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { origin, destination, weight, courier } = req.query;
  const API_KEY = 'sk_92yy1bvow5volp01dnvgispn6kcdrdepvhwbadydurjofbyhhlwy8gwetqusryo1';

  if (!origin || !destination || !weight) {
    return res.status(400).json({ status: 400, message: 'Lokasi asal, tujuan, dan berat wajib diisi.' });
  }

  try {
    // Helper pencari ID kecamatan ke API Binderbyte
    const getDistrictId = async (name) => {
      const url = `https://api.binderbyte.com/v1/list/district?api_key=${API_KEY}&query=${encodeURIComponent(name)}`;
      const resp = await fetch(url);
      const json = await resp.json();
      if (json.status === 200 && json.data && json.data.length > 0) {
        return json.data[0].id;
      }
      return null;
    };

    const originId = await getDistrictId(origin);
    const destinationId = await getDistrictId(destination);

    if (!originId) {
      return res.status(400).json({ status: 400, message: `Kecamatan asal "${origin}" tidak ditemukan. Gunakan nama kecamatan spesifik (Contoh: Banyumanik, Coblong, Tebet).` });
    }
    if (!destinationId) {
      return res.status(400).json({ status: 400, message: `Kecamatan tujuan "${destination}" tidak ditemukan. Gunakan nama kecamatan spesifik (Contoh: Banyumanik, Coblong, Tebet).` });
    }

    const courierList = courier || 'jne,jnt,sicepat,anteraja,pos,tiki';
    const costUrl = `https://api.binderbyte.com/v1/cost?api_key=${API_KEY}&origin=${originId}&destination=${destinationId}&weight=${weight}&courier=${courierList}`;
    
    const costResp = await fetch(costUrl);
    const costData = await costResp.json();

    return res.status(200).json(costData);

  } catch (err) {
    return res.status(500).json({ status: 500, message: 'Terjadi kesalahan server: ' + err.message });
  }
}
