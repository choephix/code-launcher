import { RefObject, useEffect } from 'react';

export const SmartBarPlaceholderStrings = [
  'Git repository URL to clone',
  'CLI command to run',
  'AI prompt to AI with',
];

export const useAnimatedPlaceholder = (inputRef: RefObject<HTMLInputElement>, messages: string[], messagePrefix: string = '') => {
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    let currentMessageIndex = Math.floor(Math.random() * messages.length);
    let typingIndex = 0;
    let isDeleting = false;
    let timeoutId = null as any;

    const animatePlaceholder = () => {
      const currentMessage = messages[currentMessageIndex];

      if (isDeleting) {
        typingIndex--;
        input.placeholder = messagePrefix + currentMessage.substring(0, typingIndex);

        if (typingIndex === 0) {
          isDeleting = false;
          currentMessageIndex = (currentMessageIndex + 1) % messages.length;
          timeoutId = setTimeout(animatePlaceholder, 50); // Short pause before typing next message
          return;
        }
      } else {
        typingIndex++;
        input.placeholder = messagePrefix + currentMessage.substring(0, typingIndex);

        if (typingIndex === currentMessage.length) {
          isDeleting = true;
          timeoutId = setTimeout(animatePlaceholder, 2000); // Pause before deleting
          return;
        }
      }

      const speed = isDeleting ? 4 : 12; // Faster when deleting
      timeoutId = setTimeout(animatePlaceholder, speed);
    };

    animatePlaceholder();

    return () => clearTimeout(timeoutId); // Cleanup on unmount
  }, [inputRef, messages]);
};
