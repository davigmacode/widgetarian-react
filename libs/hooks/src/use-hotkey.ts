import { useState, useEffect, useCallback } from 'react';

type IsHotkey = (key: string) => boolean;

type HotkeyHandler = (event: HotkeyParsed | null | undefined) => void;

type HotkeyListener = (key: string, handler: HotkeyHandler) => void;

type HotkeyHookReturn = [IsHotkey, HotkeyListener, HotkeyParsed | null];

type HotkeyHook = (hotkeys?: Hotkey[]) => HotkeyHookReturn;

export const useHotkey: HotkeyHook = (hotkeys) => {
  const [keysPressed, setKeysPressed] = useState<HotkeyParsed | null>(null);

  const isHotkey: IsHotkey = useCallback(
    (hotkey) => {
      const parsedHotkey = parseHotkey(hotkey);
      return JSON.stringify(parsedHotkey) === JSON.stringify(keysPressed);
    },
    [keysPressed]
  );

  const onHotkey: HotkeyListener = useCallback(
    (hotkey, handler) => {
      isHotkey(hotkey) && handler(keysPressed);
    },
    [keysPressed, isHotkey]
  );

  // If pressed key is our target key then set to true
  const downHandler = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();
      setKeysPressed(() => parseEvent(event) || null);
    },
    [setKeysPressed]
  );

  const upHandler = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();
      setKeysPressed(() => null);
    },
    [setKeysPressed]
  );

  useEffect(() => {
    hotkeys?.forEach(([hotkey, handler]) => {
      isHotkey(hotkey) && handler(keysPressed);
    });
  }, [hotkeys, isHotkey, keysPressed]);

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [downHandler, upHandler]);

  return [isHotkey, onHotkey, keysPressed];
};

export type HotkeyParsed = {
  alt: boolean;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  mod: boolean;
  key?: string;
};

export const parseHotkey = (hotkey: string): HotkeyParsed => {
  const keys = hotkey
    .toLowerCase()
    .split('+')
    .map((part) => part.trim());

  const reserved = ['alt', 'ctrl', 'meta', 'shift', 'mod'];
  const alt = keys.includes('alt');
  const ctrl = keys.includes('ctrl');
  const meta = keys.includes('meta');
  const shift = keys.includes('shift');
  const mod = keys.includes('mod') || ctrl || meta;
  const key = keys.find((key) => !reserved.includes(key));

  return { alt, ctrl, meta, shift, mod, key };
};

export const parseEvent = (event?: KeyboardEvent): HotkeyParsed | undefined => {
  return (
    event && {
      alt: event.altKey,
      ctrl: event.ctrlKey,
      meta: event.metaKey,
      shift: event.shiftKey,
      mod: event.ctrlKey || event.metaKey,
      key: event.code.replace('Key', '').toLowerCase(),
    }
  );
};

export const isHotkeyPressed = (
  hotkey: string,
  event?: KeyboardEvent
): boolean => {
  const parsedHotkey = parseHotkey(hotkey);
  const parsedEvent = parseEvent(event);
  return JSON.stringify(parsedHotkey) === JSON.stringify(parsedEvent);
};

type Hotkey = [string, HotkeyHandler];

export const createHotkeyHandler = (hotkeys: Hotkey[]) => {
  return (event: KeyboardEvent) => {
    hotkeys.forEach(([hotkey, handler]) => {
      if (isHotkeyPressed(hotkey, event)) {
        event.preventDefault();
        handler(parseEvent(event));
      }
    });
  };
};

// const isEditableElement = (event: KeyboardEvent) => {
//   if (event.target instanceof HTMLElement) {
//     return (
//       !event.target.isContentEditable &&
//       !['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)
//     );
//   }
//   return true;
// }

export default useHotkey;
