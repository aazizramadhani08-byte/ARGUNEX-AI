import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Zap, ShieldCheck, ArrowRight, Play, Server, Activity, CheckCircle } from 'lucide-react';

const S = {
  gradientText: { background: 'linear-gradient(135deg, #00f0ff 0%, #3b82f6 50%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  card: { background: 'rgba(18,22,41,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, backdropFilter: 'blur(20px)' },
  section: { maxWidth: 1140, margin: '0 auto', padding: '0 40px' },
};

const STATS = [
  { value: '98.2%', label: 'Akurasi Analisis' },
  { value: '4x', label: 'Lebih Cepat' },
  { value: '5K+', label: 'Kasus Selesai' },
  { value: '24/7', label: 'Monitoring' },
];

const FEATURES = [
  { icon: BrainCircuit, color: '#00f0ff', title: 'Multi-Engine Swarm', tag: 'Core AI', desc: 'Ditenagai 10 LLM nyata (Nemotron, Llama, Gemma) yang membangkitkan puluhan Persona spesifik (Engineer, Direktur) untuk berdebat mencari konsensus.' },
  { icon: Zap, color: '#3b82f6', title: 'Causal Simulation', tag: 'Simulation', desc: 'Mensimulasikan skenario output, efisiensi, dan risiko operasional di dashboard visual sebelum keputusan dieksekusi.' },
  { icon: ShieldCheck, color: '#8b5cf6', title: 'Multimodal & Export', tag: 'Output', desc: 'Vision-Language (VL) memindai PDF dan Gambar dengan akurat. Hasil akhirnya diekspor secara eksklusif ke dalam PDF dan PPTX.' },
];

const STEPS = [
  { num: '01', title: 'Upload Data', desc: 'Input masalah atau dokumen PDF/Gambar untuk dianalisis oleh AI Vision-Language.' },
  { num: '02', title: 'Swarm Deliberation', desc: '10 Engine AI membangkitkan persona dinamis untuk menganalisis dan saling berdebat.' },
  { num: '03', title: 'Simulasi Kaulitas', desc: 'Causal Engine memproyeksikan efektivitas setiap argumen dalam bentuk grafik.' },
  { num: '04', title: 'Ekspor Dokumen', desc: 'Output konsensus final siap di-download dalam bentuk PDF (SOP) dan PPTX (Deck).' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#070912', color: '#fff', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      {/* BG */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 10% -10%, rgba(59,130,246,0.13) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(139,92,246,0.13) 0%, transparent 55%)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.025, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* NAV */}
        <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 48px', height: 68, borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(24px)', background: 'rgba(7,9,18,0.85)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#00f0ff,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BrainCircuit size={18} color="#fff" />
            </div>
            <span style={{ fontSize: 19, fontWeight: 800, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.03em' }}>
              Argunex <span style={S.gradientText}>AI</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {['#features|Features', '#how-it-works|Cara Kerja', '#technology|Enterprise'].map(item => {
              const [href, label] = item.split('|');
              return (
                <a key={href} href={href} style={{ color: '#a0a8c2', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#a0a8c2'}>{label}</a>
              );
            })}
            <button style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: 14, height: 14 }} />
              Login Gmail
            </button>
            <button onClick={() => navigate('/dashboard')} style={{ padding: '9px 22px', borderRadius: 9, fontSize: 14, fontWeight: 700, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', boxShadow: '0 4px 20px rgba(59,130,246,0.3)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(139,92,246,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.3)'; }}>
              Coba Sekarang →
            </button>
          </div>
        </nav>

        {/* NOTIFICATION LIMIT BAR */}
        <div style={{ background: 'rgba(244,63,94,0.1)', borderBottom: '1px solid rgba(244,63,94,0.2)', padding: '8px', textAlign: 'center', fontSize: 12, color: '#f43f5e', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
           <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f43f5e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
           Akses Terbatas: Anda memiliki 1 Sisa Kuota Analisis. Login menggunakan Gmail untuk mendapatkan Akses Penuh tanpa batas.
        </div>

        {/* HERO */}
        <section style={{ ...S.section, padding: '100px 40px 72px', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 100, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#00f0ff', fontSize: 11, fontWeight: 700, marginBottom: 32, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00f0ff', display: 'inline-block', boxShadow: '0 0 8px #00f0ff' }} />
            Multi-Agent Network v1.0 — Live
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: 'clamp(44px, 7vw, 82px)', fontWeight: 800, lineHeight: 1.07, letterSpacing: '-0.04em', fontFamily: 'Outfit, sans-serif', marginBottom: 24 }}>
            AI yang Berdiskusi<br />
            <span style={S.gradientText}>Sebelum Bertindak</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            style={{ fontSize: 17, color: '#a0a8c2', lineHeight: 1.75, maxWidth: 640, margin: '0 auto 48px' }}>
            Platform SaaS enterprise pertama yang memberdayakan 10+ AI Engine terkemuka untuk membangkitkan puluhan Persona (Engineer, Analis, Direktur) yang saling berdebat dan mencari konsensus atas permasalahan bisnis Anda.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/dashboard')}
              style={{ padding: '15px 36px', borderRadius: 12, fontSize: 16, fontWeight: 700, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', boxShadow: '0 8px 32px rgba(59,130,246,0.35)', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 44px rgba(139,92,246,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.35)'; }}>
              Coba Sekarang <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/dashboard?mode=preview')}
              style={{ padding: '15px 36px', borderRadius: 12, fontSize: 16, fontWeight: 600, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.25s', backdropFilter: 'blur(10px)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(0,240,255,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
              <Play size={18} style={{ color: '#00f0ff' }} fill="#00f0ff" /> Lihat Preview
            </button>
          </motion.div>
        </section>

        {/* STATS */}
        <section style={{ ...S.section, padding: '0 40px 80px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ padding: '32px 24px', textAlign: 'center', background: 'rgba(18,22,41,0.5)', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', transition: 'background 0.3s', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(18,22,41,0.5)'}>
                <div style={{ fontSize: 38, fontWeight: 800, fontFamily: 'Outfit, sans-serif', ...S.gradientText, marginBottom: 6 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* FEATURES */}
        <section id="features" style={{ ...S.section, padding: '80px 40px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#3b82f6', display: 'block', marginBottom: 14 }}>Core Capabilities</span>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 50px)', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'Outfit, sans-serif', marginBottom: 14 }}>Tiga Pilar Kecerdasan AI</h2>
            <p style={{ color: '#a0a8c2', fontSize: 15, maxWidth: 460, margin: '0 auto' }}>Setiap keputusan dianalisis dari 3 dimensi: operasional, finansial, dan manajemen risiko.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.13 }}
                  style={{ ...S.card, padding: '36px 32px', position: 'relative', overflow: 'hidden', transition: 'all 0.3s', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${f.color}30`; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 24px 60px ${f.color}15`; e.currentTarget.style.background = 'rgba(25,30,55,0.85)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'rgba(18,22,41,0.7)'; }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`, opacity: 0.7 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${f.color}15`, border: `1px solid ${f.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={24} color={f.color} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: f.color, background: `${f.color}12`, border: `1px solid ${f.color}22`, padding: '4px 10px', borderRadius: 100 }}>{f.tag}</span>
                  </div>
                  <h3 style={{ fontSize: 19, fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 12, letterSpacing: '-0.02em' }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: '#a0a8c2', lineHeight: 1.75 }}>{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" style={{ ...S.section, padding: '80px 40px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8b5cf6', display: 'block', marginBottom: 14 }}>Alur Kerja</span>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 50px)', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'Outfit, sans-serif' }}>Dari Data ke Keputusan<br />dalam 4 Langkah</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {STEPS.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ ...S.card, padding: '28px 24px', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ fontSize: 40, fontWeight: 900, fontFamily: 'Outfit, sans-serif', ...S.gradientText, opacity: 0.4, marginBottom: 16, lineHeight: 1 }}>{step.num}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: '#a0a8c2', lineHeight: 1.7 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section id="technology" style={{ ...S.section, padding: '80px 40px 100px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ borderRadius: 28, padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden', background: 'rgba(18,22,41,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
            <Server size={40} style={{ color: '#6b7280', marginBottom: 24 }} />
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'Outfit, sans-serif', marginBottom: 16 }}>Built for Enterprise Scale</h2>
            <p style={{ color: '#a0a8c2', fontSize: 16, maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.7 }}>
              Platform AI SaaS enterprise yang siap diintegrasikan dengan database on-premise maupun cloud infrastructure perusahaan Anda.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
              {['SOC 2 Compliant', 'On-Premise Ready', 'API-First', 'Multi-tenant'].map(badge => (
                <span key={badge} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#a0a8c2', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: 100 }}>
                  <CheckCircle size={13} style={{ color: '#10b981' }} /> {badge}
                </span>
              ))}
            </div>
            <button onClick={() => navigate('/dashboard')}
              style={{ padding: '14px 36px', borderRadius: 12, fontSize: 16, fontWeight: 700, background: '#fff', color: '#070912', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              Akses Prototype Interaktif →
            </button>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#6b7280', fontSize: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BrainCircuit size={18} color="#3b82f6" />
            <span style={{ fontWeight: 600, color: '#a0a8c2', fontFamily: 'Outfit, sans-serif' }}>Argunex AI</span>
          </div>
          <span>© {new Date().getFullYear()} Argunex AI. Designed for Excellence.</span>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{ color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#6b7280'}>{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
