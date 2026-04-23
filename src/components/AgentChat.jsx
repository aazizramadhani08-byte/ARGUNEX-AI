import React, { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, useNodesState, useEdgesState, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, BrainCircuit, CheckCircle2, MessageSquareMore, Loader2, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { invokeAgentArgument } from '../services/aiService';

// ─── 5 AI Engines — Vision + Text ─────────────────────────────────────────────
const LLM_ENGINES = {
  nemo3: { name: 'Nemotron Nano VL', brand: 'NVIDIA',  hex: '#76b900', apiModel: 'nvidia/nemotron-nano-12b-v2-vl:free' },
  gemma: { name: 'Gemma 3 27B Vision', brand: 'Google', hex: '#4285f4', apiModel: 'google/gemma-3-27b-it:free' },
  qwen:  { name: 'Qwen3 Next 80B',    brand: 'Qwen',   hex: '#8b5cf6', apiModel: 'qwen/qwen3-next-80b-a3b-instruct:free' },
  llama: { name: 'Llama 3.3 70B',     brand: 'Meta',   hex: '#06b6d4', apiModel: 'meta-llama/llama-3.3-70b-instruct:free' },
  glm:   { name: 'GLM 4.5 Air',       brand: 'Z.ai',   hex: '#3b82f6', apiModel: 'z-ai/glm-4.5-air:free' },
};

// ─── Persona Pools by Domain ───────────────────────────────────────────────────
const PERSONA_POOLS = [
  { role: 'Direktur Operasional',   icon: '🏭' },
  { role: 'Manajer Keuangan',       icon: '💰' },
  { role: 'Engineer Senior',        icon: '⚙️' },
  { role: 'Ahli Keselamatan (K3)', icon: '🦺' },
  { role: 'Analis Data',            icon: '📊' },
  { role: 'Konsultan Hukum',        icon: '⚖️' },
  { role: 'Pakar Rantai Pasok',     icon: '🚚' },
  { role: 'Manajer SDM (HRD)',      icon: '👥' },
  { role: 'Spesialis Kualitas',     icon: '🔍' },
  { role: 'Konsultan Strategi',     icon: '🎯' },
  { role: 'Regulator Pemerintah',   icon: '🏛️' },
  { role: 'Pakar Teknologi',        icon: '💻' },
];

// ─── Debate Phases ─────────────────────────────────────────────────────────────
const DEBATE_PHASES = [
  { id: 'argument',   label: 'Ronde 1 — Argumen Pembuka',  color: '#3b82f6', rounds: 5 },
  { id: 'counter',    label: 'Ronde 2 — Sanggahan & Debat', color: '#f59e0b', rounds: 5 },
  { id: 'resolution', label: 'Ronde 3 — Konvergensi Solusi', color: '#10b981', rounds: 5 },
];

// ─── ReactFlow Custom Nodes ────────────────────────────────────────────────────
const RootNode = ({ data }) => (
  <div style={{ padding: '16px 20px', borderRadius: 20, background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', border: '2px solid rgba(0,240,255,0.6)', boxShadow: '0 0 40px rgba(0,240,255,0.35)', textAlign: 'center', minWidth: 160, cursor: 'default' }}>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
      <BrainCircuit size={22} color="#00f0ff" />
    </div>
    <div style={{ fontSize: 9, color: '#00f0ff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Problem Core</div>
    <div style={{ fontSize: 11, color: '#fff', fontWeight: 700, lineHeight: 1.3, maxWidth: 140 }}>{data.label}</div>
    <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    <Handle type="source" position={Position.Top} style={{ opacity: 0 }} />
    <Handle type="source" position={Position.Left} style={{ opacity: 0 }} />
    <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
  </div>
);

const EngineNode = ({ data }) => {
  const engine = LLM_ENGINES[data.engine];
  return (
    <div style={{ padding: '10px 14px', borderRadius: 14, background: '#0b0f19', border: `2px solid ${engine.hex}50`, boxShadow: `0 0 20px ${engine.hex}30`, minWidth: 130, textAlign: 'center' }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${engine.hex}20`, border: `1.5px solid ${engine.hex}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
        <Cpu size={13} color={engine.hex} />
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, color: engine.hex, lineHeight: 1.2 }}>{engine.name}</div>
      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{engine.brand}</div>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
};

const PersonaNode = ({ data }) => (
  <div style={{ padding: '5px 10px', borderRadius: 10, background: '#080b14', border: `1px solid ${data.hex}40`, boxShadow: `0 0 8px ${data.hex}20`, whiteSpace: 'nowrap', cursor: 'default' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ fontSize: 10 }}>{data.icon}</span>
      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{data.role}</span>
    </div>
    <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
    <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
  </div>
);

const nodeTypes = { root: RootNode, engine: EngineNode, persona: PersonaNode };

// ─── Global Cache (persists across tab switches) ───────────────────────────────
let CACHE = {
  done:        false,
  nodes:       null,
  edges:       null,
  feed:        [],
  progress:    0,
  currentPhase: 0,
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AgentChat({ problemContext, imageBase64, onComplete }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(CACHE.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(CACHE.edges || []);
  const [feed, setFeed]         = useState(CACHE.feed);
  const [progress, setProgress] = useState(CACHE.progress);
  const [phaseIdx, setPhaseIdx] = useState(CACHE.currentPhase);
  const [isDone, setIsDone]     = useState(CACHE.done);

  // Sync to cache
  useEffect(() => { CACHE.feed = feed; }, [feed]);
  useEffect(() => { CACHE.nodes = nodes; }, [nodes]);
  useEffect(() => { CACHE.edges = edges; }, [edges]);
  useEffect(() => { CACHE.progress = progress; }, [progress]);
  useEffect(() => { CACHE.currentPhase = phaseIdx; }, [phaseIdx]);

  // ── Build initial graph ─────────────────────────────────────────────────────
  useEffect(() => {
    if (CACHE.done) return; // don't re-run if already done

    const engKeys = Object.keys(LLM_ENGINES);
    const initNodes = [];
    const baseEdges = [];
    const engPositions = {};

    // Root
    initNodes.push({
      id: 'root', type: 'root',
      position: { x: 580, y: 440 },
      data: { label: problemContext || 'Masalah Terdeteksi' },
    });

    // Engines (circle)
    engKeys.forEach((key, i) => {
      const angle  = (i / engKeys.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 310;
      const x = 580 + Math.cos(angle) * radius;
      const y = 440 + Math.sin(angle) * radius;
      engPositions[key] = { x, y };

      initNodes.push({ id: `eng-${key}`, type: 'engine', position: { x, y }, data: { engine: key } });
      baseEdges.push({
        id: `e-root-${key}`, source: 'root', target: `eng-${key}`, animated: true,
        style: { stroke: LLM_ENGINES[key].hex, strokeWidth: 2.5, opacity: 0.7, filter: `drop-shadow(0 0 6px ${LLM_ENGINES[key].hex})` },
      });
    });

    // Personas around each engine
    const shuffled = [...PERSONA_POOLS].sort(() => Math.random() - 0.5);
    engKeys.forEach((key, ki) => {
      const pos = engPositions[key];
      const hex = LLM_ENGINES[key].hex;
      const personas = shuffled.slice(ki * 2, ki * 2 + 2);
      personas.forEach((p, pi) => {
        const a = (pi / 2) * Math.PI * 2 + ki;
        const r = 100 + Math.random() * 30;
        const pid = `P-${key}-${pi}`;
        initNodes.push({
          id: pid, type: 'persona',
          position: { x: pos.x + Math.cos(a) * r, y: pos.y + Math.sin(a) * r },
          data: { role: p.role, icon: p.icon, hex },
        });
        baseEdges.push({
          id: `e-${key}-${pi}`, source: `eng-${key}`, target: pid, animated: true,
          style: { stroke: hex, strokeWidth: 1.2, opacity: 0.5 },
        });
      });
    });

    setNodes(initNodes);
    setEdges(baseEdges);

    // ── Animated cross-edges ──────────────────────────────────────────────────
    let crossEdgeCount = 0;
    const crossInterval = setInterval(() => {
      if (CACHE.done) { clearInterval(crossInterval); return; }
      const personaNodes = initNodes.filter(n => n.type === 'persona');
      const p1 = personaNodes[Math.floor(Math.random() * personaNodes.length)];
      const p2 = personaNodes[Math.floor(Math.random() * personaNodes.length)];
      if (p1 && p2 && p1.id !== p2.id) {
        const crossEdge = {
          id: `cross-${++crossEdgeCount}-${Date.now()}`,
          source: p1.id, target: p2.id, animated: true,
          style: { stroke: p1.data.hex, strokeWidth: 1, opacity: 0.45, strokeDasharray: '4,4' },
        };
        setEdges(prev => [...prev.filter(e => !e.id.startsWith('cross-') || prev.filter(x => x.id.startsWith('cross-')).length < 120), crossEdge]);
      }
    }, 1800);

    // ── 3-Phase Debate Loop ───────────────────────────────────────────────────
    let isActive       = true;
    let history        = "";
    let globalProgress = 5;
    const allPersonas  = PERSONA_POOLS;
    const engKeysList  = Object.keys(LLM_ENGINES);

    const runDebate = async () => {
      for (let phaseI = 0; phaseI < DEBATE_PHASES.length; phaseI++) {
        if (!isActive) break;
        const phase = DEBATE_PHASES[phaseI];
        setPhaseIdx(phaseI);

        // Phase announcement card
        const phaseCard = {
          id: Date.now() + Math.random(),
          type: 'phase-header',
          label: phase.label,
          color: phase.color,
        };
        setFeed(prev => [phaseCard, ...prev]);
        await new Promise(r => setTimeout(r, 1200));

        for (let round = 0; round < phase.rounds; round++) {
          if (!isActive) break;

          // Pick a random engine & persona
          const engKey  = engKeysList[round % engKeysList.length];
          const engine  = LLM_ENGINES[engKey];
          const persona = allPersonas[(phaseI * phase.rounds + round) % allPersonas.length];

          // Highlight the active engine node
          setNodes(prev => prev.map(n =>
            n.id === `eng-${engKey}`
              ? { ...n, style: { filter: `drop-shadow(0 0 20px ${engine.hex})`, transform: 'scale(1.12)', transition: 'all 0.4s' } }
              : { ...n, style: {} }
          ));

          // Call AI
          let argumentText;
          try {
            argumentText = await invokeAgentArgument(
              persona.role,
              problemContext || "Masalah bisnis yang butuh analisa menyeluruh.",
              history,
              engine.apiModel,
              (phaseI === 0 && round < 2) ? imageBase64 : null, // only pass image in early rounds
              phase.id,
            );
          } catch (e) {
            argumentText = `Dari perspektif ${persona.role}, kita perlu mengevaluasi kondisi ini secara menyeluruh sebelum mengambil keputusan.`;
          }

          // Append to history (keep last ~2000 chars to stay within context)
          const histEntry = `[${persona.icon} ${persona.role} via ${engine.name}]: ${argumentText}`;
          history = (history + "\n" + histEntry).slice(-2500);

          // Progress
          globalProgress = Math.min(97, globalProgress + (100 / (DEBATE_PHASES.length * phase.rounds + 3)));
          setProgress(globalProgress);

          // Feed card
          const card = {
            id: Date.now() + Math.random(),
            type: 'argument',
            phase: phase.id,
            phaseColor: phase.color,
            brand: engine.brand,
            model: engine.name,
            engineHex: engine.hex,
            role: persona.role,
            icon: persona.icon,
            text: argumentText,
          };
          if (isActive) setFeed(prev => [card, ...prev].slice(0, 40));

          // Delay between rounds (faster for demo)
          await new Promise(r => setTimeout(r, 2000));
        }
      }

      // ── Debate Done ─────────────────────────────────────────────────────────
      if (isActive) {
        setProgress(100);
        setPhaseIdx(3);
        setIsDone(true);
        CACHE.done = true;
        clearInterval(crossInterval);
        if (onComplete) onComplete(history);
      }
    };

    runDebate();

    return () => {
      isActive = false;
      clearInterval(crossInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentPhase = DEBATE_PHASES[phaseIdx] || DEBATE_PHASES[2];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', height: '100%', gap: 0 }}>
      {/* ── Left: ReactFlow Graph ──────────────────────────────────────────── */}
      <div style={{ position: 'relative', background: 'radial-gradient(ellipse at 50% 50%, #06080f 0%, #020408 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <ReactFlow
          nodes={nodes} edges={edges}
          onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView fitViewOptions={{ padding: 0.15 }}
          nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}
          panOnDrag zoomOnScroll minZoom={0.2} maxZoom={1.5}
          style={{ width: '100%', height: '100%' }}
        >
          <Background color="rgba(255,255,255,0.03)" gap={28} size={1} />
          <Controls showInteractive={false} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }} />
        </ReactFlow>

        {/* Overlay: Phase Badge */}
        <div style={{ position: 'absolute', top: 16, left: 16, padding: '6px 14px', borderRadius: 100, background: `${currentPhase.color}20`, border: `1px solid ${currentPhase.color}50`, fontSize: 11, fontWeight: 700, color: currentPhase.color, fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: 6, zIndex: 10 }}>
          {isDone ? <CheckCircle2 size={13} /> : <Loader2 size={13} className="animate-spin" />}
          {isDone ? 'Debat Selesai — Konsensus Tercapai' : currentPhase.label}
        </div>

        {/* Overlay: Progress Bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.06)', zIndex: 10 }}>
          <motion.div style={{ height: '100%', background: `linear-gradient(90deg, ${currentPhase.color}, #00f0ff)`, boxShadow: `0 0 12px ${currentPhase.color}` }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} />
        </div>
      </div>

      {/* ── Right: Live Feed Panel ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', background: '#070913', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, background: 'rgba(255,255,255,0.02)' }}>
          <MessageSquareMore size={15} color="#00f0ff" />
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 13, color: '#fff' }}>Live Debate Feed</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: currentPhase.color, fontWeight: 600 }}>
            <Zap size={11} />
            {Math.round(progress)}%
          </div>
        </div>

        {/* Feed */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AnimatePresence>
            {feed.map((item) => {
              if (item.type === 'phase-header') {
                return (
                  <motion.div key={item.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '8px 14px', borderRadius: 10, background: `${item.color}15`, border: `1px solid ${item.color}40`, textAlign: 'center', fontSize: 11, fontWeight: 700, color: item.color, fontFamily: 'Outfit, sans-serif', letterSpacing: '0.04em' }}>
                    ⚡ {item.label}
                  </motion.div>
                );
              }
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ padding: '12px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.engineHex}25`, borderLeft: `3px solid ${item.phaseColor || item.engineHex}` }}
                >
                  {/* Agen header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13 }}>{item.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'Outfit, sans-serif' }}>{item.role}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 9, padding: '2px 7px', borderRadius: 100, background: `${item.engineHex}20`, color: item.engineHex, border: `1px solid ${item.engineHex}40`, fontWeight: 700 }}>
                      {item.brand}
                    </span>
                  </div>
                  {/* Argument text */}
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, margin: 0 }}>{item.text}</p>
                  {/* Model tag */}
                  <div style={{ marginTop: 7, fontSize: 9, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>via {item.model}</div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Loading state when feed is empty */}
          {feed.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 12, opacity: 0.5, paddingTop: 60 }}>
              <Loader2 size={24} color="#00f0ff" className="animate-spin" />
              <span style={{ fontSize: 12, color: '#6b7280' }}>AI Swarm sedang memulai deliberasi...</span>
            </div>
          )}

          {isDone && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '14px', borderRadius: 14, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', textAlign: 'center', marginBottom: 8 }}>
              <CheckCircle2 size={20} color="#10b981" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 13, color: '#10b981', marginBottom: 4 }}>Konsensus Tercapai!</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>15 putaran debat selesai. Laporan sedang digenerate...</div>
            </motion.div>
          )}
        </div>

        {/* Progress footer */}
        <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, background: 'rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#6b7280', marginBottom: 5 }}>
            <span>Konvergensi Swarm</span>
            <span style={{ color: currentPhase.color, fontWeight: 700 }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
            <motion.div style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg,${currentPhase.color},#00f0ff)` }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
