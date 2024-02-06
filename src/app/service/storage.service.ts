import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public static readonly CATEGORIAS: string = "categorias";
  public static readonly SUBCATEGORIAS: string = "subcategorias";
  public static readonly TOKEN: string = "token";

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this.storage = storage;
  }

  public async set(key: string, value: any) {
    await this.storage?.set(key, value);
  }

  public async get(key: string) {
    return await this.storage?.get(key);
  }

  public async remove(key: string) {
    return await this.storage?.remove(key);
  }
}
