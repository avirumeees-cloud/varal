import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/* ─── Types ─────────────────────────────────────────────── */
interface TribeStats { before: string; after: string; loss: string; }

type SlideData =
  | { id: string; type: 'hero';       title: string; subtitle: string; eyebrow: string; quote: string; image: string; description?: string }
  | { id: string; type: 'dashboard';  title: string; subtitle: string; stats: { label: string; value: string; detail: string }[]; description: string }
  | { id: string; type: 'bio';        name: string; title: string; description: string; image: string; quote: string }
  | { id: string; type: 'map';        name: string; location: string; historical: string; current: string; stats: TribeStats; description: string; imageHistorical: string; imageCurrent: string; accent: string; color: string }
  | { id: string; type: 'process';    title: string; subtitle: string; steps: { title: string; desc: string }[]; image: string }
  | { id: string; type: 'conclusion'; title: string; subtitle: string; description: string; links: { label: string; url: string }[] };

/* ─── Slides Data ────────────────────────────────────────── */
const slides: SlideData[] = [
  {
    id: 'intro', type: 'hero',
    title: 'Varal de Mapas', subtitle: 'Indígenas',
    eyebrow: 'Uma Instalação Visual e Interativa',
    quote: '"O espectador não lê sobre a perda — ele a experimenta."',
    image: 'https://images.unsplash.com/photo-1501491505116-440d1e5621d9?auto=format&fit=crop&q=80&w=1200',
    description: 'Um projeto baseado na obra de Ailton Krenak.'
  },
  {
    id: 'global-status', type: 'dashboard',
    title: 'O Placar da Terra', subtitle: 'Situação das Terras Indígenas no Brasil',
    stats: [
      { label: 'Total de Terras', value: '829', detail: 'Em diferentes fases' },
      { label: 'Homologadas', value: '539', detail: 'Regularizadas' },
      { label: 'Em Identificação', value: '163', detail: 'Em estudo pela FUNAI' },
      { label: 'Declaradas', value: '71', detail: 'Pelo Min. da Justiça' },
      { label: 'Identificadas', value: '41', detail: 'Relatório aprovado' },
      { label: 'Encaminhadas RI', value: '15', detail: 'Reservas Indígenas' },
    ],
    description: 'Cada número representa uma luta secular pela sobrevivência e pelo reconhecimento jurídico do território.'
  },
  {
    id: 'krenak-bio', type: 'bio',
    name: 'Ailton Krenak', title: 'Ideias para Adiar o Fim do Mundo',
    description: 'Líder indígena, escritor e filósofo. Sua obra questiona o conceito colonial de progresso e denuncia o apagamento sistemático dos povos originários.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    quote: '"A terra não é um recurso, é nossa própria extensão."'
  },
  {
    id: 'krenak-map', type: 'map',
    name: 'Krenak', location: 'Vale do Rio Doce, MG',
    historical: 'Território Ancestral', current: 'Reserva Homologada',
    stats: { before: '148.000 km²', after: '40 km²', loss: '99,9%' },
    description: 'O povo Krenak viveu às margens do Rio Doce por milênios. Após o desastre da Samarco em 2015, o rio — chamado de Watu — foi declarado morto.',
    imageHistorical: '/maps/Mapa_Krenak_Antes.png',
    imageCurrent: '/maps/Mapa_Krenak_Depois.png',
    accent: '#b45309', color: '#fde68a'
  },
  {
    id: 'guarani-map', type: 'map',
    name: 'Guarani Kaiowá', location: 'Cone Sul, MS',
    historical: 'Território Ancestral', current: 'Reserva Homologada',
    stats: { before: '350.000 km²', after: '480 km²', loss: '99,8%' },
    description: 'Ocuparam o Mato Grosso do Sul por séculos. Hoje têm a maior taxa de suicídio entre povos indígenas do Brasil — resultado direto do confinamento e da perda territorial.',
    imageHistorical: '/maps/Mapa_Guarani_Antes.png',
    imageCurrent: '/maps/Mapa_Guarani_Depois.png',
    accent: '#065f46', color: '#6ee7b7'
  },
  {
    id: 'yanomami-map', type: 'map',
    name: 'Yanomami', location: 'Amazonas / Roraima',
    historical: 'Território Ancestral', current: 'Terra Demarcada',
    stats: { before: '420.000 km²', after: '96.650 km²', loss: '77%' },
    description: 'O maior povo em isolamento relativo da Amazônia. A invasão garimpeira entre 2019–2023 causou crise humanitária: crianças morrendo de desnutrição e malária.',
    imageHistorical: '/maps/Mapa_Yanomami_Antes.png',
    imageCurrent: '/maps/Mapa_Yanomami_Depois.png',
    accent: '#14532d', color: '#86efac'
  },
  {
    id: 'pataxo-map', type: 'map',
    name: 'Pataxó', location: 'Costa do Descobrimento, BA',
    historical: 'Território Ancestral', current: 'Reserva Homologada',
    stats: { before: '44.000 km²', after: '86 km²', loss: '99,8%' },
    description: 'Habitavam toda a costa do descobrimento — os primeiros a ver as caravelas em 1500. Hoje restam fragmentos de terra no sul da Bahia.',
    imageHistorical: '/maps/Mapa_Pataxo_Antes.png',
    imageCurrent: '/maps/Mapa_Pataxo_Depois.png',
    accent: '#7f1d1d', color: '#fca5a5'
  },
  {
    id: 'kayapo-map', type: 'map',
    name: 'Kayapó', location: 'Pará / Mato Grosso',
    historical: 'Território Ancestral', current: 'Terra Homologada',
    stats: { before: '600.000 km²', after: '114.000 km²', loss: '81%' },
    description: 'Em 1989, o cacique Raoni liderou mobilização global contra a Usina de Belo Monte — tornando-se símbolo da luta indígena. A floresta que protegem é visível do espaço.',
    imageHistorical: '/maps/Mapa_Kayapo_Antes.png',
    imageCurrent: '/maps/Mapa_Kayapo_Depois.png',
    accent: '#1e3a5f', color: '#93c5fd'
  },
  {
    id: 'munduruku-map', type: 'map',
    name: 'Munduruku', location: 'Rio Tapajós, PA',
    historical: 'Território Ancestral', current: 'Em Demarcação',
    stats: { before: '180.000 km²', after: '2.382 km²', loss: '98,7%' },
    description: 'Chamam o Rio Tapajós de "pai". A construção de hidrelétricas ameaça submergir territórios sagrados. Sua demarcação permanece travada há décadas.',
    imageHistorical: '/maps/Mapa_Munduruku_Antes.png',
    imageCurrent: '/maps/Mapa_Munduruku_Depois.png',
    accent: '#44403c', color: '#d6d3d1'
  },
  {
    id: 'xavante-map', type: 'map',
    name: 'Xavante', location: 'Mato Grosso',
    historical: 'Território Ancestral', current: 'Reserva Homologada',
    stats: { before: '380.000 km²', after: '328 km²', loss: '99,9%' },
    description: 'Resistiram ao contato com o homem branco até 1946. Hoje vivem ilhados no Cerrado, cercados por monoculturas de soja que avançam sobre seus limites.',
    imageHistorical: '/maps/Mapa_Xavante_Antes.png',
    imageCurrent: '/maps/Mapa_Xavante_Depois.png',
    accent: '#713f12', color: '#fcd34d'
  },
  {
    id: 'tupinamba-map', type: 'map',
    name: 'Tupinambá', location: 'Bahia / Maranhão',
    historical: 'Território Ancestral', current: 'Em Demarcação',
    stats: { before: '500.000 km²', after: '47 km²', loss: '99,9%' },
    description: 'O primeiro povo a ter contato com os portugueses em 1500. Deram origem à Língua Geral — falada em todo o Brasil colonial. Hoje lutam para existir.',
    imageHistorical: '/maps/Mapa_Tupinamba_Antes.png',
    imageCurrent: '/maps/Mapa_Tupinamba_Depois.png',
    accent: '#4a1942', color: '#e879f9'
  },
  {
    id: 'process', type: 'process',
    title: 'O Gesto do Apagamento', subtitle: 'Como acontece a demarcação?',
    steps: [
      { title: 'Identificação', desc: 'Estudos antropológicos e históricos conduzidos pela FUNAI.' },
      { title: 'Declaração', desc: 'Reconhecimento formal pelo Ministério da Justiça.' },
      { title: 'Homologação', desc: 'Decreto assinado pela Presidência da República.' },
      { title: 'Registro', desc: 'Escrituração em cartório e no patrimônio da União.' },
    ],
    image: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'conclusion', type: 'conclusion',
    title: 'Adiar o Fim do Mundo', subtitle: 'O que podemos fazer?',
    description: 'Este projeto é um convite à reflexão e à ação. Preservar as terras indígenas é preservar a vida e o futuro do planeta.',
    links: [
      { label: 'ISA — Instituto Socioambiental', url: 'https://www.socioambiental.org' },
      { label: 'FUNAI', url: 'https://www.gov.br/funai' },
      { label: 'Terras Indígenas no Brasil', url: 'https://terrasindigenas.org.br' },
    ]
  }
];

/* ─── Progress Bar ────────────────────────────────────────── */
function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex gap-[3px] px-3 pt-3">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="h-[3px] flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <motion.div
            className="h-full rounded-full bg-white"
            animate={{ width: i <= current ? '100%' : '0%', opacity: i === current ? 1 : 0.65 }}
            transition={{ duration: i === current ? 0.35 : 0, ease: 'easeOut' }}
          />
        </div>
      ))}
    </div>
  );
}

/* ─── Map Comparison Slider ──────────────────────────────── */
function MapCompare({ before, after, beforeLabel, afterLabel }: {
  before: string; after: string; beforeLabel: string; afterLabel: string;
}) {
  const [pct, setPct] = useState(62);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const calc = useCallback((clientX: number) => {
    if (!ref.current) return;
    const { left, width } = ref.current.getBoundingClientRect();
    setPct(Math.min(94, Math.max(6, ((clientX - left) / width) * 100)));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) calc(e.clientX); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [calc]);

  return (
    <div
      ref={ref}
      className="relative w-full h-full select-none overflow-hidden"
      style={{ touchAction: 'none' }}
      onMouseDown={(e) => { e.preventDefault(); dragging.current = true; }}
      onTouchStart={(e) => { dragging.current = true; e.stopPropagation(); }}
      onTouchMove={(e) => { if (dragging.current) { e.preventDefault(); e.stopPropagation(); calc(e.touches[0].clientX); } }}
      onTouchEnd={() => { dragging.current = false; }}
    >
      {/* BEFORE */}
      <img src={before} alt={beforeLabel} className="absolute inset-0 w-full h-full object-contain bg-zinc-900" loading="lazy" />
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.65)', color: '#fde68a' }}>{beforeLabel}</span>
      </div>

      {/* AFTER — clipped */}
      <div className="absolute inset-0 overflow-hidden" style={{ left: `${pct}%` }}>
        <div style={{ position: 'absolute', inset: 0, left: `-${pct}%`, width: '100%' }}>
          <img src={after} alt={afterLabel} className="absolute inset-0 w-full h-full object-contain bg-zinc-800" loading="lazy" />
        </div>
      </div>
      <div className="absolute top-3 right-3 z-10 pointer-events-none">
        <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.65)', color: '#fca5a5' }}>{afterLabel}</span>
      </div>

      {/* Divider */}
      <div className="absolute top-0 bottom-0 z-20 pointer-events-none" style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}>
        <div className="w-[2px] h-full" style={{ background: 'rgba(255,255,255,0.85)' }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-ew-resize pointer-events-auto shadow-xl"
          style={{ background: 'white', left: '50%' }}
          onMouseDown={(e) => { e.preventDefault(); dragging.current = true; }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M6 9L3 6M3 6L6 3M3 6H15M12 9L15 12M15 12L12 15M15 12H3" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Hint */}
      <motion.p
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono uppercase tracking-widest pointer-events-none whitespace-nowrap"
        style={{ color: 'rgba(255,255,255,0.5)' }}
        initial={{ opacity: 0.8 }}
        animate={{ opacity: [0.8, 0, 0.8] }}
        transition={{ duration: 2.5, repeat: 2, repeatDelay: 1 }}
      >
        ← arraste →
      </motion.p>
    </div>
  );
}

/* ─── Hero Slide ─────────────────────────────────────────── */
function HeroSlide({ item, isFirst }: { item: Extract<SlideData, { type: 'hero' }>; isFirst: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center overflow-hidden">
      <motion.div className="absolute inset-0" initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2, ease: 'easeOut' }}>
        <img src={item.image} alt="" className="w-full h-full object-cover" loading={isFirst ? 'eager' : 'lazy'} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.85) 100%)' }} />
      </motion.div>

      <motion.div
        className="relative z-10 px-6 space-y-4 max-w-xs mx-auto"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/45">{item.eyebrow}</p>
        <h2 className="text-5xl font-black leading-[0.88] tracking-tighter uppercase text-white">
          {item.title}<br />
          <span className="font-light italic text-white/35 text-[2.2rem] normal-case">{item.subtitle}</span>
        </h2>
        <p className="text-[15px] font-light italic text-white/70 leading-relaxed">{item.quote}</p>
        {item.description && (
          <p className="text-[11px] font-mono uppercase tracking-widest text-white/30">{item.description}</p>
        )}
      </motion.div>

      {isFirst && (
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0], opacity: [0.4, 0.6, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
        >
          <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.3)' }} />
          <p className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/35">toque para avançar</p>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Dashboard Slide ─────────────────────────────────────── */
function DashboardSlide({ item }: { item: Extract<SlideData, { type: 'dashboard' }> }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-center bg-zinc-950 px-5 py-16 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mb-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-2">{item.subtitle}</p>
        <h2 className="text-4xl font-black tracking-tighter text-white leading-tight">{item.title}</h2>
      </motion.div>

      <div className="grid grid-cols-2 gap-px" style={{ background: 'rgba(255,255,255,0.07)' }}>
        {item.stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            className="bg-black p-5"
          >
            <p className="text-[9px] font-mono uppercase tracking-widest text-white/30 mb-2">{stat.label}</p>
            <p className="text-4xl font-black tracking-tighter text-white">{stat.value}</p>
            <p className="text-[10px] text-white/30 mt-1">{stat.detail}</p>
          </motion.div>
        ))}
      </div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
        className="mt-5 text-sm text-white/40 italic leading-relaxed">
        {item.description}
      </motion.p>
    </div>
  );
}

/* ─── Bio Slide ───────────────────────────────────────────── */
function BioSlide({ item }: { item: Extract<SlideData, { type: 'bio' }> }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-zinc-950 overflow-hidden">
      <div className="relative flex-shrink-0" style={{ height: '52%' }}>
        <motion.img
          src={item.image} alt={item.name}
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(55%) brightness(0.62)' }}
          initial={{ scale: 1.06 }} animate={{ scale: 1 }}
          transition={{ duration: 1.8 }}
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 45%, #09090b 100%)' }} />
      </div>

      <motion.div
        className="flex-1 px-6 pb-20 pt-3 overflow-y-auto space-y-3"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30">O Pensamento</p>
        <h2 className="text-4xl font-black tracking-tighter text-white">{item.name}</h2>
        <p className="text-sm font-light italic text-white/50">{item.title}</p>
        <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
        <blockquote className="text-[15px] font-light italic text-white/75 border-l-2 border-white/18 pl-4 py-1">
          {item.quote}
        </blockquote>
      </motion.div>
    </div>
  );
}

/* ─── Map Slide ───────────────────────────────────────────── */
function MapSlide({ tribe }: { tribe: Extract<SlideData, { type: 'map' }> }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: '#050505' }}>
      {/* Map compare — top 52% */}
      <motion.div
        className="relative flex-shrink-0"
        style={{ height: '52%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <MapCompare
          before={tribe.imageHistorical}
          after={tribe.imageCurrent}
          beforeLabel={tribe.historical}
          afterLabel={tribe.current}
        />
      </motion.div>

      {/* Content — bottom 48% */}
      <motion.div
        className="flex-1 px-5 pt-4 pb-20 overflow-y-auto space-y-3"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.15 }}
      >
        <div>
          <p className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: tribe.color, opacity: 0.65 }}>
            Cartografia Crítica · {tribe.location}
          </p>
          <h2 className="text-4xl font-black tracking-tighter text-white leading-none">{tribe.name}</h2>
        </div>

        <p className="text-sm text-white/57 leading-relaxed">{tribe.description}</p>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div>
            <p className="text-[9px] font-mono uppercase text-white/28 mb-1">Original</p>
            <p className="text-sm font-bold text-white">{tribe.stats.before}</p>
          </div>
          <div>
            <p className="text-[9px] font-mono uppercase text-white/28 mb-1">Hoje</p>
            <p className="text-sm font-bold text-white">{tribe.stats.after}</p>
          </div>
          <div>
            <p className="text-[9px] font-mono uppercase text-white/28 mb-1">Perda</p>
            <p className="text-sm font-bold" style={{ color: '#f87171' }}>{tribe.stats.loss}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Process Slide ───────────────────────────────────────── */
function ProcessSlide({ item }: { item: Extract<SlideData, { type: 'process' }> }) {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <div className="relative flex-shrink-0" style={{ height: '32%' }}>
        <img src={item.image} alt="" className="w-full h-full object-cover brightness-50" loading="lazy" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 35%, white 100%)' }} />
      </div>

      <div className="flex-1 bg-white text-black px-6 pt-2 pb-20 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="space-y-5">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-black/30 mb-1">{item.subtitle}</p>
            <h2 className="text-3xl font-black tracking-tighter leading-tight">{item.title}</h2>
          </div>

          {item.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 + i * 0.1 }}
              className="flex gap-4 items-start"
            >
              <span className="text-3xl font-black text-black/8 leading-none pt-0.5 shrink-0 w-8">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-[15px] font-black uppercase tracking-tight">{step.title}</h3>
                <p className="text-sm text-black/50 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Conclusion Slide ────────────────────────────────────── */
function ConclusionSlide({ item }: { item: Extract<SlideData, { type: 'conclusion' }> }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-center px-6 py-20 overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(20,83,45,0.35) 0%, transparent 65%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
        className="relative z-10 space-y-6 max-w-xs mx-auto"
      >
        <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/30">{item.subtitle}</p>
        <h2 className="text-5xl font-black tracking-tighter uppercase leading-[0.85] text-white">{item.title}</h2>
        <p className="text-[15px] font-light italic text-white/55 leading-relaxed">{item.description}</p>

        <div className="flex flex-col gap-3 mt-4">
          {item.links.map((link, i) => (
            <motion.a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-[11px] font-mono uppercase tracking-widest py-3 px-4 rounded-full text-white/60 border transition-all active:scale-95 active:bg-white active:text-black"
              style={{ borderColor: 'rgba(255,255,255,0.14)' }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>
      </motion.div>

      <p className="absolute bottom-7 text-[9px] font-mono uppercase tracking-[0.5em] text-white/18">
        Varal de Mapas · 2026
      </p>
    </div>
  );
}

/* ─── App ────────────────────────────────────────────────── */
export default function App() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const touchX = useRef<number | null>(null);
  const touchY = useRef<number | null>(null);
  const lastNav = useRef(0);

  const go = useCallback((next: number) => {
    const now = Date.now();
    if (now - lastNav.current < 350) return;
    lastNav.current = now;
    if (next < 0 || next >= slides.length) return;
    setDir(next > current ? 1 : -1);
    setCurrent(next);
  }, [current]);

  const goPrev = useCallback(() => go(current - 1), [current, go]);
  const goNext = useCallback(() => go(current + 1), [current, go]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [goNext, goPrev]);

  useEffect(() => {
    let wt = 0;
    const fn = (e: WheelEvent) => {
      if (Date.now() - wt < 700) return;
      wt = Date.now();
      if (e.deltaY > 20) goNext(); else if (e.deltaY < -20) goPrev();
    };
    window.addEventListener('wheel', fn, { passive: true });
    return () => window.removeEventListener('wheel', fn);
  }, [goNext, goPrev]);

  const slide = slides[current];
  const isMap = slide.type === 'map';

  const variants = {
    enter: (d: number) => ({ y: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (d: number) => ({ y: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div
      className="fixed inset-0 bg-black text-white overflow-hidden"
      style={{ userSelect: 'none', WebkitTapHighlightColor: 'transparent' }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; touchY.current = e.touches[0].clientY; }}
      onTouchEnd={(e) => {
        if (!touchX.current || !touchY.current) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        const dy = e.changedTouches[0].clientY - touchY.current;
        if (!isMap && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 55) {
          if (dy < 0) goNext(); else goPrev();
        }
        touchX.current = null; touchY.current = null;
      }}
    >
      <ProgressBar current={current} total={slides.length} />

      {/* Branding */}
      <div className="fixed top-8 left-4 z-50 mix-blend-difference pointer-events-none">
        <p className="text-[11px] font-black tracking-tighter uppercase text-white opacity-75">Varal de Mapas</p>
      </div>

      {/* Counter */}
      <div className="fixed top-8 right-4 z-50 pointer-events-none">
        <p className="text-[10px] font-mono text-white/25">{current + 1} / {slides.length}</p>
      </div>

      {/* Slides */}
      <AnimatePresence custom={dir} initial={false}>
        <motion.div
          key={slide.id}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          {/* Instagram-style tap zones (not on map slides — map has its own touch handling) */}
          {!isMap && (
            <>
              <div className="absolute inset-y-0 left-0 w-1/3 z-40" onClick={goPrev} />
              <div className="absolute inset-y-0 right-0 w-2/3 z-40" onClick={goNext} />
            </>
          )}
          {/* Map slides: tap zones only in the bottom text area */}
          {isMap && (
            <>
              <div className="absolute bottom-0 left-0 right-0 z-40" style={{ height: '48%' }} onClick={goNext} />
            </>
          )}

          {slide.type === 'hero'       && <HeroSlide      item={slide} isFirst={current === 0} />}
          {slide.type === 'dashboard'  && <DashboardSlide item={slide} />}
          {slide.type === 'bio'        && <BioSlide       item={slide} />}
          {slide.type === 'map'        && <MapSlide       tribe={slide} />}
          {slide.type === 'process'    && <ProcessSlide   item={slide} />}
          {slide.type === 'conclusion' && <ConclusionSlide item={slide} />}
        </motion.div>
      </AnimatePresence>

      {/* Bottom nav */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        {current > 0 && (
          <button
            onClick={goPrev}
            className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
            aria-label="Anterior"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 11L7 3M7 3L4 6M7 3L10 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="rounded-full transition-all duration-300 active:scale-90"
              style={{
                width: i === current ? 18 : 5,
                height: 5,
                background: i === current ? 'white' : 'rgba(255,255,255,0.28)',
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {current < slides.length - 1 && (
          <button
            onClick={goNext}
            className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
            aria-label="Próximo"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 3L7 11M7 11L4 8M7 11L10 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
