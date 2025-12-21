// src/stores/auth.js

import { defineStore } from 'pinia';
import { rtp, GetData, StoreData, RemoveData } from '@/stores/locker';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Pinia'da tuttuğumuz reaktif değişkenler:
    token:rtp(localStorage.getItem('authToken'))|| null,
    _bufferUI: GetData() || null,
     }),
  getters: {
    // Computed property mantığı burada. State değişince bunlar da reaktif olarak değişir.
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state._bufferUI.Role === 'Admin',
  },
  actions: {
    setAuth(UserData) {
      // Local Storage'a kaydet
      let token=UserData.token;
      localStorage.setItem('authToken', rtp(token));           
      StoreData(UserData);
      // Pinia State'i güncelle (Reaktifliği tetikleyen kısım!)
      this.token=rtp(token);
      this._bufferUI = GetData();
    },
    clearAuth() {
      // Local Storage'dan sil
      localStorage.removeItem('authToken');      
      RemoveData();
      // Pinia State'i sıfırla
      this.token=null;
      this._bufferUI = null;
    }
  }
});