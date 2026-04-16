import { AreaData } from './types';

export const AREAS: Record<string, AreaData> = {
  shinagawa: {
    id: 'shinagawa',
    name: '品川',
    summary: '交通の要所であり、近代的なビル群と歴史的な雰囲気が共存するエリアです。',
    accentColor: 'cyan',
    fillColor: '#67e8f9',
    strokeColor: '#06b6d4',
    points: '150,420 230,410 250,500 160,520',
    labelPos: { x: 160, y: 445 }
  },
  oimachi: {
    id: 'oimachi',
    name: '大井町',
    summary: '親しみやすい商店街や飲食店が多く、地元の活気を感じられるエリアです。',
    accentColor: 'emerald',
    fillColor: '#6ee7b7',
    strokeColor: '#10b981',
    points: '120,580 200,570 190,650 110,660',
    labelPos: { x: 120, y: 595 }
  },
  'shiba-park': {
    id: 'shiba-park',
    name: '芝公園・東京タワー',
    summary: '東京タワーを間近に望み、緑豊かな公園と歴史ある寺院が点在するエリアです。',
    accentColor: 'amber',
    fillColor: '#fcd34d',
    strokeColor: '#f59e0b',
    points: '180,250 260,240 280,320 200,340',
    labelPos: { x: 190, y: 270 }
  },
  odaiba: {
    id: 'odaiba',
    name: 'お台場',
    summary: '広大な敷地に商業施設や公園、ミュージアムが点在する、開放的なベイエリアです。',
    accentColor: 'fuchsia',
    fillColor: '#f9a8d4',
    strokeColor: '#f43f5e',
    points: '280,480 360,460 380,550 300,580',
    labelPos: { x: 290, y: 505 }
  }
};

export const INITIAL_ASSISTANT_MESSAGE = "エリアを選ぶと、GISで見た施設分布や集積傾向をもとに特徴を整理できます。まずはこのエリアの特徴や違いを聞いてみてください。";
