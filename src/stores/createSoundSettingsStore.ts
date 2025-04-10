export type SoundSettingsSlice = {
  soundEffects: boolean;
  speakingExercises: boolean;
  listeningExercises: boolean;
};

export const createSoundSettingsSlice = (): SoundSettingsSlice => ({
  soundEffects: true,
  speakingExercises: true,
  listeningExercises: true,
});