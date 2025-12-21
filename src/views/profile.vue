<template>
  <modal v-model="isUploadModalOpen">
    <div class="modal-container">
      <img class="image2x" :src="previewUrl" @click="openFileSelection" />
      <custominput
        ref="fileInputComponent"
        xtype="CustomFile"
        label="resim"
        v-model="newFile"
      />
      <div>
        <button class="btn btn-primary" @click="onUploadClick()">Yükle</button>
      </div>
    </div>
  </modal>
  <div class="card">
    <h2 class="card-header">Kullanıcı Profili</h2>
    <div v-if="loading">Yükleniyor...</div>
    <div v-else-if="profile">
      <form class="form-group" @submit.prevent="updateProfile">
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <img
              :src="
                profile.profileImageUrl ? profile.profileImageUrl : defaultProfileImage
              "
              alt=""
            />
           
            <button
              class="btn btn-primary btn-sm upload-button"
              @click="openUploadModal()"
            >
              <i class="fa fa-camera-retro"></i>
            </button>
          </div>
        </div>
        <div>
          <label>Kullanıcı Adı:</label>
          <input type="text" v-model="profile.userName" required />
        </div>
        <div>
          <label>E-posta:</label>
          <input type="email" :value="profile.email" disabled />
        </div>
        <div>
          <label>Biyo:</label>
          <textarea v-model="profile.bio"></textarea>
        </div>
        <div>
          <label>Yeni Parola (İsteğe Bağlı):</label>
          <input type="password" v-model="newPassword" />
        </div>
        <button class="btn btn-primary" type="submit">Profili Güncelle</button>
      </form>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">{{ success }}</p>
    </div>
    <div v-else>Profil bilgileri yüklenemedi veya erişim yetkiniz yok (403/404).</div>
  </div>
</template>
<style>
.modal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.image2x {
  border-radius: 5px;
  width: 150px;
  height: 150px;
  cursor: pointer;
}
</style>
<script setup>
import { ref, onMounted, watch, onUnmounted } from "vue";
import {GetData} from '@/stores/locker.js';
import api from "@/services/api";
import modal from "@/components/modal.vue";
import custominput from "@/components/custominput.vue";
import defaultImage from "../assets/image.svg";
import defaultProfileImage from "../assets/user.png";
const previewUrl = ref(defaultImage); // Ekranda görünecek URL
const newFile = ref();
// DOM elementine erişmek için boş bir ref oluşturuyoruz
const fileInputComponent = ref(null);
const profile = ref(null);
const newPassword = ref("");
const loading = ref(true);
const error = ref(null);
const success = ref(null);
const isUploadModalOpen = ref(false);
const currentUser=GetData();
const currentUserId = currentUser.userID // Giriş yaparken kaydettiğimiz ID
// Resme tıklanınca çalışacak fonksiyon
const openFileSelection = () => {
  // CustomInput içindeki 'triggerFileClick' fonksiyonunu uzaktan tetikliyoruz
  if (fileInputComponent.value) {
    fileInputComponent.value.triggerFileClick();
  }
};
// Dışarıdan gelen verileri (Props) tanımlıyoruz
// newFile her değiştiğinde çalışacak yapı
watch(newFile, (file, oldFile) => {
  // 1. Eğer önceki bir Blob URL varsa, hafızadan temizle (Memory Leak önlemi)
  if (oldFile && previewUrl.value !== defaultImage) {
    URL.revokeObjectURL(previewUrl.value);
  }

  // 2. Yeni dosya varsa Blob URL oluştur, yoksa varsayılanı göster
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  } else {
    previewUrl.value = defaultImage;
  }
});
const openUploadModal = async () => {
  isUploadModalOpen.value = true;
};
const onUploadClick = async () => {
  if (!newFile.value) {
    alert("Lütfen bir dosya seçin!");
    return;
  }
  profile.value.profileImageUrl=await uploadProfileImage(newFile.value);
  isUploadModalOpen.value = false;
};

const uploadProfileImage = async (newFile) => {
  
  try {
    loading.value = true;
    let formdata = new FormData();
    formdata.append("image", newFile);
    let response = await api.post(`/Uploads/ProfileImage`, formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data) {
      return response.data.url;
      alert("Profil resmi güncellendi");
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const fetchProfile = async () => {
  if (!currentUserId) {
    error.value = "Kullanıcı ID'si bulunamadı. Lütfen giriş yapın.";
    loading.value = false;
    return;
  }

  try {    
    const response = await api.get(`/users/${currentUserId}`); // GET api/users/{id}
    profile.value = response.data;
  } catch (err) {
    error.value = err.response?.data || "Profil yüklenirken bir hata oluştu.";
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
    profileImageUrl: profile.value.profileImageUrl,
  };

  // Eğer parola alanı doldurulmuşsa DTO'ya ekle
  if (newPassword.value) {
    updateData.password = newPassword.value;
  }

  try {
    await api.patch(`/users/TargetUserID`, updateData, {
      params: {
        TargetUserID: currentUserId,
      },
    }); // PATCH api/users/{id}
    success.value = "Profil başarıyla güncellendi!";
    newPassword.value = ""; // Parolayı temizle
  } catch (err) {
    error.value = err.response?.data || "Profil güncellenirken bir hata oluştu.";
  }
};
onUnmounted(() => {
  if (previewUrl.value !== defaultImage) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
onMounted(fetchProfile);
</script>
