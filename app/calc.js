// NusaBudget — logika kalkulator anggaran (fungsi murni, bisa diuji).
// Aturan 50/30/20: kebutuhan 50%, keinginan 30%, tabungan 20% dari penghasilan.

import { RULE_503020 } from './data.js';

export function parseMoney(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  const n = Number(String(v).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

export function sumExpenses(rows) {
  return rows.reduce((s, r) => s + parseMoney(r.amount), 0);
}

// Bagi pengeluaran ke tiga kelompok 50/30/20 berdasarkan kategori.
const NEED_CATS = ['Makanan', 'Sewa', 'Listrik', 'Transport', 'Pendidikan', 'Kesehatan', 'Cicilan', 'Asuransi', 'Pajak'];
const WANT_CATS = ['Jajan', 'hiburan', 'Langganan', 'Hobi', 'Liburan', 'Pakaian'];

export function classifyExpense(cat) {
  const c = String(cat).toLowerCase();
  if (WANT_CATS.some((w) => c.includes(w.toLowerCase()))) return 'wants';
  if (c.includes('tabung') || c.includes('investasi') || c.includes('dana darurat')) return 'savings';
  return 'needs';
}

export function budgetSummary(income, rows) {
  const total = sumExpenses(rows);
  const balance = income - total;
  const byGroup = { needs: 0, wants: 0, savings: 0 };
  rows.forEach((r) => { byGroup[classifyExpense(r.cat)] += parseMoney(r.amount); });
  const targets = {};
  RULE_503020.forEach((g) => { targets[g.key] = (income * g.share) / 100; });
  const verdict = balance >= 0
    ? (balance >= income * 0.2
      ? { tone: 'good', text: `Surplus ${fmtShort(balance)} — tabunganmu sudah di atas 20%. Pertahankan!` }
      : { tone: 'ok', text: `Surplus ${fmtShort(balance)} — masih positif, tapi di bawah target tabungan 20%.` })
    : { tone: 'bad', text: `Defisit ${fmtShort(-balance)} — pengeluaran melebihi penghasilan. Kurangi pos keinginan dulu.` };
  return { income, total, balance, byGroup, targets, verdict };
}

function fmtShort(n) {
  return 'Rp' + Math.round(n).toLocaleString('id-ID');
}

// Rencana tabungan: berapa bulan sampai target tercapai.
export function savingsPlan(target, perMonth, already = 0) {
  const t = parseMoney(target);
  const m = parseMoney(perMonth);
  const have = parseMoney(already);
  const remaining = Math.max(0, t - have);
  const months = m > 0 ? Math.ceil(remaining / m) : Infinity;
  const pct = t > 0 ? Math.min(100, (have / t) * 100) : 0;
  const finish = Number.isFinite(months)
    ? new Date(Date.now() + months * 30 * 864e5).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    : '—';
  return { target: t, perMonth: m, have, remaining, months, pct, finish };
}
