export type Domain = 1 | 2 | 3 | 4;
export interface Source { title: string; url: string; checked: string }
export interface Lesson { id: string; title: string; analogy: string; explanation: string; diagram: string[]; points: string[]; comparison: { name: string; use: string; caution: string }[]; conceptIds: string[]; sources: Source[] }
export interface Chapter { id: string; title: string; intro: string; lessons: Lesson[] }
export interface Term { id: string; name: string; meaning: string; chapterId: string }
export interface Question { id: string; chapterId: string; domain: Domain; conceptIds: string[]; prompt: string; options: { id: string; text: string; explanation: string }[]; answers: string[]; explanation: string; sources: Source[]; exam?: 'mock1' | 'mock2' }
export interface Attempt { questionId: string; selected: string[]; correct: boolean; unsure: boolean; at: string }
export interface ExamSession { id: 'mock1' | 'mock2'; startedAt: number; deadline: number; answers: Record<string, string[]>; submitted: boolean }
export interface Progress { version: 1; attempts: Attempt[]; bookmarks: string[]; readLessons: string[]; exam: ExamSession | null; game: unknown | null }
