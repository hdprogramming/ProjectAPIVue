import axios from 'axios';
import { rtp,GetData, StoreData, RemoveData } from '@/stores/locker';
// API'nizin temel URL'sini buraya yazın
export const API_URL = 'http://localhost:5098/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Refresh Token için Cookie'lerin gönderilmesini sağlar
});

// Request (İstek) Interceptor'ı
// Her istek gönderilmeden önce Local Storage'daki JWT Token'ı ekler
api.interceptors.request.use(
  (config) => {
    let userdata = GetData();
    
    if (userdata) {
        config.headers.Authorization = `Bearer ${userdata.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response (Yanıt) Interceptor'ı
// 401 Unauthorized hatası alınırsa (Token süresi dolmuşsa)
// Refresh Token mekanizmasını tetikleyebiliriz.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Eğer 401 hatası alırsak VE bu zaten refresh isteği değilse
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Yeni bir token almak için Refresh endpoint'ini çağır
        const response = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        
        // Yeni token'ı kaydet ve orijinal isteği tekrar dene
        const newToken = response.data.token;               
        localStorage.setItem('authToken', rtp(newToken));

        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        let data = GetData();
        data.token=newToken;
        StoreData(data); 
        // Yeni token ile orijinal isteği tekrar gönder
        return api(originalRequest);
        
      } catch (refreshError) {
        // Refresh token da başarısız olursa (süresi dolmuşsa vb.) kullanıcıyı çıkışa yönlendir
        console.error("Refresh Token başarısız. Kullanıcı çıkış yapmalı.");
        localStorage.removeItem('authToken');
        RemoveData();
        // İhtiyaç duyulursa burada bir router.push('/login') yapılabilir
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;