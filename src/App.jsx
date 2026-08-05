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

const LOGO_MAKARA = "data:image/png;base64,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";

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
        <div className="flex items-start gap-3">
          <img src={LOGO_MAKARA} alt="Makara UI Academy" className="w-14 h-14 object-contain" />
          <div>
            <div className="font-display text-base font-bold tracking-tight leading-tight">MAKARA UI ACADEMY</div>
            <div className="text-xs text-[#6B6455] mt-1 leading-relaxed">
              Jl. Akses Vokasi Universitas Indonesia, Depok, 16424<br />
              Mobile: +62 851-5668-0714 &nbsp;•&nbsp; Web: uiacademy.id<br />
              Email: info@makarauiacademy.com
            </div>
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
  const [draftInvoice, setDraftInvoice] = useState(null);
  const [draftKwitansi, setDraftKwitansi] = useState(null);

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

  function openInvoiceDraft(p, s) {
    setDraftInvoice({
      nama: p.nama, batch: p.batch, tahap: s.tahap,
      tanggal: new Date().toISOString().slice(0, 10),
      deskripsi: `Pembayaran Program Pelatihan — s.d. Tahap ${s.tahap}`,
      nominal: -s.selisih,
    });
  }
  function confirmInvoice(draft) {
    const nomor = `INV-${yyyymm(draft.tanggal)}-${seq3(invoices.length + 1)}`;
    const data = { nomor, ...draft, nominal: Number(draft.nominal) };
    setInvoices([...invoices, data]);
    setPreviewDoc({ type: "invoice", data });
    setDraftInvoice(null);
  }
  function openKwitansiDraft(log) {
    setDraftKwitansi({
      nama: log.nama, tanggal: log.tanggal, keterangan: log.keterangan,
      nominal: log.nominal, logId: log.id,
    });
  }
  function confirmKwitansi(draft) {
    const nomor = `KWT-${yyyymm(draft.tanggal)}-${seq3(kwitansiHist.length + 1)}`;
    const data = { nomor, ...draft, nominal: Number(draft.nominal) };
    setKwitansiHist([...kwitansiHist, data]);
    setPreviewDoc({ type: "kwitansi", data });
    setDraftKwitansi(null);
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
                          <td className="px-5 py-2.5"><Btn variant="accent" onClick={() => openInvoiceDraft(p, s)}>Buat Invoice</Btn></td>
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
                            <Btn variant="ghost" onClick={() => openKwitansiDraft(l)}>Buat Kwitansi</Btn>
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
                          <td className="px-5 py-2.5"><Btn variant="accent" onClick={() => openInvoiceDraft(p, s)}>Generate</Btn></td>
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
      {draftInvoice && (
        <Modal title="Cek & Edit Invoice" onClose={() => setDraftInvoice(null)}>
          <InvoiceEditForm initial={draftInvoice} onSubmit={confirmInvoice} onCancel={() => setDraftInvoice(null)} />
        </Modal>
      )}
      {draftKwitansi && (
        <Modal title="Cek & Edit Kwitansi" onClose={() => setDraftKwitansi(null)}>
          <KwitansiEditForm initial={draftKwitansi} onSubmit={confirmKwitansi} onCancel={() => setDraftKwitansi(null)} />
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

function InvoiceEditForm({ initial, onSubmit, onCancel }) {
  const [nama, setNama] = useState(initial.nama);
  const [batch, setBatch] = useState(initial.batch || "");
  const [tanggal, setTanggal] = useState(initial.tanggal);
  const [deskripsi, setDeskripsi] = useState(initial.deskripsi);
  const [nominal, setNominal] = useState(initial.nominal);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ nama, batch, tanggal: tanggal, tahap: initial.tahap, deskripsi, nominal }); }} className="space-y-3">
      <div><label className="text-xs text-[#6B6455] block mb-1">Nama Peserta</label><Input value={nama} onChange={(e) => setNama(e.target.value)} required /></div>
      <div><label className="text-xs text-[#6B6455] block mb-1">Batch</label><Input value={batch} onChange={(e) => setBatch(e.target.value)} /></div>
      <div><label className="text-xs text-[#6B6455] block mb-1">Tanggal Invoice</label><Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} /></div>
      <div><label className="text-xs text-[#6B6455] block mb-1">Deskripsi</label><Input value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} /></div>
      <div><label className="text-xs text-[#6B6455] block mb-1">Nominal (Rp)</label><Input type="number" value={nominal} onChange={(e) => setNominal(e.target.value)} required /></div>
      <div className="flex gap-2 pt-2">
        <Btn type="submit">Buat Invoice</Btn>
        <Btn type="button" variant="ghost" onClick={onCancel}>Batal</Btn>
      </div>
    </form>
  );
}

function KwitansiEditForm({ initial, onSubmit, onCancel }) {
  const [nama, setNama] = useState(initial.nama);
  const [tanggal, setTanggal] = useState(initial.tanggal);
  const [nominal, setNominal] = useState(initial.nominal);
  const [keterangan, setKeterangan] = useState(initial.keterangan || "");

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ nama, tanggal, nominal, keterangan, logId: initial.logId }); }} className="space-y-3">
      <div><label className="text-xs text-[#6B6455] block mb-1">Nama Peserta</label><Input value={nama} onChange={(e) => setNama(e.target.value)} required /></div>
      <div><label className="text-xs text-[#6B6455] block mb-1">Tanggal</label><Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} /></div>
      <div><label className="text-xs text-[#6B6455] block mb-1">Nominal (Rp)</label><Input type="number" value={nominal} onChange={(e) => setNominal(e.target.value)} required /></div>
      <div><label className="text-xs text-[#6B6455] block mb-1">Untuk Pembayaran</label><Input value={keterangan} onChange={(e) => setKeterangan(e.target.value)} /></div>
      <div className="flex gap-2 pt-2">
        <Btn type="submit">Buat Kwitansi</Btn>
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
            <td className="py-3">{data.deskripsi || `Pembayaran Program Pelatihan — s.d. Tahap ${data.tahap}`}</td>
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
