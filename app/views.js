// NusaBudget — halaman-halaman situs (hash router) dan render-nya.
// Setiap halaman dirender dari data.js; grafik dari charts.js.

import { BPS, RULE_503020, EXAMPLE_HOUSEHOLDS, SAVING_PRESETS, TIPS } from './data.js';
import { fmtRp, fmtPct, barChart, donutChart, progressBar } from './charts.js';
import { parseMoney, budgetSummary, savingsPlan, classifyExpense } from './calc.js';

const app = () => document.getElementById('app');

function setActive(route) {
  document.querySelectorAll('nav.main a').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === route);
  });
}

function kpi(num, label, sub = '') {
  return `<div class="card"><div class="kpi-num">${num}</div><div class="kpi-label">${label}</div>${sub ? `<div class="kpi-sub">${sub}</div>` : ''}</div>`;
}

// ---- Beranda ----
export function viewHome() {
  const b = BPS.mar2026;
  const foodPct = (b.foodTotal / b.total) * 100;
  const nonPct = (b.nonFoodTotal / b.total) * 100;
  const topFood = [...b.food].sort((x, y) => y.value - x.value).slice(0, 5);
  const topNon = [...b.nonFood].sort((x, y) => y.value - x.value).slice(0, 5);
  app().innerHTML = `
  <span class="pill">Data resmi BPS · Susenas Maret 2026</span>
  <h1>Berapa sih pengeluaran rumah tangga Indonesia sebulan?</h1>
  <p class="lede">Rata-rata orang Indonesia mengeluarkan <strong>${fmtRp(b.total)}</strong> per kapita
  setiap bulan. Separuhnya untuk makanan, separuhnya untuk bukan makanan. NusaBudget membantu
  keluargamu membandingkan anggaran sendiri dengan angka nasional itu — lalu menyusun rencana yang realistis.</p>
  <div class="grid cols-4">
    ${kpi(fmtRp(b.total), 'Pengeluaran rata-rata / orang / bulan', 'Susenas Maret 2026')}
    ${kpi(fmtPct(foodPct), 'Untuk makanan', fmtRp(b.foodTotal) + ' per orang')}
    ${kpi(fmtPct(nonPct), 'Untuk bukan makanan', fmtRp(b.nonFoodTotal) + ' per orang')}
    ${kpi('50 / 30 / 20', 'Aturan anggaran', 'kebutuhan / keinginan / tabungan')}
  </div>
  <div class="grid cols-2" style="margin-top:14px">
    <div class="card">
      <h3>Makanan vs bukan makanan</h3>
      <div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">
        ${donutChart([
          { name: 'Makanan', value: b.foodTotal, color: '#0e7a5f' },
          { name: 'Bukan makanan', value: b.nonFoodTotal, color: '#d9930d' },
        ])}
        <div class="legend" style="flex-direction:column;gap:8px">
          <span><i style="background:#0e7a5f"></i>Makanan — ${fmtPct(foodPct)} (${fmtRp(b.foodTotal)})</span>
          <span><i style="background:#d9930d"></i>Bukan makanan — ${fmtPct(nonPct)} (${fmtRp(b.nonFoodTotal)})</span>
        </div>
      </div>
      <p class="small">Per kapita sebulan, Susenas Maret 2026 (BPS). Bandingkan dengan
      Maret 2024: makanan 50,10% dari total ${fmtRp(BPS.mar2024.total)}.</p>
    </div>
    <div class="card">
      <h3>Pos belanja terbesar</h3>
      ${barChart([
        { name: 'Perumahan & fasilitas RT', value: 424251, color: '#0e7a5f' },
        { name: 'Makanan & minuman jadi', value: 277302, color: '#d9930d' },
        { name: 'Aneka barang & jasa', value: 208038, color: '#2563eb' },
        { name: 'Rokok & tembakau', value: 94180, color: '#94a3b8' },
        { name: 'Padi-padian', value: 92141, color: '#0e7a5f' },
      ])}
      <p class="small">Per kapita sebulan, Susenas Maret 2026. Perumahan adalah pos bukan makanan
      terbesar — lebih besar dari semua makanan jadi.</p>
    </div>
  </div>
  <div class="grid cols-3" style="margin-top:14px">
    <div class="card">
      <h3>Kalkulator anggaran</h3>
      <p>Masukkan penghasilan dan pengeluaranmu. Kalkulator membagi otomatis ke aturan 50/30/20 dan memberi tahu surplus atau defisitmu.</p>
      <p><a href="#/kalkulator">Buka kalkulator →</a></p>
    </div>
    <div class="card">
      <h3>Perencana tabungan</h3>
      <p>Punya target — dana darurat, DP rumah, umroh? Hitung berapa bulan sampai tercapai dengan tabungan bulananmu.</p>
      <p><a href="#/tabungan">Rencanakan tabungan →</a></p>
    </div>
    <div class="card">
      <h3>Panduan & template</h3>
      <p>Tiga template anggaran keluarga siap pakai (contoh) plus enam tips hemat yang konkret dan bisa langsung dilakukan.</p>
      <p><a href="#/panduan">Baca panduan →</a></p>
    </div>
  </div>
  <div class="note"><strong>Mulai dari angka nasional, bukan dari nol.</strong>
  Rata-rata nasional ${fmtRp(b.total)} per orang per bulan berarti keluarga 4 orang rata-rata mengeluarkan
  sekitar ${fmtRp(b.total * 4)} sebulan. Kalau anggaranmu jauh di atas itu, cek pos mana yang membengkak di
  <a href="#/belanja">Rincian Belanja</a>.</div>`;
  setActive('home');
  document.title = 'NusaBudget — Anggaran Rumah Tangga Indonesia';
}

// ---- Rincian Belanja (data BPS) ----
export function viewBelanja() {
  const b = BPS.mar2026;
  const foodRows = [...b.food].sort((x, y) => y.value - x.value).map((r) => ({
    ...r, share: (r.value / b.foodTotal) * 100, color: '#0e7a5f',
  }));
  const nonRows = [...b.nonFood].sort((x, y) => y.value - x.value).map((r) => ({
    ...r, share: (r.value / b.nonFoodTotal) * 100, color: '#d9930d',
  }));
  const table = (rows, total, title) => `
    <h3>${title}</h3>
    <table>
      <thead><tr><th>Kelompok komoditas</th><th class="num">Rp / orang / bulan</th><th class="num">Pangsa</th><th style="min-width:110px">Batang</th></tr></thead>
      <tbody>
        ${rows.map((r) => `<tr><td>${r.name}${r.note ? ' <span class="small">(' + r.note + ')</span>' : ''}</td><td class="num">${fmtRp(r.value)}</td><td class="num">${fmtPct(r.share)}</td><td><div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, r.share * 2)}%;background:${r.color}"></div></div></td></tr>`).join('')}
        <tr class="total-row"><td>Total ${title.toLowerCase()}</td><td class="num">${fmtRp(total)}</td><td class="num">100%</td><td></td></tr>
      </tbody>
    </table>`;
  app().innerHTML = `
  <span class="pill">BPS · Susenas Maret 2026</span>
  <h1>Rincian belanja: ke mana perginya ${fmtRp(b.total)} itu?</h1>
  <p class="lede">Rata-rata pengeluaran per kapita sebulan menurut kelompok komoditas.
  Angka-angka ini adalah <strong>rata-rata nasional</strong> — patokan untuk membandingkan anggaran keluargamu, bukan vonis.</p>
  <div class="grid cols-2">
    <div class="card">
      <h3>Semua kelompok, terbesar dulu</h3>
      ${barChart([...b.nonFood, ...b.food].sort((x, y) => y.value - x.value).slice(0, 8).map((r, i) => ({
        name: r.name.length > 26 ? r.name.slice(0, 26) + '…' : r.name,
        value: r.value, color: i % 2 ? '#d9930d' : '#0e7a5f',
      })), { labelW: 190 })}
    </div>
    <div class="card">
      <h3>Tiga hal yang paling mengejutkan</h3>
      <ol>
        <li><strong>Perumahan ${fmtRp(424251)}</strong> — pos tunggal terbesar, seperempat dari semua pengeluaran.</li>
        <li><strong>Rokok &amp; tembakau ${fmtRp(94180)}</strong> — lebih besar dari daging (${fmtRp(40352)}) dan telur-susu (${fmtRp(44915)}) digabung.</li>
        <li><strong>Makanan jadi ${fmtRp(277302)}</strong> — makan di luar dan makanan siap saji kini sepertiga dari semua belanja makanan.</li>
      </ol>
      <p class="small">Sumber: BPS, Susenas Maret 2026. Lihat halaman <a href="#/sumber">Sumber</a> untuk publikasi lengkapnya.</p>
    </div>
  </div>
  <div class="card" style="margin-top:14px">${table(foodRows, b.foodTotal, 'Makanan')}</div>
  <div class="card" style="margin-top:14px">${table(nonRows, b.nonFoodTotal, 'Bukan makanan')}</div>
  <div class="callout"><strong>Kontras wilayah (Maret 2024):</strong> di DKI Jakarta, porsi bukan makanan
  mencapai 60,34% dan makanan hanya 39,66% — kebalikan dari rata-rata nasional (50,10% makanan).
  Makin tinggi penghasilan, makin kecil porsi makanan. Itu normal — yang penting totalnya terkendali.</div>
  <p><a href="#/kalkulator">Bandingkan anggaranmu dengan angka ini →</a></p>`;
  setActive('belanja');
  document.title = 'Rincian Belanja (BPS) — NusaBudget';
}

// ---- Kalkulator Anggaran ----
let calcRows = [];
let pendingExample = null;
let currentExampleId = EXAMPLE_HOUSEHOLDS[0].id;

export function viewKalkulator() {
  if (calcRows.length === 0 || pendingExample) {
    loadExample(pendingExample || EXAMPLE_HOUSEHOLDS[0].id);
    pendingExample = null;
  }
  app().innerHTML = `
  <span class="pill">Alat interaktif — semua hitungan di browsermu</span>
  <h1>Kalkulator anggaran keluarga</h1>
  <p class="lede">Isi penghasilan dan pengeluaran bulananmu. Kalkulator menghitung total, sisa,
  dan pembagian 50/30/20 secara langsung — tanpa mengirim data ke mana pun.</p>
  <div class="grid cols-2">
    <div class="card">
      <label for="income">Penghasilan bulanan (Rp)</label>
      <input type="number" id="income" min="0" step="1000" value="12000000">
      <label for="example">Mulai dari contoh keluarga</label>
      <select id="example">
        ${EXAMPLE_HOUSEHOLDS.map((h) => `<option value="${h.id}">${h.name} — ${h.members}</option>`).join('')}
      </select>
      <p class="small">Contoh di atas adalah ilustrasi, bukan data BPS. Ubah angkanya sesukamu.</p>
      <h3>Pengeluaran bulanan</h3>
      <div id="expense-rows"></div>
      <div class="btn-row">
        <button class="btn-ghost" id="add-row" type="button">+ Tambah pos</button>
        <button class="btn" id="recalc" type="button">Hitung ulang</button>
      </div>
    </div>
    <div class="card" id="result" aria-live="polite"></div>
  </div>
  <div class="card" style="margin-top:14px">
    <h3>Aturan 50/30/20 — target untuk penghasilanmu</h3>
    <div id="rule-targets"></div>
  </div>`;
  setActive('kalkulator');
  document.title = 'Kalkulator Anggaran — NusaBudget';
  document.getElementById('example').value = currentExampleId;
  const render = () => renderCalc();
  document.getElementById('income').addEventListener('input', render);
  document.getElementById('example').addEventListener('change', (e) => { loadExample(e.target.value); renderCalc(); });
  document.getElementById('add-row').addEventListener('click', () => { calcRows.push({ cat: 'Lainnya', amount: 0 }); renderCalc(); });
  document.getElementById('recalc').addEventListener('click', render);
  renderCalc();
  window.__shotReady = true;
}

function loadExample(id) {
  const h = EXAMPLE_HOUSEHOLDS.find((x) => x.id === id) || EXAMPLE_HOUSEHOLDS[0];
  currentExampleId = h.id;
  calcRows = h.expenses.map((e) => ({ cat: e.cat, amount: e.amount }));
  const inc = document.getElementById('income');
  if (inc) inc.value = h.income;
}

function renderCalc() {
  const rowsEl = document.getElementById('expense-rows');
  const income = parseMoney(document.getElementById('income').value);
  rowsEl.innerHTML = calcRows.map((r, i) => `
    <div style="display:flex;gap:8px;margin-bottom:8px">
      <input type="text" value="${escAttr(r.cat)}" data-row="${i}" data-field="cat" aria-label="Kategori pengeluaran ${i + 1}" style="flex:2">
      <input type="number" value="${r.amount}" min="0" step="1000" data-row="${i}" data-field="amount" aria-label="Jumlah rupiah ${i + 1}" style="flex:1">
      <button class="btn-danger" type="button" data-del="${i}" aria-label="Hapus pos ${i + 1}">Hapus</button>
    </div>`).join('');
  rowsEl.querySelectorAll('input').forEach((inp) => {
    inp.addEventListener('input', () => {
      const i = Number(inp.dataset.row);
      if (inp.dataset.field === 'amount') calcRows[i].amount = parseMoney(inp.value);
      else calcRows[i].cat = inp.value;
      renderResult();
    });
  });
  rowsEl.querySelectorAll('[data-del]').forEach((btn) => {
    btn.addEventListener('click', () => { calcRows.splice(Number(btn.dataset.del), 1); renderCalc(); });
  });
  renderResult();
}

function renderResult() {
  const income = parseMoney(document.getElementById('income').value);
  const s = budgetSummary(income, calcRows);
  const res = document.getElementById('result');
  const groupRow = (g) => {
    const spent = s.byGroup[g.key];
    const target = s.targets[g.key];
    const pct = income > 0 ? (spent / income) * 100 : 0;
    const over = spent > target;
    return `<tr><td><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${g.color};margin-right:6px"></span>${g.name}</td>
      <td class="num">${fmtRp(spent)}</td><td class="num">${fmtPct(pct, 0)}</td>
      <td class="num">${fmtRp(target)}</td><td class="${over ? 'bad' : 'good'}">${over ? 'Lewat ' + fmtRp(spent - target) : 'Aman'}</td></tr>`;
  };
  res.innerHTML = `
    <h3>Hasil hitungan</h3>
    <div class="grid cols-3">
      ${kpi(fmtRp(s.income), 'Penghasilan')}
      ${kpi(fmtRp(s.total), 'Total pengeluaran')}
      ${kpi(fmtRp(s.balance), s.balance >= 0 ? 'Sisa (surplus)' : 'Kurang (defisit)', '')}
    </div>
    <div class="verdict ${s.verdict.tone}">${s.verdict.text}</div>
    <h3>Pembagian 50/30/20</h3>
    <table><thead><tr><th>Kelompok</th><th class="num">Belanjamu</th><th class="num">Porsi</th><th class="num">Target</th><th>Status</th></tr></thead>
    <tbody>${RULE_503020.map(groupRow).join('')}</tbody></table>
    <p class="small">Klasifikasi otomatis: makanan, rumah, listrik, transport, pendidikan, dan kesehatan
    dihitung sebagai kebutuhan; jajan dan hiburan sebagai keinginan; tabungan sebagai tabungan.</p>`;
  const rt = document.getElementById('rule-targets');
  rt.innerHTML = RULE_503020.map((g) => {
    const target = (income * g.share) / 100;
    return `<div style="margin-bottom:12px"><strong>${g.name} — ${g.share}% = ${fmtRp(target)} / bulan</strong>
      <p class="small" style="margin:2px 0 6px">${g.desc}</p>${progressBar(g.share, g.color)}</div>`;
  }).join('');
}

function escAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

// ---- Perencana Tabungan ----
export function viewTabungan() {
  app().innerHTML = `
  <span class="pill">Alat interaktif — semua hitungan di browsermu</span>
  <h1>Perencana tabungan</h1>
  <p class="lede">Pilih target, isi berapa yang sudah terkumpul dan berapa yang bisa disisihkan tiap bulan.
  Perencana menghitung berapa bulan lagi sampai target tercapai — dan tanggalnya.</p>
  <div class="grid cols-2">
    <div class="card">
      <label for="preset">Target siap pakai</label>
      <select id="preset">
        ${SAVING_PRESETS.map((p) => `<option value="${p.id}">${p.name} — ${fmtRp(p.target)}</option>`).join('')}
        <option value="custom">Target sendiri…</option>
      </select>
      <label for="target">Target tabungan (Rp)</label>
      <input type="number" id="target" min="0" step="100000" value="30000000">
      <label for="have">Sudah terkumpul (Rp)</label>
      <input type="number" id="have" min="0" step="100000" value="5000000">
      <label for="monthly">Bisa disisihkan per bulan (Rp)</label>
      <input type="number" id="monthly" min="0" step="50000" value="1500000">
      <div class="btn-row"><button class="btn" id="plan-go" type="button">Hitung rencana</button></div>
      <p class="small">Contoh: dana darurat idealnya 3–6 bulan pengeluaran. Kalau pengeluaranmu
      Rp5.000.000/bulan, dana daruratmu Rp15.000.000–Rp30.000.000.</p>
    </div>
    <div class="card" id="plan-result" aria-live="polite"></div>
  </div>`;
  setActive('tabungan');
  document.title = 'Perencana Tabungan — NusaBudget';
  const update = () => renderPlan();
  ['target', 'have', 'monthly'].forEach((id) => document.getElementById(id).addEventListener('input', update));
  document.getElementById('plan-go').addEventListener('click', update);
  document.getElementById('preset').addEventListener('change', (e) => {
    const p = SAVING_PRESETS.find((x) => x.id === e.target.value);
    if (p) { document.getElementById('target').value = p.target; update(); }
  });
  renderPlan();
}

function renderPlan() {
  const p = savingsPlan(
    document.getElementById('target').value,
    document.getElementById('monthly').value,
    document.getElementById('have').value,
  );
  const el = document.getElementById('plan-result');
  if (!Number.isFinite(p.months)) {
    el.innerHTML = `<h3>Belum bisa dihitung</h3><p>Isi jumlah yang bisa disisihkan per bulan (lebih dari Rp0) supaya rencana bisa dihitung.</p>`;
    return;
  }
  const years = Math.floor(p.months / 12);
  const rest = p.months % 12;
  const dur = years > 0 ? `${years} tahun ${rest} bulan` : `${p.months} bulan`;
  el.innerHTML = `
    <h3>Rencanamu</h3>
    <div class="grid cols-2">
      ${kpi(fmtRp(p.target), 'Target')}
      ${kpi(fmtRp(p.have), 'Sudah terkumpul', fmtPct(p.pct, 0) + ' dari target')}
      ${kpi(fmtRp(p.perMonth), 'Tabungan / bulan')}
      ${kpi(dur, 'Waktu sampai tercapai', 'sekitar ' + p.finish)}
    </div>
    <h3>Progres</h3>
    ${progressBar(p.pct)}
    <p class="small">${fmtPct(p.pct)} terkumpul · sisa ${fmtRp(p.remaining)}</p>
    <div class="verdict ${p.months <= 12 ? 'good' : 'ok'}">
      ${p.months <= 12
        ? `Hebat — target tercapai dalam setahun (${dur}).`
        : `Dengan ${fmtRp(p.perMonth)}/bulan, target tercapai dalam ${dur} (sekitar ${p.finish}). Naikkan tabungan bulanan untuk mempercepat.`}
    </div>
    <p class="small">Tips: naikkan tabungan Rp500.000/bulan memangkas ${p.perMonth > 0 ? Math.max(0, p.months - Math.ceil(p.remaining / (p.perMonth + 500000))) : 0} bulan dari rencana ini.</p>`;
}

// ---- Panduan & Template ----
export function viewPanduan() {
  app().innerHTML = `
  <span class="pill">Panduan praktis</span>
  <h1>Panduan anggaran &amp; template keluarga</h1>
  <p class="lede">Tiga template siap pakai di bawah ini adalah <strong>contoh ilustrasi</strong> — sesuaikan
  dengan penghasilan dan harga di kotamu. Aturan 50/30/20 adalah titik awal, bukan hukum.</p>
  <div class="card">
    <h3>Aturan 50/30/20 dalam satu menit</h3>
    ${RULE_503020.map((g) => `<p><strong style="color:${g.color}">${g.share}% — ${g.name}.</strong> ${g.desc}</p>`).join('')}
    <p class="small">Kalau penghasilanmu Rp8.500.000: kebutuhan Rp4.250.000, keinginan Rp2.550.000,
    tabungan Rp1.700.000. Di kota besar, kebutuhan sering menyentuh 60% — tidak apa-apa, asal tabungan tidak nol.</p>
  </div>
  ${EXAMPLE_HOUSEHOLDS.map((h) => {
    const total = h.expenses.reduce((s, e) => s + e.amount, 0);
    const sisa = h.income - total;
    return `<div class="card" style="margin-top:14px">
      <h3>${h.name} <span class="pill">Contoh</span></h3>
      <p class="small">${h.members} · Penghasilan ${fmtRp(h.income)}/bulan · Target tabungan ${fmtRp(h.savingsTarget)}/bulan</p>
      <table><thead><tr><th>Pos</th><th class="num">Rp / bulan</th><th class="num">Porsi</th></tr></thead><tbody>
      ${h.expenses.map((e) => `<tr><td>${e.cat}</td><td class="num">${fmtRp(e.amount)}</td><td class="num">${fmtPct((e.amount / h.income) * 100, 0)}</td></tr>`).join('')}
      <tr class="total-row"><td>Total pengeluaran</td><td class="num">${fmtRp(total)}</td><td class="num">${fmtPct((total / h.income) * 100, 0)}</td></tr>
      <tr><td>Sisa untuk tabungan</td><td class="num">${fmtRp(sisa)}</td><td class="num">${fmtPct((sisa / h.income) * 100, 0)}</td></tr>
      </tbody></table>
      <p><a href="#/kalkulator?ex=${h.id}">Muat contoh ini di kalkulator →</a></p>
    </div>`;
  }).join('')}
  <div class="card" style="margin-top:14px">
    <h3>Enam tips hemat yang benar-benar jalan</h3>
    ${TIPS.map((t) => `<p><strong>${t.title}.</strong> ${t.body}</p>`).join('')}
  </div>`;
  setActive('panduan');
  document.title = 'Panduan & Template — NusaBudget';
}

// ---- Sumber ----
export function viewSumber() {
  app().innerHTML = `
  <span class="pill">Transparansi data</span>
  <h1>Sumber data</h1>
  <p class="lede">Semua angka nasional di situs ini berasal dari publikasi resmi Badan Pusat Statistik (BPS).
  Angka contoh rumah tangga diberi label “Contoh” dan bukan data BPS.</p>
  <div class="card">
    <h3>Publikasi BPS yang dipakai</h3>
    <table><thead><tr><th>Publikasi</th><th>Angka yang dipakai</th></tr></thead><tbody>
    <tr><td><strong>Pengeluaran untuk Konsumsi Penduduk Indonesia, Maret 2026</strong><br><span class="small">BPS, dirilis 5 Oktober 2026 (Susenas Maret 2026)</span></td>
    <td>Rata-rata pengeluaran per kapita ${fmtRp(1657281)}/bulan; makanan ${fmtRp(825306)}; bukan makanan ${fmtRp(831974)}; rincian kelompok komoditas di halaman Rincian Belanja.</td></tr>
    <tr><td><strong>Pengeluaran untuk Konsumsi Penduduk Indonesia, Maret 2024</strong><br><span class="small">BPS, Vol. 28 No. 1, 2024, Katalog 3201004 (Susenas Maret 2024)</span></td>
    <td>Rata-rata pengeluaran per kapita ${fmtRp(1500556)}/bulan; makanan 50,10%, bukan makanan 49,90%; porsi makanan DKI Jakarta 39,66% vs bukan makanan 60,34%.</td></tr>
    </tbody></table>
  </div>
  <div class="card" style="margin-top:14px">
    <h3>Cara membaca angka-angka ini</h3>
    <ul>
      <li><strong>Per kapita</strong> artinya per orang, bukan per rumah tangga. Kalikan dengan jumlah anggota keluarga untuk patokan rumah tangga.</li>
      <li><strong>Rata-rata nasional</strong> mencampur kota besar dan desa. Biaya hidup di Jakarta jauh di atas rata-rata; di desa jauh di bawah.</li>
      <li><strong>“Kelompok makanan lainnya”</strong> di halaman Rincian Belanja adalah sisa hitungan (total makanan dikurangi kelompok yang dirinci) — mencakup kacang-kacangan, buah-buahan, minyak dan kelapa, bahan minuman, dan lain-lain.</li>
      <li>Selisih Rp2 pada total bukan makanan berasal dari pembulatan tiap kelompok di publikasi BPS.</li>
    </ul>
  </div>
  <div class="card" style="margin-top:14px">
    <h3>Tentang NusaBudget</h3>
    <p>Situs ini dibuat dari nol untuk bounty make.fun “Make the best household budget site” — desain, teks,
    dan kode asli. Tidak ada data yang dikirim ke server mana pun: kalkulator dan perencana tabungan berjalan
    sepenuhnya di browsermu, dan situs ini tidak memuat apa pun dari internet.</p>
    <p><a href="#/">Kembali ke Beranda →</a></p>
  </div>`;
  setActive('sumber');
  document.title = 'Sumber Data — NusaBudget';
}

// ---- Router ----
export const ROUTES = {
  '': viewHome,
  'kalkulator': viewKalkulator,
  'belanja': viewBelanja,
  'tabungan': viewTabungan,
  'panduan': viewPanduan,
  'sumber': viewSumber,
};

export function route() {
  const hash = (location.hash || '#/').replace(/^#\/?/, '').split('?')[0];
  const query = (location.hash.split('?')[1] || '');
  const ex = new URLSearchParams(query).get('ex');
  if (ex) pendingExample = ex;
  const view = ROUTES[hash] || viewHome;
  view();
  window.__shotReady = true;
  window.scrollTo(0, 0);
}
