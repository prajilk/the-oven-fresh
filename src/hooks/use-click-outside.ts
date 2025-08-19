'use client';

import type React from 'react';
import { useEventListener } from './use-event-listener';

export function useClickOutside(
  ref: React.RefObject<HTMLDivElement | null>,
  handler: (e: Event) => void,
  event = 'mousedown'
) {
  useEventListener(event, (e) => {
    const el = ref?.current;

    if (!el || el.contains(e.target as Node)) {
      return;
    }

    handler(e);
  });
}
