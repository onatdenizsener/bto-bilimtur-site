// Yalnız yerel deneme için: Amadeus Travel Builder cevaplarını taklit eden sunucu.
// node kaynak/sahte-amadeus.mjs 4199  ->  AMADEUS_GATEWAY_URL=http://localhost:4199 AMADEUS_API_KEY=deneme
import http from 'node:http'

const yer = (id, sub, name, det, iata, city, country) => ({ type: 'location', subType: sub, name, detailedName: det, id, iataCode: iata, address: { cityName: city, countryName: country } })
const YERLER = [
  yer('CANK', 'CITY', 'ANKARA', 'ANKARA/TR', 'ANK', 'ANKARA', 'TURKIYE'),
  yer('AESB', 'AIRPORT', 'ESENBOGA', 'ANKARA/TR:ESENBOGA', 'ESB', 'ANKARA', 'TURKIYE'),
  yer('AAYT', 'AIRPORT', 'ANTALYA', 'ANTALYA/TR', 'AYT', 'ANTALYA', 'TURKIYE'),
  yer('CLON', 'CITY', 'LONDON', 'LONDON/GB', 'LON', 'LONDON', 'UNITED KINGDOM'),
  yer('ALHR', 'AIRPORT', 'HEATHROW', 'LONDON/GB:HEATHROW', 'LHR', 'LONDON', 'UNITED KINGDOM'),
]

const ucus = (al, no, o, d, dep, arr, dur) => ({ marketing_airline: al, flight_number: no, origin: { airport: o }, destination: { airport: d }, departs_at: dep, arrives_at: arr, duration: dur, booking_infos: [{ ptc: 'ADT', travel_class: 'ECONOMY', seats_remaining: 4 }] })

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x')
  res.setHeader('Content-Type', 'application/json')
  if (req.headers['x-api-key'] !== 'deneme') { res.statusCode = 401; return res.end('{"errors":[{"code":38191}]}') }
  if (u.pathname === '/v1/reference-data/locations') {
    const k = (u.searchParams.get('keyword') || '').toLowerCase()
    if (/[^a-z0-9 '"()/:.-]/.test(k)) { res.statusCode = 400; return res.end('{"errors":[{"code":477}]}') }
    return res.end(JSON.stringify({ meta: { count: 1 }, data: YERLER.filter((y) => y.name.toLowerCase().startsWith(k) || y.iataCode.toLowerCase().startsWith(k) || y.address.cityName.toLowerCase().startsWith(k)) }))
  }
  if (u.pathname === '/api/v3/search/') {
    const o = u.searchParams.get('origins').split(','), d = u.searchParams.get('destinations').split(','), t = u.searchParams.get('dates').split(',')
    console.log('arama', o, d, t, u.searchParams.get('disable_deep_links'), u.searchParams.get('currency'))
    const g = t[0], r = t[1]
    const gidis = [
      { m: 'PC', f: [ucus('PC', '2652', 'ESB', 'AYT', `${g}T07:30:00+03:00`, `${g}T08:45:00+03:00`, '01:15')], p: 2150 },
      { m: 'TK', f: [ucus('TK', '2414', 'ESB', 'IST', `${g}T06:00:00+03:00`, `${g}T07:10:00+03:00`, '01:10'), ucus('TK', '2410', 'IST', 'AYT', `${g}T08:30:00+03:00`, `${g}T09:50:00+03:00`, '01:20')], p: 3420 },
      { m: 'VF', f: [ucus('VF', '3052', 'ESB', 'AYT', `${g}T21:40:00+03:00`, `${g}T22:55:00+03:00`, '01:15')], p: 1890 },
    ]
    const donus = r ? [ucus('PC', '2653', 'AYT', 'ESB', `${r}T19:10:00+03:00`, `${r}T20:20:00+03:00`, '01:10')] : null
    const results = gidis.map((x) => ({
      merchant: x.m,
      bounds: [{ duration: '01:15', flights: x.f, included_checked_bags: [{ type: 'weight', weight_amount: 20, weight_unit: 'KG', applicable_legs: [1] }] }, ...(donus ? [{ duration: '01:10', flights: donus }] : [])],
      fare: { currency: 'TRY', itinerary_price: { total_fare: x.p * (r ? 1.9 : 1) }, price_per_adult: { total_fare: x.p * (r ? 1.9 : 1) } },
    }))
    return res.end(JSON.stringify({ request_id: 'x', results, errors: { AJ: '120 - No flight' }, meta: { carriers: { PC: { name: 'Pegasus Airlines' }, TK: { name: 'Turkish Airlines' }, VF: { name: 'AJet' } } } }))
  }
  res.statusCode = 404; res.end('{}')
}).listen(Number(process.argv[2] || 4199))
