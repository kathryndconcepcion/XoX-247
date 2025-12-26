
export enum BannerStyle {
  CYBER = 'CYBER',
  MINIMAL = 'MINIMAL',
  LUXURY = 'LUXURY',
  CARTOON = 'CARTOON'
}

export interface BannerConfig {
  id: string;
  style: BannerStyle;
  title: string;
  description: string;
}

export interface GeneratedBanner {
  configId: string;
  imageUrl: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
}
