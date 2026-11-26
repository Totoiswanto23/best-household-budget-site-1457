// NusaBudget — grafik SVG tanpa pustaka. Semua grafik digambar sebagai
// SVG murni dari data, tanpa dependensi dan tanpa network.

export function fmtRp(n) {
  return 'Rp' + Math.round(n).toLocaleString('id-ID');
}

export function fmtPct(n, digits = 1) {
  return n.toFixed(digits).replace('.', ',') + '%';
}

// Diagram batang horizontal: [{name, value, color?}] -> string SVG.
// Nilai ditampilkan di ujung batang; nama di sebelah kiri.
export function barChart(rows, opts = {}) {
  const width = opts.width || 640;
  const rowH = opts.rowH || 34;
  const labelW = opts.labelW || 210;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const height = rows.length * rowH + 8;
  const barMax = width - labelW - 110;
  let out = `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Diagram batang">`;
  rows.forEach((r, i) => {
    const y = 8 + i * rowH;
    const w = Math.max(2, (r.value / max) * barMax);
    const color = r.color || '#0e7a5f';
    out += `<text x="0" y="${y + 15}" font-size="13" fill="#334155">${esc(r.name)}</text>`;
    out += `<rect x="${labelW}" y="${y}" width="${w}" height="20" rx="4" fill="${color}"/>`;
    out += `<text x="${labelW + w + 8}" y="${y + 15}" font-size="13" font-weight="600" fill="#0f172a">${fmtRp(r.value)}</text>`;
  });
  out += '</svg>';
  return out;
}

// Diagram donat: [{name, value, color}] -> string SVG + legenda HTML.
export function donutChart(parts, opts = {}) {
  const size = opts.size || 220;
  const thick = opts.thick || 34;
  const r = (size - thick) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  let out = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Diagram donat">`;
  let offset = 25; // mulai dari atas
  parts.forEach((p) => {
    const frac = p.value / total;
    const len = frac * 100;
    const gap = frac > 0 ? 0.6 : 0;
    out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${p.color}" stroke-width="${thick}" stroke-dasharray="${Math.max(0, len - gap)} ${100 - len + gap}" stroke-dashoffset="${offset}" pathLength="100"/>`;
    offset -= len;
  });
  out += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" font-weight="700" fill="#0f172a">${fmtPct((parts[0].value / total) * 100, 1)}</text>`;
  out += `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="11" fill="#64748b">${esc(parts[0].name)}</text>`;
  out += '</svg>';
  return out;
}

// Bilah progres sederhana (0–100%).
export function progressBar(pct, color = '#0e7a5f') {
  const p = Math.max(0, Math.min(100, pct));
  return `<div class="progress" role="progressbar" aria-valuenow="${Math.round(p)}" aria-valuemin="0" aria-valuemax="100">`
    + `<div class="progress-fill" style="width:${p}%;background:${color}"></div></div>`;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
