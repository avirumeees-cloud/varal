import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface TribeStats {
  before: string;
  after: string;
  loss: string;
}

interface BaseSlide {
  id: string;
  type: string;
}

interface HeroSlideData extends BaseSlide {
  type: 'hero';
  title: string;
  subtitle: string;
  eyebrow: string;
  quote: string;
  image: string;
  description?: string;
}

interface DashboardStat {
  label: string;
  value: string;
  detail: string;
}

interface ProcessStep {
  title: string;
  desc: string;
}

interface MaterialItem {
  title: string;
  desc: string;
}

interface ConclusionLink {
  label: string;
  url: string;
}

interface DashboardSlideData extends BaseSlide {
  type: 'dashboard';
  title: string;
  subtitle: string;
  stats: DashboardStat[];
  description: string;
}

interface BioSlideData extends BaseSlide {
  type: 'bio';
  title: string;
  name: string;
  description: string;
  image: string;
  quote: string;
}

interface MapSlideData extends BaseSlide {
  type: 'map';
  name: string;
  location: string;
  historical: string;
  current: string;
  stats: TribeStats;
  description: string;
  imageHistorical: string;
  imageCurrent: string;
  accent: string;
}

interface ProcessSlideData extends BaseSlide {
  type: 'process';
  title: string;
  subtitle: string;
  steps: ProcessStep[];
  image: string;
}

interface MaterialsSlideData extends BaseSlide {
  type: 'materials';
  title: string;
  subtitle: string;
  items: MaterialItem[];
  image: string;
}

interface ConclusionSlideData extends BaseSlide {
  type: 'conclusion';
  title: string;
  subtitle: string;
  description: string;
  links: ConclusionLink[];
}

type SlideData = 
  | HeroSlideData 
  | DashboardSlideData 
  | BioSlideData 
  | MapSlideData 
  | ProcessSlideData 
  | MaterialsSlideData 
  | ConclusionSlideData;

const tribes: SlideData[] = [
  {
    id: 'intro',
    type: 'hero',
    title: 'Varal de Mapas',
    subtitle: 'Indígenas',
    eyebrow: 'Uma Instalação Visual e Interativa',
    quote: '"O espectador não lê sobre a perda — ele a experimenta."',
    image: 'https://images.unsplash.com/photo-1501491505116-440d1e5621d9?auto=format&fit=crop&q=80&w=2000',
    description: 'Um projeto interdisciplinar baseado na obra de Ailton Krenak.'
  },
  {
    id: 'global-status',
    type: 'dashboard',
    title: 'O Placar da Terra',
    subtitle: 'Situação das Terras Indígenas no Brasil',
    stats: [
      { label: 'Total de Terras', value: '829', detail: 'Em diferentes fases' },
      { label: 'Homologadas', value: '539', detail: 'Regularizadas' },
      { label: 'Em Identificação', value: '163', detail: 'Em estudo pela FUNAI' },
      { label: 'Declaradas', value: '71', detail: 'Pelo Min. da Justiça' },
      { label: 'Identificadas', value: '41', detail: 'Relatório aprovado' },
      { label: 'Encaminhadas RI', value: '15', detail: 'Reservas Indígenas' }
    ],
    description: 'A demarcação é um processo longo e tortuoso. Cada número aqui representa uma luta secular pela sobrevivência e pelo reconhecimento jurídico do território.'
  },
  {
    id: 'krenak-bio',
    type: 'bio',
    name: 'Ailton Krenak',
    title: 'Ideias para Adiar o Fim do Mundo',
    description: 'Líder indígena, escritor e filósofo. Sua obra questiona o conceito colonial de progresso e denuncia o apagamento sistemático dos povos originários.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
    quote: '"A terra não é um recurso, é nossa própria extensão."'
  },
  {
    id: 'environment',
    type: 'hero',
    title: 'Escudos da Vida',
    subtitle: 'Proteção Ambiental',
    eyebrow: 'O Impacto Ecológico',
    quote: '"Terras Indígenas são as áreas mais conservadas do Brasil."',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2000',
    description: 'A demarcação não é apenas um direito humano, é uma estratégia vital para o equilíbrio climático do planeta.'
  },
  {
    id: 'krenak-map',
    type: 'map',
    name: 'Krenak',
    location: 'Vale do Rio Doce, MG',
    historical: 'Território Ancestral',
    current: 'Reserva Homologada',
    stats: { before: '148.000 km²', after: '40 km²', loss: '99.9%' },
    description: 'O povo Krenak viveu às margens do Rio Doce por milênios. Após séculos de pressão, resta uma reserva mínima.',
    imageHistorical: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200',
    imageCurrent: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=1200',
    accent: 'bg-amber-700'
  },
  {
    id: 'guarani-map',
    type: 'map',
    name: 'Guarani Kaiowá',
    location: 'Cone Sul, MS',
    historical: 'Território Ancestral',
    current: 'Reserva Homologada',
    stats: { before: '350.000 km²', after: '480 km²', loss: '99.8%' },
    description: 'Ocuparam o cone sul do Mato Grosso do Sul por séculos. Hoje enfrentam constantes conflitos fundiários.',
    imageHistorical: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1200',
    imageCurrent: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=1200',
    accent: 'bg-emerald-800'
  },
  {
    id: 'yanomami-map',
    type: 'map',
    name: 'Yanomami',
    location: 'Amazonas / Roraima',
    historical: 'Território Ancestral',
    current: 'Terra Demarcada',
    stats: { before: '420.000 km²', after: '96.650 km²', loss: '77%' },
    description: 'O maior povo indígena em isolamento relativo da Amazônia. A invasão garimpeira ameaça sua existência.',
    imageHistorical: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1200',
    imageCurrent: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
    accent: 'bg-green-900'
  },
  {
    id: 'pataxo-map',
    type: 'map',
    name: 'Pataxó',
    location: 'Costa do Descobrimento, BA',
    historical: 'Território Ancestral',
    current: 'Reserva Homologada',
    stats: { before: '44.000 km²', after: '86 km²', loss: '99.8%' },
    description: 'Habitavam toda a costa do descobrimento. Hoje restam fragmentos de terra no sul da Bahia.',
    imageHistorical: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?auto=format&fit=crop&q=80&w=1200',
    imageCurrent: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=1200',
    accent: 'bg-red-800'
  },
  {
    id: 'process',
    type: 'process',
    title: 'O Gesto do Apagamento',
    subtitle: 'Como acontece a demarcação?',
    steps: [
      { title: 'Identificação', desc: 'Estudos antropológicos e históricos.' },
      { title: 'Declaração', desc: 'Reconhecimento pelo Ministério da Justiça.' },
      { title: 'Homologação', desc: 'Decreto assinado pela Presidência.' },
      { title: 'Registro', desc: 'Escrituração em cartório e na União.' }
    ],
    image: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'materials',
    type: 'materials',
    title: 'A Matéria da Luta',
    subtitle: 'Sustentabilidade e Gesto',
    items: [
      { title: 'PVC e PET', desc: 'Estrutura de baixo custo e reaproveitada.' },
      { title: 'Areia e Terra', desc: 'O peso da realidade sobre a base.' },
      { title: 'O Varal', desc: 'A instabilidade que simboliza a resistência.' }
    ],
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'conclusion',
    type: 'conclusion',
    title: 'Adiar o Fim do Mundo',
    subtitle: 'O que podemos fazer?',
    description: 'Este projeto é um convite à reflexão e à ação. A preservação das terras indígenas é a preservação da vida e do futuro do planeta.',
    links: [
      { label: 'ISA - Instituto Socioambiental', url: 'https://www.socioambiental.org' },
      { label: 'FUNAI', url: 'https://www.gov.br/funai' },
      { label: 'Terras Indígenas no Brasil', url: 'https://terrasindigenas.org.br' }
    ]
  }
];

function ProgressIndicator({ current, total }: { current: number, total: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex gap-1.5 p-3" role="progressbar" aria-valuenow={current} aria-valuemax={total - 1}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div 
            className={`h-full bg-white ${i === current ? 'opacity-100' : 'opacity-40'}`}
            animate={{ 
              width: i <= current ? '100%' : '0%',
              backgroundColor: i === current ? '#ffffff' : '#ffffff66'
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            aria-current={i === current ? 'step' : undefined}
          />
        </div>
      ))}
    </div>
  );
}

const slideVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

function HeroSlide({ item, active, index }: { item: HeroSlideData, active: boolean, index: number }) {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 1.1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 -z-10"
      >
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover brightness-50" 
          referrerPolicy="no-referrer"
          loading={index === 0 ? "eager" : "lazy"}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      </motion.div>
      
      <motion.div
        variants={slideVariants}
        initial="hidden"
        animate={active ? "visible" : "hidden"}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="space-y-6 md:space-y-8"
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.6em] opacity-50">{item.eyebrow}</span>
        <h2 className="text-4xl md:text-8xl lg:text-[12rem] font-bold leading-tight lg:leading-[0.8] tracking-tighter uppercase">
          {item.title} <br />
          <span className="font-display italic font-light text-white/30 lowercase">{item.subtitle}</span>
        </h2>
        <p className="text-lg md:text-xl lg:text-2xl font-display italic opacity-70 max-w-2xl mx-auto px-4">
          {item.quote}
        </p>
        {item.description && (
          <p className="text-sm md:text-base opacity-40 max-w-md mx-auto mt-4 font-mono uppercase tracking-widest">
            {item.description}
          </p>
        )}
      </motion.div>
      
      {index === 0 && (
        <motion.div 
          animate={{ y: [0, 10, 0], opacity: active ? 1 : 0 }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="w-px h-8 md:h-12 bg-white/20" />
          <span className="text-[10px] font-mono uppercase tracking-widest opacity-30">Role para iniciar</span>
        </motion.div>
      )}
    </div>
  );
}

function BioSlide({ item, active, index }: { item: BioSlideData, active: boolean, index: number }) {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-6 md:p-24 bg-zinc-950">
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 md:gap-24 items-center py-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: active ? 1 : 0, x: active ? 0 : -50 }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[3/4] w-full max-w-sm mx-auto rounded-sm overflow-hidden shadow-2xl order-2 md:order-1"
        >
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover grayscale brightness-75" 
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-stone-900/20 mix-blend-overlay" />
        </motion.div>
        
        <motion.div 
          variants={slideVariants}
          initial="hidden"
          animate={active ? "visible" : "hidden"}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8 md:space-y-12 order-1 md:order-2"
        >
          <div className="space-y-4 md:space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">O Pensamento</span>
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold leading-tight">{item.name}</h2>
            <p className="text-lg md:text-2xl font-display italic text-white/60">{item.title}</p>
          </div>
          <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-lg">
            {item.description}
          </p>
          <blockquote className="text-lg md:text-2xl font-display italic border-l-2 border-white/20 pl-6 md:pl-8 py-2">
            {item.quote}
          </blockquote>
        </motion.div>
      </div>
    </div>
  );
}

function MapSlide({ tribe, active, index }: { tribe: MapSlideData, active: boolean, index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (!active) setIsFlipped(false);
  }, [active]);

  return (
    <div className="relative w-full min-h-[100dvh] flex items-center justify-center p-6 md:p-12 overflow-hidden">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 md:gap-12 items-center py-12">
        <div className="space-y-6 md:space-y-8 z-10 order-2 lg:order-1">
          <motion.div
            variants={slideVariants}
            initial="hidden"
            animate={active ? "visible" : "hidden"}
            transition={{ delay: 0.1 }}
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">Cartografia Crítica</span>
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white leading-tight mt-4">{tribe.name}</h2>
            <p className="text-base md:text-xl font-display italic text-white/60 mt-4 md:mt-6">{tribe.location}</p>
          </motion.div>

          <motion.p 
            variants={slideVariants}
            initial="hidden"
            animate={active ? "visible" : "hidden"}
            transition={{ delay: 0.3 }}
            className="text-white/70 text-base md:text-lg leading-relaxed max-w-md"
          >
            {tribe.description}
          </motion.p>

          <motion.div 
            variants={slideVariants}
            initial="hidden"
            animate={active ? "visible" : "hidden"}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4 md:gap-8 pt-6 md:pt-8 border-t border-white/10"
          >
            <div>
              <p className="text-[10px] font-mono uppercase text-white/30">Original</p>
              <p className="text-lg md:text-xl font-bold text-white">{tribe.stats.before}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-white/30">Perda</p>
              <p className="text-lg md:text-xl font-bold text-red-500">{tribe.stats.loss}</p>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 1 : 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFlipped(!isFlipped)}
            aria-label={isFlipped ? 'Ver mapa ancestral' : 'Ver mapa atual'}
            className={`flex items-center gap-4 px-6 md:px-8 py-3 md:py-4 rounded-full text-xs md:text-sm font-mono uppercase tracking-widest font-bold shadow-2xl transition-colors ${tribe.accent} text-white hover:brightness-110`}
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-700 ${isFlipped ? 'rotate-180' : ''}`} />
            {isFlipped ? 'Ver Ancestral' : 'Ver Agora'}
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.9 }}
          className="relative aspect-square w-full max-w-sm md:max-w-md lg:max-w-none mx-auto perspective-2000 order-1 lg:order-2"
        >
          <motion.div 
            className="w-full h-full relative preserve-3d"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-white p-4 shadow-2xl rounded-sm">
              <img src={tribe.imageHistorical} alt={`Mapa ancestral de ${tribe.name}`} className="w-full h-full object-cover grayscale brightness-75" referrerPolicy="no-referrer" loading="lazy" />
              <div className="absolute inset-0 bg-amber-900/20 mix-blend-multiply" />
              <div className="absolute top-8 left-8 right-8 text-black">
                <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">Lado A</span>
                <h3 className="text-2xl font-bold uppercase tracking-tighter">{tribe.historical}</h3>
              </div>
            </div>
            {/* Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-zinc-900 p-4 shadow-2xl rounded-sm">
              <img src={tribe.imageCurrent} alt={`Mapa atual de ${tribe.name}`} className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" loading="lazy" />
              <div className="absolute inset-0 border-[20px] border-red-900/40 m-4 pointer-events-none" />
              <div className="absolute top-8 left-8 right-8 text-white">
                <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">Lado B</span>
                <h3 className="text-2xl font-bold uppercase tracking-tighter">{tribe.current}</h3>
                <p className="text-xs mt-2 opacity-60">{tribe.stats.after}</p>
              </div>
            </div>
          </motion.div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        </motion.div>
      </div>

      {/* Background Parallax Image */}
      <motion.div 
        className="absolute inset-0 -z-10 opacity-20 scale-110"
        animate={{ x: active ? [-20, 20] : 0, opacity: active ? 0.2 : 0 }}
        transition={{ duration: 20, repeat: active ? Infinity : 0, repeatType: 'reverse' }}
      >
        <img src={tribe.imageHistorical} alt="" className="w-full h-full object-cover blur-md" referrerPolicy="no-referrer" loading="lazy" />
      </motion.div>
    </div>
  );
}

function DashboardSlide({ item, active, index }: { item: DashboardSlideData, active: boolean, index: number }) {
  return (
    <div className="relative w-full min-h-[100dvh] flex items-center justify-center p-6 md:p-12 bg-zinc-950">
      <div className="max-w-6xl w-full z-10 py-12">
        <motion.div
          variants={slideVariants}
          initial="hidden"
          animate={active ? "visible" : "hidden"}
          className="mb-8 md:mb-16"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">{item.subtitle}</span>
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white mt-4">{item.title}</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {item.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-black p-6 md:p-12 group hover:bg-white hover:text-black active:bg-white active:text-black transition-colors duration-500"
            >
              <p className="text-[10px] font-mono uppercase tracking-widest opacity-40 group-hover:opacity-100 mb-4">{stat.label}</p>
              <p className="text-3xl md:text-5xl lg:text-7xl font-bold mb-2 tracking-tighter">{stat.value}</p>
              <p className="text-[10px] md:text-xs opacity-40 group-hover:opacity-60">{stat.detail}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          variants={slideVariants}
          initial="hidden"
          animate={active ? "visible" : "hidden"}
          transition={{ delay: 0.5 }}
          className="mt-8 md:mt-12 text-white/50 text-base md:text-lg max-w-2xl font-display italic"
        >
          {item.description}
        </motion.p>
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  );
}

function ProcessSlide({ item, active, index }: { item: ProcessSlideData, active: boolean, index: number }) {
  return (
    <div className="relative w-full min-h-[100dvh] flex items-center justify-center p-6 md:p-12 bg-white text-black">
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-8 lg:gap-24 items-center z-10 py-12">
        <div className="space-y-6 md:space-y-12">
          <motion.div
            variants={slideVariants}
            initial="hidden"
            animate={active ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-black/40">{item.subtitle}</span>
            <h2 className="text-3xl md:text-6xl lg:text-8xl font-bold leading-tight mt-2 md:mt-4">{item.title}</h2>
          </motion.div>

          <div className="space-y-4 md:space-y-8">
            {item.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: active ? 1 : 0, x: active ? 0 : -20 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex gap-4 md:gap-8 items-start group"
              >
                <span className="text-xl md:text-4xl font-bold opacity-10 group-hover:opacity-100 transition-opacity">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-base md:text-xl font-bold uppercase tracking-tight">{step.title}</h3>
                  <p className="text-xs md:text-base text-black/60">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.9 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-2xl mt-8 lg:mt-0"
        >
          <img src={item.image} alt="Processo de demarcação" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
          <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
        </motion.div>
      </div>
      
      {/* Decorative vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/5 -translate-x-1/2 hidden lg:block" />
    </div>
  );
}

function MaterialsSlide({ item, active, index }: { item: MaterialsSlideData, active: boolean, index: number }) {
  return (
    <div className="relative w-full min-h-[100dvh] flex items-center justify-center p-6 md:p-12 bg-zinc-900">
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-8 lg:gap-24 items-center z-10 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 1.1 }}
          transition={{ duration: 1 }}
          className="relative aspect-square rounded-full overflow-hidden border-4 md:border-8 border-white/5 shadow-2xl max-w-[280px] md:max-w-none mx-auto"
        >
          <img src={item.image} alt="Materiais da instalação" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" loading="lazy" />
          <div className="absolute inset-0 bg-amber-900/20 mix-blend-multiply" />
        </motion.div>

        <div className="space-y-6 md:space-y-12">
          <motion.div
            variants={slideVariants}
            initial="hidden"
            animate={active ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">{item.subtitle}</span>
            <h2 className="text-3xl md:text-6xl lg:text-8xl font-bold text-white mt-2 md:mt-4">{item.title}</h2>
          </motion.div>

          <div className="grid gap-3 md:gap-8">
            {item.items.map((mat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: active ? 1 : 0, x: active ? 0 : 20 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="p-3 md:p-6 border-l-2 border-white/10 hover:border-white transition-colors group"
              >
                <h3 className="text-base md:text-xl font-bold text-white group-hover:text-amber-500 transition-colors uppercase tracking-tight">{mat.title}</h3>
                <p className="text-xs md:text-base text-white/50 mt-1 md:mt-2">{mat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConclusionSlide({ item, active, index }: { item: ConclusionSlideData, active: boolean, index: number }) {
  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center p-6 md:p-12 bg-black text-center">
      <div className="max-w-4xl z-10 py-12">
        <motion.div
          variants={slideVariants}
          initial="hidden"
          animate={active ? "visible" : "hidden"}
          transition={{ duration: 1 }}
          className="space-y-6 md:space-y-8"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-white/40">{item.subtitle}</span>
          <h2 className="text-5xl md:text-6xl lg:text-[10rem] font-bold leading-tight lg:leading-[0.8] tracking-tighter uppercase text-white">
            {item.title}
          </h2>
          <p className="text-lg md:text-2xl lg:text-3xl font-display italic text-white/70 max-w-2xl mx-auto leading-relaxed">
            {item.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 md:mt-24 flex flex-wrap justify-center gap-4 md:gap-8"
        >
          {item.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] md:text-sm font-mono uppercase tracking-widest border border-white/20 px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-white hover:text-black active:bg-white active:text-black transition-all"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20 text-[10px] font-mono uppercase tracking-[0.5em]">
        Varal de Mapas · 2026
      </div>
      
      {/* Background atmosphere */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-green-950 to-transparent" />
      </div>
    </div>
  );
}

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const options = {
      root: containerRef.current,
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = slideRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) {
            setCurrentSlide(index);
          }
        }
      });
    }, options);

    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') goToSlide('down');
      if (e.key === 'ArrowUp') goToSlide('up');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentSlide]);

  const goToSlide = (direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentSlide - 1 : currentSlide + 1;
    if (targetIndex >= 0 && targetIndex < tribes.length) {
      slideRefs.current[targetIndex]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart.current - touchEnd;

    if (Math.abs(diff) > 50) {
      goToSlide(diff > 0 ? 'down' : 'up');
    }
    touchStart.current = null;
  };

  return (
    <div 
      className="h-[100dvh] bg-black text-white selection:bg-white selection:text-black overflow-hidden" 
      role="main"
    >
      <ProgressIndicator current={currentSlide} total={tribes.length} />
      
      {/* Navigation Overlay */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-4">
        <button 
          onClick={() => goToSlide('up')}
          aria-label="Slide anterior"
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/40 hover:bg-white hover:text-black active:bg-white active:text-black transition-all backdrop-blur-md disabled:opacity-20 disabled:cursor-not-allowed"
          disabled={currentSlide === 0}
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <button 
          onClick={() => goToSlide('down')}
          aria-label="Próximo slide"
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/40 hover:bg-white hover:text-black active:bg-white active:text-black transition-all backdrop-blur-md disabled:opacity-20 disabled:cursor-not-allowed"
          disabled={currentSlide === tribes.length - 1}
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Branding */}
      <div className="fixed top-8 left-8 z-50 mix-blend-difference">
        <h1 className="text-xl font-bold tracking-tighter uppercase">Varal de Mapas</h1>
      </div>

      {/* Main Content */}
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory no-scrollbar scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {tribes.map((item, i) => (
          <div 
            key={item.id} 
            ref={el => slideRefs.current[i] = el}
            className="min-h-full w-full snap-start relative"
          >
            {item.type === 'hero' && (
              <HeroSlide item={item} active={currentSlide === i} index={i} />
            )}

            {item.type === 'dashboard' && (
              <DashboardSlide item={item} active={currentSlide === i} index={i} />
            )}

            {item.type === 'bio' && (
              <BioSlide item={item} active={currentSlide === i} index={i} />
            )}

            {item.type === 'map' && (
              <MapSlide tribe={item} active={currentSlide === i} index={i} />
            )}

            {item.type === 'process' && (
              <ProcessSlide item={item} active={currentSlide === i} index={i} />
            )}

            {item.type === 'materials' && (
              <MaterialsSlide item={item} active={currentSlide === i} index={i} />
            )}

            {item.type === 'conclusion' && (
              <ConclusionSlide item={item} active={currentSlide === i} index={i} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
