import type { Tone, Trigger, Phase } from '../types';
import messages from './messages.json';
import extraMessages from './messages.extra.json';

interface UrgeMessage {
  main: string;
  sub: string;
}

const MESSAGES = messages as any;
const EXTRA_MESSAGES = extraMessages as any;

function getPhase(daysSinceQuit: number): Phase {
  if (daysSinceQuit <= 7) return 'early';
  if (daysSinceQuit <= 30) return 'mid';
  return 'late';
}

function getCandidates(tone: Tone, trigger: Trigger, phase: Phase): UrgeMessage[] {
  const baseCandidates = MESSAGES[tone][trigger][phase] ?? [];
  const extraCandidates = EXTRA_MESSAGES[tone]?.[trigger] ?? [];
  return [...baseCandidates, ...extraCandidates];
}

export function getMessage(tone: Tone, trigger: Trigger, daysSinceQuit: number): UrgeMessage {
  const phase = getPhase(daysSinceQuit);
  const candidates = getCandidates(tone, trigger, phase);
  return candidates[Math.floor(Math.random() * candidates.length)];
}
