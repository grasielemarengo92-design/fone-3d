// Todo o texto e conteúdo estruturado do site fica centralizado aqui,
// separado dos componentes visuais, para facilitar edição e localização.

export const brand = {
  name: 'Auravox',
  tagline: 'Som. Tecnologia. Redefinidos.',
  legalNote:
    'Conceito de demonstração não oficial, sem vínculo com a Apple. Nenhuma especificação técnica real é reivindicada.',
};

export const nav = [
  { label: 'Início', href: '#hero' },
  { label: 'Produto', href: '#produto' },
  { label: 'Tecnologia', href: '#tecnologia' },
  { label: 'Experiência', href: '#experiencia' },
  { label: 'Especificações', href: '#especificacoes' },
  { label: 'Comprar', href: '#comprar' },
];

export const hero = {
  eyebrow: 'Conceito',
  title: 'Auravox',
  subtitle: 'Som. Tecnologia. Redefinidos.',
  hint: 'Explore em 3D',
};

export const interactionHints = {
  desktop: {
    drag: 'Arraste para girar',
    scroll: 'Role para explorar',
    exploreCta: 'Explorar desmontagem',
  },
  touch: {
    drag: 'Arraste para girar',
    swipeUp: 'Deslize para explorar',
    pinch: 'Pinça para aproximar',
  },
};

export const cursorLabels = {
  drag: 'ARRASTAR',
  explore: 'EXPLORAR',
  open: 'ABRIR',
};

// As 8 peças animáveis da vista explodida, na ordem em que se separam.
// `order` controla o atraso relativo de cada peça na cascata de desmontagem.
export type PartId =
  | 'shell'
  | 'board'
  | 'battery'
  | 'chip'
  | 'sensors'
  | 'mics'
  | 'driver'
  | 'antenna';

export interface PartInfo {
  id: PartId;
  order: number;
  label: string;
  description: string;
  /** Seção em que esta peça recebe destaque (spotlight) na vista explodida. */
  spotlightSection?: 'audio' | 'battery' | 'connectivity';
}

export const parts: PartInfo[] = [
  {
    id: 'shell',
    order: 0,
    label: 'Acabamento externo',
    description:
      'Carcaça externa em concept design, pensada para equilibrar leveza e resistência ao toque diário.',
  },
  {
    id: 'driver',
    order: 1,
    label: 'Driver',
    description: 'Projetado para entregar áudio detalhado e resposta equilibrada.',
    spotlightSection: 'audio',
  },
  {
    id: 'mics',
    order: 2,
    label: 'Microfones',
    description: 'Microfones direcionais ajudam a captar a voz com clareza.',
    spotlightSection: 'audio',
  },
  {
    id: 'battery',
    order: 3,
    label: 'Bateria',
    description: 'Alta densidade energética para oferecer autonomia durante todo o dia.',
    spotlightSection: 'battery',
  },
  {
    id: 'board',
    order: 4,
    label: 'Placa eletrônica',
    description:
      'Concentra os circuitos que conectam sensores, áudio e conectividade em um espaço mínimo.',
  },
  {
    id: 'chip',
    order: 5,
    label: 'Chip',
    description: 'Processamento avançado para áudio, conectividade e recursos inteligentes.',
  },
  {
    id: 'sensors',
    order: 6,
    label: 'Sensores',
    description: 'Detectam movimentos e interações para tornar a experiência mais intuitiva.',
  },
  {
    id: 'antenna',
    order: 7,
    label: 'Antena',
    description: 'Estrutura conceitual de antena para conectividade sem fio de curto alcance.',
    spotlightSection: 'connectivity',
  },
];

export const technologies = [
  {
    id: 'spatial-audio',
    title: 'Áudio espacial',
    description: 'Som posicional que se adapta ao movimento da cabeça, criando profundidade.',
  },
  {
    id: 'noise-cancelling',
    title: 'Cancelamento de ruído',
    description: 'Reduz sons externos indesejados para manter o foco no que importa.',
  },
  {
    id: 'smart-mics',
    title: 'Microfones inteligentes',
    description: 'Isolam a voz mesmo em ambientes com ruído de fundo.',
  },
  {
    id: 'wear-detection',
    title: 'Detecção de uso',
    description: 'Identifica quando o fone é colocado ou removido do ouvido.',
  },
  {
    id: 'bluetooth',
    title: 'Conectividade Bluetooth',
    description: 'Pareamento rápido e estável com múltiplos dispositivos.',
  },
  {
    id: 'battery-tech',
    title: 'Bateria',
    description: 'Gestão de energia pensada para uso contínuo ao longo do dia.',
  },
  {
    id: 'sensors-tech',
    title: 'Sensores',
    description: 'Reconhecem toques e gestos para controle sem precisar do celular.',
  },
  {
    id: 'audio-processing',
    title: 'Processamento de áudio',
    description: 'Ajusta o som em tempo real conforme o conteúdo reproduzido.',
  },
];

export const howItWorks = [
  { id: 'input', label: 'Som entrando' },
  { id: 'mics', label: 'Microfones captando' },
  { id: 'processing', label: 'Processamento' },
  { id: 'anc', label: 'Cancelamento de ruído' },
  { id: 'driver', label: 'Driver reproduzindo' },
  { id: 'output', label: 'Som chegando ao ouvido' },
];

export const audioSection = {
  title: 'Som que envolve você.',
  subtitle: 'Uma experiência sonora criada para acompanhar cada momento.',
};

export const batterySection = {
  title: 'Energia para acompanhar seu dia.',
  note: 'Representação conceitual — sem números oficiais de autonomia.',
};

export const connectivitySection = {
  title: 'Conectado ao que importa.',
  subtitle: 'Transições suaves entre os dispositivos do seu dia a dia.',
  devices: ['Smartphone', 'Notebook', 'Tablet', 'Smartwatch'],
};

export const disassemblySection = {
  title: 'Veja o que existe por dentro.',
  hint: 'Arraste para explorar',
};

export const reassemblySection = {
  finalLine: 'Feito para desaparecer no som.',
};

export const loadingScreen = {
  message: 'Preparing the experience...',
};

export const accessibility = {
  reduceMotionLabel: 'Reduzir animações',
  skipToContent: 'Pular para o conteúdo',
};
