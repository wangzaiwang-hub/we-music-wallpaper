export type Wallpaper = {
  id: number;
  name: string;
  url: string;
  thumbnail: string;
  isDynamic: boolean;
  aspectRatio: "16:9" | "4:3";
};

export type AudioTrack = {
  id: number;
  name: string;
  audioSrc: string;
  icon?: string;
  volume?: number;
};

export type Song = {
  id: string;
  name: string;
  artist?: string;
  url: string;
  duration: number;
};

export type PlaybackMode = 'repeat-one' | 'sequence' | 'shuffle';