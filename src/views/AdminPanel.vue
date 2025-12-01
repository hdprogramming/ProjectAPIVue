<template>
  <div class="admin-panel">
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
    <h2 class="card-header">Yönetici Paneli (Tüm Kullanıcılar) 👑</h2>
    <div v-if="loading">Kullanıcılar yükleniyor...</div>

    <div class="card" v-else-if="users.length > 0">
      <table>
        <thead>
          <tr>
            <th>Kullanıcı Adı</th>
            <th>E-posta</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.email">
            <td>{{ user.userName }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button @click="deleteUser(user.id)" class="btn btn-danger">Sil</button>

              <button class="btn btn-primary" @click="openEditModal(user)">
                Düzenle
              </button>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api";
import modal from "../components/modal.vue";
import custominput from "../components/custominput.vue";
const isModalOpen = ref(false);
const modalVals = ref({});
const users = ref([]);
const loading = ref(true);
const error = ref(null);

const openEditModal = (user) => {
  // ÖNEMLİ: {...user} diyerek objenin kopyasını alıyoruz.
  // Bunu yapmazsak modalda yazarken arkadaki tablo da anlık değişir (istemediğimiz durum).
  modalVals.value = { ...user };
  isModalOpen.value = true;
};
const fetchUsers = async () => {
  try {
    const response = await api.get("/users"); // GET api/users (Admin rolü gerektirir)
    users.value = response.data; 
      
  } catch (err) {
    // 403 Forbidden hatası alırsak buraya düşeriz
    error.value =
      err.response?.data ||
      "Kullanıcı listesi yüklenirken bir hata oluştu. Yetkiniz yoksa bu normaldir.";
  } finally {
    loading.value = false;
  }
};
const updateUser = async(userid)=>{
  
  const founded=users.value.find((user)=>user.id==userid);
    let user={};
  const newval=modalVals.value;
   console.log(Object.keys(newval))  
  if(newval.userName!=founded.userName)
  user.userName=newval.userName;
  if(newval.bio!=founded.bio)
  user.bio=newval.bio;
  if(newval.password)
  {
  if(newval.password.length>8)  
  user.password=newval.password;
  else{    
    alert("Şifre en az 8 karakter olmalı");
    return; 
  }      
  }
  if(Object.keys(user).length>0)
  try {
console.log(user);
    const response=await api.patch("users/TargetUserID",user,{
    params: {
        TargetUserID: userid
    }
    
});
loading.value=true;
    if(response)
    console.log(response.status);
  } catch (error) {
    console.log(error);
  }
  finally {
    loading.value = false;
    isModalOpen.value=false;
  }
}
// API'de Guid id ile silme işlemi yapıldığı için (DELETE api/users/{id})
const deleteUser = async (userId) => {
  if (!confirm(`Kullanıcı ID: ${userId} silinecek. Emin misiniz?`)) return;
  try {
    await api.delete(`/users/${userId}`);
    // Başarılı olursa listeyi yeniden yükle
    users.value = users.value.filter((u) => u.id !== userId);
     loading.value=true;
    alert("Kullanıcı başarıyla silindi.");
  } catch (err) {
    alert(err.response?.data || "Kullanıcı silinirken bir hata oluştu.");
  }
  finally {
    loading.value = false;
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
.error-message {
  color: red;
}
/* Basit tablo stili */
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
</style>
