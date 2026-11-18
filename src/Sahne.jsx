// Sahne çizimleri (SVG). Her sahnede tek, sade bir hareket var.
// Firmanın gerçek fotoğrafları gelince <Sahne> yerine <img> konabilir.

const Gok = ({ id, ust, alt }) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={ust} /><stop offset="1" stopColor={alt} />
    </linearGradient>
  </defs>
)

const Balon = ({ x, y, s = 1, renk, serit = '#fff', sinif = '' }) => (
  <g className={sinif} style={{ transformOrigin: `${x}px ${y}px` }}>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -60 C38 -60 48 -30 40 -5 C34 14 14 26 8 38 L-8 38 C-14 26 -34 14 -40 -5 C-48 -30 -38 -60 0 -60Z" fill={renk} />
      <path d="M0 -60 C14 -60 18 -30 14 -5 C12 14 6 26 4 38 L-4 38 C-6 26 -12 14 -14 -5 C-18 -30 -14 -60 0 -60Z" fill={serit} opacity=".9" />
      <path d="M-8 38 L-7 48 M8 38 L7 48" stroke="#14213d" strokeWidth="1.5" />
      <rect x="-8" y="48" width="16" height="11" rx="2" fill="#8a5a3c" />
    </g>
  </g>
)

const Baca = ({ x, t, h, w = 34, renk = '#e2b98f', sapka = '#a8775a' }) => (
  <g>
    <path d={`M${x - w} ${t + h} Q${x - w * .55} ${t + h * .45} ${x - 9} ${t + 16} L${x + 9} ${t + 16} Q${x + w * .55} ${t + h * .45} ${x + w} ${t + h}Z`} fill={renk} />
    <ellipse cx={x} cy={t + 12} rx="15" ry="11" fill={sapka} />
  </g>
)

function Kapadokya() {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Kapadokya’da gün doğarken peri bacaları ve balonlar">
      <Gok id="g-kap" ust="#bcd9ee" alt="#fde3c4" />
      <rect width="800" height="500" fill="url(#g-kap)" />
      <circle cx="640" cy="330" r="60" fill="#ffd36b" opacity=".75" />
      <Balon x={150} y={120} s={.62} renk="#f2b705" sinif="an-yuksel" />
      <Balon x={330} y={85} s={.8} renk="#0f6e72" serit="#f2b705" sinif="an-yuksel an-gec1" />
      <Balon x={520} y={130} s={.5} renk="#14213d" serit="#dcebf5" sinif="an-yuksel an-gec2" />
      <Balon x={690} y={80} s={.42} renk="#e8a28f" sinif="an-yuksel an-gec3" />
      <path d="M0 360 Q120 320 260 345 Q420 300 560 340 Q680 310 800 330 L800 500 L0 500Z" fill="#ecc9a0" />
      <Baca x={90} t={300} h={110} />
      <Baca x={150} t={330} h={80} w={26} />
      <Baca x={420} t={280} h={130} w={38} />
      <Baca x={480} t={320} h={90} w={28} />
      <Baca x={700} t={300} h={110} />
      <path d="M0 410 Q200 380 400 400 T800 395 L800 500 L0 500Z" fill="#c99a72" />
      <Baca x={270} t={340} h={120} w={40} renk="#d4a77d" sapka="#8f6248" />
      <Baca x={600} t={350} h={110} w={36} renk="#d4a77d" sapka="#8f6248" />
      <path d="M0 470 Q200 445 400 465 T800 455 L800 500 L0 500Z" fill="#b5835e" />
    </svg>
  )
}

function Gulet() {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Koyda demirli bir gulet">
      <Gok id="g-gul" ust="#bfe0f2" alt="#eaf6fb" />
      <rect width="800" height="500" fill="url(#g-gul)" />
      <path d="M0 260 Q120 180 260 230 Q380 170 520 240 Q640 200 800 250 L800 300 L0 300Z" fill="#7fae8f" />
      <path d="M0 280 Q200 250 400 270 T800 265 L800 300 L0 300Z" fill="#5f9174" />
      <rect y="290" width="800" height="210" fill="#2f8fa3" />
      <path d="M0 330 Q100 320 200 330 T400 330 T600 330 T800 330" stroke="#7fc6d4" strokeWidth="3" fill="none" opacity=".6" />
      <path d="M0 400 Q100 390 200 400 T400 400 T600 400 T800 400" stroke="#7fc6d4" strokeWidth="3" fill="none" opacity=".4" />
      <g className="an-salla" style={{ transformOrigin: '400px 360px' }}>
        <path d="M250 330 L560 330 Q545 375 520 380 L290 380 Q260 370 250 330Z" fill="#fff" />
        <path d="M262 355 L548 355" stroke="#14213d" strokeWidth="5" />
        <rect x="320" y="305" width="150" height="25" rx="4" fill="#8a5a3c" />
        <path d="M360 305 L360 140 M450 305 L450 170" stroke="#14213d" strokeWidth="5" />
        <path d="M365 150 L365 295 L440 295Z" fill="#f2b705" />
        <path d="M455 180 L455 295 L520 295Z" fill="#fff" stroke="#dcebf5" />
      </g>
    </svg>
  )
}

function Akdeniz() {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Akdeniz’de güneşli bir sahil">
      <Gok id="g-akd" ust="#9fd0ec" alt="#e6f4fb" />
      <rect width="800" height="500" fill="url(#g-akd)" />
      <circle className="an-nefes" cx="620" cy="120" r="55" fill="#f2b705" style={{ transformOrigin: '620px 120px' }} />
      <rect y="280" width="800" height="120" fill="#1f86a8" />
      <path d="M0 300 Q200 290 400 300 T800 300" stroke="#8fd0e4" strokeWidth="3" fill="none" />
      <path d="M0 390 Q250 360 500 385 T800 370 L800 500 L0 500Z" fill="#f1d9a8" />
      <path d="M150 400 Q160 320 175 250" stroke="#8a5a3c" strokeWidth="9" fill="none" />
      <g fill="#3e8f5f"><path d="M175 250 Q130 230 95 255 Q140 245 175 255Z" /><path d="M175 250 Q220 225 255 250 Q210 242 175 255Z" /><path d="M175 250 Q150 205 120 200 Q155 220 172 252Z" /><path d="M175 250 Q205 205 235 205 Q200 222 178 252Z" /></g>
      <path d="M520 430 L640 430 M580 430 L580 340" stroke="#14213d" strokeWidth="4" />
      <path d="M530 345 Q580 315 630 345Z" fill="#f2b705" />
    </svg>
  )
}

function Karadeniz() {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Karadeniz yaylası ve sis">
      <Gok id="g-kar" ust="#d6e6ee" alt="#f2f7f4" />
      <rect width="800" height="500" fill="url(#g-kar)" />
      <path d="M0 300 L120 150 L230 260 L360 110 L500 270 L620 160 L800 300 L800 500 L0 500Z" fill="#6f9a86" />
      <path d="M0 360 L150 240 L300 340 L450 230 L620 350 L800 270 L800 500 L0 500Z" fill="#3f7a5c" />
      <g className="an-kay" opacity=".85"><rect x="-200" y="290" width="520" height="34" rx="17" fill="#fff" /><rect x="420" y="330" width="420" height="28" rx="14" fill="#fff" /></g>
      <path d="M0 420 Q200 380 400 410 T800 400 L800 500 L0 500Z" fill="#2c5f45" />
      <g fill="#fff" stroke="#14213d" strokeWidth="3"><path d="M520 410 L520 370 L555 345 L590 370 L590 410Z" /></g>
      <path d="M512 372 L555 340 L598 372" stroke="#8a5a3c" strokeWidth="8" fill="none" />
    </svg>
  )
}

function Istanbul() {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Akşam İstanbul Boğazı ve köprü">
      <Gok id="g-ist" ust="#2a3d6b" alt="#f3b9a0" />
      <rect width="800" height="500" fill="url(#g-ist)" />
      <g fill="#14213d">
        <path d="M60 330 L60 250 Q100 200 140 250 L140 330Z" /><rect x="40" y="200" width="8" height="130" /><rect x="152" y="200" width="8" height="130" />
        <path d="M44 200 L44 185 L48 175 L52 185 L52 200Z" />
        <rect x="200" y="290" width="70" height="40" /><rect x="290" y="270" width="50" height="60" />
      </g>
      <path d="M380 330 L380 170 M720 330 L720 170" stroke="#14213d" strokeWidth="10" />
      <path d="M300 300 Q550 300 800 300" stroke="#14213d" strokeWidth="8" />
      <path d="M380 172 Q550 300 720 172" stroke="#14213d" strokeWidth="3" fill="none" />
      <g stroke="#f2b705" strokeWidth="2" className="an-yanson"><path d="M420 205 L420 300 M470 240 L470 300 M520 262 L520 300 M570 268 L570 300 M620 250 L620 300 M670 218 L670 300" /></g>
      <rect y="330" width="800" height="170" fill="#1e3463" />
      <g className="an-salla" style={{ transformOrigin: '250px 395px' }}><path d="M190 385 L320 385 L305 405 L205 405Z" fill="#fff" /><rect x="220" y="370" width="60" height="15" fill="#f2b705" /></g>
    </svg>
  )
}

function Kibris() {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Kıbrıs’ta liman ve kale">
      <Gok id="g-kib" ust="#a9d6ef" alt="#f1f8fc" />
      <rect width="800" height="500" fill="url(#g-kib)" />
      <path d="M0 260 Q200 170 420 230 Q600 150 800 220 L800 300 L0 300Z" fill="#b9a07a" />
      <g fill="#d8c09a"><rect x="470" y="200" width="160" height="100" /><rect x="460" y="180" width="30" height="40" /><rect x="610" y="180" width="30" height="40" /></g>
      <rect y="295" width="800" height="205" fill="#2384a6" />
      <path className="an-ucus" d="M60 120 L130 105 L118 120 L150 128 L118 130 L128 146Z" fill="#14213d" />
      <path d="M0 360 Q200 350 400 360 T800 360" stroke="#8fd0e4" strokeWidth="3" fill="none" opacity=".6" />
    </svg>
  )
}

function Avrupa() {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Avrupa şehir silueti">
      <Gok id="g-avr" ust="#cfe1ef" alt="#f6f9fc" />
      <rect width="800" height="500" fill="url(#g-avr)" />
      <g fill="#14213d">
        <path d="M120 420 L150 160 L165 160 L195 420Z" /><rect x="100" y="410" width="120" height="10" />
        <path d="M128 330 L187 330 L184 345 L131 345Z" fill="#dcebf5" />
        <rect x="260" y="250" width="40" height="170" /><path d="M260 250 L280 200 L300 250Z" /><circle cx="280" cy="280" r="10" fill="#f2b705" />
        <rect x="340" y="300" width="120" height="120" /><path d="M340 300 Q400 230 460 300Z" />
        <rect x="500" y="270" width="30" height="150" /><path d="M500 270 L515 220 L530 270Z" /><rect x="540" y="320" width="80" height="100" />
        <rect x="650" y="290" width="60" height="130" /><path d="M650 290 L680 250 L710 290Z" />
      </g>
      <g fill="#f2b705"><rect x="360" y="330" width="14" height="20" /><rect x="392" y="330" width="14" height="20" /><rect x="424" y="330" width="14" height="20" /><rect x="555" y="340" width="12" height="16" /><rect x="590" y="340" width="12" height="16" /></g>
      <rect y="420" width="800" height="80" fill="#9db3c7" />
      <path className="an-ucus" d="M60 100 L130 85 L118 100 L150 108 L118 110 L128 126Z" fill="#0f6e72" />
    </svg>
  )
}

function Yol() {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Bozkırda yol alan bir minibüs">
      <Gok id="g-yol" ust="#d7e8f3" alt="#fbf3e3" />
      <rect width="800" height="500" fill="url(#g-yol)" />
      <path d="M0 300 Q200 240 400 280 T800 260 L800 500 L0 500Z" fill="#d8c48f" />
      <path d="M0 340 Q250 300 520 330 T800 320 L800 500 L0 500Z" fill="#c4ad74" />
      <path d="M0 420 L800 380 L800 440 L0 480Z" fill="#5b6578" />
      <path d="M0 450 L800 410" stroke="#f2b705" strokeWidth="4" strokeDasharray="30 30" className="an-serit" />
      <g transform="translate(330 345)">
        <path d="M0 50 L0 10 Q0 0 10 0 L120 0 Q140 0 150 20 L160 40 L160 50Z" fill="#fff" stroke="#14213d" strokeWidth="3" />
        <path d="M15 8 L65 8 L65 26 L15 26Z M75 8 L118 8 Q130 8 136 26 L75 26Z" fill="#9fd0ec" />
        <rect x="0" y="34" width="160" height="6" fill="#f2b705" />
        <circle cx="35" cy="52" r="13" fill="#14213d" /><circle cx="125" cy="52" r="13" fill="#14213d" />
      </g>
    </svg>
  )
}

function Ucak() {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Bulutların üzerinde uçak">
      <Gok id="g-uc" ust="#8fc3e6" alt="#e9f4fb" />
      <rect width="800" height="500" fill="url(#g-uc)" />
      <path d="M40 330 Q300 120 760 160" stroke="#fff" strokeWidth="3" strokeDasharray="10 12" fill="none" />
      <g fill="#fff"><ellipse cx="160" cy="420" rx="200" ry="60" /><ellipse cx="420" cy="440" rx="220" ry="60" /><ellipse cx="700" cy="410" rx="180" ry="60" /></g>
      <g className="an-suzul" style={{ transformOrigin: '470px 180px' }}>
        <g transform="translate(470 180) rotate(-8)">
          <path d="M-120 0 Q-120 -16 -100 -16 L90 -16 Q130 -14 140 0 Q130 14 90 16 L-100 16 Q-120 16 -120 0Z" fill="#fff" stroke="#14213d" strokeWidth="3" />
          <path d="M-10 -14 L-60 -80 L-35 -80 L40 -14Z M-10 14 L-50 60 L-28 60 L35 14Z M-100 -14 L-125 -55 L-108 -55 L-80 -14Z" fill="#14213d" />
          <path d="M-90 4 L110 4" stroke="#f2b705" strokeWidth="5" />
        </g>
      </g>
    </svg>
  )
}

// Ana sayfa (masaüstü): balonlar başlığın üstündeki boş gökte, peri bacaları altta şerit halinde
export function GirisSahne() {
  const balonlar = [
    ['b1', '#f2b705', '#fff'], ['b2', '#0f6e72', '#f2b705'], ['b3', '#14213d', '#dcebf5'], ['b4', '#e8a28f', '#fff'],
  ]
  return (
    <div className="giris-sahne-masa" aria-hidden="true">
      {balonlar.map(([k, r, s], i) => (
        <svg key={k} className={`giris-balon ${k}`} viewBox="-50 -66 100 130"><Balon x={0} y={0} renk={r} serit={s} sinif={`an-yuksel ${i ? 'an-gec' + i : ''}`} /></svg>
      ))}
      <svg className="giris-zemin" viewBox="0 0 1600 240" preserveAspectRatio="xMidYMax slice">
        <circle cx="1240" cy="170" r="80" fill="#ffd36b" opacity=".7" />
        <path d="M0 150 Q240 110 520 135 Q840 90 1120 130 Q1360 100 1600 120 L1600 240 L0 240Z" fill="#ecc9a0" />
        <Baca x={60} t={80} h={110} /><Baca x={120} t={110} h={80} w={26} />
        <Baca x={1460} t={70} h={120} w={38} /><Baca x={1530} t={110} h={80} w={28} />
        <Baca x={1080} t={100} h={100} w={30} />
        <path d="M0 190 Q400 160 800 180 T1600 175 L1600 240 L0 240Z" fill="#c99a72" />
        <Baca x={360} t={120} h={110} w={40} renk="#d4a77d" sapka="#8f6248" />
        <Baca x={1340} t={125} h={105} w={36} renk="#d4a77d" sapka="#8f6248" />
        <path d="M0 225 Q400 205 800 222 T1600 215 L1600 240 L0 240Z" fill="#b5835e" />
      </svg>
    </div>
  )
}

const SAHNELER = { kapadokya: Kapadokya, gulet: Gulet, akdeniz: Akdeniz, karadeniz: Karadeniz, istanbul: Istanbul, kibris: Kibris, avrupa: Avrupa, yol: Yol, ucak: Ucak }

export default function Sahne({ ad, className = '' }) {
  const S = SAHNELER[ad] || Ucak
  return <div className={`sahne ${className}`}><S /></div>
}
