// BTO Bilimtur logosu, vektör olarak yeniden çizildi (orijinal: btotravel.com/images/logo.png).
// Kırmızı "BT", lacivert kare içinde ışınsal halka ("O"), aralıklı "bilimtur", altında "Turizm Organizasyon".
// <Halka> logonun "O"su; sitede marka işareti olarak tek başına da kullanılıyor.

export const KIRMIZI = '#e3060b'
export const LACIVERT = '#060034'

const ISIN = 48
export function Halka({ boyut = 64, kare = true, className = '', donen = false, ic = 23, dis = 41, sayi = ISIN }) {
  return (
    <svg className={`halka ${donen ? 'halka-donen' : ''} ${className}`} width={boyut} height={boyut} viewBox="-50 -50 100 100" aria-hidden="true">
      {kare && <rect x="-50" y="-50" width="100" height="100" fill={LACIVERT} />}
      <g className="halka-isinlar">
        {Array.from({ length: sayi }).map((_, i) => (
          <line key={i} x1="0" y1={-ic} x2="0" y2={-dis} transform={`rotate(${(i * 360) / sayi})`}
            stroke={i % 2 ? '#c9cbe0' : '#ffffff'} strokeWidth={sayi > 60 ? 1.6 : 3.2} strokeLinecap="round" style={{ '--i': i }} />
        ))}
      </g>
      <circle r={ic - 2} fill={LACIVERT} />
    </svg>
  )
}

export default function Logo({ koyuZemin = false, kisa = false, className = '' }) {
  const yazi = koyuZemin ? '#ffffff' : LACIVERT
  return (
    <span className={`bto-logo ${kisa ? 'kisa' : ''} ${className}`}>
      <svg viewBox="0 0 560 82" role="img" aria-label="BTO Bilimtur Turizm Organizasyon">
        <g className="logo-bt"><text x="0" y="74" fill={KIRMIZI} fontFamily="Archivo Black, Overpass, sans-serif" fontWeight="400" fontSize="88" letterSpacing="-3">BT</text></g>
        <g transform="translate(174 41)"><g className="logo-o">
          <rect x="-40" y="-40" width="80" height="80" fill={LACIVERT} />
          <g className="halka-isinlar">
            {Array.from({ length: ISIN }).map((_, i) => (
              <line key={i} x1="0" y1="-18" x2="0" y2="-33" transform={`rotate(${(i * 360) / ISIN})`}
                stroke={i % 2 ? '#c9cbe0' : '#ffffff'} strokeWidth="2.6" strokeLinecap="round" style={{ '--i': i }} />
            ))}
          </g>
          <circle r="17" fill={LACIVERT} />
        </g></g>
        {!kisa && (
          <g className="logo-ad">
            <text x="226" y="38" fill={yazi} fontFamily="Courier Prime, Courier New, monospace" fontWeight="700" fontSize="42" textLength="330" lengthAdjust="spacing">
              {'bilimtur'.split('').map((h, i) => <tspan key={i} style={{ '--i': i }}>{h}</tspan>)}
            </text>
            <text x="224" y="78" fill={yazi} fontFamily="Oswald, Arial Narrow, sans-serif" fontWeight="300" fontSize="33" textLength="332" lengthAdjust="spacingAndGlyphs">Turizm Organizasyon</text>
          </g>
        )}
      </svg>
    </span>
  )
}
