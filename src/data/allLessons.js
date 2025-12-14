// Combined lessons export - merges SMP and SMA lessons
import { lessons as lessonsSMP } from './lessons';
import { lessonsSMA } from './lessonsSMA';

export const lessons = [...lessonsSMP, ...lessonsSMA];

export default lessons;
