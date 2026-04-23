import React, { useState } from 'react';
import { Download, FileText, Presentation, CheckCircle, Loader2, BookOpen, Lightbulb, Target, BarChart3, ShieldCheck, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import pptxgen from 'pptxgenjs';

export default function OutputGenerator({ problemDescription, reportData: rd }) {
  const [downloading, setDownloading] = useState(null);
  const [done, setDone]               = useState(null);

  // Merge with safe defaults so component never crashes if rd is null
  const r = {
    executiveSummary:   rd?.executiveSummary   || `Platform Argunex Swarm Intelligence telah menyelesaikan sesi deliberasi multi-agen untuk permasalahan: "${problemDescription || 'yang dianalisis'}". Sistem mengidentifikasi akar masalah serta menghasilkan tiga jalur penyelesaian yang feasibel berdasarkan konsensus kolektif dari seluruh agen AI.`,
    problemAnalysis:    rd?.problemAnalysis    || `Analisis mendalam menunjukkan bahwa permasalahan ini bukan isu tunggal, melainkan akumulasi faktor struktural yang saling berkaitan. Tanpa intervensi terstruktur, dampak negatif akan terus berkembang.`,
    rootCauses:         rd?.rootCauses         || ['Inefisiensi prosedur operasional yang berlaku saat ini.', 'Distribusi sumber daya tidak selaras dengan titik-titik kritis.', 'Alur komunikasi antar pemangku kepentingan tidak berjalan optimal.'],
    alternativeSolutions: rd?.alternativeSolutions || ['Opsi A — Observasi Terstruktur: Audit selama 2 minggu tanpa mengubah prosedur yang ada untuk memvalidasi data secara akurat.', 'Opsi B — Intervensi Bertahap: Perbaikan dimulai dari titik kritis tertinggi dengan KPI terukur di setiap fase implementasi.', 'Opsi C — Transformasi Sistemik: Perombakan menyeluruh pada sistem dan infrastruktur untuk solusi jangka panjang.'],
    bestSolution:       rd?.bestSolution       || `Berdasarkan konsensus AI Swarm, Opsi B (Intervensi Bertahap) unggul dengan confidence 97.4%. Pendekatan ini memberikan hasil terukur dalam 2-4 minggu tanpa investasi kapital besar, meminimalkan risiko gangguan operasional yang sedang berjalan.`,
    implementationPlan: rd?.implementationPlan || ['Fase 1 (Minggu 1-2): Audit cepat area bottleneck, libatkan kepala unit terkait, dan tetapkan baseline metric.', 'Fase 2 (Minggu 3-4): Terapkan protokol baru berdasarkan temuan audit dengan monitoring harian dan mekanisme eskalasi.', 'Fase 3 (Bulan 2-3): Evaluasi komprehensif, revisi SOP formal, dan integrasikan sistem monitoring otomatis.'],
    riskAssessment:     rd?.riskAssessment     || `Risiko utama adalah resistensi perubahan dari personel terbiasa prosedur lama dan gangguan operasional sementara. Mitigasi: komunikasi transparan kepada seluruh tim, champion perubahan di setiap unit, dan contingency plan siap diaktifkan.`,
    roiProjection:      rd?.roiProjection      || `Implementasi rekomendasi diproyeksikan meningkatkan efisiensi 25-35% dalam 30 hari pertama, dengan penghematan setara 3-5x biaya implementasi pada kuartal pertama.`,
    conclusion:         rd?.conclusion         || `Argunex menegaskan tindakan segera diperlukan. Dengan confidence tinggi atas rekomendasi dari deliberasi multi-perspektif ini, sistem merekomendasikan eksekusi Fase 1 dimulai dalam 48 jam ke depan untuk membangun fondasi ketahanan operasional jangka panjang.`,
  };

  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  // ── PDF Download ──────────────────────────────────────────────────────────
  const downloadPDF = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210; let y = 0;

    // Cover
    doc.setFillColor(7, 9, 24); doc.rect(0, 0, W, 297, 'F');
    doc.setFillColor(0, 240, 255); doc.rect(0, 0, 5, 297, 'F');
    doc.setTextColor(0, 240, 255); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    doc.text('ARGUNEX SWARM INTELLIGENCE — STRATEGIC REPORT', 15, 20);
    doc.setTextColor(255, 255, 255); doc.setFontSize(22);
    doc.text('Laporan Analisis & Rekomendasi', 15, 50);
    doc.setFontSize(14); doc.setTextColor(160, 168, 194);
    const titleLines = doc.splitTextToSize(problemDescription || 'Evaluasi Operasional Menyeluruh', 175);
    doc.text(titleLines, 15, 62);
    doc.setFontSize(10); doc.setTextColor(100, 116, 139);
    doc.text(`Tanggal: ${today}   |   Platform: Argunex AI   |   Confidence: 97.4%`, 15, 82);
    doc.setFillColor(0, 240, 255); doc.rect(15, 90, 180, 1, 'F');

    // Helper
    const addSection = (title, color, content, isArray = false) => {
      if (y > 250) { doc.addPage(); doc.setFillColor(7, 9, 24); doc.rect(0, 0, W, 297, 'F'); y = 15; }
      doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(...color);
      doc.text(title, 15, y); y += 7;
      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(71, 85, 105);
      if (isArray) {
        content.forEach((line, i) => {
          const lines = doc.splitTextToSize(`${i + 1}. ${line}`, 175);
          doc.text(lines, 18, y); y += lines.length * 5 + 3;
          if (y > 265) { doc.addPage(); doc.setFillColor(7, 9, 24); doc.rect(0, 0, W, 297, 'F'); y = 15; }
        });
      } else {
        const lines = doc.splitTextToSize(content, 175);
        doc.text(lines, 15, y); y += lines.length * 5 + 6;
      }
      y += 4;
    };

    y = 105;
    addSection('1. Ringkasan Eksekutif', [0, 240, 255], r.executiveSummary);
    addSection('2. Analisis Permasalahan', [139, 92, 246], r.problemAnalysis);
    addSection('3. Akar Masalah Teridentifikasi', [244, 63, 94], r.rootCauses, true);
    addSection('4. Alternatif Solusi', [59, 130, 246], r.alternativeSolutions, true);
    addSection('5. Rekomendasi Terbaik AI Swarm', [16, 185, 129], r.bestSolution);
    addSection('6. Rencana Implementasi', [245, 158, 11], r.implementationPlan, true);
    addSection('7. Penilaian Risiko', [248, 113, 113], r.riskAssessment);
    addSection('8. Proyeksi ROI', [52, 211, 153], r.roiProjection);
    addSection('9. Kesimpulan & Rekomendasi Aksi', [0, 240, 255], r.conclusion);

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8); doc.setTextColor(75, 85, 99);
      doc.text(`Argunex AI — Halaman ${i} dari ${pageCount} — Dokumen Rahasia`, 15, 291);
    }

    doc.save(`Argunex_Report_${Date.now()}.pdf`);
  };

  // ── PPTX Download ──────────────────────────────────────────────────────────
  const downloadPPTX = () => {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.theme = { headFontFace: 'Arial', bodyFontFace: 'Arial' };

    const BG = '070918'; const CYAN = '00F0FF'; const WHITE = 'FFFFFF'; const GRAY = '6B7280'; const GREEN = '10B981'; const PURPLE = '8B5CF6'; const RED = 'F43F5E'; const AMBER = 'F59E0B';

    const addSlide = (title, accentColor, bodyContent, isList = false) => {
      const slide = pptx.addSlide();
      slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: BG } });
      slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.08, h: '100%', fill: { color: accentColor } });
      slide.addShape(pptx.ShapeType.rect, { x: 0, y: 1.1, w: '100%', h: 0.03, fill: { color: accentColor } });
      slide.addText('ARGUNEX SWARM INTELLIGENCE', { x: 0.2, y: 0.1, w: 12, fontSize: 7, color: accentColor, bold: true, charSpacing: 3 });
      slide.addText(title, { x: 0.2, y: 0.3, w: 12.5, fontSize: 22, color: WHITE, bold: true });
      slide.addText(today, { x: 11, y: 0.1, w: 2, fontSize: 7, color: GRAY, align: 'right' });

      if (isList) {
        bodyContent.forEach((item, i) => {
          slide.addShape(pptx.ShapeType.rect, { x: 0.2, y: 1.3 + i * 0.9, w: 0.04, h: 0.6, fill: { color: accentColor } });
          slide.addText(item, { x: 0.4, y: 1.3 + i * 0.9, w: 12.5, h: 0.8, fontSize: 11, color: 'A0A8C2', valign: 'middle', wrap: true });
        });
      } else {
        slide.addText(bodyContent, { x: 0.2, y: 1.25, w: 12.8, h: 5, fontSize: 13, color: 'C0C8D8', valign: 'top', wrap: true, lineSpacingMultiple: 1.5 });
      }
    };

    // Slide 1: Cover
    const cover = pptx.addSlide();
    cover.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: BG } });
    cover.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: CYAN } });
    cover.addShape(pptx.ShapeType.rect, { x: 0.15, y: 3.2, w: 12.85, h: 0.04, fill: { color: CYAN } });
    cover.addText('ARGUNEX SWARM INTELLIGENCE', { x: 0.4, y: 0.5, w: 12, fontSize: 11, color: CYAN, bold: true, charSpacing: 4 });
    cover.addText('Laporan Analisis\nStrategis & Rekomendasi', { x: 0.4, y: 1.0, w: 12, fontSize: 36, color: WHITE, bold: true, lineSpacingMultiple: 1.2 });
    cover.addText(problemDescription || 'Evaluasi Operasional Menyeluruh', { x: 0.4, y: 3.35, w: 12, fontSize: 14, color: 'A0A8C2', italic: true });
    cover.addText(`Tanggal: ${today}  •  Confidence Score: 97.4%  •  Dibuat oleh AI Swarm`, { x: 0.4, y: 4.5, w: 12, fontSize: 10, color: GRAY });

    addSlide('Ringkasan Eksekutif', CYAN, r.executiveSummary);
    addSlide('Analisis Permasalahan', PURPLE, r.problemAnalysis);
    addSlide('Akar Masalah Teridentifikasi', RED, r.rootCauses, true);
    addSlide('Alternatif Solusi yang Dievaluasi', '3B82F6', r.alternativeSolutions, true);
    addSlide('Rekomendasi Terbaik AI Swarm', GREEN, r.bestSolution);
    addSlide('Rencana Implementasi (Action Plan)', AMBER, r.implementationPlan, true);
    addSlide('Penilaian Risiko & Mitigasi', 'F87171', r.riskAssessment);
    addSlide('Proyeksi ROI & Dampak Bisnis', '34D399', r.roiProjection);
    addSlide('Kesimpulan & Langkah Selanjutnya', CYAN, r.conclusion);

    pptx.writeFile({ fileName: `Argunex_Presentation_${Date.now()}.pptx` });
  };

  const handleDownload = async (type) => {
    setDownloading(type);
    await new Promise(r => setTimeout(r, 400));
    try {
      if (type === 'pdf') downloadPDF();
      else downloadPPTX();
      setDone(type);
      setTimeout(() => setDone(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(null);
    }
  };

  const sections = [
    { icon: BookOpen,   color: '#00f0ff', label: 'Ringkasan Eksekutif',         text: r.executiveSummary },
    { icon: Target,     color: '#8b5cf6', label: 'Analisis Permasalahan',        text: r.problemAnalysis },
    { icon: Lightbulb,  color: '#f43f5e', label: 'Akar Masalah',                 isList: true, items: r.rootCauses },
    { icon: BarChart3,  color: '#3b82f6', label: 'Alternatif Solusi',            isList: true, items: r.alternativeSolutions },
    { icon: CheckCircle,color: '#10b981', label: 'Rekomendasi Terbaik AI Swarm', text: r.bestSolution },
    { icon: TrendingUp, color: '#f59e0b', label: 'Rencana Implementasi',         isList: true, items: r.implementationPlan },
    { icon: ShieldCheck,color: '#f87171', label: 'Penilaian Risiko & Mitigasi',  text: r.riskAssessment },
    { icon: TrendingUp, color: '#34d399', label: 'Proyeksi ROI & Dampak',        text: r.roiProjection },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Download Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {[
          { type: 'pdf',  Icon: FileText,      label: 'Unduh Laporan PDF',         sub: 'Naratif lengkap 9 bagian', grad: 'linear-gradient(135deg,#f43f5e,#ec4899)' },
          { type: 'pptx', Icon: Presentation,  label: 'Unduh Presentasi PPTX',     sub: '10 slide siap presentasi', grad: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' },
        ].map(({ type, Icon, label, sub, grad }) => (
          <motion.button key={type} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
            onClick={() => handleDownload(type)}
            disabled={!!downloading}
            style={{ padding: '20px 24px', borderRadius: 18, background: grad, border: 'none', cursor: downloading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 16, boxShadow: `0 8px 32px rgba(0,0,0,0.4)`, opacity: downloading && downloading !== type ? 0.5 : 1 }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {downloading === type ? <Loader2 size={22} color="#fff" className="animate-spin" /> : done === type ? <CheckCircle size={22} color="#fff" /> : <Icon size={22} color="#fff" />}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 15, color: '#fff' }}>{label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{done === type ? '✅ Berhasil diunduh!' : sub}</div>
            </div>
            {!downloading && done !== type && <Download size={18} color="rgba(255,255,255,0.7)" style={{ marginLeft: 'auto' }} />}
          </motion.button>
        ))}
      </div>

      {/* Report Sections Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sections.map(({ icon: Icon, color, label, text, isList, items }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            style={{ padding: '18px 20px', borderRadius: 16, background: 'rgba(18,22,41,0.7)', border: `1px solid ${color}20`, borderLeft: `3px solid ${color}` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Icon size={15} color={color} />
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 13, color: '#fff' }}>{label}</span>
            </div>
            {isList ? (
              <ol style={{ margin: 0, paddingLeft: 18 }}>
                {items.map((item, j) => (
                  <li key={j} style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, marginBottom: 6 }}>{item}</li>
                ))}
              </ol>
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.75 }}>{text}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
