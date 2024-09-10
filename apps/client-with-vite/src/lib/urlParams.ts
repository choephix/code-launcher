const queryString = globalThis?.location?.search ?? '';
const urlParamsObject = new URLSearchParams(queryString);

const defaults = {
  ide: 'code', // "code" or "cursor"
};

export const urlParams = new Proxy(defaults, {
  get: (target, prop: keyof typeof defaults) => {
    const value = urlParamsObject.get(prop.toString());

    if (value === null) {
      return target[prop];
    }

    if (value === '') {
      return true;
    }

    /**
     * Try parsing the value as JSON.
     *
     * This will work for objects, but will also turn any
     * numeric strings to `number`s (e.g. "1" -> 1),
     * and boolean strings to `boolean`s (e.g. "true" -> true).
     *
     * If the value is not a valid JSON string, we will
     * simply return the original string instead.
     */
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  },
});
