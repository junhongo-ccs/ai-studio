export type AreaId = 'shinagawa' | 'oimachi' | 'shiba-park' | 'odaiba';

export interface AreaData {
  id: AreaId;
  name: string;
  summary: string;
  accentColor: string;
  fillColor: string;
  strokeColor: string;
  points: string; // SVG points
  labelPos: { x: number; y: number };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
