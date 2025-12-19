// src/stores/auth.js

import { defineStore } from 'pinia';
import { rtp, GetData, StoreData, RemoveData } from '@/stores/locker';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Pinia'da tuttuğumuz reaktif değişkenler:
    token:rtp(localStorage.getItem('authToken'))|| null,
    _bufferUI: GetData() || null,
    userId: localStorage.getItem('currentUserId') || null,
    role: localStorage.getItem('userRole') || 'User', // Varsayılan rol
  }),
  getters: {
    // Computed property mantığı burada. State değişince bunlar da reaktif olarak değişir.
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role === 'Admin',
  },
  actions: {
    setAuth(token, userId, role) {
      // Local Storage'a kaydet
      localStorage.setItem('authToken', rtp(token));           
      localStorage.setItem('currentUserId', userId);
      localStorage.setItem('userRole', role);
      StoreData(token);
      // Pinia State'i güncelle (Reaktifliği tetikleyen kısım!)
      this.token=rtp(token);
      this._bufferUI = GetData();
      this.userId = userId;
      this.role = role;
    },
    clearAuth() {
      // Local Storage'dan sil
      localStorage.removeItem('authToken');      
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('userRole');
      RemoveData();
      // Pinia State'i sıfırla
      this.token=null;
      this._bufferUI = null;
      this.userId = null;
      this.role = 'User';
    }
  }
});