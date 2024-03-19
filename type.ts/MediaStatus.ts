export interface IMediaStatus {
  currentSrc: string;
  currentTime: number;
  muted: boolean;
  played: boolean;
  looped: boolean;
  pause: boolean;
  volume: number;
}
