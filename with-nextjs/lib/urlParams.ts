const queryString = window.location.search;
const urlParamsObject = new URLSearchParams(queryString);

const defaults = {
  "ide": "code", // "code" or "cursor"
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
  set: (_, prop: keyof typeof defaults, value) => {
    if (value === '') {
      urlParamsObject.delete(prop.toString());
    } else if (typeof value === 'object') {
      urlParamsObject.set(prop.toString(), JSON.stringify(value));
    } else {
      urlParamsObject.set(prop.toString(), String(value));
    }

    // window.location.search = urlParamsObject.toString();

    // Update the URL without causing a page refresh
    const { protocol, host, pathname } = window.location;
    const newUrl = protocol + '//' + host + pathname + '?' + urlParamsObject.toString();
    window.history.replaceState({ path: newUrl }, '', newUrl);

    return true;
  },
  deleteProperty(target, p) {
    console.log(`delete called for property: ${String(p)}`);

    urlParamsObject.delete(String(p));

    // Update the URL without causing a page refresh
    const { protocol, host, pathname } = window.location;
    const newUrl = protocol + '//' + host + pathname + '?' + urlParamsObject.toString();
    window.history.replaceState({ path: newUrl }, '', newUrl);

    delete (target as any)[p];

    return true;
  },
});
