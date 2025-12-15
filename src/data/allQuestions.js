// Combined questions export - merges SMP and SMA questions
import { questions as questionsSMP } from './questions';
import { questionsSMA as questionsSMAKelas10 } from './questionsSMAKelas10';
import questionsSMAKelas11 from './questionsSMAKelas11';
import questionsSMAKelas12 from './questionsSMAKelas12';
import questionsTKA from './questionsTKA';

// Merge SMP questions (already includes kelas 7, 8, 9) with SMA questions and TKA
export const questions = {
    ...questionsSMP,
    ...questionsSMAKelas10,
    ...questionsSMAKelas11,
    ...questionsSMAKelas12,
    ...questionsTKA,
};

export default questions;

