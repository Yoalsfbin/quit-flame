import type { Tone, Trigger, Phase } from '../types';
import messages from './messages.json';

interface UrgeMessage {
  main: string;
  sub: string;
}

const MESSAGES = messages as any;

function getPhase(daysSinceQuit: number): Phase {
  if (daysSinceQuit <= 7) return 'early';
  if (daysSinceQuit <= 30) return 'mid';
  return 'late';
}

export function getMessage(tone: Tone, trigger: Trigger, daysSinceQuit: number): UrgeMessage {
  const phase = getPhase(daysSinceQuit);
  const candidates = MESSAGES[tone][trigger][phase];
  return candidates[Math.floor(Math.random() * candidates.length)];
}
