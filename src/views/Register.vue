<template>
<div class=MainDiv> 
  <div class="card" >
    <h2 class="card-header" >Hesabınız yokmu? </h2>
    <form @submit.prevent="register" class="form-group">
      <div>
        <label for="email">E-posta:</label>
        <input  type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Parola:</label>
        <input  type="password" id="password" v-model="password" required>
      </div>
      <button class="btn btn-primary" type="submit">Kaydolun</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-if="success" class="success-message">{{ success }}</p>
  </div></div>
</template>
<script setup>
import { ref } from 'vue';
import api from '@/services/api';
import { useRouter } from 'vue-router'; 
import {useAuthStore} from '@/stores/auth.js'
const router = useRouter();
const authStore = useAuthStore(); 
const email = ref('');
const password = ref('');
const error = ref(null);
const success = ref(null);

const register = async () => {
  // ... (Hata kontrolü)
  try {
    authStore.clearAuth();
    const response = await api.post('/auth/register', {
      email: email.value,
      password: password.value
    });  
  
    success.value = 'Başarıyla kayıt edildi!';
    router.push('/'); // Yönlendirme, nav bar artık reaktif olarak güncellenmeli.
    
  } catch (err) {
    alert("Kayıt edilemedi");
  }
};

</script>
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