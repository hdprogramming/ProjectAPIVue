<template>
  <div class="admin-panel">
  <div v-if="loading">Kullanıcılar yükleniyor...</div>
    <modal v-model="isModalOpen">
      <div class="form-group v-stack">
        <h2>Kullanıcı Düzenle</h2>
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <img :src="modalVals.profileImageUrl" />
          </div>
        </div>
        <custominput label="Kullanıcı Adı" v-model="modalVals.userName" />
         <custominput type="password" label="Yeni Parola" v-model="modalVals.password" />
        <custominput label="Bio" v-model="modalVals.bio" />
        <button class="btn btn-primary" @click="updateUser(modalVals.id)">Gönder</button>
      </div>
    </modal>
    <h2 class="card-header">Yönetici Paneli (Tüm Kullanıcılar) </h2>
    
    <div class="card" v-if="users.length > 0">
     <h2>Kullanıcılar</h2>
      <table class="fl-table">
        <thead>
          <tr>
            <th>Kullanıcı Adı</th>
            <th>E-posta</th>
             <th>Bio</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.email">
            <td>{{ user.userName }}</td>
            <td>{{ user.email }}</td>
             <td>{{ user.bio }}</td>
            <td>
             
              <button class="btn btn-primary" @click="openEditModal(user)">
                <i class="fa-solid fa-edit"></i>
              </button>
               <button @click="deleteUser(user.id)" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>

            </td>
          </tr>
        </tbody>
      </table>
    </div>    
    <div v-else-if="error">
      <p class="error-message">{{ error }}</p>
      <p>Bu sayfaya erişim yetkiniz olmayabilir (403 Forbidden).</p>
    </div>   
    <div v-else>Kayıtlı kullanıcı bulunamadı.</div>
    <div class="card">
    <h2>Silinen Kullanıcılar</h2>
    
     <div v-if="loading">Kullanıcılar yükleniyor...</div>
      <table class="fl-table redhead" >
        <thead>
          <tr>
            <th>Kullanıcı Adı</th>
            <th>E-posta</th>
             <th>Bio</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="deluser in deletedusers" :key="deluser.email">
            <td>{{ deluser.userName }}</td>
            <td>{{ deluser.email }}</td>
             <td>{{ deluser.bio }}</td>
            <td>
             
              <button class="btn btn-recover" @click="recoverUser(deluser.id)">
               <i class="fa-solid fa-recycle"></i> Kurtar
              </button>
              
            </td>
          </tr>
          <tr v-if="deletedusers.length === 0 && !loading">
            <td colspan="4" style="text-align: center; padding: 20px">
              Silinmiş kullanıcı bulunamadı.
            </td>
          </tr>
        </tbody>
      </table>
       
      
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api"; // Yolun doğruluğundan emin ol
import modal from "../components/modal.vue";
import custominput from "../components/custominput.vue";

const isModalOpen = ref(false);
const modalVals = ref({});
const users = ref([]);
const deletedusers = ref([]);
const loading = ref(true);
const error = ref(null);

const openEditModal = (user) => {
  modalVals.value = { ...user };
  isModalOpen.value = true;
};

const fetchUsers = async () => {
  try {
    const response = await api.get("/users");
    users.value = response.data;
  } catch (err) {
    error.value = err.response?.data || "Kullanıcı listesi yüklenirken hata.";
  }
  // Loading'i burada false yapmıyoruz çünkü onMounted içinde 
  // her iki fetch bitince kapatmak daha sağlıklı olabilir veya 
  // her fonksiyon kendi loading kontrolünü yapabilir.
};

const fetchDeletedUsers = async () => {
  try {
    const response = await api.get("Users/?deleted=true");
    deletedusers.value = response.data || [];
  } catch (err) {
    error.value = err.response?.data || "Silinen kullanıcılar yüklenemedi.";
  }
};

// Sayfa ilk açıldığında çalışacak ana fonksiyon
const initData = async () => {
    loading.value = true;
    await fetchUsers();
    await fetchDeletedUsers();
    loading.value = false;
};

const updateUser = async (userid) => {
  const founded = users.value.find((user) => user.id == userid);
  let user = {};
  const newval = modalVals.value;

  if (newval.userName != founded.userName) user.userName = newval.userName;
  if (newval.bio != founded.bio) user.bio = newval.bio;
  if (newval.password) {
    if (newval.password.length > 8) user.password = newval.password;
    else {
      alert("Şifre en az 8 karakter olmalı");
      return;
    }
  }

  if (Object.keys(user).length > 0) {
    loading.value = true; // Yükleme başladı
    try {
      const response = await api.patch("users/TargetUserID", user, {
        params: { TargetUserID: userid },
      });
      // Başarılı olursa listeyi yenile
      await fetchUsers();
      isModalOpen.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  } else {
      isModalOpen.value = false; // Değişiklik yoksa modalı kapat
  }
};

const deleteUser = async (userId) => {
  if (!confirm(`Kullanıcı ID: ${userId} silinecek. Emin misiniz?`)) return;
  
  loading.value = true;
  try {
    await api.delete(`/users/${userId}`);
    // Hem aktif kullanıcıları hem silinenleri yenile
    await fetchUsers();
    await fetchDeletedUsers();
   
  } catch (err) {
    alert(err.response?.data || "Kullanıcı silinirken bir hata oluştu.");
  } finally {
    loading.value = false;
  }
};

const recoverUser = async (userId) => {
  loading.value = true;
  try {
    await api.post(`/Users/Recover/${userId}`);
    // Hem aktif kullanıcıları hem silinenleri yenile
    await fetchUsers();
    await fetchDeletedUsers();
    
  } catch (error) {
    console.log(error);
    alert("Kurtarma başarısız.");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  initData();
});
</script>

<style scoped>
.error-message {
  color: red;
}
/* Basit tablo stili */

</style>
