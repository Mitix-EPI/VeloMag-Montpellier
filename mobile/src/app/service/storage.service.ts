/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) { }

  isReady(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this._storage) {
        resolve(true);
      } else {
        this.storage.create().then(storage => {
          this._storage = storage;
          resolve(true);
        });
      }
    });
  }

  public set(key: any, value: any) {
    this._storage?.set(key, value);
  }

  public get(key: string) {
    return this._storage?.get(key);
  }

  public remove(key: string) {
    this._storage?.remove(key);
  }

  public clear() {
    this._storage?.clear();
  }

  public keys() {
    return this._storage?.keys();
  }
}
