// Çizgi tarzı sade ikonlar
const P = {
  ucak: 'M3 14l18-7-4 9-6 1-3 4-1-5z M11 16l6-9',
  yatak: 'M3 18V8 M3 14h18v4 M21 14v-2a3 3 0 00-3-3h-7v5 M5.5 11a1.5 1.5 0 103 0 1.5 1.5 0 10-3 0',
  pasaport: 'M6 3h12v18H6z M12 13a3 3 0 100-6 3 3 0 000 6z M9 17h6',
  kalkan: 'M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z M9 12l2 2 4-4',
  insanlar: 'M9 11a3 3 0 100-6 3 3 0 000 6z M3 20c0-3 3-5 6-5s6 2 6 5 M17 11a2.5 2.5 0 100-5 M17 14c2 0 4 1.5 4 4',
  minibus: 'M3 16V7h13l5 5v4z M3 11h18 M7 19a2 2 0 100-4 2 2 0 000 4z M17 19a2 2 0 100-4 2 2 0 000 4z',
  kitap: 'M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1z M12 6v14',
  balon: 'M12 3a6 6 0 016 6c0 4-4 7-6 8-2-1-6-4-6-8a6 6 0 016-6z M10 17l1 3h2l1-3 M12 3c-2 2-2 11 0 14 M12 3c2 2 2 11 0 14',
  tel: 'M5 4h4l2 5-3 2a11 11 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  wa: 'M4 20l1.5-4A8 8 0 1112 20a8 8 0 01-4-1z M9 9c0 3 3 6 6 6l1-2-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z',
  pin: 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z M12 12a2 2 0 100-4 2 2 0 000 4z',
  araba: 'M3 16v-4l2-5h14l2 5v4z M3 12h18 M7 19a2 2 0 100-4 2 2 0 000 4z M17 19a2 2 0 100-4 2 2 0 000 4z',
  saat: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 7v5l3 2',
  koltuk:'M7 4v9h10 M7 13l-1 7 M17 13v7 M7 9h6',
}

export default function Ikon({ ad, boyut = 24 }) {
  return (
    <svg className="ikon" width={boyut} height={boyut} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[ad]} />
    </svg>
  )
}
