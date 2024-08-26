// @ts-nocheck

import { useState, useEffect, useCallback, useRef } from 'react';

const store = {
  state: { result: null as any },
  setters: new Set(),
};

const setState = newState => {
  const prevState = store.state;
  store.state = { ...prevState, ...newState };
  if (JSON.stringify(prevState) !== JSON.stringify(store.state)) {
    store.setters.forEach(setter => setter(store.state));
  }
};

const useCommandResultStore = () => {
  const [state, setter] = useState(store.state);
  const stateRef = useRef(state);

  useEffect(() => {
    const wrappedSetter = newState => {
      if (JSON.stringify(stateRef.current) !== JSON.stringify(newState)) {
        stateRef.current = newState;
        setter(newState);
      }
    };
    store.setters.add(wrappedSetter);
    return () => store.setters.delete(wrappedSetter);
  }, []);

  const setResult = useCallback(newResult => {
    setState({ result: newResult });
  }, []);

  return { result: state.result, setResult };
};

export default useCommandResultStore;
