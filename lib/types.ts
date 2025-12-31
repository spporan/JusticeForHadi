export interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  opacity: number;
  textShadow: number;
  textAlign: 'left' | 'center' | 'right';
  isFooter?: boolean;
}

export interface PresetImage {
  id: string;
  name: string;
  url: string;
}

export interface PresetQuote {
  id: string;
  text: string;
  category: string;
}

export interface TimeElapsed {
  days: number;
  hours: number;
  minutes: number;
}
