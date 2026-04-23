import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Play, Database, FileText, FileSpreadsheet, ImageIcon, ArrowRight, Loader2, Server, Check } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AgentChat from '../components/AgentChat';
import SimulationEngine from '../components/SimulationEngine';
import OutputGenerator from '../components/OutputGenerator';

const AI_MODELS = [
  { provider: 'NVIDIA', name: 'Nemotron 3 Super', role: 'Assessor Agent' },
  { provider: 'Z.ai', name: 'GLM 4.5 Air', role: 'Operations Agent' },
  { provider: 'OpenAI', name: 'gpt-oss-120b', role: 'Finance Agent' },
  { provider: 'inclusionAI', name: 'Ling-2.6-flash', role: 'HR Agent' },
  { provider: 'NVIDIA', name: 'Nemotron 3 Nano 30B A3B', role: 'Risk Agent' },
  { provider: 'MiniMax', name: 'MiniMax M2.5', role: 'Supply Chain Agent' },
  { provider: 'NVIDIA', name: 'Nemotron Nano 9B V2', role: 'Quality Control Agent' },
  { provider: 'Google', name: 'Gemma 4 31B', role: 'Sales Agent' },
  { provider: 'Qwen', name: 'Qwen3 Next 80B A3B Instruct', role: 'Legal & Compliance Agent' },
  { provider: 'Meta', name: 'Llama 3.3 70B Instruct', role: 'Tech Agent' }
];

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const FILE_TYPES = [
  { icon: FileText, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', title: 'PDF (.pdf)', desc: 'Laporan QC harian, hirarkis & tabel.' },
  { icon: FileSpreadsheet, color: '#10b981', bg: 'rgba(16,185,129,0.1)', title: 'Excel (.xlsx)', desc: 'Matriks baris per departemen & output.' },
  { icon: ImageIcon, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', title: 'Gambar (.png/jpg)', desc: 'Pembacaan teks presensi via OCR.' },
];

export default function DashboardPrototype() {
  const location = useLocation();
  const isPreview = new URLSearchParams(location.search).get('mode') === 'preview';

  const [activeTab, setActiveTab] = useState(isPreview ? 'upload' : 'model-config');
  const [file, setFile] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [problemDescription, setProblem] = useState(isPreview ? 'Kenapa target produksi 100.000 pcs hanya tercapai 95.000 pcs?' : '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [discussionLog, setDiscussionLog] = useState("");
  const [reportData, setReportData]       = useState(null);
  const [simData, setSimData]             = useState(null);
  const [isSimLoading, setIsSimLoading]   = useState(false);
  const fileInputRef = useRef(null);

  const handleStartAnalysis = () => {
    setIsProcessing(true);
    setTimeout(() => { setIsProcessing(false); setActiveTab('deliberation'); }, 1800);
  };

  const processFile = (f) => {
    if (f) {
      setFile(f);
      if (f.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setImageBase64(reader.result);
        reader.readAsDataURL(f);
      } else {
        setImageBase64(null);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', background: '#070912', overflow: 'hidden', color: '#fff', position: 'relative' }}>
      {/* BG glows */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse 50% 50% at 80% 10%, rgba(139,92,246,0.06) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 20% 90%, rgba(59,130,246,0.06) 0%, transparent 60%)' }} />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{ padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: 'rgba(7,9,18,0.6)', backdropFilter: 'blur(12px)' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 4 }}>
              {activeTab === 'model-config' && 'Konfigurasi Model AI (Coba Sekarang)'}
              {activeTab === 'upload' && 'Data & Permasalahan'}
              {activeTab === 'deliberation' && 'Multi-Agent Deliberation'}
              {activeTab === 'simulation' && 'Causal Simulation & Impact'}
              {activeTab === 'output' && 'Report & Action Plan'}
            </h1>
            <p style={{ fontSize: 13, color: '#6b7280' }}>
              {activeTab === 'model-config' && 'Pilih dan aktifkan model LLM nyata untuk menggerakkan Multi-Agent AI.'}
              {activeTab === 'upload' && 'Upload data multimodal untuk dianalisis oleh tim AI.'}
              {activeTab === 'deliberation' && 'Agen-agen AI spesialis sedang mencari akar masalah.'}
              {activeTab === 'simulation' && 'Simulasikan solusi sebelum tindakan aktual ditetapkan.'}
              {activeTab === 'output' && 'Unduh output strategis yang dapat langsung dieksekusi.'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 100, fontSize: 12, fontWeight: 600, color: '#10b981' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Simulation Mode Active
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 32 }}>
          <AnimatePresence mode="wait">

            {/* MODEL CONFIG TAB */}
            {activeTab === 'model-config' && (
              <motion.div key="model-config" {...PAGE_VARIANTS} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ background: 'rgba(18,22,41,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '32px', backdropFilter: 'blur(20px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <Server size={22} color="#3b82f6" />
                    <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>Pemilihan Engine AI — Try Now Mode</h2>
                  </div>
                  <p style={{ color: '#a0a8c2', fontSize: 14, marginBottom: 28, lineHeight: 1.6, maxWidth: 800 }}>
                    Dalam mode "Coba Sekarang", Argunex AI tidak menggunakan simulasi statis. Sistem mengintegrasikan model-model bahasa besar (LLM) nyata untuk mentenagai para Agen secara *real-time*. Masing-masing peran telah di-assign ke model dengan karakteristik optimal.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                    {AI_MODELS.map((model, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, transition: 'all 0.2s', cursor: 'default' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.06)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)'; }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '2px 8px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{model.provider}</span>
                            <span style={{ fontSize: 10, color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', padding: '1px 6px', borderRadius: 100 }}>Free</span>
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: '#fff', marginBottom: 2 }}>{model.name}</div>
                          <div style={{ fontSize: 12, color: '#a0a8c2' }}>Role: <span style={{ color: '#d1d5db', fontWeight: 500 }}>{model.role}</span></div>
                        </div>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={14} color="#10b981" strokeWidth={3} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
                  <button onClick={() => setActiveTab('upload')}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 600, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', boxShadow: '0 4px 20px rgba(59,130,246,0.3)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(139,92,246,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.3)'; }}>
                    Lanjutkan ke Upload Data <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* UPLOAD TAB */}
            {activeTab === 'upload' && (
              <motion.div key="upload" {...PAGE_VARIANTS}
                style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
                {/* Left col */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Problem statement */}
                  <div style={{ background: 'rgba(18,22,41,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '28px 28px 24px', backdropFilter: 'blur(20px)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <Database size={18} color="#3b82f6" />
                      <h2 style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>Misi Utama — Problem Statement</h2>
                    </div>
                    <p style={{ fontSize: 11, color: '#a0a8c2', marginBottom: 16 }}>
                      Engine AI akan membaca konteks ini dan secara dinamis menciptakan peran/persona yang relevan (misal: Ahli Tata Kota untuk banjir, atau Engineer Mesin untuk cacat produksi).
                    </p>
                    <textarea
                      value={problemDescription}
                      onChange={e => setProblem(e.target.value)}
                      rows={3}
                      placeholder="Contoh: Kami mengalami penurunan output sebesar 5% minggu ini..."
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                        borderRadius: 12, padding: '14px 16px', color: '#fff', fontFamily: 'Inter, sans-serif',
                        fontSize: 14, resize: 'vertical', outline: 'none', lineHeight: 1.7,
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(0,240,255,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                    />
                  </div>

                  {/* File upload */}
                  <div style={{ background: 'rgba(18,22,41,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '28px 28px 24px', backdropFilter: 'blur(20px)' }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 6 }}>Berkas Pendukung — Multimodal Input</h2>
                    <p style={{ fontSize: 11, color: '#a0a8c2', marginBottom: 16, lineHeight: 1.5 }}>
                      Unggah dokumen Anda. Engine Vision-Language (seperti Nemotron Embed VL 1B dan Nemotron Nano 12B VL) akan memindai dan membaca teks, tabel, serta struktur gambar secara sangat rinci dan akurat.
                    </p>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      style={{
                        border: `2px dashed ${isDragging ? '#3b82f6' : file ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 16, padding: '48px 32px', textAlign: 'center', cursor: 'pointer',
                        background: isDragging ? 'rgba(59,130,246,0.05)' : file ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.02)',
                        transition: 'all 0.25s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                      }}>
                      <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s' }}>
                        {imageBase64 ? (
                          <img src={imageBase64} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
                        ) : (
                          <Upload size={26} color={file ? '#10b981' : '#3b82f6'} />
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                          {file ? `✓ ${file.name}` : 'Drag & Drop File atau Klik Di Sini'}
                        </p>
                        <p style={{ fontSize: 12, color: '#6b7280' }}>Mendukung PDF, Excel/CSV, Gambar, dan Text</p>
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" style={{ display: 'none' }}
                        onChange={e => processFile(e.target.files?.[0])}
                        accept=".pdf,.xlsx,.xls,.png,.jpg,.jpeg,.csv,.txt" />
                    </div>
                  </div>
                </div>

                {/* Right col */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ background: 'rgba(18,22,41,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '24px', backdropFilter: 'blur(20px)', flex: 1 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 20 }}>Format yang Didukung</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {FILE_TYPES.map((ft, i) => {
                        const Icon = ft.icon;
                        return (
                          <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                            <div style={{ width: 36, height: 36, borderRadius: 9, background: ft.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Icon size={18} color={ft.color} />
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{ft.title}</div>
                              <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{ft.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button onClick={handleStartAnalysis} disabled={isProcessing}
                    style={{
                      width: '100%', padding: '16px', borderRadius: 14, fontSize: 15, fontWeight: 700,
                      background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', border: 'none',
                      cursor: isProcessing ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      boxShadow: '0 8px 32px rgba(59,130,246,0.3)', transition: 'all 0.25s',
                      opacity: isProcessing ? 0.8 : 1,
                    }}
                    onMouseEnter={e => { if (!isProcessing) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(139,92,246,0.45)'; } }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.3)'; }}>
                    {isProcessing
                      ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Memproses...</>
                      : <><Play size={18} /> Mulai Analisis AI</>
                    }
                  </button>
                </div>
              </motion.div>
            )}

            {/* DELIBERATION TAB */}
            {activeTab === 'deliberation' && (
              <motion.div key="deliberation" {...PAGE_VARIANTS} style={{ height: '100%', width: '100%' }}>
                <AgentChat
                  problemContext={problemDescription}
                  imageBase64={imageBase64}
                  onComplete={async (log) => {
                    setDiscussionLog(log);
                    setIsSimLoading(true);

                    // Run both in parallel for speed
                    try {
                      const { generateFinalReport, generateSimulationData } = await import('../services/aiService');
                      const [report, sim] = await Promise.allSettled([
                        generateFinalReport(problemDescription, log),
                        generateSimulationData(problemDescription, log),
                      ]);
                      if (report.status === 'fulfilled' && report.value) setReportData(report.value);
                      if (sim.status === 'fulfilled' && sim.value)       setSimData(sim.value);
                    } catch (e) {
                      console.warn('Report/Sim generation error:', e);
                    } finally {
                      setIsSimLoading(false);
                    }

                    setTimeout(() => setActiveTab('simulation'), 800);
                  }}
                />
              </motion.div>
            )}

            {/* SIMULATION TAB */}
            {activeTab === 'simulation' && (
              <motion.div key="simulation" {...PAGE_VARIANTS} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <SimulationEngine simData={simData} isLoading={isSimLoading} />

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <button onClick={() => setActiveTab('output')}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', boxShadow: '0 4px 20px rgba(59,130,246,0.3)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(139,92,246,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.3)'; }}>
                    Lihat Action Plan & Output <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* OUTPUT TAB */}
            {activeTab === 'output' && (
              <motion.div key="output" {...PAGE_VARIANTS}>
                <OutputGenerator problemDescription={problemDescription} reportData={reportData} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
