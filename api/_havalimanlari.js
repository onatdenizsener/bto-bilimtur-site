// BTO müşterilerinin en çok uçtuğu yerler. Amadeus anahtarı yokken ya da cevap vermezken arama bu listeden yapılır.
// [IATA, tür, ad, şehir, ülke, aramada eşleşecek ek kelimeler]
export const HAVALIMANLARI = [
  ['ESB', 'AIRPORT', 'Ankara Esenboğa', 'Ankara', 'Türkiye', 'ankara esenboga'],
  ['IST', 'AIRPORT', 'İstanbul Havalimanı', 'İstanbul', 'Türkiye', 'istanbul'],
  ['SAW', 'AIRPORT', 'Sabiha Gökçen', 'İstanbul', 'Türkiye', 'istanbul sabiha gokcen'],
  ['AYT', 'AIRPORT', 'Antalya', 'Antalya', 'Türkiye', 'antalya'],
  ['ADB', 'AIRPORT', 'İzmir Adnan Menderes', 'İzmir', 'Türkiye', 'izmir adnan menderes'],
  ['BJV', 'AIRPORT', 'Bodrum Milas', 'Bodrum', 'Türkiye', 'bodrum milas mugla'],
  ['DLM', 'AIRPORT', 'Dalaman', 'Dalaman', 'Türkiye', 'dalaman fethiye marmaris mugla'],
  ['TZX', 'AIRPORT', 'Trabzon', 'Trabzon', 'Türkiye', 'trabzon karadeniz'],
  ['NAV', 'AIRPORT', 'Kapadokya', 'Nevşehir', 'Türkiye', 'kapadokya nevsehir cappadocia'],
  ['ASR', 'AIRPORT', 'Kayseri Erkilet', 'Kayseri', 'Türkiye', 'kayseri kapadokya'],
  ['GZT', 'AIRPORT', 'Gaziantep', 'Gaziantep', 'Türkiye', 'gaziantep antep'],
  ['VAN', 'AIRPORT', 'Van Ferit Melen', 'Van', 'Türkiye', 'van'],
  ['ERZ', 'AIRPORT', 'Erzurum', 'Erzurum', 'Türkiye', 'erzurum'],
  ['DIY', 'AIRPORT', 'Diyarbakır', 'Diyarbakır', 'Türkiye', 'diyarbakir'],
  ['ECN', 'AIRPORT', 'Ercan', 'Lefkoşa', 'KKTC', 'kibris ercan lefkosa girne cyprus'],
  ['LON', 'CITY', 'Londra (tüm havalimanları)', 'Londra', 'Birleşik Krallık', 'londra london ingiltere'],
  ['PAR', 'CITY', 'Paris (tüm havalimanları)', 'Paris', 'Fransa', 'paris fransa'],
  ['BCN', 'AIRPORT', 'Barselona El Prat', 'Barselona', 'İspanya', 'barselona barcelona ispanya'],
  ['PRG', 'AIRPORT', 'Prag Václav Havel', 'Prag', 'Çekya', 'prag prague cekya'],
  ['MIL', 'CITY', 'Milano (tüm havalimanları)', 'Milano', 'İtalya', 'milano milan italya'],
  ['ROM', 'CITY', 'Roma (tüm havalimanları)', 'Roma', 'İtalya', 'roma rome italya'],
  ['AMS', 'AIRPORT', 'Amsterdam Schiphol', 'Amsterdam', 'Hollanda', 'amsterdam hollanda'],
  ['BRU', 'AIRPORT', 'Brüksel', 'Brüksel', 'Belçika', 'bruksel brussels belcika'],
  ['FRA', 'AIRPORT', 'Frankfurt', 'Frankfurt', 'Almanya', 'frankfurt almanya'],
  ['BER', 'AIRPORT', 'Berlin Brandenburg', 'Berlin', 'Almanya', 'berlin almanya'],
  ['MUC', 'AIRPORT', 'Münih', 'Münih', 'Almanya', 'munih munich almanya'],
  ['VIE', 'AIRPORT', 'Viyana', 'Viyana', 'Avusturya', 'viyana vienna avusturya'],
  ['STO', 'CITY', 'Stockholm (tüm havalimanları)', 'Stockholm', 'İsveç', 'stockholm isvec'],
  ['OSL', 'AIRPORT', 'Oslo', 'Oslo', 'Norveç', 'oslo norvec'],
  ['CPH', 'AIRPORT', 'Kopenhag', 'Kopenhag', 'Danimarka', 'kopenhag copenhagen danimarka'],
  ['NYC', 'CITY', 'New York (tüm havalimanları)', 'New York', 'ABD', 'new york abd amerika'],
  ['DXB', 'AIRPORT', 'Dubai', 'Dubai', 'BAE', 'dubai'],
  ['BAK', 'CITY', 'Bakü', 'Bakü', 'Azerbaycan', 'baku azerbaycan'],
]

// Türkçe harfleri sadeleştirir: aramada "İzmir", "izmir", "IZMIR" aynı sonucu verir
export const sade = (s) => String(s || '')
  .replace(/[İIı]/g, 'i').replace(/[Ğğ]/g, 'g').replace(/[Üü]/g, 'u').replace(/[Şş]/g, 's').replace(/[Öö]/g, 'o').replace(/[Çç]/g, 'c')
  .normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function yerelAra(q, limit = 8) {
  const k = sade(q).trim()
  if (!k) return []
  return HAVALIMANLARI
    .filter(([iata, , ad, sehir, , ek]) => iata.toLowerCase().startsWith(k) || sade(`${ad} ${sehir} ${ek}`).split(/\s+/).some((s) => s.startsWith(k)))
    .slice(0, limit)
    .map(([iata, tip, ad, sehir, ulke]) => ({ id: (tip === 'CITY' ? 'C' : 'A') + iata, iata, tip, ad, sehir, ulke }))
}

// Sık görülen havayolu kodları (Amadeus cevabında yalnız satıcı adları gelir)
export const HAVAYOLLARI = {
  TK: 'Türk Hava Yolları', PC: 'Pegasus', XQ: 'SunExpress', VF: 'AJet', LH: 'Lufthansa', BA: 'British Airways',
  AF: 'Air France', KL: 'KLM', LX: 'Swiss', OS: 'Austrian', SN: 'Brussels Airlines', AZ: 'ITA Airways', IB: 'Iberia',
  VY: 'Vueling', U2: 'easyJet', FR: 'Ryanair', W6: 'Wizz Air', EK: 'Emirates', QR: 'Qatar Airways', EY: 'Etihad',
  SK: 'SAS', DY: 'Norwegian', OK: 'Czech Airlines', J2: 'AZAL', A3: 'Aegean', UA: 'United', AA: 'American Airlines', DL: 'Delta',
}
