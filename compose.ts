import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

interface MapPin25 {
  id: string;
  x: number;
  y: number;
  color: string;
}

interface TimelineStop25 {
  utc: string;
  place: string;
  event: string;
}

interface FeatureStory25 {
  id: string;
  imgFile: string;
  fallbackFile: string;
  kicker: string;
  tone: string;
  headline: string;
  deck: string;
}

interface DeskItem25 {
  id: string;
  beat: string;
  tone: string;
  place: string;
  headline: string;
  summary: string;
}

interface WorldDesk25 {
  deskName: string;
  spanIds: string;
  bannerBg: string;
  items: DeskItem25[];
}

const TIMELINE_25_NOV: TimelineStop25[] = [
  { utc: '02:10Z', place: 'CANBERRA', event: 'Solomon security treaty' },
  { utc: '04:15Z', place: 'JIUQUAN / ORBIT', event: 'Shenzhou-24 liftoff' },
  { utc: '07:45Z', place: 'ATHENS & SAMARA', event: '60-city strike & refineries' },
  { utc: '10:30Z', place: 'DHAKA / GAZIPUR', event: '৳17k wage vote & 140 mills' },
  { utc: '13:20Z', place: 'HORMUZ / JEDDAH', event: '2 tankers hit mines' },
  { utc: '15:50Z', place: 'BENGHAZI / ABUJA', event: 'Corvette sunk & ₦65.2T' },
  { utc: '18:40Z', place: 'BROOKLYN / IOWA', event: 'Huawei guilty 10/12 & blast' },
  { utc: '20:00Z', place: 'EUROPE / AMERICAS', event: 'UN 25 Nov & UCL Matchday 5' },
];

const MAP_PINS_25: MapPin25[] = [
  { id: '1', x: 213, y: 67, color: '#C23B22' },  // Hormuz 2 tankers, Ras Tanura & Jeddah
  { id: '2', x: 258, y: 47, color: '#1D4ED8' },  // Jiuquan Shenzhou-24 launch
  { id: '3', x: 83, y: 44, color: '#0F766E' },   // Brooklyn Huawei guilty 10/12 & CIA cyber
  { id: '4', x: 181, y: 46, color: '#B91C1C' },  // Greece 60-city strike & Samara refineries
  { id: '5', x: 304, y: 109, color: '#0F766E' }, // Canberra Australia-Solomon treaty
  { id: '6', x: 247, y: 63, color: '#B45309' },  // Bangladesh 17k Taka vote & 108 BGB platoons
  { id: '7', x: 176, y: 58, color: '#B91C1C' },  // Benghazi corvette Merkuriy sunk
  { id: '8', x: 69, y: 45, color: '#475569' },   // Iowa 5-ton lead azide & Florida Learjet
  { id: '9', x: 193, y: 57, color: '#991B1B' },  // Gaza Al-Shati refugee camp strike
  { id: '10', x: 166, y: 78, color: '#15803D' }, // Abuja Nigeria 65.18T budget
  { id: '11', x: 196, y: 77, color: '#0F766E' }, // Addis Ababa / Sudan rejects Abiy bid
  { id: '12', x: 58, y: 69, color: '#7E22CE' },  // UN Nov 25 47k femicide report, Mexico & Colombia
  { id: '13', x: 98, y: 108, color: '#1D4ED8' }, // Brazil WTO, Kaszek $650M, Argentina Lemon
  { id: '14', x: 261, y: 80, color: '#C2410C' }, // Singapore Megaspeed, Phuket fire, Bogor mine
  { id: '15', x: 284, y: 50, color: '#1D4ED8' }, // ROK $7B Shaheen & K-ETA, Taiwan deepfakes
  { id: '16', x: 159, y: 35, color: '#334155' }, // UK BBC iPlayer / Top Gear, UCL & NBA Cup
];

const FEATURE_CARDS_25: FeatureStory25[] = [
  {
    id: '2',
    imgFile: 'n25_shenzhou24_orbit.jpg',
    fallbackFile: 'shenzhou24_launch.jpg',
    kicker: '2 · ORBITAL MILESTONE · JIUQUAN & TIANGONG STATION',
    tone: '#1D4ED8',
    headline: 'Shenzhou-24 Launches First Foreign Astronaut to Tiangong',
    deck: 'China’s Long March-2F lifts off carrying Tang Hongbo, Wu Yi and Pakistani specialist Muhammad Zeeshan Ali—the first international crew member aboard Tiangong.',
  },
  {
    id: '3, 8',
    imgFile: 'n25_huawei_edny_iowa.jpg',
    fallbackFile: 'huawei_edny_tech.jpg',
    kicker: '3 & 8 · U.S. COURTS, CYBER & DEMOLITION · BROOKLYN / IOWA',
    tone: '#0F766E',
    headline: 'Jury Convicts Huawei on 10 Counts; Army Detonates 5-Ton Cache',
    deck: 'A Brooklyn federal jury finds Huawei guilty of fraud, money laundering and trade-secret conspiracy (acquitting on RICO); U.S. Army blasts 5 tons of unstable lead azide in Iowa.',
  },
  {
    id: '4, 7',
    imgFile: 'n25_greece_samara_benghazi.jpg',
    fallbackFile: 'greece_europe.jpg',
    kicker: '4 & 7 · EUROPE STRIKE & NAVAL WAR · ATHENS / SAMARA / BENGHAZI',
    tone: '#B91C1C',
    headline: 'Greece Halts in General Strike; Drones Hit Samara & Benghazi',
    deck: 'Unions ground flights at 15 Greek airports and shut ferries nationwide; Ukrainian drones burn two Samara oil refineries and sink Russian corvette Merkuriy in Benghazi.',
  },
];

const WORLD_DESKS_25: WorldDesk25[] = [
  {
    deskName: 'ASIA-PACIFIC & OCEANIA',
    spanIds: '#5–#6, #14–#15',
    bannerBg: '#0F172A',
    items: [
      {
        id: '5',
        beat: 'PACIFIC PACT',
        tone: '#0F766E',
        place: 'CANBERRA · HONIARA',
        headline: 'Australia & Solomon Islands Sign Security Treaty',
        summary: 'PMs Anthony Albanese and Matthew Wale sign a Canberra defense pact naming Australia primary security partner after ending Honiara’s 2022 China deal.',
      },
      {
        id: '6, 14',
        beat: 'SOUTH & SE ASIA',
        tone: '#B45309',
        place: 'DHAKA · SINGAPORE · PHUKET · BOGOR',
        headline: 'Dhaka ৳17k Wage Riots, Megaspeed Ban & Fatal Disasters',
        summary: 'Unions reject Bangladesh’s ৳17,000 wage hike as 140 mills shut and 108 BGB platoons deploy; U.S. blacklists Singapore’s Megaspeed; Phuket fire kills 11 and Bogor mine floods.',
      },
      {
        id: '15',
        beat: 'EAST ASIA',
        tone: '#1D4ED8',
        place: 'SEOUL · ULSAN · TAIPEI · BANGKOK',
        headline: 'Aramco $7B Korea Plant, K-ETA to 2027 & Taiwan Deepfakes',
        summary: 'South Korea inaugurates the $7B Shaheen petrochemical complex and extends visa-free K-ETA; synthetic AI news anchors target Taiwan’s local vote; BOT flags 48% informal GDP.',
      },
    ],
  },
  {
    deskName: 'MIDDLE EAST & AFRICA',
    spanIds: '#9–#11',
    bannerBg: '#7C2D12',
    items: [
      {
        id: '9',
        beat: 'GAZA STRIP',
        tone: '#B91C1C',
        place: 'AL-SHATI CAMP · GAZA CITY',
        headline: 'Al-Shati Refugee Camp Airstrike Kills Family of Four',
        summary: 'An Israeli strike on Gaza City’s Al-Shati camp kills a local Hamas security official, his wife and two daughters alongside further casualties across the strip.',
      },
      {
        id: '10',
        beat: 'WEST AFRICA',
        tone: '#15803D',
        place: 'ABUJA, NIGERIA',
        headline: 'Tinubu Submits Trimmed ₦65.18 Trillion 2026 Budget',
        summary: 'Nigeria’s president asks lawmakers to re-enact the 2026 Appropriation Act, cutting spending by ₦3.15T while keeping a ₦31.46T deficit and ₦29.22T borrowing plan.',
      },
      {
        id: '11',
        beat: 'HORN & LIBYA',
        tone: '#0F766E',
        place: 'ADDIS ABABA · PORT SUDAN · TRIPOLI',
        headline: 'Sudan Rejects Abiy Peace Talks; UN Demands Benghazi Probe',
        summary: 'Sudan’s army-aligned government spurns Ethiopian PM Abiy Ahmed’s Addis Ababa dialogue over alleged RSF bias; UNSMIL urges an inquiry into Benghazi port strikes.',
      },
    ],
  },
  {
    deskName: 'THE AMERICAS & GLOBAL SOCIETY',
    spanIds: '#8, #12–#13',
    bannerBg: '#1E3A8A',
    items: [
      {
        id: '12',
        beat: 'NOV 25 UN REPORT',
        tone: '#7E22CE',
        place: 'VIENNA · MEXICO CITY · BOGOTÁ',
        headline: 'UN Reports 47,000 Femicides as Nov 25 Marches Fill Cities',
        summary: 'Marking Nov 25, UNODC and UN Women report 5 women killed hourly by partners or kin globally (24 daily in LatAm per ECLAC), sparking marches across the Americas.',
      },
      {
        id: '13',
        beat: 'LATAM ECONOMY',
        tone: '#1D4ED8',
        place: 'GENEVA · MINAS GERAIS · BUENOS AIRES',
        headline: 'Brazil WTO Tariff Bid, Kaszek $650M & Argentina Fintech',
        summary: 'Brasília seeks a WTO panel against U.S. Section 301 tariffs; Sandvik buys Brazil’s Del Rey Minerals; Kaszek closes a $650M LatAm fund and Tether backs Lemon.',
      },
      {
        id: '8',
        beat: 'NORTH AMERICA',
        tone: '#475569',
        place: 'GREENACRES, FL · LANGLEY · ESTONIA',
        headline: 'Florida Learjet Crash Kills 9; CIA Breach & Baltic Protest',
        summary: 'Nine die in a Learjet 60 crash in Greenacres, Florida; AP reports a cyber intrusion into an unclassified CIA system; Moscow lodges a formal border protest with Estonia.',
      },
    ],
  },
  {
    deskName: 'MEDIA, CULTURE & GLOBAL SPORT',
    spanIds: '#16',
    bannerBg: '#115E59',
    items: [
      {
        id: '16A',
        beat: 'UK MEDIA',
        tone: '#0F766E',
        place: 'LONDON · WESTMINSTER',
        headline: 'UK Plans “Britflix” BBC iPlayer Overhaul; Ramsay Leads Top Gear',
        summary: 'Ministers advance a commercial-ad upgrade opening BBC iPlayer to rival public broadcasters, while the BBC names chef Gordon Ramsay new lead host of Top Gear.',
      },
      {
        id: '16B',
        beat: 'CHAMPIONS LEAGUE',
        tone: '#1D4ED8',
        place: 'LONDON · MANCHESTER · MADRID · PARIS',
        headline: 'UEFA Champions League Matchday 5 Pivotal Clashes',
        summary: 'League-phase Matchday 5 headlines European sport as Arsenal host Dortmund, Man City face Napoli, Real Madrid meet PSV, and PSG clash with Roma.',
      },
      {
        id: '16C',
        beat: 'NBA CUP & TECH',
        tone: '#B45309',
        place: 'NEW YORK · OKLAHOMA CITY · HOUSTON',
        headline: 'Nine-Game NBA Cup Pre-Holiday Slate & AI Chip Loans',
        summary: 'NBA Cup group play stages nine games including Cavaliers–Knicks and Timberwolves–Thunder, while filings show Chinese data centers pledging AI chips for loans.',
      },
    ],
  },
];

function loadDataUri25(assetsDir: string, preferred: string, fallback: string): string {
  const chosen = existsSync(join(assetsDir, preferred)) ? preferred : fallback;
  const raw = readFileSync(join(assetsDir, chosen));
  const mime = chosen.endsWith('.png') ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${raw.toString('base64')}`;
}

function renderWorldMap25Svg(): string {
  const pins = MAP_PINS_25.map(
    (p) => `
      <g transform="translate(${p.x},${p.y})">
        <circle r="5.8" fill="${p.color}" stroke="#FAF6EE" stroke-width="1.2"/>
        <text y="2.3" text-anchor="middle" fill="#FFFFFF" font-family="Segoe UI, Arial, sans-serif" font-size="6.3" font-weight="900">${p.id}</text>
      </g>`,
  ).join('');

  return `
  <svg viewBox="0 0 344 134" width="100%" height="134" xmlns="http://www.w3.org/2000/svg" style="display:block;background:#0B1F2E;border-bottom:1.5px solid #0F172A">
    <defs>
      <pattern id="grid25" width="28" height="22" patternUnits="userSpaceOnUse">
        <path d="M 28 0 L 0 0 0 22" fill="none" stroke="#19384D" stroke-width="0.6"/>
      </pattern>
    </defs>
    <rect width="344" height="134" fill="url(#grid25)"/>
    <path d="M18,22 L62,18 L96,34 L88,56 L66,68 L46,64 L26,44 Z" fill="#28495B" stroke="#537A8E" stroke-width="0.8"/>
    <path d="M74,73 L106,77 L116,99 L101,126 L84,123 L77,96 Z" fill="#28495B" stroke="#537A8E" stroke-width="0.8"/>
    <path d="M146,20 L196,17 L208,39 L186,49 L151,48 Z" fill="#28495B" stroke="#537A8E" stroke-width="0.8"/>
    <path d="M144,53 L198,53 L210,79 L194,116 L171,115 L156,84 L142,69 Z" fill="#28495B" stroke="#537A8E" stroke-width="0.8"/>
    <path d="M199,20 L306,22 L314,56 L284,78 L244,77 L214,67 L198,46 Z" fill="#28495B" stroke="#537A8E" stroke-width="0.8"/>
    <path d="M254,79 L292,83 L298,95 L258,94 Z" fill="#28495B" stroke="#537A8E" stroke-width="0.8"/>
    <path d="M278,99 L318,98 L322,120 L284,121 Z" fill="#28495B" stroke="#537A8E" stroke-width="0.8"/>
    <path d="M12,14 Q172,-3 332,14" fill="none" stroke="#38BDF8" stroke-width="1.1" stroke-dasharray="3,2"/>
    <rect x="4" y="3" width="164" height="12" rx="2" fill="#0F172A" opacity="0.9"/>
    <text x="8" y="11.5" fill="#FBBF24" font-family="Segoe UI, Arial, sans-serif" font-size="7.1" font-weight="800" letter-spacing="0.45">24 DISPATCHES · STRICTLY 25 NOV</text>
    ${pins}
  </svg>`;
}

export function renderNews25Document(assetsDir: string): string {
  const heroUri = loadDataUri25(assetsDir, 'n25_hormuz_rastanura.jpg', 'redsea_jeddah.jpg');

  const timelineHtml = TIMELINE_25_NOV.map(
    (t) => `
      <div class="tl-stop">
        <span class="tl-utc">${t.utc}</span>
        <span class="tl-loc">${t.place}</span>
        <span class="tl-evt">${t.event}</span>
      </div>`,
  ).join('');

  const featuresHtml = FEATURE_CARDS_25.map((f) => {
    const uri = loadDataUri25(assetsDir, f.imgFile, f.fallbackFile);
    return `
      <article class="f-card">
        <div class="f-art">
          <img src="${uri}" alt="${f.headline}" />
          <span class="f-kicker" style="background:${f.tone}">${f.kicker}</span>
        </div>
        <div class="f-body">
          <h3>${f.headline}</h3>
          <p>${f.deck}</p>
        </div>
      </article>`;
  }).join('');

  const desksHtml = WORLD_DESKS_25.map(
    (d) => `
      <section class="desk">
        <div class="desk-head" style="background:${d.bannerBg}">
          <span>${d.deskName}</span>
          <span>${d.spanIds}</span>
        </div>
        <div class="desk-items">
          ${d.items
            .map(
              (it) => `
            <article class="d-item">
              <div class="d-meta">
                <span class="d-pill" style="background:${it.tone}">#${it.id} · ${it.beat}</span>
                <span class="d-place">${it.place}</span>
              </div>
              <h4>${it.headline}</h4>
              <p>${it.summary}</p>
            </article>`,
            )
            .join('')}
        </div>
      </section>`,
  ).join('');

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
    background: #F6F1E6;
    color: #0F172A;
    font-family: Georgia, "Times New Roman", serif;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 1024px;
    height: 1024px;
    padding: 9px 11px 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    border: 3px solid #0F172A;
  }
  .masthead {
    background: #0B192C;
    color: #FAF6EE;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 3.5px solid #C23B22;
  }
  .m-brand { display: flex; flex-direction: column; gap: 1px; }
  .m-sub {
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 8.8px;
    font-weight: 800;
    letter-spacing: 1.35px;
    color: #FBBF24;
    text-transform: uppercase;
  }
  .m-title {
    font-size: 23.5px;
    font-weight: 900;
    letter-spacing: 0.45px;
    line-height: 1.02;
    color: #FFFFFF;
  }
  .m-date {
    background: #C23B22;
    padding: 4px 10px;
    text-align: right;
    border-radius: 2px;
  }
  .m-date-top {
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 8.4px;
    font-weight: 800;
    letter-spacing: 1px;
    color: #FDE68A;
  }
  .m-date-main {
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 14.5px;
    font-weight: 900;
    color: #FFFFFF;
    letter-spacing: 0.4px;
  }
  .timeline {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
    background: #E9E0CE;
    border: 1px solid #0F172A;
    padding: 3px 5px;
  }
  .tl-stop {
    display: flex;
    flex-direction: column;
    border-right: 1px solid #C4B89F;
    padding-right: 3px;
    font-family: "Segoe UI", Arial, sans-serif;
  }
  .tl-stop:last-child { border-right: none; padding-right: 0; }
  .tl-utc { font-size: 7.6px; font-weight: 900; color: #C23B22; line-height: 1.05; }
  .tl-loc { font-size: 7.4px; font-weight: 800; color: #0F172A; line-height: 1.05; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tl-evt { font-size: 7.3px; color: #334155; line-height: 1.05; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .top-grid {
    display: grid;
    grid-template-columns: 642px 1fr;
    gap: 8px;
    height: 294px;
  }
  .lead-card {
    border: 1.5px solid #0F172A;
    background: #FFFDF9;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .lead-art {
    position: relative;
    height: 196px;
    border-bottom: 1.5px solid #0F172A;
    overflow: hidden;
    background: #0F172A;
  }
  .lead-art img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .lead-kicker {
    position: absolute;
    left: 8px;
    top: 8px;
    background: #C23B22;
    color: #FFFFFF;
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.65px;
    padding: 2.5px 7px;
    border: 1px solid #FAF6EE;
  }
  .lead-copy {
    padding: 6px 10px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
    justify-content: center;
  }
  .lead-copy h2 { font-size: 18.2px; font-weight: 900; line-height: 1.1; color: #0F172A; }
  .lead-copy p { font-family: "Segoe UI", Arial, sans-serif; font-size: 10.5px; line-height: 1.24; color: #1E293B; }

  .map-rail {
    border: 1.5px solid #0F172A;
    background: #FFFDF9;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .rail-highlights {
    padding: 6px 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    gap: 5px;
  }
  .rail-box { border-left: 3.5px solid #C23B22; padding-left: 6px; }
  .rail-box.blue { border-left-color: #1D4ED8; }
  .rail-box .rk {
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 8.1px;
    font-weight: 900;
    color: #C23B22;
    letter-spacing: 0.45px;
  }
  .rail-box.blue .rk { color: #1D4ED8; }
  .rail-box h4 { font-size: 11.8px; font-weight: 900; line-height: 1.12; color: #0F172A; margin: 1px 0; }
  .rail-box p { font-family: "Segoe UI", Arial, sans-serif; font-size: 9.5px; line-height: 1.21; color: #334155; }

  .features-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    height: 242px;
  }
  .f-card {
    border: 1.5px solid #0F172A;
    background: #FFFDF9;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .f-art {
    position: relative;
    height: 132px;
    border-bottom: 1.5px solid #0F172A;
    overflow: hidden;
    background: #0F172A;
  }
  .f-art img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .f-kicker {
    position: absolute;
    left: 6px;
    bottom: 6px;
    color: #FFFFFF;
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 7.8px;
    font-weight: 900;
    letter-spacing: 0.4px;
    padding: 2px 5.5px;
    border: 1px solid rgba(255,255,255,0.75);
  }
  .f-body { padding: 5px 8px; display: flex; flex-direction: column; gap: 2.5px; flex: 1; justify-content: center; }
  .f-body h3 { font-size: 13.3px; font-weight: 900; line-height: 1.12; color: #0F172A; }
  .f-body p { font-family: "Segoe UI", Arial, sans-serif; font-size: 9.8px; line-height: 1.23; color: #1E293B; }

  .desks-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 7px;
    flex: 1;
    min-height: 0;
  }
  .desk { border: 1.5px solid #0F172A; background: #FFFDF9; display: flex; flex-direction: column; overflow: hidden; }
  .desk-head {
    color: #FFFFFF;
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 8.7px;
    font-weight: 900;
    letter-spacing: 0.5px;
    padding: 3.5px 7px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .desk-items { padding: 5px 7px; display: flex; flex-direction: column; justify-content: space-between; flex: 1; gap: 4px; }
  .d-item { border-bottom: 1px dashed #CBD5E1; padding-bottom: 4px; }
  .d-item:last-child { border-bottom: none; padding-bottom: 0; }
  .d-meta { display: flex; justify-content: space-between; align-items: center; gap: 3px; margin-bottom: 1.5px; font-family: "Segoe UI", Arial, sans-serif; }
  .d-pill { color: #FFFFFF; font-size: 7.3px; font-weight: 900; padding: 1px 4px; border-radius: 2px; white-space: nowrap; }
  .d-place { font-size: 7.3px; font-weight: 800; color: #475569; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .d-item h4 { font-size: 11px; font-weight: 900; line-height: 1.12; color: #0F172A; margin-bottom: 1.5px; }
  .d-item p { font-family: "Segoe UI", Arial, sans-serif; font-size: 9.1px; line-height: 1.2; color: #1E293B; }

  .footer {
    background: #0B192C;
    color: #F8FAFC;
    padding: 3.5px 10px;
    display: flex;
    justify-content: space-between;
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 8.4px;
    font-weight: 800;
    letter-spacing: 0.55px;
  }
</style>
</head>
<body>
  <div class="page">
    <header class="masthead">
      <div class="m-brand">
        <div class="m-sub">THE WORLD IN ONE DAY · 24 VERIFIED SAME-DAY DISPATCHES · ALL CONTINENTS &amp; ORBIT</div>
        <div class="m-title">WEDNESDAY, 25 NOVEMBER 2026</div>
      </div>
      <div class="m-date">
        <div class="m-date-top">STRICT 24-HOUR UTC EDITION</div>
        <div class="m-date-main">25 NOV 2026 · 00:00–23:59Z</div>
      </div>
    </header>

    <div class="timeline">${timelineHtml}</div>

    <section class="top-grid">
      <article class="lead-card">
        <div class="lead-art">
          <img src="${heroUri}" alt="Strait of Hormuz burning tankers and Ras Tanura refinery air defense" />
          <span class="lead-kicker">1 · LEAD MARITIME &amp; GULF ESCALATION · STRAIT OF HORMUZ, RAS TANURA &amp; JEDDAH</span>
        </div>
        <div class="lead-copy">
          <h2>Two Tankers Strike Mines in Hormuz; Houthi Drones Target Ras Tanura Refinery</h2>
          <p>Iran’s IRGC Navy reports two oil tankers caught fire after hitting mines along an unauthorized Strait of Hormuz route—while Houthis claim drone strikes on Saudi Arabia’s Ras Tanura refinery and threaten Jeddah ports as coalition air defenses intercept incoming drones.</p>
        </div>
      </article>

      <aside class="map-rail">
        ${renderWorldMap25Svg()}
        <div class="rail-highlights">
          <div class="rail-box">
            <div class="rk">MARITIME, AIR &amp; LABOR FRONTS</div>
            <h4>Hormuz Mines, Ras Tanura, Samara &amp; Benghazi</h4>
            <p>Refinery strikes in Saudi Arabia and Russia, a Russian corvette sunk in Libya, and nationwide strikes across Greece and Bangladesh.</p>
          </div>
          <div class="rail-box blue">
            <div class="rk">ORBIT, COURTS, TREATIES &amp; SOCIETY</div>
            <h4>Shenzhou-24 Liftoff, Huawei Verdict &amp; Canberra Pact</h4>
            <p>Tiangong’s first foreign astronaut launches, Brooklyn convicts Huawei on 10 counts, Australia–Solomons sign defense pact &amp; UN marks Nov 25.</p>
          </div>
        </div>
      </aside>
    </section>

    <section class="features-row">${featuresHtml}</section>

    <section class="desks-row">${desksHtml}</section>

    <footer class="footer">
      <span>VERIFIED SAME-DAY WORLD RECORD · WEDNESDAY, 25 NOVEMBER 2026</span>
      <span>AMERICAS · EUROPE · RUSSIA · MENA · SUB-SAHARAN AFRICA · SOUTH &amp; EAST ASIA · OCEANIA · ORBIT</span>
    </footer>
  </div>
</body>
</html>`;
}

const assetsFolder = process.argv[2] ?? 'e:\\HD stuff\\makefun\\news25-assets';
const htmlDestination = process.argv[3] ?? join(assetsFolder, 'poster_v2.html');
writeFileSync(htmlDestination, renderNews25Document(assetsFolder), 'utf8');
console.log(`Generated ${htmlDestination}`);
