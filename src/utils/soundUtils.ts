import { Howl } from 'howler';

const soundCache: { [key: string]: Howl } = {};

export const playSoundEffect = (name: string, src: string, volume = 0.5): void => {
  if (!soundCache[name]) {
    soundCache[name] = new Howl({
      src: [src],
      volume,
      preload: true
    });
  }
  soundCache[name].play();
};

export const stopAllSounds = (): void => {
  Object.values(soundCache).forEach(sound => sound.stop());
};

export const cleanupSounds = (): void => {
  Object.values(soundCache).forEach(sound => sound.unload());
  Object.keys(soundCache).forEach(key => delete soundCache[key]);
};