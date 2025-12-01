<template>
  <div class="card">
    <h2 class="card-header">Kullanıcı Profili</h2>
    <div v-if="loading">Yükleniyor...</div>
    <div v-else-if="profile">
      <form class="form-group" @submit.prevent="updateProfile">
      <div class="avatar-section">
      <div class="avatar-wrapper">
       <img v-bind:src="profile.profileImageUrl" alt="">
       </div>
       
      </div>
        <div>
          <label>Kullanıcı Adı:</label>
          <input  type="text" v-model="profile.userName" required>
        </div>
        <div>
          <label>E-posta:</label>
          <input  type="email" :value="profile.email" disabled>
        </div>
        <div>
          <label>Biyo:</label>
          <textarea   v-model="profile.bio"></textarea>
        </div>
        <div>
          <label>Yeni Parola (İsteğe Bağlı):</label>
          <input   type="password" v-model="newPassword">
        </div>
        <button class="btn btn-primary"  type="submit">Profili Güncelle</button>
      </form>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">{{ success }}</p>
    </div>
    <div v-else>Profil bilgileri yüklenemedi veya erişim yetkiniz yok (403/404).</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const profile = ref(null);
const newPassword = ref('');
const loading = ref(true);
const error = ref(null);
const success = ref(null);

const currentUserId = localStorage.getItem('currentUserId'); // Giriş yaparken kaydettiğimiz ID

const fetchProfile = async () => {
  if (!currentUserId) {
    error.value = 'Kullanıcı ID\'si bulunamadı. Lütfen giriş yapın.';
    loading.value = false;
    return;
  }
  
  try {
    const response = await api.get(`/users/${currentUserId}`); // GET api/users/{id}
    profile.value = response.data;
  } catch (err) {
    error.value = err.response?.data || 'Profil yüklenirken bir hata oluştu.';
    profile.value = null; // Başarısız olursa profili temizle
  } finally {
    loading.value = false;
  }
};

const updateProfile = async () => {
  error.value = null;
  success.value = null;

  if (!currentUserId) return;

  // Sadece güncellenecek alanları içeren DTO'yu oluştur
  const updateData = {
    userName: profile.value.userName,
    bio: profile.value.bio,
    // Diğer alanlar...
  };

  // Eğer parola alanı doldurulmuşsa DTO'ya ekle
  if (newPassword.value) {
    updateData.password = newPassword.value;
  }

  try {
    await api.patch(`/users/TargetUserID`, updateData,{
    params:{
      TargetUserID:currentUserId
    }

    }); // PATCH api/users/{id}
    success.value = 'Profil başarıyla güncellendi!';
    newPassword.value = ''; // Parolayı temizle
  } catch (err) {
    error.value = err.response?.data || 'Profil güncellenirken bir hata oluştu.';
  }
};

onMounted(fetchProfile);
</script>