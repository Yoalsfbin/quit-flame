import type { Tone, Trigger, Phase } from '../types';
import messages from './messages.json';
import overrides from './message-overrides.json';

interface UrgeMessage {
  main: string;
  sub: string;
}

type MessageDb = Record<Tone, Record<Trigger, Record<Phase, UrgeMessage[]>>>;

const BASE = messages as MessageDb;
const EXTRA = overrides as MessageDb;

function getPhase(daysSinceQuit: number): Phase {
  if (daysSinceQuit <= 7) return 'early';
  if (daysSinceQuit <= 30) return 'mid';
  return 'late';
}

function mergeMessages(base: UrgeMessage[], extra: UrgeMessage[]): UrgeMessage[] {
  return [...base, ...extra];
}

export function getMessage(tone: Tone, trigger: Trigger, daysSinceQuit: number): UrgeMessage {
  const phase = getPhase(daysSinceQuit);

  const baseCandidates = BASE[tone][trigger][phase] ?? [];
  const extraCandidates = EXTRA[tone]?.[trigger]?.[phase] ?? [];

  const candidates = mergeMessages(baseCandidates, extraCandidates);

  return candidates[Math.floor(Math.random() * candidates.length)];
}
