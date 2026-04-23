import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, ShieldAlert, Clock, Banknote, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0f1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px' }}>
      <p style={{ margin: 0, fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0, fontSize: 13, fontWeight: 700, color: p.color }}>
          {p.name}: {p.value?.toFixed(1)}{unit || ''}
        </p>
      ))}
    </div>
  );
};

// ─── Generate projection chart data from simulation scenario ─────────────────
function buildProjectionData(scenario, currentValue, targetValue, weeks = 8) {
  const data = [];
  const start = currentValue;
  const end   = scenario.projectedValue;
  for (let w = 0; w <= weeks; w++) {
    const t     = w / weeks;
    // Ease-in-out curve for realistic projection
    const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const val   = start + (end - start) * eased;
    data.push({ week: `W${w}`, value: parseFloat(val.toFixed(1)), target: targetValue });
  }
  return data;
}

// ─── Radar chart data ─────────────────────────────────────────────────────────
function buildRadarData(scenarios) {
  const dims = ['Efektivitas', 'Kecepatan', 'Biaya', 'Risiko', 'Dampak Jangka Panjang'];
  return dims.map((dim, i) => {
    const obj = { subject: dim };
    scenarios.forEach(s => {
      // Assign pseudo-scores based on scenario type
      const baseMap = { A: [40, 30, 90, 20, 25], B: [90, 80, 75, 85, 92], C: [70, 50, 40, 55, 85] };
      const base = baseMap[s.id] || [60, 60, 60, 60, 60];
      obj[s.id] = base[i] + Math.floor(Math.random() * 5 - 2);
    });
    return obj;
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SimulationEngine({ simData, isLoading }) {
  const [activeId, setActiveId] = useState('B');
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const scenarios   = simData?.scenarios     || [];
  const metricLabel = simData?.metricLabel   || 'Efisiensi Operasional';
  const metricUnit  = simData?.metricUnit    || '%';
  const currentVal  = simData?.currentValue  ?? 70;
  const targetVal   = simData?.targetValue   ?? 100;
  const problemSum  = simData?.problemSummary || '';

  const active = scenarios.find(s => s.id === activeId) || scenarios[1] || scenarios[0];

  // Animate to projected value
  useEffect(() => {
    if (!active) return;
    setAnimatedProgress(0);
    const timer = setTimeout(() => setAnimatedProgress(active.projectedValue), 300);
    return () => clearTimeout(timer);
  }, [activeId, active]);

  const chartData  = useMemo(() => active ? buildProjectionData(active, currentVal, targetVal) : [], [active, currentVal, targetVal]);
  const radarData  = useMemo(() => buildRadarData(scenarios), [scenarios]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, gap: 16 }}>
        <Loader2 size={32} color="#00f0ff" className="animate-spin" />
        <p style={{ color: '#6b7280', fontSize: 14, fontFamily: 'Outfit, sans-serif' }}>Generating simulation dari hasil diskusi AI...</p>
      </div>
    );
  }

  if (!simData || scenarios.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, gap: 12, opacity: 0.5 }}>
        <AlertTriangle size={28} color="#f59e0b" />
        <p style={{ color: '#6b7280', fontSize: 13 }}>Menunggu hasil debat AI untuk men-generate simulasi...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Problem Summary ─────────────────────────────────────────────────── */}
      {problemSum && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '14px 18px', borderRadius: 14, background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)', fontSize: 13, color: '#a0a8c2', lineHeight: 1.7 }}>
          <span style={{ fontWeight: 700, color: '#60a5fa', marginRight: 6 }}>📋 Ringkasan AI:</span>
          {problemSum}
        </motion.div>
      )}

      {/* ── Scenario Selector ───────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {scenarios.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            style={{
              padding: '14px 16px', borderRadius: 16, border: `2px solid ${activeId === s.id ? s.color : 'rgba(255,255,255,0.07)'}`,
              background: activeId === s.id ? `${s.color}12` : 'rgba(255,255,255,0.02)',
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
            }}
          >
            {activeId === s.id && <motion.div layoutId="scenario-hl" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: s.color, borderRadius: '4px 0 0 4px' }} />}
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 12, color: activeId === s.id ? '#fff' : 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{s.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{s.desc?.slice(0, 70)}...</div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 3 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: 'Outfit, sans-serif' }}>{s.projectedValue}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{metricUnit}</span>
            </div>
          </button>
        ))}
      </div>

      {/* ── Main Grid: Chart + Details ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* Projection Chart */}
        <div style={{ background: 'rgba(18,22,41,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '20px 20px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff' }}>Proyeksi {metricLabel}</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>8 minggu ke depan — {active?.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Target</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#00f0ff', fontFamily: 'Outfit, sans-serif' }}>{targetVal}{metricUnit}</div>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: 230 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={active?.color} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={active?.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[Math.max(0, currentVal - 20), Math.min(targetVal + 10, 110)]} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}${metricUnit}`} />
                  <Tooltip content={<CustomTooltip unit={metricUnit} />} />
                  <ReferenceLine y={targetVal} stroke="#10b981" strokeDasharray="4 4" label={{ value: `Target: ${targetVal}${metricUnit}`, fill: '#10b981', fontSize: 10, position: 'insideTopRight' }} />
                  <Area type="monotone" dataKey="value" name={metricLabel} stroke={active?.color} strokeWidth={2.5} fill="url(#chartGrad)" dot={false} activeDot={{ r: 5, fill: active?.color }} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Detail panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* KPI cards */}
          {[
            { label: 'Proyeksi', value: `${active?.projectedValue}${metricUnit}`, color: active?.color, icon: TrendingUp },
            { label: 'Risiko', value: active?.risk, color: active?.risk === 'Tinggi' ? '#f43f5e' : active?.risk === 'Sedang' ? '#f59e0b' : '#10b981', icon: ShieldAlert },
            { label: 'Estimasi Biaya', value: active?.cost, color: '#a78bfa', icon: Banknote },
            { label: 'Timeframe', value: active?.timeframe, color: '#60a5fa', icon: Clock },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon size={14} color={color} />
                <span style={{ fontSize: 12, color: '#6b7280' }}>{label}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: 'Outfit, sans-serif' }}>{value}</span>
            </div>
          ))}

          {/* Pros & Cons */}
          <div style={{ padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', flex: 1 }}>
            {active?.pros?.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: '#10b981', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>✅ Keunggulan</div>
                {active.pros.map((p, i) => (
                  <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, paddingLeft: 4, marginBottom: 3 }}>• {p}</div>
                ))}
              </div>
            )}
            {active?.cons?.length > 0 && (
              <div>
                <div style={{ fontSize: 10, color: '#f43f5e', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>⚠️ Kelemahan</div>
                {active.cons.map((c, i) => (
                  <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, paddingLeft: 4, marginBottom: 3 }}>• {c}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Radar Comparison ────────────────────────────────────────────────── */}
      {scenarios.length === 3 && (
        <div style={{ background: 'rgba(18,22,41,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '20px' }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 16 }}>Perbandingan Multi-Dimensi Ketiga Skenario</div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius={80}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                {scenarios.map(s => (
                  <Radar key={s.id} name={s.name} dataKey={s.id} stroke={s.color} fill={s.color} fillOpacity={0.12} strokeWidth={2} />
                ))}
                <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
