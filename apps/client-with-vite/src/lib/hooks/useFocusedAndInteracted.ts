import { useState, useEffect, RefObject } from 'react';

export const useFocusedAndInteracted = (inputRef: RefObject<HTMLTextAreaElement | HTMLInputElement>) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const inputElement = inputRef.current;
    if (!inputElement) return;

    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    inputElement.addEventListener('click', handleInteraction);
    inputElement.addEventListener('input', handleInteraction);
    inputElement.addEventListener('focus', handleFocus);
    inputElement.addEventListener('blur', handleBlur);

    return () => {
      inputElement.removeEventListener('click', handleInteraction);
      inputElement.removeEventListener('input', handleInteraction);
      inputElement.removeEventListener('focus', handleFocus);
      inputElement.removeEventListener('blur', handleBlur);
    };
  }, [inputRef, hasInteracted]);

  const isInteractiveAndFocused = hasInteracted && isFocused;

  return isInteractiveAndFocused;
};
