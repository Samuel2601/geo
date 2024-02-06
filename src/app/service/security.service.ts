import { Injectable } from '@angular/core';
import * as Forge from 'node-forge';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private static readonly AES_ALGORITHM: Forge.cipher.Algorithm = 'AES-CBC';
  private static readonly AES_BYTES_SIZE: number = 32;
  private static readonly AES_KEY_LENGTH: number = 32;
  private static readonly AES_IV_LENGTH: number = 16;
  private static readonly AES_SECONDS: number = 10;
  private static AES_KEY: string;
  private static AES_IV: string;
  private static readonly RSA_ENCRYPTION_SCHEME: Forge.pki.rsa.EncryptionScheme = 'RSA-OAEP';
  private static readonly SERVICE_PUBLIC_KEY: string = `-----BEGIN PUBLIC KEY-----
  MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAtYLhL4UCSZmnNM5rE2ku
  7EE9xwV1mtsEGfx2LtCZl7Zr0ZSPWYH9Dk3bpdGfqWsU2RQ3+8hVdPaipb7T5A2K
  bM1eddQx8aAYS3x01md4oFLWoaJDhRccxOee2KNkSWYjHXRd0TqRMV5VbufOguBr
  i0S2zEW6MwqPt25sTjkNGANHMWu8uZIrzkNLeNC+FvM13OHjZtJfbf67UupwJfQK
  YjoC/USKS4/UAN49IRxRC+xbl/ovZdZvTdWnUxTgqTyO8UL3FgWEMslp+30Jg5XJ
  i/BuOG+33H2n/jAaWns2/+ZdFK9eb0DpxzzycWpDNAmMs0a99p70uavT5kctHZQ7
  55i2lIGB7awQDYJFE+vmN9VTZOVn9Cy2FJ5y9VlyldkUSxsPWmm436OeovdbhAp0
  64+JRoN/37QO7szQE7hBb4b2mYANeiZXyFWCsu8swvO8NNjlwnuixHap/NUSgkRR
  WtTIGZBuZRLaieOfNrRglRmr/KpcnZLMQHPb9JAA77DpzZiSd8q194eTtOZtBCqV
  Yr5NkijNia3BpiJ6n5HcS5QnulVFVolHTdaLeCo1csCe/kyCaOSVF1rV6EHC/kXt
  J31eJw/9lYNJYmdOeB8OI++1gBSfcIZfICJDdx8IvRYb+52S9/ohLlOTpFRhgWoZ
  vqQfaW3Z0CR891As6/rI3W8CAwEAAQ==
  -----END PUBLIC KEY-----`;

  constructor() {
  }

  public static generateKey(length: number = SecurityService.AES_KEY_LENGTH, bytes: number = SecurityService.AES_BYTES_SIZE) {
    const sha = Forge.md.sha512.create();
    sha.update(window.btoa(Forge.random.getBytesSync(bytes)));
    const key = Forge.util.encode64(sha.digest().data).substring(0, length);
    return key;
  }

  public static refreshAES() {
    SecurityService.AES_KEY = SecurityService.generateKey();
    SecurityService.AES_IV = SecurityService.generateKey(SecurityService.AES_IV_LENGTH);
  }

  public static encryptAes(text: string, key: string = SecurityService.AES_KEY, iv: string = SecurityService.AES_IV): any {
    const cipher = Forge.cipher.createCipher(
      SecurityService.AES_ALGORITHM,
      key
    );
    cipher.start({ iv });
    cipher.update(Forge.util.createBuffer(text, 'utf8'));
    cipher.finish();
    return Forge.util.encode64(cipher.output.toHex());
  }

  public static decryptAes(encrypted: string, isObject: boolean = true, key: string = SecurityService.AES_KEY, iv: string = SecurityService.AES_IV): any {
    const decipher = Forge.cipher.createDecipher(SecurityService.AES_ALGORITHM, key);
    decipher.start({ iv });
    const decoded = Forge.util.decode64(encrypted);
    const data = Forge.util.hexToBytes(decoded);
    decipher.update(Forge.util.createBuffer(data));
    decipher.finish();
    return isObject ? JSON.parse(decipher.output.toString()) : decipher.output.toString();
  }

  public static getAES(seconds: number = SecurityService.AES_SECONDS) {
    return { valid: new Date(Date.now() + 1000 * seconds), key: SecurityService.AES_KEY, iv: SecurityService.AES_IV };
  }

  public static encryptRsa(text: string, urlSafe: boolean = false): any {
    const rsa = Forge.pki.publicKeyFromPem(SecurityService.SERVICE_PUBLIC_KEY);
    const encryptedData = window.btoa(rsa.encrypt(text, SecurityService.RSA_ENCRYPTION_SCHEME));
    return { data: urlSafe ? encodeURIComponent(encryptedData) : encryptedData };
  }

  public static decryptRsa(text: string, private_key: string, isObject: boolean = true): any {
    const rsa = Forge.pki.decryptRsaPrivateKey(private_key);
    const decrypted = rsa.decrypt(text, SecurityService.RSA_ENCRYPTION_SCHEME);
    const data = isObject ? JSON.parse(decrypted) : decrypted;
    return { data };
  }
}
