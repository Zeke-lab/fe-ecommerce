import { config } from '../../../config/register';
import type { AuthState } from '../zustand/authStore';
import CryptoJs from 'crypto-js';

// Browser check to ensure localStorage is only accessed in a browser environment
const browser = typeof window !== 'undefined';
const CONFIG_NAME = config.name + '-auth';

/*
    This service is responsible for setting, getting, and clearing the localStorage.
    This is used to store the user's auth-state and other data.
*/

export const LocalServices = {
  setLocalStorage(value: AuthState): void {
    if (!browser) return;
    const encryptData = CryptoJs.AES.encrypt(
      JSON.stringify(value),
      config.root,
    ).toString();

    localStorage.setItem(CONFIG_NAME, encryptData);
  },
  getLocalStorage(): AuthState | undefined {
    if (!browser) return;
    const item = localStorage.getItem(CONFIG_NAME);
    if (item) {
      try {
        const decryptData = CryptoJs.AES.decrypt(item, config.root).toString(
          CryptoJs.enc.Utf8,
        );
        if (decryptData) {
          const result: AuthState = JSON.parse(decryptData);
          return result;
        }
      } catch (error) {
        console.log('Error decrypting local storage data: ', error);
        this.clearLocalStorage();
      }
    }
  },
  clearLocalStorage(): void {
    if (!browser) return;
    localStorage.removeItem(CONFIG_NAME);
  },
};
