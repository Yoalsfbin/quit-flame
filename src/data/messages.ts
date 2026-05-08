import type { Tone, Trigger, Phase } from '../types';
import messages from './messages.json';

interface UrgeMessage {
  main: string;
  sub: string;
}

type MessageDb = Record<Tone, Record<Trigger, Record<Phase, UrgeMessage[]>>>;

const MESSAGES = messages as MessageDb;

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
