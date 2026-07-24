import React, { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "./supabaseClient";

/* ============================== DATA & CONSTANTS ============================== */

const SKEMA = {
  STD: [3750000, 2500000, 2000000, 1500000, 1500000, 1500000, 1500000, 1500000],
  SB5: [3750000, 5000000, 5000000, 2000000],
};
const SKEMA_LABEL = {
  STD: "Standar (8 tahap)",
  SB5: "Sertifikasi Batch 5 (4 tahap)",
};

const PESERTA_SEED = [{"nama":"Jilly","wa":"081291888990","batch":"Sertifikasi Batch 5","skema":"SB5","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Bayu Dendi Susandhy","wa":"089688246326","batch":"Sertifikasi Batch 5","skema":"SB5","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Putri Widyastuti","wa":"083147879946","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Shalma Dhena Abdul","wa":"0881010121698","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Hilma Ambar Khoerunisa","wa":"085211750008","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Ratu Aliqah Fahendra","wa":"089527353093","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Jihan Tri Rizky","wa":"0895321655155","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Welly Caecar Harliansyah","wa":"0895330529327","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Meta Juwita Sari","wa":"083176940319","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Ali Akbar","wa":"082372486577","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Bintang Aditya Dewantoro","wa":"0895323211977","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Fadhil M Irsyad","wa":"085841502798","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Hazizi Apriansyah","wa":"082373368969","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Alifviana Melanie Suci","wa":"085179787904","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Ainur Putri Lil Firdaus","wa":"0895360879246","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Weydia Yustina Rahma Putri","wa":"083196107599","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Aulia Rahma","wa":"083862941309","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Kurniyah","wa":"089518870465","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Tia Safitri Dewi","wa":"083120896686","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Intan Ratnasari","wa":"083824823502","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Wahyuni Ayu Kinasih","wa":"082312589077","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Afifa Khairunnisa","wa":"081524781113","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Indah Tri Rumiati","wa":"0895401528533","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Keisha de Zahra","wa":"087783799990","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Neysa Rizmadya Dwi Putri","wa":"087874883184","batch":"Wasaida Batch 2","skema":"STD","total_biaya":15750000,"tanggal_mulai":"2026-05-01"},{"nama":"Inayah Wulandari","wa":"087894523772","batch":"Mulai 2026","skema":"STD","total_biaya":15750000,"tanggal_mulai":null},{"nama":"Haifa Hurin Zakiyah","wa":"083148078276","batch":"Mulai 2026","skema":"STD","total_biaya":15750000,"tanggal_mulai":null},{"nama":"Rifal Maulana","wa":"083182363422","batch":"Mulai 2026","skema":"STD","total_biaya":15750000,"tanggal_mulai":null}].map((p, i) => ({ id: "p" + i, ...p }));

const LOG_SEED = [{"tanggal":"2026-01-10","nama":"Jilly","nominal":9000000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2026-04-10","nama":"Bayu Dendi Susandhy","nominal":3750000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-11-10","nama":"Putri Widyastuti","nominal":6000000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-09-01","nama":"Shalma Dhena Abdul","nominal":16000000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-10-05","nama":"Hilma Ambar Khoerunisa","nominal":7750000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-10-05","nama":"Ratu Aliqah Fahendra","nominal":7750000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-10-05","nama":"Jihan Tri Rizky","nominal":7750000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-10-05","nama":"Welly Caecar Harliansyah","nominal":6250000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-10-05","nama":"Meta Juwita Sari","nominal":7750000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-09-01","nama":"Ali Akbar","nominal":17750000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-09-01","nama":"Bintang Aditya Dewantoro","nominal":10250000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-09-01","nama":"Fadhil M Irsyad","nominal":12250000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-10-05","nama":"Hazizi Apriansyah","nominal":8300000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-09-01","nama":"Alifviana Melanie Suci","nominal":10500000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-09-01","nama":"Ainur Putri Lil Firdaus","nominal":11750000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-10-05","nama":"Weydia Yustina Rahma Putri","nominal":8000000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-09-01","nama":"Aulia Rahma","nominal":11000000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-10-05","nama":"Kurniyah","nominal":6000000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-10-05","nama":"Tia Safitri Dewi","nominal":8000000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-10-05","nama":"Intan Ratnasari","nominal":6000000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-10-05","nama":"Wahyuni Ayu Kinasih","nominal":8000000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-10-05","nama":"Afifa Khairunnisa","nominal":8000000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-10-05","nama":"Indah Tri Rumiati","nominal":8000000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"},{"tanggal":"2025-10-05","nama":"Keisha de Zahra","nominal":6250000,"keterangan":"Saldo Awal (riwayat sebelum tracker ini dibuat)"}].map((l, i) => ({ id: "l" + i, ...l }));

/* ============================== HELPERS ============================== */

const fmtRp = (n) => "Rp " + Math.round(Number(n) || 0).toLocaleString("id-ID");
const fmtTanggal = (s) => {
  if (!s) return "-";
  const d = new Date(s + "T00:00:00");
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};
const today = () => new Date();

function cumulativeAt(skema, tahap) {
  const arr = SKEMA[skema] || SKEMA.STD;
  let sum = 0;
  for (let i = 0; i < tahap && i < arr.length; i++) sum += arr[i];
  return sum;
}
function totalBiayaSkema(skema) {
  return (SKEMA[skema] || SKEMA.STD).reduce((a, b) => a + b, 0);
}
function monthsBetween(startStr, end) {
  const start = new Date(startStr + "T00:00:00");
  let m = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) m -= 1;
  return m;
}
function currentTahap(peserta, ref) {
  if (!peserta.tanggal_mulai) return null;
  const maxT = (SKEMA[peserta.skema] || SKEMA.STD).length;
  const m = monthsBetween(peserta.tanggal_mulai, ref);
  return Math.min(maxT, Math.max(1, m + 1));
}
function totalTerbayar(nama, logs) {
  return logs.filter((l) => l.nama === nama).reduce((a, l) => a + (Number(l.nominal) || 0), 0);
}
function computeStatus(peserta, logs, ref) {
  const terbayar = totalTerbayar(peserta.nama, logs);
  const totalBiaya = peserta.total_biaya || totalBiayaSkema(peserta.skema);
  if (terbayar >= totalBiaya) {
    return { label: "LUNAS", kind: "lunas", terbayar, totalBiaya, seharusnya: totalBiaya, selisih: terbayar - totalBiaya, tahap: (SKEMA[peserta.skema] || SKEMA.STD).length };
  }
  const tahap = currentTahap(peserta, ref);
  if (tahap === null) {
    return { label: "ISI TANGGAL", kind: "warn", terbayar, totalBiaya, seharusnya: null, selisih: null, tahap: null };
  }
  const seharusnya = cumulativeAt(peserta.skema, tahap);
  const selisih = terbayar - seharusnya;
  return {
    label: selisih >= 0 ? "AMAN" : "NUNGGAK",
    kind: selisih >= 0 ? "aman" : "nunggak",
    terbayar, totalBiaya, seharusnya, selisih, tahap,
  };
}

const SATUAN = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
function terbilang(n) {
  n = Math.round(n);
  if (n < 12) return SATUAN[n];
  if (n < 20) return terbilang(n - 10) + " belas";
  if (n < 100) return terbilang(Math.floor(n / 10)) + " puluh " + terbilang(n % 10);
  if (n < 200) return "seratus " + terbilang(n - 100);
  if (n < 1000) return terbilang(Math.floor(n / 100)) + " ratus " + terbilang(n % 100);
  if (n < 2000) return "seribu " + terbilang(n - 1000);
  if (n < 1000000) return terbilang(Math.floor(n / 1000)) + " ribu " + terbilang(n % 1000);
  if (n < 1000000000) return terbilang(Math.floor(n / 1000000)) + " juta " + terbilang(n % 1000000);
  return terbilang(Math.floor(n / 1000000000)) + " miliar " + terbilang(n % 1000000000);
}
function terbilangRupiah(n) {
  const t = terbilang(n).replace(/\s+/g, " ").trim();
  return (t.charAt(0).toUpperCase() + t.slice(1)) + " rupiah";
}

const REK_INFO = "BNI 180 880 5875 a.n. Maju Usaha Inovasi";
function waTemplate(tone, nama, nominal) {
  const rp = fmtRp(nominal);
  if (tone === "telat") {
    return `Halo kak ${nama} 👋\nKami ingin mengingatkan bahwa pembayaran Program Pelatihan sebesar *${rp}* sudah melewati jatuh tempo.\n\nMohon segera transfer ke:\n🏦 ${REK_INFO}\n\nKalau sudah transfer, boleh kirim bukti transfernya ke sini ya. Terima kasih 🙏`;
  }
  if (tone === "eskalasi") {
    return `Halo kak ${nama},\nKami menghubungi kakak karena pembayaran sebesar *${rp}* sudah melewati jatuh tempo cukup lama.\n\nMohon segera diselesaikan agar tidak menghambat proses program kakak selanjutnya. Kalau ada kendala, silakan hubungi kami untuk didiskusikan.\n\n🏦 ${REK_INFO}`;
  }
  return `Halo kak ${nama} 👋\nMengingatkan bahwa pembayaran Program Pelatihan sebesar *${rp}* mohon segera diselesaikan.\n\nTransfer ke:\n🏦 ${REK_INFO}\n\nTerima kasih 🙏`;
}
function seq3(n) { return String(n).padStart(3, "0"); }
function yyyymm(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return "" + d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0");
}

/* ============================== STORAGE HOOK ============================== */

function useCloudState(key, initial) {
  const [value, setValue] = useState(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error: err } = await supabase.from("kv_store").select("value").eq("key", key).maybeSingle();
        if (!cancelled) {
          if (data && data.value !== null && data.value !== undefined) setValue(data.value);
          setLoaded(true);
        }
      } catch (e) {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [key]);
  const persist = async (next) => {
    setValue(next);
    try { await supabase.from("kv_store").upsert({ key, value: next, updated_at: new Date().toISOString() }); } catch (e) {}
  };
  return [value, persist, loaded];
}

/* ============================== UI ATOMS ============================== */

const FONTS = (
  <style>{`
    .font-display { font-family: 'Fraunces', serif; }
    .font-body { font-family: 'IBM Plex Sans', sans-serif; }
    .font-mono { font-family: 'IBM Plex Mono', monospace; }
    @media print {
      body * { visibility: hidden; }
      .print-area, .print-area * { visibility: visible; }
      .print-area { position: fixed; top: 0; left: 0; width: 100%; margin: 0; padding: 0; }
      .no-print { display: none !important; }
    }
  `}</style>
);

function Badge({ kind, children }) {
  const map = {
    lunas: "bg-[#E7EFE6] text-[#3F6B4C] border-[#BFD8C2]",
    aman: "bg-[#EAF1F6] text-[#2E5C74] border-[#C6DCE8]",
    nunggak: "bg-[#F7E8E4] text-[#A6402F] border-[#E9C4B9]",
    warn: "bg-[#F7F0DE] text-[#8A6A1F] border-[#E9D8A6]",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium font-body ${map[kind] || ""}`}>
      {children}
    </span>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white border border-[#E4DFD3] rounded-lg px-5 py-4 flex-1 min-w-[130px]">
      <div className="text-xs font-body text-[#8A8372] uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-2xl font-display font-semibold ${accent || "text-[#1C2B40]"}`}>{value}</div>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", type = "button", className = "", disabled }) {
  const styles = {
    primary: "bg-[#1C2B40] text-white hover:bg-[#152030] disabled:opacity-40",
    accent: "bg-[#B8863C] text-white hover:bg-[#a3762f] disabled:opacity-40",
    ghost: "bg-transparent text-[#1C2B40] border border-[#D8D2C2] hover:bg-[#F1EDE2]",
    danger: "bg-transparent text-[#A6402F] border border-[#E9C4B9] hover:bg-[#F7E8E4]",
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium font-body transition-colors ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}

function Input(props) {
  return <input {...props} className={`w-full px-3 py-2 rounded-md border border-[#D8D2C2] bg-white text-sm font-body text-[#1C2B40] focus:outline-none focus:ring-2 focus:ring-[#B8863C]/40 focus:border-[#B8863C] ${props.className || ""}`} />;
}
function Select(props) {
  return <select {...props} className={`w-full px-3 py-2 rounded-md border border-[#D8D2C2] bg-white text-sm font-body text-[#1C2B40] focus:outline-none focus:ring-2 focus:ring-[#B8863C]/40 ${props.className || ""}`} />;
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 bg-[#1C2B40]/50 z-50 flex items-center justify-center p-4 no-print" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className={`bg-[#F7F5EF] rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto w-full ${wide ? "max-w-3xl" : "max-w-md"}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4DFD3] sticky top-0 bg-[#F7F5EF]">
          <h3 className="font-display text-lg font-semibold text-[#1C2B40]">{title}</h3>
          <button onClick={onClose} className="text-[#8A8372] hover:text-[#1C2B40] text-xl leading-none">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ============================== LETTERHEAD DOC ============================== */

function Letterhead({ children, docLabel, docNo, docDate }) {
  return (
    <div className="print-area bg-white text-[#1C2B40] w-full max-w-[720px] mx-auto p-10 font-body" style={{ minHeight: 500 }}>
      <div className="flex items-start justify-between border-b-2 border-[#1C2B40] pb-4 mb-6">
        <div>
          <div className="font-display text-2xl font-bold tracking-tight">UI ACADEMY</div>
          <div className="text-xs text-[#6B6455] mt-1 leading-relaxed">
            Jl. Akses Vokasi Universitas Indonesia, Depok, 16424<br />
            Mobile: +62 878 9112 4419 &nbsp;•&nbsp; Web: uiacademy.id<br />
            Email: info@makarauiacademy.com
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-lg font-semibold uppercase">{docLabel}</div>
          <div className="text-xs text-[#6B6455] font-mono mt-1">No. {docNo}</div>
          <div className="text-xs text-[#6B6455] font-mono">{docDate}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ============================== APP ============================== */

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [config, setConfig, configLoaded] = useCloudState("app-config", { accessCode: "" });
  const [peserta, setPeserta, pesertaLoaded] = useCloudState("peserta-list", null);
  const [logs, setLogs, logsLoaded] = useCloudState("log-pembayaran", null);
  const [invoices, setInvoices] = useCloudState("invoice-history", []);
  const [kwitansiHist, setKwitansiHist] = useCloudState("kwitansi-history", []);
  const [codeInput, setCodeInput] = useState("");
  const [newCode, setNewCode] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [previewDoc, setPreviewDoc] = useState(null); // {type:'invoice'|'kwitansi', data}
  const [addingPeserta, setAddingPeserta] = useState(false);
  const [addingLog, setAddingLog] = useState(false);
  const [editingTanggal, setEditingTanggal] = useState(null);
  const [editingPeserta, setEditingPeserta] = useState(null); // peserta object or null
  const [editingLog, setEditingLog] = useState(null); // log object or null
  const [confirmDelete, setConfirmDelete] = useState(null); // {type:'peserta'|'log', id, label}
  const [waTone, setWaTone] = useState({}); // { [pesertaId]: 'pengingat'|'telat'|'eskalasi' }

  const ready = configLoaded && pesertaLoaded && logsLoaded;

  // seed data on first load
  useEffect(() => {
    if (!ready) return;
    if (peserta === null) setPeserta(PESERTA_SEED);
    if (logs === null) setLogs(LOG_SEED);
  }, [ready]); // eslint-disable-line

  const pesertaList = peserta || [];
  const logList = logs || [];
  const ref = today();

  const rows = useMemo(() => pesertaList.map((p) => ({ p, s: computeStatus(p, logList, ref) })), [pesertaList, logList]);

  const summary = useMemo(() => {
    const c = { total: rows.length, lunas: 0, aman: 0, nunggak: 0, warn: 0 };
    rows.forEach(({ s }) => {
      if (s.kind === "lunas") c.lunas++;
      else if (s.kind === "aman") c.aman++;
      else if (s.kind === "nunggak") c.nunggak++;
      else c.warn++;
    });
    return c;
  }, [rows]);

  const nunggakRows = rows.filter((r) => r.s.kind === "nunggak").sort((a, b) => a.s.selisih - b.s.selisih);
  const warnRows = rows.filter((r) => r.s.kind === "warn");
  const perluInvoice = rows.filter((r) => r.s.kind === "nunggak");

  /* ---------- actions ---------- */
  function handleUnlock(e) {
    e.preventDefault();
    if (!config.accessCode) return;
    if (codeInput === config.accessCode) { setUnlocked(true); setError(""); }
    else setError("Kode akses salah.");
  }
  function handleSetInitialCode(e) {
    e.preventDefault();
    if (newCode.trim().length < 4) { setError("Kode minimal 4 karakter."); return; }
    setConfig({ accessCode: newCode.trim() });
    setUnlocked(true);
    setError("");
  }
  function addPeserta(data) {
    const next = [...pesertaList, { id: "p" + Date.now(), total_biaya: totalBiayaSkema(data.skema), ...data }];
    setPeserta(next);
    setAddingPeserta(false);
  }
  function updatePeserta(id, data) {
    setPeserta(pesertaList.map((p) => (p.id === id ? { ...p, ...data, total_biaya: totalBiayaSkema(data.skema) } : p)));
    setEditingPeserta(null);
  }
  function deletePeserta(id) {
    setPeserta(pesertaList.filter((p) => p.id !== id));
    setConfirmDelete(null);
  }
  function updateTanggalMulai(id, tanggal) {
    setPeserta(pesertaList.map((p) => (p.id === id ? { ...p, tanggal_mulai: tanggal } : p)));
    setEditingTanggal(null);
  }
  function addLog(data) {
    const next = [...logList, { id: "l" + Date.now(), ...data, nominal: Number(data.nominal) }];
    setLogs(next);
    setAddingLog(false);
  }
  function updateLog(id, data) {
    setLogs(logList.map((l) => (l.id === id ? { ...l, ...data, nominal: Number(data.nominal) } : l)));
    setEditingLog(null);
  }
  function deleteLog(id) {
    setLogs(logList.filter((l) => l.id !== id));
    setConfirmDelete(null);
  }
  function waLink(nomor, text) {
    let n = (nomor || "").replace(/\D/g, "");
    if (n.startsWith("0")) n = "62" + n.slice(1);
    else if (!n.startsWith("62")) n = "62" + n;
    return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
  }

  function generateInvoice(p, s) {
    const nomor = `INV-${yyyymm(new Date().toISOString().slice(0, 10))}-${seq3(invoices.length + 1)}`;
    const data = {
      nomor, tanggal: new Date().toISOString().slice(0, 10),
      nama: p.nama, batch: p.batch, tahap: s.tahap, nominal: -s.selisih,
    };
    setInvoices([...invoices, data]);
    setPreviewDoc({ type: "invoice", data });
  }
  function generateKwitansi(log) {
    const nomor = `KWT-${yyyymm(log.tanggal)}-${seq3(kwitansiHist.length + 1)}`;
    const data = { nomor, tanggal: log.tanggal, nama: log.nama, nominal: log.nominal, keterangan: log.keterangan, logId: log.id };
    setKwitansiHist([...kwitansiHist, data]);
    setPreviewDoc({ type: "kwitansi", data });
  }

  const kwitansiDone = new Set(kwitansiHist.map((k) => k.logId));

  if (!ready) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-[#F7F5EF] font-body text-[#8A8372]">
        {FONTS}Memuat…
      </div>
    );
  }

  /* ---------- gate: first run, set access code ---------- */
  if (!config.accessCode) {
    return (
      <div className="min-h-[560px] flex items-center justify-center bg-[#F7F5EF] p-6">
        {FONTS}
        <div className="max-w-sm w-full">
          <div className="font-display text-2xl font-semibold text-[#1C2B40] mb-1">UI Academy — Pembayaran</div>
          <div className="text-sm text-[#6B6455] font-body mb-6">Ini pertama kali dibuka. Buat kode akses untuk tim kamu.</div>
          <form onSubmit={handleSetInitialCode} className="space-y-3">
            <Input placeholder="Buat kode akses (min. 4 karakter)" value={newCode} onChange={(e) => setNewCode(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSetInitialCode(e); }} autoFocus />
            {error && <div className="text-sm text-[#A6402F] font-body">{error}</div>}
            <Btn type="submit" className="w-full justify-center">Simpan & Masuk</Btn>
          </form>
          <div className="text-xs text-[#8A8372] font-body mt-4">Bagikan kode ini ke anggota tim keuangan yang perlu akses. Bisa diganti nanti di menu Pengaturan.</div>
        </div>
      </div>
    );
  }

  /* ---------- gate: enter code ---------- */
  if (!unlocked) {
    return (
      <div className="min-h-[560px] flex items-center justify-center bg-[#F7F5EF] p-6">
        {FONTS}
        <div className="max-w-sm w-full">
          <div className="font-display text-2xl font-semibold text-[#1C2B40] mb-1">UI Academy — Pembayaran</div>
          <div className="text-sm text-[#6B6455] font-body mb-6">Masukkan kode akses untuk melanjutkan.</div>
          <form onSubmit={handleUnlock} className="space-y-3">
            <Input type="password" placeholder="Kode akses" value={codeInput} onChange={(e) => setCodeInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleUnlock(e); }} autoFocus />
            {error && <div className="text-sm text-[#A6402F] font-body">{error}</div>}
            <Btn type="submit" className="w-full justify-center">Masuk</Btn>
          </form>
        </div>
      </div>
    );
  }

  const NAV = [
    { id: "dashboard", label: "Dashboard" },
    { id: "peserta", label: "Data Peserta" },
    { id: "pembayaran", label: "Log Pembayaran" },
    { id: "invoice", label: "Invoice" },
    { id: "kwitansi", label: "Kwitansi" },
    { id: "reminder", label: "Reminder WA" },
    { id: "pengaturan", label: "Pengaturan" },
  ];

  return (
    <div className="min-h-[600px] bg-[#F7F5EF] font-body">
      {FONTS}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="md:w-56 bg-[#1C2B40] text-white md:min-h-[600px] no-print">
          <div className="px-5 py-5 border-b border-white/10">
            <div className="font-display text-lg font-semibold">UI Academy</div>
            <div className="text-xs text-white/50">Pembayaran Peserta</div>
          </div>
          <nav className="flex md:flex-col overflow-x-auto md:overflow-visible">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => setTab(n.id)}
                className={`text-left px-5 py-3 text-sm whitespace-nowrap md:whitespace-normal border-l-2 ${tab === n.id ? "bg-white/10 border-[#B8863C] text-white" : "border-transparent text-white/60 hover:text-white hover:bg-white/5"}`}>
                {n.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main */}
        <div className="flex-1 p-6 max-w-5xl">
          {tab === "dashboard" && (
            <div>
              <h2 className="font-display text-xl font-semibold text-[#1C2B40] mb-4">Dashboard</h2>
              <div className="flex flex-wrap gap-3 mb-6">
                <StatCard label="Total Peserta" value={summary.total} />
                <StatCard label="Lunas" value={summary.lunas} accent="text-[#3F6B4C]" />
                <StatCard label="Aman" value={summary.aman} accent="text-[#2E5C74]" />
                <StatCard label="Nunggak" value={summary.nunggak} accent="text-[#A6402F]" />
                <StatCard label="Belum Isi Tanggal" value={summary.warn} accent="text-[#8A6A1F]" />
              </div>

              <div className="bg-white border border-[#E4DFD3] rounded-lg mb-6">
                <div className="px-5 py-3 border-b border-[#E4DFD3] font-display font-semibold text-[#1C2B40]">Perlu Ditagih</div>
                {nunggakRows.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-[#8A8372]">Tidak ada yang nunggak.</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-[#8A8372] uppercase">
                        <th className="px-5 py-2">Nama</th><th className="px-5 py-2">Batch</th><th className="px-5 py-2">Nunggak</th><th className="px-5 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {nunggakRows.map(({ p, s }) => (
                        <tr key={p.id} className="border-t border-[#EFEBDF]">
                          <td className="px-5 py-2.5">{p.nama}</td>
                          <td className="px-5 py-2.5 text-[#6B6455]">{p.batch}</td>
                          <td className="px-5 py-2.5 text-[#A6402F] font-medium">{fmtRp(-s.selisih)}</td>
                          <td className="px-5 py-2.5"><Btn variant="accent" onClick={() => generateInvoice(p, s)}>Buat Invoice</Btn></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="bg-white border border-[#E4DFD3] rounded-lg">
                <div className="px-5 py-3 border-b border-[#E4DFD3] font-display font-semibold text-[#1C2B40]">Belum Isi Tanggal Mulai</div>
                {warnRows.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-[#8A8372]">Semua sudah diisi.</div>
                ) : (
                  <table className="w-full text-sm">
                    <tbody>
                      {warnRows.map(({ p }) => (
                        <tr key={p.id} className="border-t border-[#EFEBDF]">
                          <td className="px-5 py-2.5">{p.nama}</td>
                          <td className="px-5 py-2.5 text-[#6B6455]">{p.batch}</td>
                          <td className="px-5 py-2.5 text-right"><Btn variant="ghost" onClick={() => { setTab("peserta"); setEditingTanggal(p.id); }}>Isi Tanggal</Btn></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {tab === "peserta" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-[#1C2B40]">Data Peserta</h2>
                <Btn onClick={() => setAddingPeserta(true)}>+ Tambah Peserta</Btn>
              </div>
              <div className="bg-white border border-[#E4DFD3] rounded-lg overflow-x-auto">
                <table className="w-full text-sm min-w-[720px]">
                  <thead>
                    <tr className="text-left text-xs text-[#8A8372] uppercase border-b border-[#E4DFD3]">
                      <th className="px-4 py-2.5">Nama</th><th className="px-4 py-2.5">Batch</th><th className="px-4 py-2.5">Skema</th><th className="px-4 py-2.5">Tgl Mulai</th><th className="px-4 py-2.5">Terbayar</th><th className="px-4 py-2.5">Status</th><th className="px-4 py-2.5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ p, s }) => (
                      <tr key={p.id} className="border-t border-[#EFEBDF]">
                        <td className="px-4 py-2.5">{p.nama}</td>
                        <td className="px-4 py-2.5 text-[#6B6455]">{p.batch}</td>
                        <td className="px-4 py-2.5 text-[#6B6455]">{SKEMA_LABEL[p.skema]}</td>
                        <td className="px-4 py-2.5">
                          {editingTanggal === p.id ? (
                            <Input type="date" defaultValue={p.tanggal_mulai || ""} autoFocus
                              onBlur={(e) => updateTanggalMulai(p.id, e.target.value)}
                              onKeyDown={(e) => { if (e.key === "Enter") updateTanggalMulai(p.id, e.target.value); }} />
                          ) : (
                            <button onClick={() => setEditingTanggal(p.id)} className="hover:underline decoration-dotted">
                              {p.tanggal_mulai ? fmtTanggal(p.tanggal_mulai) : <span className="text-[#8A6A1F]">Isi tanggal</span>}
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-2.5">{fmtRp(s.terbayar)}</td>
                        <td className="px-4 py-2.5"><Badge kind={s.kind}>{s.label}{s.kind === "nunggak" ? " " + fmtRp(-s.selisih) : ""}</Badge></td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <button onClick={() => setEditingPeserta(p)} className="text-xs text-[#1C2B40] hover:underline mr-3">Edit</button>
                          <button onClick={() => setConfirmDelete({ type: "peserta", id: p.id, label: p.nama })} className="text-xs text-[#A6402F] hover:underline">Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "pembayaran" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-[#1C2B40]">Log Pembayaran</h2>
                <Btn onClick={() => setAddingLog(true)}>+ Catat Pembayaran</Btn>
              </div>
              <div className="bg-white border border-[#E4DFD3] rounded-lg overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead>
                    <tr className="text-left text-xs text-[#8A8372] uppercase border-b border-[#E4DFD3]">
                      <th className="px-4 py-2.5">Tanggal</th><th className="px-4 py-2.5">Nama</th><th className="px-4 py-2.5">Nominal</th><th className="px-4 py-2.5">Keterangan</th><th className="px-4 py-2.5"></th><th className="px-4 py-2.5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...logList].sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1)).map((l) => (
                      <tr key={l.id} className="border-t border-[#EFEBDF]">
                        <td className="px-4 py-2.5">{fmtTanggal(l.tanggal)}</td>
                        <td className="px-4 py-2.5">{l.nama}</td>
                        <td className="px-4 py-2.5">{fmtRp(l.nominal)}</td>
                        <td className="px-4 py-2.5 text-[#6B6455]">{l.keterangan}</td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          {kwitansiDone.has(l.id) ? (
                            <span className="text-xs text-[#3F6B4C]">✓ Kwitansi dibuat</span>
                          ) : (
                            <Btn variant="ghost" onClick={() => generateKwitansi(l)}>Buat Kwitansi</Btn>
                          )}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <button onClick={() => setEditingLog(l)} className="text-xs text-[#1C2B40] hover:underline mr-3">Edit</button>
                          <button onClick={() => setConfirmDelete({ type: "log", id: l.id, label: `${l.nama} · ${fmtRp(l.nominal)}` })} className="text-xs text-[#A6402F] hover:underline">Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "invoice" && (
            <div>
              <h2 className="font-display text-xl font-semibold text-[#1C2B40] mb-4">Invoice</h2>
              <div className="bg-white border border-[#E4DFD3] rounded-lg mb-6">
                <div className="px-5 py-3 border-b border-[#E4DFD3] font-display font-semibold text-[#1C2B40]">Perlu Dibuatkan Invoice</div>
                {perluInvoice.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-[#8A8372]">Tidak ada peserta yang perlu invoice saat ini.</div>
                ) : (
                  <table className="w-full text-sm">
                    <tbody>
                      {perluInvoice.map(({ p, s }) => (
                        <tr key={p.id} className="border-t border-[#EFEBDF]">
                          <td className="px-5 py-2.5">{p.nama}</td>
                          <td className="px-5 py-2.5 text-[#6B6455]">Tahap {s.tahap}</td>
                          <td className="px-5 py-2.5 font-medium">{fmtRp(-s.selisih)}</td>
                          <td className="px-5 py-2.5"><Btn variant="accent" onClick={() => generateInvoice(p, s)}>Generate</Btn></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="bg-white border border-[#E4DFD3] rounded-lg">
                <div className="px-5 py-3 border-b border-[#E4DFD3] font-display font-semibold text-[#1C2B40]">Riwayat Invoice</div>
                {invoices.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-[#8A8372]">Belum ada invoice dibuat.</div>
                ) : (
                  <table className="w-full text-sm">
                    <tbody>
                      {[...invoices].reverse().map((inv) => (
                        <tr key={inv.nomor} className="border-t border-[#EFEBDF]">
                          <td className="px-5 py-2.5 font-mono text-xs text-[#6B6455]">{inv.nomor}</td>
                          <td className="px-5 py-2.5">{inv.nama}</td>
                          <td className="px-5 py-2.5">{fmtRp(inv.nominal)}</td>
                          <td className="px-5 py-2.5"><Btn variant="ghost" onClick={() => setPreviewDoc({ type: "invoice", data: inv })}>Lihat</Btn></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {tab === "kwitansi" && (
            <div>
              <h2 className="font-display text-xl font-semibold text-[#1C2B40] mb-4">Kwitansi</h2>
              <div className="bg-white border border-[#E4DFD3] rounded-lg">
                <div className="px-5 py-3 border-b border-[#E4DFD3] font-display font-semibold text-[#1C2B40]">Riwayat Kwitansi</div>
                {kwitansiHist.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-[#8A8372]">Belum ada kwitansi dibuat. Buat dari tab Log Pembayaran.</div>
                ) : (
                  <table className="w-full text-sm">
                    <tbody>
                      {[...kwitansiHist].reverse().map((k) => (
                        <tr key={k.nomor} className="border-t border-[#EFEBDF]">
                          <td className="px-5 py-2.5 font-mono text-xs text-[#6B6455]">{k.nomor}</td>
                          <td className="px-5 py-2.5">{k.nama}</td>
                          <td className="px-5 py-2.5">{fmtRp(k.nominal)}</td>
                          <td className="px-5 py-2.5"><Btn variant="ghost" onClick={() => setPreviewDoc({ type: "kwitansi", data: k })}>Lihat</Btn></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {tab === "reminder" && (
            <div>
              <h2 className="font-display text-xl font-semibold text-[#1C2B40] mb-4">Reminder WA</h2>
              {nunggakRows.length === 0 ? (
                <div className="bg-white border border-[#E4DFD3] rounded-lg px-5 py-6 text-sm text-[#8A8372]">Tidak ada peserta yang perlu diingatkan saat ini.</div>
              ) : (
                <div className="space-y-4">
                  {nunggakRows.map(({ p, s }) => {
                    const tone = waTone[p.id] || "pengingat";
                    const text = waTemplate(tone, p.nama, -s.selisih);
                    return (
                      <div key={p.id} className="bg-white border border-[#E4DFD3] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                          <div>
                            <div className="font-medium text-[#1C2B40]">{p.nama}</div>
                            <div className="text-xs text-[#6B6455]">{p.batch} · Nunggak {fmtRp(-s.selisih)} · {p.wa || "no. WA belum diisi"}</div>
                          </div>
                          <Select className="w-auto" value={tone} onChange={(e) => setWaTone({ ...waTone, [p.id]: e.target.value })}>
                            <option value="pengingat">Nada: Pengingat</option>
                            <option value="telat">Nada: Telat</option>
                            <option value="eskalasi">Nada: Eskalasi</option>
                          </Select>
                        </div>
                        <textarea readOnly value={text} rows={5}
                          className="w-full px-3 py-2 rounded-md border border-[#D8D2C2] bg-[#FBFAF6] text-sm font-body text-[#1C2B40]" />
                        <div className="flex gap-2 mt-3">
                          <Btn variant="ghost" onClick={() => navigator.clipboard && navigator.clipboard.writeText(text)}>Salin Teks</Btn>
                          <Btn variant="accent" disabled={!p.wa} onClick={() => window.open(waLink(p.wa, text), "_blank")}>Buka WhatsApp</Btn>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === "pengaturan" && (
            <div>
              <h2 className="font-display text-xl font-semibold text-[#1C2B40] mb-4">Pengaturan</h2>
              <div className="bg-white border border-[#E4DFD3] rounded-lg p-5 max-w-sm">
                <div className="text-sm font-medium text-[#1C2B40] mb-2">Ganti Kode Akses</div>
                <form onSubmit={(e) => { e.preventDefault(); if (newCode.trim().length >= 4) { setConfig({ accessCode: newCode.trim() }); setNewCode(""); setError("Kode akses berhasil diganti."); } else setError("Minimal 4 karakter."); }} className="space-y-3">
                  <Input placeholder="Kode akses baru" value={newCode} onChange={(e) => setNewCode(e.target.value)} />
                  <Btn type="submit">Simpan</Btn>
                  {error && <div className="text-xs text-[#6B6455]">{error}</div>}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {addingPeserta && (
        <Modal title="Tambah Peserta" onClose={() => setAddingPeserta(false)}>
          <PesertaForm onSubmit={addPeserta} onCancel={() => setAddingPeserta(false)} />
        </Modal>
      )}
      {addingLog && (
        <Modal title="Catat Pembayaran" onClose={() => setAddingLog(false)}>
          <LogForm pesertaList={pesertaList} onSubmit={addLog} onCancel={() => setAddingLog(false)} />
        </Modal>
      )}
      {editingPeserta && (
        <Modal title="Edit Peserta" onClose={() => setEditingPeserta(null)}>
          <PesertaForm initial={editingPeserta} onSubmit={(data) => updatePeserta(editingPeserta.id, data)} onCancel={() => setEditingPeserta(null)} />
        </Modal>
      )}
      {editingLog && (
        <Modal title="Edit Pembayaran" onClose={() => setEditingLog(null)}>
          <LogForm pesertaList={pesertaList} initial={editingLog} onSubmit={(data) => updateLog(editingLog.id, data)} onCancel={() => setEditingLog(null)} />
        </Modal>
      )}
      {confirmDelete && (
        <Modal title="Hapus Data?" onClose={() => setConfirmDelete(null)}>
          <p className="text-sm text-[#1C2B40] mb-4">Yakin mau hapus <span className="font-medium">{confirmDelete.label}</span>? Aksi ini tidak bisa dibatalkan.</p>
          <div className="flex gap-2">
            <Btn variant="danger" onClick={() => (confirmDelete.type === "peserta" ? deletePeserta(confirmDelete.id) : deleteLog(confirmDelete.id))}>Ya, Hapus</Btn>
            <Btn variant="ghost" onClick={() => setConfirmDelete(null)}>Batal</Btn>
          </div>
        </Modal>
      )}
      {previewDoc && (
        <Modal title={previewDoc.type === "invoice" ? "Invoice" : "Kwitansi"} onClose={() => setPreviewDoc(null)} wide>
          <div className="no-print flex justify-end mb-3">
            <Btn onClick={() => window.print()}>Cetak / Simpan PDF</Btn>
          </div>
          {previewDoc.type === "invoice" ? <InvoiceDoc data={previewDoc.data} /> : <KwitansiDoc data={previewDoc.data} />}
        </Modal>
      )}
    </div>
  );
}

/* ============================== FORMS ============================== */

function PesertaForm({ onSubmit, onCancel, initial }) {
  const [nama, setNama] = useState(initial?.nama || "");
  const [wa, setWa] = useState(initial?.wa || "");
  const [batch, setBatch] = useState(initial?.batch || "");
  const [skema, setSkema] = useState(initial?.skema || "STD");
  const [tanggalMulai, setTanggalMulai] = useState(initial?.tanggal_mulai || "");

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!nama) return; onSubmit({ nama, wa, batch, skema, tanggal_mulai: tanggalMulai || null }); }} className="space-y-3">
      <div><label className="text-xs text-[#6B6455] block mb-1">Nama Peserta</label><Input value={nama} onChange={(e) => setNama(e.target.value)} required /></div>
      <div><label className="text-xs text-[#6B6455] block mb-1">No. WhatsApp</label><Input value={wa} onChange={(e) => setWa(e.target.value)} /></div>
      <div><label className="text-xs text-[#6B6455] block mb-1">Batch / Kategori</label><Input value={batch} onChange={(e) => setBatch(e.target.value)} /></div>
      <div><label className="text-xs text-[#6B6455] block mb-1">Skema Cicilan</label>
        <Select value={skema} onChange={(e) => setSkema(e.target.value)}>
          <option value="STD">Standar (8 tahap)</option>
          <option value="SB5">Sertifikasi Batch 5 (4 tahap)</option>
        </Select>
      </div>
      <div><label className="text-xs text-[#6B6455] block mb-1">Tanggal Mulai (opsional)</label><Input type="date" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} /></div>
      <div className="flex gap-2 pt-2">
        <Btn type="submit">Simpan</Btn>
        <Btn type="button" variant="ghost" onClick={onCancel}>Batal</Btn>
      </div>
    </form>
  );
}

function LogForm({ pesertaList, onSubmit, onCancel, initial }) {
  const [nama, setNama] = useState(initial?.nama || pesertaList[0]?.nama || "");
  const [tanggal, setTanggal] = useState(initial?.tanggal || new Date().toISOString().slice(0, 10));
  const [nominal, setNominal] = useState(initial?.nominal ?? "");
  const [keterangan, setKeterangan] = useState(initial?.keterangan || "");

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!nama || !nominal) return; onSubmit({ nama, tanggal, nominal, keterangan }); }} className="space-y-3">
      <div><label className="text-xs text-[#6B6455] block mb-1">Peserta</label>
        <Select value={nama} onChange={(e) => setNama(e.target.value)}>
          {pesertaList.map((p) => <option key={p.id} value={p.nama}>{p.nama}</option>)}
        </Select>
      </div>
      <div><label className="text-xs text-[#6B6455] block mb-1">Tanggal Transfer</label><Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} /></div>
      <div><label className="text-xs text-[#6B6455] block mb-1">Nominal Diterima (Rp)</label><Input type="number" value={nominal} onChange={(e) => setNominal(e.target.value)} required /></div>
      <div><label className="text-xs text-[#6B6455] block mb-1">Keterangan</label><Input value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="mis. Transfer tahap 3" /></div>
      <div className="flex gap-2 pt-2">
        <Btn type="submit">Simpan</Btn>
        <Btn type="button" variant="ghost" onClick={onCancel}>Batal</Btn>
      </div>
    </form>
  );
}

/* ============================== DOCUMENTS ============================== */

function InvoiceDoc({ data }) {
  return (
    <Letterhead docLabel="Invoice" docNo={data.nomor} docDate={fmtTanggal(data.tanggal)}>
      <div className="mb-6">
        <div className="text-xs text-[#8A8372] uppercase mb-1">Ditagihkan Kepada</div>
        <div className="font-medium">{data.nama}</div>
        {data.batch && <div className="text-sm text-[#6B6455]">{data.batch}</div>}
      </div>
      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="border-b border-[#1C2B40] text-left text-xs uppercase text-[#6B6455]">
            <th className="py-2">Deskripsi</th><th className="py-2 text-right">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-[#EFEBDF]">
            <td className="py-3">Pembayaran Program Pelatihan — s.d. Tahap {data.tahap}</td>
            <td className="py-3 text-right">{fmtRp(data.nominal)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td className="py-3 text-right font-medium">Total</td>
            <td className="py-3 text-right font-display font-semibold text-lg">{fmtRp(data.nominal)}</td>
          </tr>
        </tfoot>
      </table>
      <div className="text-xs text-[#6B6455] leading-relaxed">
        Mohon transfer ke rekening BNI 180 880 5875 a.n. Maju Usaha Inovasi paling lambat 7 hari sejak invoice ini diterbitkan.
      </div>
    </Letterhead>
  );
}

function KwitansiDoc({ data }) {
  return (
    <Letterhead docLabel="Kwitansi" docNo={data.nomor} docDate={fmtTanggal(data.tanggal)}>
      <div className="space-y-4 text-sm">
        <div className="flex"><div className="w-40 text-[#8A8372]">Telah terima dari</div><div className="font-medium">: {data.nama}</div></div>
        <div className="flex"><div className="w-40 text-[#8A8372]">Sejumlah</div><div className="font-medium">: {fmtRp(data.nominal)}</div></div>
        <div className="flex"><div className="w-40 text-[#8A8372]">Terbilang</div><div className="italic">: {terbilangRupiah(data.nominal)}</div></div>
        <div className="flex"><div className="w-40 text-[#8A8372]">Untuk pembayaran</div><div>: {data.keterangan || "Program Pelatihan"}</div></div>
      </div>
      <div className="flex justify-end mt-16">
        <div className="text-center text-sm">
          <div className="mb-16">Depok, {fmtTanggal(data.tanggal)}</div>
          <div className="border-t border-[#1C2B40] pt-1 w-40">UI Academy</div>
        </div>
      </div>
    </Letterhead>
  );
}
