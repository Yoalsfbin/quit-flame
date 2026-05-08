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

function dedupeMessages(messages: UrgeMessage[]): UrgeMessage[] {
  const seen = new Set<string>();

  return messages.filter((message) => {
    const key = `${message.main}::${message.sub}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function getCandidates(tone: Tone, trigger: Trigger, phase: Phase): UrgeMessage[] {
  const baseCandidates = BASE[tone][trigger][phase] ?? [];
  const extraCandidates = EXTRA[tone]?.[trigger]?.[phase] ?? [];

  return dedupeMessages([...baseCandidates, ...extraCandidates]);
}

export function getMessage(tone: Tone, trigger: Trigger, daysSinceQuit: number): UrgeMessage {
  const phase = getPhase(daysSinceQuit);
  const candidates = getCandidates(tone, trigger, phase);

  return candidates[Math.floor(Math.random() * candidates.length)];
}
