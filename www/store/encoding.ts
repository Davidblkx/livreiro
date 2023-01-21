import { JSONObject } from './models.ts';

function toBinary(string: string) {
  const codeUnits = Uint16Array.from(
    { length: string.length },
    (_, index) => string.charCodeAt(index),
  );
  const charCodes = new Uint8Array(codeUnits.buffer);

  let result = '';
  charCodes.forEach((char) => {
    result += String.fromCharCode(char);
  });
  return result;
}

function fromBinary(binary: string) {
  const bytes = Uint8Array.from({ length: binary.length }, (_, index) => binary.charCodeAt(index));
  const charCodes = new Uint16Array(bytes.buffer);

  let result = '';
  charCodes.forEach((char) => {
    result += String.fromCharCode(char);
  });
  return result;
}

function encodeString(string: string) {
  return btoa(toBinary(string));
}

function decodeString(base64: string) {
  return fromBinary(atob(base64));
}

export function encodeObject(object: JSONObject) {
  const json = JSON.stringify(object);
  return encodeString(json);
}

export function decodeObject(base64: string) {
  const json = decodeString(base64);
  return JSON.parse(json);
}
