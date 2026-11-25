import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const assetsDir = process.argv[2] ?? 'e:\\HD stuff\\makefun\\news25-assets';
const outHtml = process.argv[3] ?? join(assetsDir, 'poster_v1.html');

function dataUri(file: string): string {
  const b64 = readFileSync(join(assetsDir, file)).toString('base64');
  return `data:image/jpeg;base64,${b64}`;
}

const imgRedSea = dataUri('redsea_jeddah.jpg');
const imgShenzhou = dataUri('shenzhou24_launch.jpg');
const imgHuawei = dataUri('huawei_edny_tech.jpg');
const imgGreece = dataUri('greece_europe.jpg');

interface BriefItem {
  region: string;
  color: string;
  place: string;
  headline: string;
  detail: string;
}

const briefs: BriefItem[] = [
  {
    region: 'SE ASIA · TRADE',
    color: '#c84b31',
    place: 'SINGAPORE / WASHINGTON',
    headline: 'U.S. Blacklists Megaspeed International',
    detail: 'Commerce Dept. adds Singapore AI-server buyer to Entity List over chip-diversion probe.',
  },
  {
    region: 'EAST ASIA · CYBER',
    color: '#2b6cb0',
    place: 'TAIPEI',
    headline: 'AI Deepfake Network Targets Taiwan Vote',
    detail: 'BBC Verify uncovers coordinated synthetic-anchor campaign ahead of local elections.',
  },
  {
    region: 'OCEANIA · PACT',
    color: '#1f7a6b',
    place: 'CANBERRA',
    headline: 'Australia & Solomon Islands Sign Treaty',
    detail: 'Bilateral security and policing pact signed in Canberra reshapes Pacific defense ties.',
  },
  {
    region: 'SOUTH ASIA · LABOR',
    color: '#b7791f',
    place: 'GAZIPUR & OTTAWA',
    headline: 'Bangladesh Garment Clashes; India–Canada Pact',
    detail: 'Police fire tear gas as wage strikes halt hubs; New Delhi & Ottawa near trade accord.',
  },
  {
    region: 'N. AFRICA · DRONES',
    color: '#9b2c2c',
    place: 'BENGHAZI',
    headline: 'Maritime Drone Boats Strike Libyan Port',
    detail: 'Sea drones hit vessel and Benghazi port facilities, widening naval conflict theater.',
  },
  {
    region: 'EAST AFRICA · PEACE',
    color: '#2c7a7b',
    place: 'ADDIS ABABA & SENNAR',
    headline: 'Sudan Rivals Back Ethiopian Peace Bid',
    detail: 'Somoud & RSF welcome PM Abiy talks; Sennar begins AfDB-backed grain storage silos.',
  },
  {
    region: 'WEST & S. AFRICA',
    color: '#2f855a',
    place: 'ABUJA, DAKAR & DURBAN',
    headline: 'Nigeria ₦65.2T Budget; CAS Restores Senegal',
    detail: 'Tinubu submits revised 2026 budget & satellite plan; CAS hands AFCON title to Senegal.',
  },
  {
    region: 'SOUTH AMERICA',
    color: '#2b6cb0',
    place: 'GENEVA & BRASÍLIA',
    headline: 'Brazil Challenges U.S. Tariffs at WTO',
    detail: 'Brasília seeks panel over Section 301 duties as UNESCO CILAC Science Forum opens.',
  },
  {
    region: 'LATAM & CARIBBEAN',
    color: '#805ad5',
    place: 'MEXICO CITY & HAVANA',
    headline: 'UN Nov 25 Femicide Report; WHO Aids Cuba',
    detail: 'UNODC–UN Women report sparks Mexico City marches; WHO pledges $2M vaccine aid in Havana.',
  },
  {
    region: 'NORTH AMERICA',
    color: '#4a5568',
    place: 'IOWA & WASHINGTON',
    headline: 'Army Lead Azide Blast Plan; Iran War Poll',
    detail: 'U.S. Army sets 10,000-lb Iowa explosive disposal; poll shows majority wants Iran war ended.',
  },
  {
    region: 'EUROPE · SPACE',
    color: '#3182ce',
    place: 'ROME & ZAPORIZHZHIA',
    headline: 'Rome Space Forum Opens; Zaporizhzhia Hit',
    detail: 'NSE Expoforum backs EU orbital autonomy while Russian strike hits Zaporizhzhia apartments.',
  },
  {
    region: 'SE ASIA · ECONOMY',
    color: '#d69e2e',
    place: 'BANGKOK',
    headline: 'Thai Central Bank Flags 48% Informal GDP',
    detail: 'Bank of Thailand warns shadow sector weighs on household debt and formal credit growth.',
  },
];

const briefCardsHtml = briefs
  .map(
    (b) => `
    <div class="brief" style="border-left: 4px solid ${b.color}">
      <div class="b-top">
        <span class="b-tag" style="background:${b.color}">${b.region}</span>
        <span class="b-place">${b.place}</span>
      </div>
      <div class="b-head">${b.headline}</div>
      <div class="b-desc">${b.detail}</div>
    </div>`,
  )
  .join('');

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 1024px;
    height: 1024px;
    overflow: hidden;
    background: #f4efe6;
    color: #111924;
    font-family: 'Segoe UI', Arial, sans-serif;
  }
  .page {
    width: 1024px;
    height: 1024px;
    padding: 12px 14px 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 3px solid #101b2b;
  }
  .masthead {
    background: #0d1829;
    color: #f8f4ec;
    padding: 8px 14px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 4px solid #d9482b;
  }
  .m-left {
    display: flex;
    flex-direction: column;
  }
  .m-kicker {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.8px;
    color: #f4b942;
    text-transform: uppercase;
  }
  .m-title {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 27px;
    font-weight: 900;
    letter-spacing: 0.6px;
    line-height: 1.05;
    color: #ffffff;
  }
  .m-date-box {
    text-align: right;
    background: #d9482b;
    padding: 5px 12px;
    border-radius: 3px;
  }
  .m-day {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.4px;
    color: #ffe8df;
  }
  .m-date {
    font-size: 17px;
    font-weight: 900;
    letter-spacing: 0.5px;
    color: #ffffff;
  }

  /* Hero section */
  .hero {
    display: grid;
    grid-template-columns: 560px 1fr;
    gap: 10px;
    background: #ffffff;
    border: 1.5px solid #1c2d42;
    border-radius: 4px;
    overflow: hidden;
    height: 204px;
  }
  .hero-img-wrap {
    position: relative;
    width: 560px;
    height: 204px;
    overflow: hidden;
  }
  .hero-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .hero-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    background: #c92a2a;
    color: #ffffff;
    font-size: 10px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 2px;
    letter-spacing: 1px;
  }
  .hero-body {
    padding: 10px 12px 10px 2px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .hero-loc {
    font-size: 10.5px;
    font-weight: 800;
    color: #b83227;
    letter-spacing: 1px;
  }
  .hero-h1 {
    font-family: Georgia, serif;
    font-size: 20.5px;
    font-weight: 900;
    line-height: 1.14;
    color: #0d1829;
  }
  .hero-lead {
    font-size: 11.5px;
    line-height: 1.32;
    color: #243447;
  }
  .hero-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    border-top: 1px solid #d5cfc2;
    padding-top: 6px;
  }
  .stat-pill {
    background: #f6f1e7;
    border-left: 3px solid #d9482b;
    padding: 3px 6px;
    font-size: 10px;
    line-height: 1.2;
  }
  .stat-pill b { color: #0d1829; font-size: 10.5px; }

  /* 3 Feature Illustrated Plates */
  .features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    height: 248px;
  }
  .f-card {
    background: #ffffff;
    border: 1.5px solid #22354d;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .f-img {
    position: relative;
    height: 126px;
    width: 100%;
    overflow: hidden;
  }
  .f-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .f-tag {
    position: absolute;
    top: 6px;
    left: 6px;
    color: #fff;
    font-size: 9.5px;
    font-weight: 800;
    padding: 2px 7px;
    border-radius: 2px;
    letter-spacing: 0.8px;
  }
  .f-txt {
    padding: 7px 9px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
  }
  .f-title {
    font-family: Georgia, serif;
    font-size: 14px;
    font-weight: 900;
    line-height: 1.15;
    color: #0d1829;
  }
  .f-sub {
    font-size: 10.6px;
    line-height: 1.28;
    color: #2b3c50;
  }

  /* 12-story Regional World Briefings Grid */
  .section-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #17283d;
    color: #ffffff;
    padding: 4px 10px;
    border-radius: 3px;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 1.2px;
  }
  .section-bar span {
    color: #f4b942;
    font-size: 10px;
  }
  .brief-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 6px;
    flex: 1;
  }
  .brief {
    background: #fffdf9;
    border: 1px solid #bfb7a6;
    border-radius: 3px;
    padding: 7px 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 3px;
  }
  .b-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
  }
  .b-tag {
    color: #ffffff;
    font-size: 8.8px;
    font-weight: 800;
    padding: 2px 5.5px;
    border-radius: 2px;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }
  .b-place {
    font-size: 8.8px;
    font-weight: 800;
    color: #48596b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .b-head {
    font-family: Georgia, serif;
    font-size: 12.6px;
    font-weight: 900;
    line-height: 1.13;
    color: #0d1829;
  }
  .b-desc {
    font-size: 10.4px;
    line-height: 1.24;
    color: #233345;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9.5px;
    font-weight: 700;
    color: #394b5f;
    padding-top: 1px;
  }
</style>
</head>
<body>
  <div class="page">
    <div class="masthead">
      <div class="m-left">
        <div class="m-kicker">GLOBAL NEWS ATLAS · 7 CONTINENTS &amp; ORBITAL DISPATCH · 17 VERIFIED STORIES</div>
        <div class="m-title">THE WORLD ON 25 NOVEMBER 2026</div>
      </div>
      <div class="m-date-box">
        <div class="m-day">WEDNESDAY EDITION</div>
        <div class="m-date">25 NOV 2026</div>
      </div>
    </div>

    <div class="hero">
      <div class="hero-img-wrap">
        <img src="${imgRedSea}" alt="Red Sea Hodeidah Jeddah">
        <div class="hero-badge">LEAD · MIDDLE EAST &amp; RED SEA</div>
      </div>
      <div class="hero-body">
        <div class="hero-loc">HODEIDAH · JEDDAH · TAIZ</div>
        <div class="hero-h1">Houthis Threaten Jeddah &amp; Saudi Ports After Hodeidah Evacuation Order</div>
        <div class="hero-lead">Yemen's Houthi movement warned it will strike Jeddah and Saudi Red Sea ports if coalition forces attack Hodeidah following evacuation orders, escalating Gulf shipping perils.</div>
        <div class="hero-stats">
          <div class="stat-pill"><b>364,000+ Displaced</b><br>UN OCHA tally across Yemen since August</div>
          <div class="stat-pill"><b>350,000 Children</b><br>Miss measles-rubella shots in besieged Taiz</div>
        </div>
      </div>
    </div>

    <div class="features">
      <div class="f-card">
        <div class="f-img">
          <img src="${imgShenzhou}" alt="Shenzhou-24 Launch">
          <div class="f-tag" style="background:#1d4ed8">ORBITAL SPACE · JIUQUAN</div>
        </div>
        <div class="f-txt">
          <div class="f-title">Shenzhou-24 Launches With First Pakistani Astronaut</div>
          <div class="f-sub">China's Long March-2F lifts off for Tiangong carrying payload specialist M. Zeeshan Ali in landmark international crewed flight.</div>
        </div>
      </div>

      <div class="f-card">
        <div class="f-img">
          <img src="${imgHuawei}" alt="Huawei EDNY Verdict">
          <div class="f-tag" style="background:#0f766e">U.S. LAW &amp; BIG TECH</div>
        </div>
        <div class="f-txt">
          <div class="f-title">U.S. Jury Acquits Huawei of RICO; Nvidia Keeps Huang</div>
          <div class="f-sub">Brooklyn federal jury clears Huawei on racketeering counts; Nvidia board reinstates CEO Jensen Huang as Microsoft declares M365 'Code Red'.</div>
        </div>
      </div>

      <div class="f-card">
        <div class="f-img">
          <img src="${imgGreece}" alt="Greece Strike and Uzhhorod">
          <div class="f-tag" style="background:#b91c1c">EUROPE · LABOR &amp; DIPLOMACY</div>
        </div>
        <div class="f-txt">
          <div class="f-title">Greece Halts in 60-City Strike; Magyar Meets Zelenskyy</div>
          <div class="f-sub">GSEE &amp; ADEDY unions shut Greek ferries, rails, and ports over living costs while Hungary's PM Péter Magyar holds Uzhhorod reset talks.</div>
        </div>
      </div>
    </div>

    <div class="section-bar">
      <div>WORLD REGIONAL DISPATCHES · WEDNESDAY 25 NOVEMBER 2026</div>
      <span>NORTH &amp; SOUTH AMERICA · EUROPE · AFRICA · ASIA-PACIFIC</span>
    </div>

    <div class="brief-grid">
      ${briefCardsHtml}
    </div>

    <div class="footer">
      <div>COVERAGE: AMERICAS · EUROPE · MENA · SUB-SAHARAN AFRICA · SOUTH &amp; SE ASIA · EAST ASIA · OCEANIA · LOW EARTH ORBIT</div>
      <div>WEDNESDAY · 25 NOVEMBER 2026 · ALL TIME ZONES</div>
    </div>
  </div>
</body>
</html>`;

writeFileSync(outHtml, html, 'utf8');
console.log('Wrote poster HTML to', outHtml);
