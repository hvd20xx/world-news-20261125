import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { deflateSync, inflateSync } from 'node:zlib';

const CANVAS_SIZE = 1024;
const MAX_BYTES = 1_048_576;
const OUTPUT_PNG = join(import.meta.dirname, 'entry.png');

interface EditorialPanel {
  id: string;
  tag: string;
  tagColor: string;
  region: string;
  headline: string;
  summary: string;
  whyLine: string;
  artSvg: string;
}

function renderHeroTariffSvg(): string {
  const bars = [
    { label: 'CN 40%', h: 78, x: 432, fill: '#dc2626' },
    { label: 'VN 35%', h: 68, x: 472, fill: '#ea580c' },
    { label: 'IN 25%', h: 52, x: 512, fill: '#d97706' },
    { label: 'EU 20%', h: 42, x: 552, fill: '#2563eb' },
    { label: 'JP 15%', h: 32, x: 592, fill: '#0d9488' },
  ];
  const barSvg = bars
    .map(
      (b) => `
      <rect x="${b.x}" y="${136 - b.h}" width="32" height="${b.h}" fill="${b.fill}" stroke="#091526" stroke-width="2" rx="2"/>
      <text x="${b.x + 16}" y="${130 - b.h}" text-anchor="middle" fill="#fef3c7" font-family="Segoe UI, Arial, sans-serif" font-size="8.4" font-weight="900">${b.label}</text>`,
    )
    .join('');

  return `<svg viewBox="0 0 644 168" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="skyHero" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f2942"/>
        <stop offset="55%" stop-color="#1e4066"/>
        <stop offset="100%" stop-color="#c2410c"/>
      </linearGradient>
      <linearGradient id="seaHero" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0e7490"/>
        <stop offset="100%" stop-color="#082f49"/>
      </linearGradient>
    </defs>
    <rect width="644" height="168" fill="url(#skyHero)"/>
    <circle cx="330" cy="72" r="46" fill="#fbbf24" opacity="0.22"/>
    <circle cx="330" cy="72" r="28" fill="#fde68a" opacity="0.45"/>
    <g fill="#0b1628" stroke="#091526" stroke-width="1.5">
      <rect x="0" y="76" width="150" height="58"/>
      <rect x="18" y="42" width="14" height="36"/>
      <rect x="44" y="52" width="12" height="26"/>
      <path d="M98,128 L98,28 L168,46 L162,54 L108,38 L108,128 Z" fill="#1e293b"/>
      <line x1="158" y1="50" x2="158" y2="86" stroke="#fbbf24" stroke-width="2"/>
    </g>
    <polygon points="184,132 184,38 386,18 386,132" fill="#dc2626" stroke="#091526" stroke-width="3"/>
    <polygon points="386,18 408,28 408,132 386,132" fill="#991b1b" stroke="#091526" stroke-width="2.5"/>
    <text x="285" y="76" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="900" letter-spacing="1.2">SEC. 301</text>
    <text x="285" y="96" text-anchor="middle" fill="#fde68a" font-family="Segoe UI, Arial, sans-serif" font-size="11.5" font-weight="800">14 PARTNERS · 15%–40%</text>
    <rect x="0" y="130" width="644" height="38" fill="url(#seaHero)"/>
    <path d="M22,138 L178,138 L166,154 L34,154 Z" fill="#0f172a" stroke="#f8fafc" stroke-width="1.6"/>
    <rect x="44" y="122" width="24" height="16" fill="#f59e0b" stroke="#091526" stroke-width="1.4"/>
    <rect x="70" y="122" width="24" height="16" fill="#0284c7" stroke="#091526" stroke-width="1.4"/>
    <rect x="96" y="122" width="24" height="16" fill="#dc2626" stroke="#091526" stroke-width="1.4"/>
    <rect x="122" y="114" width="20" height="24" fill="#e2e8f0" stroke="#091526" stroke-width="1.4"/>
    <rect x="420" y="14" width="214" height="128" rx="5" fill="#091526" opacity="0.9" stroke="#fbbf24" stroke-width="1.6"/>
    <text x="527" y="30" text-anchor="middle" fill="#fbbf24" font-family="Segoe UI, Arial, sans-serif" font-size="9.2" font-weight="900" letter-spacing="0.8">PROPOSED USTR RATES</text>
    ${barSvg}
  </svg>`;
}

function renderHormuzSvg(): string {
  return `<svg viewBox="0 0 320 116" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="gulfSky" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#7c2d12"/>
        <stop offset="60%" stop-color="#c2410c"/>
        <stop offset="100%" stop-color="#fbbf24"/>
      </linearGradient>
    </defs>
    <rect width="320" height="116" fill="url(#gulfSky)"/>
    <!-- Strait Headlands -->
    <path d="M0,48 L92,38 L128,58 L0,62 Z" fill="#451a03" stroke="#091526" stroke-width="1.5"/>
    <path d="M210,54 L268,36 L320,44 L320,64 L204,64 Z" fill="#451a03" stroke="#091526" stroke-width="1.5"/>
    <!-- Refinery Towers at Ras Tanura -->
    <rect x="242" y="24" width="10" height="28" fill="#1e293b" stroke="#091526" stroke-width="1.4"/>
    <rect x="260" y="18" width="12" height="34" fill="#1e293b" stroke="#091526" stroke-width="1.4"/>
    <circle cx="288" cy="26" r="14" fill="#f97316" opacity="0.85"/>
    <circle cx="288" cy="26" r="8" fill="#fef08a"/>
    <!-- Sea -->
    <rect x="0" y="58" width="320" height="58" fill="#0c4a6e"/>
    <path d="M0,74 Q80,68 160,74 T320,74" fill="none" stroke="#38bdf8" stroke-width="1.4" opacity="0.6"/>
    <!-- Stricken Oil Tankers -->
    <g transform="translate(52,66)">
      <path d="M0,14 L106,14 L96,29 L12,29 Z" fill="#0f172a" stroke="#f8fafc" stroke-width="1.5"/>
      <rect x="76" y="4" width="18" height="10" fill="#e2e8f0" stroke="#091526" stroke-width="1.2"/>
      <polygon points="34,14 44,-10 56,14" fill="#ef4444"/>
      <polygon points="39,14 44,-3 51,14" fill="#fde047"/>
      <circle cx="48" cy="-16" r="13" fill="#1e293b" opacity="0.82"/>
      <circle cx="62" cy="-24" r="11" fill="#334155" opacity="0.72"/>
    </g>
    <!-- Spiked Naval Mine -->
    <g transform="translate(194,86)">
      <circle r="9" fill="#0f172a" stroke="#f8fafc" stroke-width="1.4"/>
      <line x1="-13" y1="0" x2="13" y2="0" stroke="#f8fafc" stroke-width="2"/>
      <line x1="0" y1="-13" x2="0" y2="13" stroke="#f8fafc" stroke-width="2"/>
      <circle cx="0" cy="0" r="3" fill="#ef4444"/>
    </g>
    <!-- Incoming Drone Silhouette -->
    <polygon points="222,16 244,22 228,28 232,22" fill="#091526" stroke="#fde047" stroke-width="1.2"/>
  </svg>`;
}

function renderEuropeMideastSvg(): string {
  return `<svg viewBox="0 0 320 116" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="euSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#172554"/>
        <stop offset="100%" stop-color="#1d4ed8"/>
      </linearGradient>
    </defs>
    <rect width="320" height="116" fill="url(#euSky)"/>
    <!-- EU Stars Arc -->
    <g fill="#fbbf24">
      <circle cx="66" cy="24" r="2.6"/><circle cx="88" cy="16" r="2.6"/><circle cx="112" cy="14" r="2.6"/>
      <circle cx="136" cy="16" r="2.6"/><circle cx="158" cy="24" r="2.6"/><circle cx="176" cy="36" r="2.6"/>
    </g>
    <!-- Brussels Council Semicircle -->
    <path d="M26,102 A86,58 0 0,1 198,102 L166,102 A54,34 0 0,0 58,102 Z" fill="#0f172a" stroke="#93c5fd" stroke-width="2"/>
    <path d="M62,102 A50,30 0 0,1 162,102 Z" fill="#1e3a8a" stroke="#fbbf24" stroke-width="1.6"/>
    <!-- Air Defense Radar Beams -->
    <path d="M168,94 L276,20" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5 3"/>
    <path d="M168,94 L298,48" stroke="#22c55e" stroke-width="2" stroke-dasharray="5 3"/>
    <circle cx="246" cy="40" r="14" fill="none" stroke="#f87171" stroke-width="2"/>
    <!-- Peace Olive Branch + Strike Barrier shifted higher -->
    <rect x="206" y="42" width="104" height="38" rx="4" fill="#091526" opacity="0.88" stroke="#fbbf24" stroke-width="1.5"/>
    <rect x="214" y="50" width="32" height="9" rx="2" fill="#dc2626"/>
    <rect x="214" y="52.5" width="32" height="3.5" fill="#ffffff"/>
    <text x="250" y="58" fill="#fde68a" font-family="Segoe UI, Arial, sans-serif" font-size="8.2" font-weight="900">15 AIRPORTS</text>
    <text x="258" y="72" text-anchor="middle" fill="#86efac" font-family="Segoe UI, Arial, sans-serif" font-size="8.2" font-weight="800">GAZA &amp; UNSCR 1701</text>
  </svg>`;
}

function renderOrbitCourtsSvg(): string {
  return `<svg viewBox="0 0 320 116" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <rect width="320" height="116" fill="#051324"/>
    <circle cx="38" cy="22" r="1.4" fill="#e2e8f0"/><circle cx="116" cy="18" r="1.6" fill="#e2e8f0"/>
    <circle cx="182" cy="14" r="1.3" fill="#e2e8f0"/><circle cx="290" cy="22" r="1.6" fill="#fbbf24"/>
    <!-- Earth Limb -->
    <path d="M-20,126 Q90,72 210,126 Z" fill="#0284c7" stroke="#7dd3fc" stroke-width="2.4"/>
    <!-- Tiangong Station & Shenzhou-24 -->
    <g transform="translate(88,42) rotate(-14)">
      <rect x="-26" y="-5" width="52" height="10" rx="2" fill="#e2e8f0" stroke="#091526" stroke-width="1.5"/>
      <rect x="-18" y="-22" width="10" height="44" fill="#2563eb" stroke="#93c5fd" stroke-width="1.2"/>
      <rect x="8" y="-22" width="10" height="44" fill="#2563eb" stroke="#93c5fd" stroke-width="1.2"/>
      <circle cx="34" cy="0" r="6" fill="#fbbf24" stroke="#091526" stroke-width="1.2"/>
    </g>
    <!-- Divider & Brooklyn Court + Cyber Shield on Right -->
    <line x1="176" y1="8" x2="176" y2="108" stroke="#334155" stroke-width="2"/>
    <g transform="translate(192,16)">
      <polygon points="56,0 112,20 0,20" fill="#cbd5e1" stroke="#091526" stroke-width="1.6"/>
      <rect x="10" y="20" width="92" height="6" fill="#94a3b8"/>
      <rect x="16" y="26" width="10" height="46" fill="#e2e8f0"/>
      <rect x="40" y="26" width="10" height="46" fill="#e2e8f0"/>
      <rect x="64" y="26" width="10" height="46" fill="#e2e8f0"/>
      <rect x="86" y="26" width="10" height="46" fill="#e2e8f0"/>
      <rect x="4" y="72" width="104" height="10" fill="#64748b"/>
      <circle cx="56" cy="50" r="18" fill="#0f766e" stroke="#fde047" stroke-width="2"/>
      <text x="56" y="54" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="11" font-weight="900">10/12</text>
    </g>
  </svg>`;
}

function renderAsiaPacificSvg(): string {
  return `<svg viewBox="0 0 240 82" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <linearGradient id="asiaSky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <rect width="240" height="82" fill="url(#asiaSky)"/>
    <!-- Canberra Treaty Shield + Naval Hull -->
    <rect x="0" y="54" width="240" height="28" fill="#0e7490"/>
    <path d="M18,54 L106,54 L96,68 L28,68 Z" fill="#1e293b" stroke="#f8fafc" stroke-width="1.4"/>
    <rect x="44" y="42" width="22" height="12" fill="#64748b" stroke="#091526" stroke-width="1.2"/>
    <!-- Petrochemical Complex & Textile Mills -->
    <rect x="132" y="24" width="14" height="32" fill="#e2e8f0" stroke="#091526" stroke-width="1.4"/>
    <rect x="152" y="16" width="14" height="40" fill="#cbd5e1" stroke="#091526" stroke-width="1.4"/>
    <rect x="174" y="34" width="52" height="22" fill="#334155" stroke="#091526" stroke-width="1.4"/>
    <circle cx="196" cy="24" r="10" fill="#f59e0b" stroke="#fff" stroke-width="1.4"/>
    <text x="196" y="27.5" text-anchor="middle" fill="#091526" font-family="Segoe UI, Arial, sans-serif" font-size="8.5" font-weight="900">$7B</text>
  </svg>`;
}

function renderAfricaMenaSvg(): string {
  return `<svg viewBox="0 0 240 82" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <linearGradient id="afSky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#14532d"/><stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
    <rect width="240" height="82" fill="url(#afSky)"/>
    <!-- Scales of Justice + Budget Pillars -->
    <line x1="68" y1="14" x2="68" y2="68" stroke="#fef08a" stroke-width="3"/>
    <line x1="34" y1="22" x2="102" y2="22" stroke="#fef08a" stroke-width="2.5"/>
    <path d="M24,46 L34,22 L44,46 Z" fill="none" stroke="#fde047" stroke-width="1.6"/>
    <path d="M92,46 L102,22 L112,46 Z" fill="none" stroke="#fde047" stroke-width="1.6"/>
    <rect x="46" y="64" width="44" height="8" fill="#091526"/>
    <rect x="132" y="10" width="94" height="44" rx="4" fill="#091526" opacity="0.9" stroke="#4ade80" stroke-width="1.6"/>
    <text x="179" y="29" text-anchor="middle" fill="#4ade80" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="900">₦65.18T</text>
    <text x="179" y="44" text-anchor="middle" fill="#f8fafc" font-family="Segoe UI, Arial, sans-serif" font-size="8" font-weight="800">SA COURT · GAZA</text>
  </svg>`;
}

function renderAmericasUnSvg(): string {
  return `<svg viewBox="0 0 240 82" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <linearGradient id="amSky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3b0764"/><stop offset="100%" stop-color="#1e3a8a"/>
    </linearGradient>
    <rect width="240" height="82" fill="url(#amSky)"/>
    <!-- NYC Skyline & Storm Winds -->
    <rect x="16" y="34" width="18" height="48" fill="#0f172a"/>
    <rect x="38" y="20" width="16" height="62" fill="#1e293b"/>
    <rect x="58" y="42" width="22" height="40" fill="#0f172a"/>
    <path d="M88,26 Q132,12 174,26" fill="none" stroke="#38bdf8" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M96,40 Q144,28 186,40" fill="none" stroke="#93c5fd" stroke-width="2.2" stroke-linecap="round"/>
    <!-- UN Nov 25 Orange Ribbon -->
    <circle cx="196" cy="40" r="24" fill="#f97316" stroke="#ffffff" stroke-width="2"/>
    <text x="196" y="38" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="10.5" font-weight="900">UN</text>
    <text x="196" y="50" text-anchor="middle" fill="#fef3c7" font-family="Segoe UI, Arial, sans-serif" font-size="8.5" font-weight="900">NOV 25</text>
  </svg>`;
}

function renderUclSportSvg(): string {
  return `<svg viewBox="0 0 240 82" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <rect width="240" height="82" fill="#0b3b24"/>
    <!-- Football Pitch -->
    <rect x="12" y="10" width="216" height="62" fill="#15803d" stroke="#dcfce7" stroke-width="1.8"/>
    <line x1="120" y1="10" x2="120" y2="72" stroke="#dcfce7" stroke-width="1.6"/>
    <circle cx="120" cy="41" r="14" fill="none" stroke="#dcfce7" stroke-width="1.6"/>
    <rect x="12" y="24" width="24" height="34" fill="none" stroke="#dcfce7" stroke-width="1.6"/>
    <rect x="204" y="24" width="24" height="34" fill="none" stroke="#dcfce7" stroke-width="1.6"/>
    <!-- Scoreboard Badge -->
    <rect x="64" y="18" width="112" height="46" rx="5" fill="#091526" opacity="0.92" stroke="#fbbf24" stroke-width="1.6"/>
    <text x="120" y="35" text-anchor="middle" fill="#fbbf24" font-family="Segoe UI, Arial, sans-serif" font-size="9" font-weight="900">UCL MATCHDAY 5</text>
    <text x="120" y="48" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="8.5" font-weight="800">LIV 3-0 · BAR 4-1 · LIL 2-1</text>
    <text x="120" y="59" text-anchor="middle" fill="#93c5fd" font-family="Segoe UI, Arial, sans-serif" font-size="8" font-weight="700">MUN 2-2 · PSG 2-2 · INT 2-0</text>
  </svg>`;
}

const MIDDLE_PANELS: EditorialPanel[] = [
  {
    id: '2',
    tag: '2 · HORMUZ & RED SEA',
    tagColor: '#b91c1c',
    region: 'HORMUZ · RAS TANURA · RIYADH',
    headline: 'Two Tankers Strike Mines in Hormuz; Drones Target Ras Tanura',
    summary:
      'Iran’s IRGC Navy says two tankers hit mines and caught fire in the Strait of Hormuz while Houthis claim drone attacks on Saudi Arabia’s Ras Tanura refinery and Riyadh.',
    whyLine: 'WHY: Threatens 20% of global oil transit · U.S. Iran alert',
    artSvg: renderHormuzSvg(),
  },
  {
    id: '3',
    tag: '3 · EUROPE & MIDEAST',
    tagColor: '#1d4ed8',
    region: 'BRUSSELS · BARCELONA · ATHENS',
    headline: 'EU Backs Ukraine Air Defense; UfM Presses Gaza & Lebanon Truce',
    summary:
      'EU defense chiefs meet Gen. Drapatyi on air defense and advance 22nd Russia sanctions; Barcelona UfM ministers urge Gaza & UNSCR 1701 ceasefires as Greece strikes.',
    whyLine: 'WHY: Locks EU aid through 2028 · 15 Greek airports shut',
    artSvg: renderEuropeMideastSvg(),
  },
  {
    id: '4',
    tag: '4 · ORBIT, COURTS & CYBER',
    tagColor: '#0f766e',
    region: 'JIUQUAN · BROOKLYN · IOWA',
    headline: 'Shenzhou-24 Launches Foreign Crew; Jury Convicts Huawei',
    summary:
      'China’s Shenzhou-24 carries Pakistani specialist Muhammad Zeeshan Ali to Tiangong; a Brooklyn jury convicts Huawei on 10 counts as FinCEN briefly goes offline.',
    whyLine: 'WHY: Tiangong milestone & major U.S. tech verdict',
    artSvg: renderOrbitCourtsSvg(),
  },
];

const BOTTOM_PANELS: EditorialPanel[] = [
  {
    id: '5',
    tag: '5 · ASIA-PACIFIC',
    tagColor: '#c2410c',
    region: 'CANBERRA · TOKYO · DHAKA',
    headline: 'Australia–Solomons Defense Pact; Dhaka ৳17k Mill Strike',
    summary:
      'Canberra signs a security treaty with Honiara; Japan weighs Indian missile ranges; S. Korea opens $7B Shaheen plant as 140 Dhaka mills shut.',
    whyLine: 'WHY: Pacific security shift & Dhaka wage strain',
    artSvg: renderAsiaPacificSvg(),
  },
  {
    id: '6',
    tag: '6 · AFRICA & GAZA',
    tagColor: '#15803d',
    region: 'CAPE TOWN · ABUJA · GAZA',
    headline: 'Ramaphosa Survives Court Bid; Nigeria ₦65.18T Budget',
    summary:
      'South Africa’s president thwarts impeachment in court; Nigeria tables a ₦65.18T budget and mourns Pete Edochie; Gaza Al-Shati strike draws alarm.',
    whyLine: 'WHY: Key stability test in Africa’s top economies',
    artSvg: renderAfricaMenaSvg(),
  },
  {
    id: '7',
    tag: '7 · UN & AMERICAS',
    tagColor: '#7e22ce',
    region: 'UN · BOGOTÁ · NEW YORK',
    headline: 'UN Marks Nov 25 Violence Day; Storm Hits U.S. Travel',
    summary:
      'UNODC logs 47,000 femicides on Nov 25; Colombia ends a hostage standoff; winter storms and gusts rattle U.S. travel and NYC parade prep.',
    whyLine: 'WHY: Global rights focus & holiday transit disruption',
    artSvg: renderAmericasUnSvg(),
  },
  {
    id: '8',
    tag: '8 · SPORT & MEDIA',
    tagColor: '#334155',
    region: 'UCL MATCHDAY 5 · LONDON',
    headline: 'Liverpool 3-0, Barça 4-1 & Lille Stuns Bayern in UCL',
    summary:
      'Liverpool & Barça cruise, Lille upsets Bayern 2-1, Man Utd draws 2-2, PSG ties Roma 2-2 and Inter wins 2-0; UK advances BBC iPlayer overhaul.',
    whyLine: 'ALSO: 9-game NBA Cup slate & Ramsay on Top Gear',
    artSvg: renderUclSportSvg(),
  },
];

function renderWorldMapSvg(): string {
  const pins = [
    { id: '1', x: 70, y: 48, c: '#dc2626' },
    { id: '2', x: 204, y: 66, c: '#b91c1c' },
    { id: '3', x: 164, y: 38, c: '#1d4ed8' },
    { id: '4', x: 266, y: 45, c: '#0f766e' },
    { id: '5', x: 298, y: 106, c: '#c2410c' },
    { id: '6', x: 174, y: 84, c: '#15803d' },
    { id: '7', x: 84, y: 66, c: '#7e22ce' },
    { id: '8', x: 154, y: 34, c: '#334155' },
  ];
  return `<svg viewBox="0 0 340 142" width="100%" height="142" xmlns="http://www.w3.org/2000/svg" style="display:block;background:#0a1f38;border-bottom:1.5px solid #091526">
    <g stroke="#1e3a5f" stroke-width="0.6" opacity="0.6">
      <line x1="0" y1="36" x2="340" y2="36"/><line x1="0" y1="71" x2="340" y2="71"/><line x1="0" y1="106" x2="340" y2="106"/>
      <line x1="85" y1="0" x2="85" y2="142"/><line x1="170" y1="0" x2="170" y2="142"/><line x1="255" y1="0" x2="255" y2="142"/>
    </g>
    <path d="M18,28 L34,21 L60,20 L86,26 L96,38 L82,56 L68,72 L56,62 L38,52 L22,40 Z" fill="#254e80" stroke="#7dd3fc" stroke-width="0.8"/>
    <path d="M80,78 L102,82 L116,96 L102,130 L88,132 L82,102 Z" fill="#254e80" stroke="#7dd3fc" stroke-width="0.8"/>
    <path d="M148,24 L176,18 L200,24 L196,44 L172,48 L152,42 Z" fill="#254e80" stroke="#7dd3fc" stroke-width="0.8"/>
    <path d="M148,54 L182,52 L212,60 L204,82 L190,124 L174,122 L162,90 L146,70 Z" fill="#254e80" stroke="#7dd3fc" stroke-width="0.8"/>
    <path d="M200,22 L256,18 L306,24 L312,48 L292,70 L264,82 L242,74 L216,62 L200,44 Z" fill="#254e80" stroke="#7dd3fc" stroke-width="0.8"/>
    <path d="M276,100 L312,98 L320,118 L286,124 Z" fill="#254e80" stroke="#7dd3fc" stroke-width="0.8"/>
    <path d="M24,14 Q170,2 316,14" fill="none" stroke="#2dd4bf" stroke-width="1.2" stroke-dasharray="4 3"/>
    ${pins
      .map(
        (p) =>
          `<circle cx="${p.x}" cy="${p.y}" r="7.2" fill="${p.c}" stroke="#fff" stroke-width="1.2"/><text x="${p.x}" y="${p.y + 2.8}" text-anchor="middle" fill="#fff" font-family="Segoe UI, sans-serif" font-size="8" font-weight="900">${p.id}</text>`,
      )
      .join('')}
  </svg>`;
}

export function buildHtml(): string {
  const renderCard = (p: EditorialPanel, isBottom: boolean) => `
    <article class="card">
      <div class="panel-art">
        ${p.artSvg}
        <div class="pill" style="background:${p.tagColor}">${p.tag}</div>
        <div class="region-pill">${p.region}</div>
      </div>
      <div class="panel-body">
        <h3>${p.headline}</h3>
        <p>${p.summary}</p>
        <div class="extra-line">${p.whyLine}</div>
      </div>
    </article>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 1024px;
    height: 1024px;
    overflow: hidden;
    background: #faf6ee;
    color: #091526;
    font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  }
  .page {
    width: 1024px;
    height: 1024px;
    padding: 10px 12px 9px;
    display: flex;
    flex-direction: column;
    gap: 7px;
    background: #faf6ee;
  }
  .masthead {
    height: 60px;
    background: #091526;
    color: #faf6ee;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    border-bottom: 4px solid #dc2626;
    border-radius: 3px;
  }
  .kicker {
    font-size: 9.2px;
    font-weight: 800;
    letter-spacing: 1.5px;
    color: #fbbf24;
    margin-bottom: 2px;
  }
  .mast-left h1 {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 27px;
    font-weight: 900;
    letter-spacing: 0.7px;
    line-height: 1;
    color: #ffffff;
  }
  .date-badge {
    background: #dc2626;
    padding: 6px 12px;
    border-radius: 3px;
    text-align: center;
    border: 1.5px solid #fca5a5;
  }
  .date-badge .top { font-size: 8.6px; font-weight: 800; letter-spacing: 1px; color: #fef3c7; }
  .date-badge .bot { font-size: 14.5px; font-weight: 900; color: #ffffff; }

  .ticker {
    height: 29px;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
    background: #ede4d3;
    border: 1.5px solid #091526;
    padding: 2.5px 5px;
  }
  .tick { display: flex; flex-direction: column; justify-content: center; border-right: 1px solid #c4b59b; padding-right: 4px; overflow: hidden; }
  .tick:last-child { border-right: none; padding-right: 0; }
  .tick .tz { font-size: 7.4px; font-weight: 900; color: #b91c1c; white-space: nowrap; }
  .tick .ev { font-size: 8.2px; font-weight: 700; color: #091526; white-space: nowrap; }

  .hero-row {
    height: 286px;
    display: grid;
    grid-template-columns: 644px 1fr;
    gap: 8px;
  }
  .card {
    background: #ffffff;
    border: 1.8px solid #091526;
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .hero-art-wrap {
    height: 166px;
    position: relative;
    border-bottom: 1.8px solid #091526;
    overflow: hidden;
    background: #0b192c;
  }
  .pill {
    position: absolute;
    top: 7px;
    left: 7px;
    color: #ffffff;
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.55px;
    padding: 2.5px 7px;
    border-radius: 2px;
    border: 1.2px solid #ffffff;
  }
  .region-pill {
    position: absolute;
    bottom: 6px;
    right: 7px;
    background: rgba(9, 21, 38, 0.9);
    color: #fde68a;
    font-size: 7.8px;
    font-weight: 800;
    letter-spacing: 0.45px;
    padding: 2px 6px;
    border-radius: 2px;
  }
  .hero-body {
    flex: 1;
    padding: 7px 11px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .hero-body h2 {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 18.2px;
    font-weight: 900;
    line-height: 1.12;
    color: #091526;
  }
  .hero-body p { font-size: 11px; line-height: 1.25; color: #1e293b; font-weight: 600; }
  .extra-line {
    font-size: 8.6px;
    font-weight: 800;
    line-height: 1.2;
    color: #7c2d12;
    background: #fef3c7;
    padding: 3px 6px;
    border-left: 3px solid #dc2626;
  }

  .atlas-card {
    background: #091526;
    border: 1.8px solid #091526;
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: #f8fafc;
  }
  .atlas-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4.5px 9px;
    background: #0f2942;
    border-bottom: 1.5px solid #1e3a5f;
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.7px;
    color: #fbbf24;
  }
  .atlas-list {
    flex: 1;
    padding: 5px 8px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3px 6px;
    align-content: center;
  }
  .al-item { display: flex; align-items: center; gap: 4.5px; font-size: 8.6px; font-weight: 700; color: #e2e8f0; white-space: nowrap; }
  .al-item .dot {
    width: 14px; height: 14px; border-radius: 50%; display: inline-flex;
    align-items: center; justify-content: center; font-size: 8px; font-weight: 900; color: #fff; flex-shrink: 0;
  }

  .mid-row {
    height: 294px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .bot-row {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 7px;
    min-height: 0;
  }
  .panel-art {
    height: 128px;
    position: relative;
    border-bottom: 1.8px solid #091526;
    overflow: hidden;
    background: #0b192c;
  }
  .bot-row .panel-art { height: 92px; }
  .panel-body {
    flex: 1;
    padding: 6px 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    justify-content: space-between;
  }
  .bot-row .panel-body { padding: 5px 7px; gap: 3px; }
  .panel-body h3 {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 14.2px;
    font-weight: 900;
    line-height: 1.13;
    color: #091526;
  }
  .bot-row .panel-body h3 { font-size: 12.6px; line-height: 1.13; }
  .panel-body p { font-size: 10.4px; line-height: 1.24; color: #1e293b; font-weight: 600; }
  .bot-row .panel-body p { font-size: 9.8px; line-height: 1.22; }

  .footer {
    height: 21px;
    background: #091526;
    color: #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    font-size: 8.5px;
    font-weight: 800;
    letter-spacing: 0.65px;
  }
</style>
</head>
<body>
  <div class="page">
    <header class="masthead">
      <div class="mast-left">
        <div class="kicker">THE WORLD IN ONE DAY · 6 CONTINENTS &amp; ORBIT · GLOBAL EDITORIAL ATLAS</div>
        <h1>WEDNESDAY, 25 NOVEMBER 2026</h1>
      </div>
      <div class="date-badge">
        <div class="top">STRICT SAME-DAY EDITION</div>
        <div class="bot">25 NOV 2026 · UTC</div>
      </div>
    </header>

    <div class="ticker">
      <div class="tick"><span class="tz">WASHINGTON</span><span class="ev">Sec. 301 tariffs</span></div>
      <div class="tick"><span class="tz">HORMUZ · KSA</span><span class="ev">Mines &amp; Ras Tanura</span></div>
      <div class="tick"><span class="tz">JIUQUAN · ORBIT</span><span class="ev">Shenzhou-24 crew</span></div>
      <div class="tick"><span class="tz">BRUSSELS · UfM</span><span class="ev">Air defense &amp; truce</span></div>
      <div class="tick"><span class="tz">BROOKLYN</span><span class="ev">Huawei 10/12 guilty</span></div>
      <div class="tick"><span class="tz">CANBERRA · DHAKA</span><span class="ev">Pact &amp; 140 mills</span></div>
      <div class="tick"><span class="tz">ABUJA · CAPE</span><span class="ev">₦65T &amp; SA court</span></div>
      <div class="tick"><span class="tz">EUROPE · UN</span><span class="ev">UCL MD5 &amp; Nov 25</span></div>
    </div>

    <div class="hero-row">
      <article class="card">
        <div class="hero-art-wrap">
          ${renderHeroTariffSvg()}
          <div class="pill" style="background:#dc2626">1 · LEAD TRADE &amp; WORLD ECONOMY</div>
          <div class="region-pill">WASHINGTON · BEIJING · BRUSSELS · NEW DELHI</div>
        </div>
        <div class="hero-body">
          <h2>U.S. Unveils Section 301 Tariffs on 14 Economies After Supreme Court Ruling</h2>
          <p>USTR proposes 15%–40% duties on China, the EU, Vietnam, Japan, South Korea, India and 8 others over excess industrial capacity, with hearings set for Jan 25, 2027.</p>
          <div class="extra-line">WHY IT MATTERS: Reshapes rules on &gt;70% of U.S. imports · Brazil seeks WTO dispute panel</div>
        </div>
      </article>

      <aside class="atlas-card">
        <div class="atlas-head">
          <span>25 NOV GLOBAL DISPATCH MAP</span>
          <span>8 CORRIDORS</span>
        </div>
        ${renderWorldMapSvg()}
        <div class="atlas-list">
          <div class="al-item"><span class="dot" style="background:#dc2626">1</span>USTR 14-Nation Tariffs</div>
          <div class="al-item"><span class="dot" style="background:#c2410c">5</span>Canberra Pact &amp; Dhaka</div>
          <div class="al-item"><span class="dot" style="background:#b91c1c">2</span>Hormuz Mines &amp; Gulf</div>
          <div class="al-item"><span class="dot" style="background:#15803d">6</span>SA Court &amp; ₦65T Budget</div>
          <div class="al-item"><span class="dot" style="background:#1d4ed8">3</span>EU Ukraine &amp; Gaza Truce</div>
          <div class="al-item"><span class="dot" style="background:#7e22ce">7</span>UN Nov 25 &amp; U.S. Storm</div>
          <div class="al-item"><span class="dot" style="background:#0f766e">4</span>Shenzhou-24 &amp; Huawei</div>
          <div class="al-item"><span class="dot" style="background:#334155">8</span>UCL MD5 &amp; BBC Overhaul</div>
        </div>
      </aside>
    </div>

    <section class="mid-row">${MIDDLE_PANELS.map((p) => renderCard(p, false)).join('')}</section>
    <section class="bot-row">${BOTTOM_PANELS.map((p) => renderCard(p, true)).join('')}</section>

    <footer class="footer">
      <span>VERIFIED SAME-DAY WORLD RECORD · WEDNESDAY, 25 NOVEMBER 2026</span>
      <span>AMERICAS · EUROPE · RUSSIA · MENA · AFRICA · ASIA · OCEANIA · ORBIT</span>
    </footer>
  </div>
</body>
</html>`;
}

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function decodePngRgba(png: Buffer): { width: number; height: number; rgba: Uint8Array } {
  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 6;
  const idatParts: Buffer[] = [];
  while (offset < png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.subarray(offset + 4, offset + 8).toString('ascii');
    const data = png.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9];
    } else if (type === 'IDAT') idatParts.push(data);
    else if (type === 'IEND') break;
    offset += 12 + length;
  }
  const bpp = colorType === 6 ? 4 : 3;
  const stride = width * bpp;
  const inflated = inflateSync(Buffer.concat(idatParts));
  const rgba = new Uint8Array(width * height * 4);
  const prevRow = new Uint8Array(stride);
  const curRow = new Uint8Array(stride);
  const paeth = (a: number, b: number, c: number): number => {
    const p = a + b - c;
    const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    const filter = inflated[rowStart];
    for (let i = 0; i < stride; i++) {
      const raw = inflated[rowStart + 1 + i];
      const left = i >= bpp ? curRow[i - bpp] : 0;
      const up = prevRow[i];
      const upLeft = i >= bpp ? prevRow[i - bpp] : 0;
      let val = raw;
      if (filter === 1) val = (raw + left) & 0xff;
      else if (filter === 2) val = (raw + up) & 0xff;
      else if (filter === 3) val = (raw + ((left + up) >> 1)) & 0xff;
      else if (filter === 4) val = (raw + paeth(left, up, upLeft)) & 0xff;
      curRow[i] = val;
    }
    for (let x = 0; x < width; x++) {
      const dst = (y * width + x) * 4;
      const src = x * bpp;
      rgba[dst] = curRow[src];
      rgba[dst + 1] = curRow[src + 1];
      rgba[dst + 2] = curRow[src + 2];
      rgba[dst + 3] = bpp === 4 ? curRow[src + 3] : 255;
    }
    prevRow.set(curRow);
  }
  return { width, height, rgba };
}

function encodeRgbPng(width: number, height: number, rgba: Uint8Array): Buffer {
  const bpp = 3;
  const stride = width * bpp;
  const rawData = Buffer.alloc(height * (stride + 1));
  const prev = new Uint8Array(stride);
  const cur = new Uint8Array(stride);
  const paeth = (a: number, b: number, c: number): number => {
    const p = a + b - c;
    const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const src = (y * width + x) * 4;
      cur[x * 3] = rgba[src];
      cur[x * 3 + 1] = rgba[src + 1];
      cur[x * 3 + 2] = rgba[src + 2];
    }
    const outRow = y * (stride + 1);
    rawData[outRow] = 4;
    for (let i = 0; i < stride; i++) {
      const left = i >= bpp ? cur[i - bpp] : 0;
      const up = prev[i];
      const upLeft = i >= bpp ? prev[i - bpp] : 0;
      rawData[outRow + 1 + i] = (cur[i] - paeth(left, up, upLeft)) & 0xff;
    }
    prev.set(cur);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([sig, makeChunk('IHDR', ihdr), makeChunk('IDAT', deflateSync(rawData, { level: 9 })), makeChunk('IEND', Buffer.alloc(0))]);
}

function findBrowserExecutable(): string {
  for (const p of [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  ]) {
    if (existsSync(p)) return p;
  }
  throw new Error('No Chromium/Edge browser found');
}

export function renderNews25Png(): void {
  const workDir = join(tmpdir(), `news25-render-${Date.now()}`);
  mkdirSync(workDir, { recursive: true });
  const htmlPath = join(workDir, 'broadsheet.html');
  const rawPngPath = join(workDir, 'raw.png');
  try {
    writeFileSync(htmlPath, buildHtml(), 'utf8');
    execFileSync(
      findBrowserExecutable(),
      [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--force-device-scale-factor=1',
        `--window-size=${CANVAS_SIZE},${CANVAS_SIZE}`,
        `--screenshot=${rawPngPath}`,
        `file:///${htmlPath.replace(/\\/g, '/')}`,
      ],
      { stdio: 'ignore', timeout: 45_000 },
    );
    const { width, height, rgba } = decodePngRgba(readFileSync(rawPngPath));
    const pngBuf = encodeRgbPng(width, height, rgba);
    if (pngBuf.length > MAX_BYTES) {
      throw new Error(`PNG too large: ${pngBuf.length} > ${MAX_BYTES}`);
    }
    writeFileSync(OUTPUT_PNG, pngBuf);
    console.log(`Wrote ${OUTPUT_PNG} (${pngBuf.length} bytes, ${width}x${height} lossless PNG)`);
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

renderNews25Png();
