import { JSONObject } from './models.ts';
import { decodeObject, encodeObject } from './encoding.ts';

export function persistState(state: JSONObject) {
  try {
    const encoded = encodeObject(state);
    const url = new URL(window.location.href);
    url.searchParams.set('q', encoded);
    window.history.replaceState({}, '', url.toString());
  } catch (error) {
    console.error(error);
  }
}

export function loadState(): JSONObject {
  try {
    const url = new URL(window.location.href);
    const encoded = url.searchParams.get('q');
    if (!encoded) return {};
    return decodeObject(encoded);
  } catch (error) {
    console.error(error);
    return {};
  }
}
