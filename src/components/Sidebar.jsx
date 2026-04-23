import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Upload, MessageSquare, BarChart2, FileOutput, ArrowLeft, Server } from 'lucide-react';

const STEPS = [
  { id: 'model-config',icon: Server,         label: 'Model Selection',     sub: 'Konfigurasi Engine AI' },
  { id: 'upload',      icon: Upload,         label: 'Data & Problem',      sub: 'Upload & deskripsi' },
  { id: 'deliberation',icon: MessageSquare,  label: 'AI Deliberation',     sub: 'Multi-agent debate' },
  { id: 'simulation',  icon: BarChart2,      label: 'Causal Simulation',   sub: 'Scenario analysis' },
  { id: 'output',      icon: FileOutput,     label: 'Output & Action Plan',sub: 'Report generation' },
];

const ORDER = ['model-config', 'upload', 'deliberation', 'simulation', 'output'];

export default function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const currentIdx = ORDER.indexOf(activeTab);

  return (
    <aside style={{
      width: 260, height: '100vh', flexShrink: 0,
      background: 'rgba(3,4,9,0.9)', borderRight: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(24px)', display: 'flex', flexDirection: 'column', padding: '0 0 24px',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#00f0ff,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BrainCircuit size={17} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em', lineHeight: 1 }}>Argunex AI</div>
            <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2, fontWeight: 500 }}>Decision Intelligence</div>
          </div>
        </div>
      </div>

      {/* Steps Label */}
      <div style={{ padding: '20px 20px 10px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280' }}>Analysis Workflow</div>
      </div>

      {/* Step Nav */}
      <nav style={{ flex: 1, padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeTab === step.id;
          const isDone = idx < currentIdx;
          const isPending = idx > currentIdx;

          const dotColor = isDone ? '#10b981' : isActive ? '#3b82f6' : '#374151';
          const textColor = isActive ? '#ffffff' : isDone ? '#a0a8c2' : '#4b5563';
          const bgColor = isActive ? 'rgba(59,130,246,0.12)' : 'transparent';
          const borderColor = isActive ? 'rgba(59,130,246,0.25)' : 'transparent';

          return (
            <div key={step.id} style={{ position: 'relative' }}>
              {/* Connector line */}
              {idx < STEPS.length - 1 && (
                <div style={{
                  position: 'absolute', left: 27, top: '100%', width: 2, height: 8,
                  background: isDone ? '#10b981' : 'rgba(255,255,255,0.07)', zIndex: 0, transition: 'background 0.4s',
                }} />
              )}
              <button
                onClick={() => setActiveTab(step.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 12, border: `1px solid ${borderColor}`,
                  background: bgColor, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                  position: 'relative', zIndex: 1,
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = bgColor; e.currentTarget.style.borderColor = borderColor; } }}>

                {/* Icon circle */}
                <div style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive ? 'rgba(59,130,246,0.2)' : isDone ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? 'rgba(59,130,246,0.4)' : isDone ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  transition: 'all 0.3s',
                }}>
                  <Icon size={16} color={isActive ? '#3b82f6' : isDone ? '#10b981' : '#4b5563'} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: textColor, fontFamily: 'Outfit, sans-serif', transition: 'color 0.2s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{step.label}</div>
                  <div style={{ fontSize: 11, color: '#4b5563', marginTop: 1 }}>{step.sub}</div>
                </div>

                {/* Status dot */}
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, flexShrink: 0, boxShadow: isActive ? '0 0 8px #3b82f6' : isDone ? '0 0 6px #10b981' : 'none', transition: 'all 0.3s' }} />
              </button>
            </div>
          );
        })}
      </nav>

      {/* Progress */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', margin: '0 0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 11, color: '#6b7280' }}>
          <span>Progress</span>
          <span style={{ fontWeight: 600, color: '#a0a8c2' }}>{Math.round((currentIdx / (ORDER.length - 1)) * 100)}%</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)', width: `${(currentIdx / (ORDER.length - 1)) * 100}%`, transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Back */}
      <div style={{ padding: '0 12px' }}>
        <button onClick={() => navigate('/')}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#6b7280', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
          <ArrowLeft size={15} /> Kembali ke Landing
        </button>
      </div>
    </aside>
  );
}
