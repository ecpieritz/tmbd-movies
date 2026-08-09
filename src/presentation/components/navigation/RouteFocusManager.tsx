import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

const MAIN_CONTENT_ID = 'main-content';

interface NavigationState {
  readonly preserveFocus?: unknown;
}

export function RouteFocusManager() {
  const location = useLocation();
  const previousLocationKey = useRef(location.key);

  useEffect(() => {
    if (previousLocationKey.current === location.key) {
      return;
    }

    previousLocationKey.current = location.key;

    if ((location.state as NavigationState | null)?.preserveFocus === true) {
      return;
    }

    document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true });
  }, [location.key, location.state]);

  return null;
}
