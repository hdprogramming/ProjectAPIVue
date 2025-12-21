<script setup>
import { ref } from 'vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth'; // Store'u import et
import { useRouter } from 'vue-router'; 

const authStore = useAuthStore(); // Store'u kullan
const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref(null);
const success = ref(null);

const login = async () => {
  // ... (Hata kontrolü)
  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    });

    const UserData = response.data;    
    // 🏆 KRİTİK: State'i ve Local Storage'ı Pinia action ile tek seferde güncelle!
    authStore.setAuth(UserData);
    
    success.value = 'Başarıyla giriş yapıldı!';
    router.push('/Projects'); // Yönlendirme, nav bar artık reaktif olarak güncellenmeli.
    
  } catch (err) {
    alert("Girdiğiniz şifre hatalı yada böyle bir kullanıcı yok"+err);
  }
};

</script>
<template>
<div class=MainDiv> 
  <div class="card" >
    <h2 class="card-header" >Giriş Yap </h2>
    <form @submit.prevent="login" class="form-group">
      <div>
        <label for="email">E-posta:</label>
        <input  type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Parola:</label>
        <input  type="password" id="password" v-model="password" required>
      </div>
      <button class="btn btn-primary" type="submit">Giriş</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-if="success" class="success-message">{{ success }}</p>
  </div></div>
</template>



<style scoped>
 .MainDiv{
  margin:auto;
  margin-top:40px;
  width:50%;
 }
 

.error-message { color: red; }
.success-message { color: green; }
/* Basit CSS stilleri buraya eklenebilir */
</style>