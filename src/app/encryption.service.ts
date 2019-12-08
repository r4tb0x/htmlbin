import { Injectable } from '@angular/core';
import { Pbkdf2HmacSha256, Sha256, AES_GCM, string_to_bytes, bytes_to_string, hex_to_bytes, bytes_to_hex, base64_to_bytes, bytes_to_base64 } from 'asmcrypto.js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  public encrypt(cleartextString: string, passphrase: string): string {
    const cleartext: Uint8Array = new Uint8Array(string_to_bytes(cleartextString));
    const salt: Uint8Array = crypto.getRandomValues(new Uint8Array(16));
    const key: Uint8Array = Pbkdf2HmacSha256(
        new Uint8Array(string_to_bytes(passphrase)),
        salt,
        10000,
        32
      );
    const nonce: Uint8Array = crypto.getRandomValues(new Uint8Array(16));
    const ciphertext: Uint8Array = AES_GCM.encrypt(cleartext, key, nonce);

    const encrypted: string = JSON.stringify({
      'salt': bytes_to_string(salt),
      'nonce': bytes_to_string(nonce),
      'ciphertext': bytes_to_string(ciphertext)
    });
    return this.toBase64(encrypted);
  }
  public decrypt(ciphertext: string, passphrase: string): string {
    const cipherObj: any = JSON.parse(this.fromBase64(ciphertext));
    const salt: Uint8Array = new Uint8Array(string_to_bytes(cipherObj.salt));
    const nonce: Uint8Array = new Uint8Array(string_to_bytes(cipherObj.nonce));
    const encrypted: Uint8Array = new Uint8Array(string_to_bytes(cipherObj.ciphertext));
    const key: Uint8Array = Pbkdf2HmacSha256(
        new Uint8Array(string_to_bytes(passphrase)),
        salt,
        10000,
        32
      );
    const cleartext: Uint8Array = AES_GCM.decrypt(encrypted, key, nonce);
    return bytes_to_string(cleartext);
  }

  public generateFileName(): string {
    return bytes_to_hex(crypto.getRandomValues(new Uint8Array(8)));
  }
  public generatePassword(): string {
    let b64: string = bytes_to_base64(crypto.getRandomValues(new Uint8Array(32)));
    b64 = b64.replace(/\//g, '-');
    b64 = b64.replace(/\=/g, '_');
    return b64;
  }

  public toBase64(utf8string: string): string {
    let b64: string = bytes_to_base64(string_to_bytes(utf8string));
    b64 = b64.replace(/\//g, '-');
    b64 = b64.replace(/\=/g, '_');
    return b64;
  }
  public fromBase64(base64string: string): string {
    base64string = base64string.replace(/\-/g, '/');
    base64string = base64string.replace(/\_/g, '=');
    return bytes_to_string(base64_to_bytes(base64string));
  }
}