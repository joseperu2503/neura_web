import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';
import { AesEncryptionStrategy } from './strategies/aes-encryption.strategy';
import { EncryptionStrategy } from './interfaces/encryption-strategy.interface';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private strategy: EncryptionStrategy;

  constructor() {
    this.strategy = new AesEncryptionStrategy();
  }

  encrypt<T>(value: T): Record<string, string> {
    return this.strategy.encrypt(value, environment.encryptionKey);
  }

  decrypt<T>(value: Record<string, string>): T {
    return this.strategy.decrypt(value, environment.encryptionKey);
  }
}
