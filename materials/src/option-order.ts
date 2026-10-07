import type { Question } from './types';
// Stable for a question/session, without mutating IDs, saved answers or the source.
export function orderedOptions(question: Question, seed: string): Question['options'] {
 let state = 2166136261;
 for (const ch of `${seed}:${question.id}`) state = Math.imul(state ^ ch.charCodeAt(0), 16777619) >>> 0;
 const next = () => {
  state += 0x6D2B79F5;
  let n = state;
  n = Math.imul(n ^ n >>> 15, n | 1);
  n ^= n + Math.imul(n ^ n >>> 7, n | 61);
  return ((n ^ n >>> 14) >>> 0) / 4294967296;
 };
 const options = [...question.options];
 for (let i = options.length - 1; i > 0; i--) {
  const j = Math.floor(next() * (i + 1));
  [options[i], options[j]] = [options[j], options[i]];
 }
 return options;
}
