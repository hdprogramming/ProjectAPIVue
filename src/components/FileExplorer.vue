<template>
  <modal name="EditModal" v-model="isEditModalOpen" v-if="Mode === 'Edit'">
    <div class="modal-container">
      <img class="image2x" :src="selectedFile.url" />
      <custominput type="text" label="Resim Adı:" v-model="selectedFile.name" />
      <button class="btn btn-primary" @click="updateFileName()">Kaydet</button>
    </div>
  </modal>

  <modal v-model="isNewModalOpen">
    <div class="modal-container">
      <img class="image2x" :src="previewUrl" @click="openFileSelection"/>
      <custominput ref="fileInputComponent" xtype="CustomFile" label="resim" v-model="newFile" />
      <button class="btn btn-primary" @click="onUploadClick()">Yükle</button>
    </div>
  </modal>

  <div class="file-container">    
    <div 
        class="file-content newimage" 
        v-if="Mode==='Edit'||Mode==='Select'" 
        @click="newImage()"
    >
      <img :src="defaultImage" />
      <label>Yeni Resim Ekle</label>
    </div>

    <div class="file-content" v-for="file in files" :key="file.id">
      <img class="image" :src="file.url" @click="onImageClick(file)" />
      <label>{{ file.name }}</label>

      <div v-if="Mode !== 'Select'" class="action-buttons">
         <template v-if="Mode === 'Edit'">
           <button class="btn btn-primary btn-sm" @click="editImage(file)">
             <i class="fa-solid fa-edit"></i>
           </button>
           <button class="btn btn-warning btn-sm" @click="deleteImage(file.id)">
             <i class="fa-solid fa-trash"></i>
           </button>
         </template>
          <template v-if="Mode === 'Deleted'">
           <button class="btn btn-primary btn-sm" @click="recoverImage(file.id)">
             <i class="fa-solid fa-recycle"></i>
           </button>
           <button class="btn btn-danger btn-sm" @click="permanentDeleteImage(file.id)">
             <i class="fa-solid fa-burn"></i>
           </button>
         </template>
         </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";
import modal from "@/components/modal.vue";
import api from "@/services/api.js";
import custominput from "@/components/custominput.vue";
// Placeholder görseli import ediyoruz (Vite/Webpack yolu bulsun diye)
import defaultImage from "../assets/image.svg";
const previewUrl = ref(defaultImage); // Ekranda görünecek URL
const isNewModalOpen = ref(false);
const newFile = ref();
// DOM elementine erişmek için boş bir ref oluşturuyoruz
const fileInputComponent = ref(null);

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

const props = defineProps({
  files: {
    type: Array,
    required: true,
  },
  Mode: {
    type: String,
    default: "Select", // Varsayılan olarak normal dosya muamelesi yap
  },
});
const loading = ref(true);
const error = ref(null);
const success = ref(null);
const isEditModalOpen = ref(false);
const selectedFile = ref({});
//API fomskiyonlar backend-frontend iletişimi
const editImage = async (file) => {
  selectedFile.value = { ...file };
  isEditModalOpen.value = true;
};
const newImage = async () => {
  isNewModalOpen.value = true;
};
const onImageClick = (file) => {
  if (props.Mode === 'Select') {
    // Editörden açıldıysa, seçilen dosyayı yukarı fırlat
    emit('click-image', file);
  } else if (props.Mode === 'Edit') {
    // Yönetim panelindeyse, düzenleme modalını aç
    editImage(file);
  }
  // Deleted modundaysa genelde tıklayınca bir şey olmaz, butonlar kullanılır
};
const uploadImage = async (newFile) => {
  console.log(newFile.value);
  try {
    loading.value = true;
    let formdata = new FormData();
    formdata.append("name", newFile.name);
    formdata.append("image", newFile);
    let response = await api.post(`/Uploads/Image`, formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data) {
      await emit("fetchMyFiles");
      alert("Upload işlemi tamamdır");
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
const updateFileName = async () => {
  let id = selectedFile.value.id;

  try {
    loading.value = true;
    let data = { name: selectedFile.value.name };
    let response = await api.put(`/Uploads/Update/${id}`, data);
    await emit("fetchMyFiles");
    isEditModalOpen.value = false;
  } catch (error) {
    console.log(error);
    error.value = error.message;
  } finally {
    loading.value = false;
  }
};
const deleteImage = async (id) => {
  try {
    loading.value = true;
    let response = await api.delete(`/Uploads/Delete/${id}`);
    await emit("refresh");
    isEditModalOpen.value = false;
  } catch (error) {
    console.log(error);
    error.value = error.message;
  } finally {
    loading.value = false;
  }
};
const recoverImage = async (id) => {
  try {
    loading.value = true;
    let response = await api.post(`/Uploads/Recover/${id}`);
    await emit("refresh");
    isEditModalOpen.value = false;
  } catch (error) {
    console.log(error);
    error.value = error.message;
  } finally {
    loading.value = false;
  }
};
const permanentDeleteImage = async (id) => {
  if (confirm("Kalıcı olarak silinecek eminmisiniz?"))
    try {
      loading.value = true;
      let response = await api.delete(`/Uploads/Permanent/${id}`);
      await emit("refresh");
      isEditModalOpen.value = false;
    } catch (error) {
      console.log(error);
      error.value = error.message;
    } finally {
      loading.value = false;
    }
};

const onUploadClick = () => {
  // 1. Önce dosya seçilmiş mi kontrol et (Güvenlik)
  if (!newFile.value) {
    alert("Lütfen bir dosya seçin!");
    return;
  }

  // 2. Parent'a 'upload' sinyaliyle beraber DOSYAYI gönder
  emit("upload", newFile.value);

  // 3. Temizlik yap (UX için önemli)
  isNewModalOpen.value = false; // Modalı kapat
  newFile.value = null; // Dosya değişkenini sıfırla
};
// Bileşen ekrandan giderse son kalan URL'i de temizleyelim
onUnmounted(() => {
  if (previewUrl.value !== defaultImage) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
// Dışarıya haber vereceğimiz olayları (Emits) tanımlıyoruz
const emit = defineEmits(["click-image", "upload", "refresh", "fetchMyFiles"]);
</script>

<style scoped>
.modal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  
}
.file-container{
  background-color:#fff;
  
}
.file-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image {
  border-radius: 5px;
  width: 50px;
  height: 50px;
  cursor: pointer;
}
.newimage {
  position: relative;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.12));
}

.newimage:hover {
  transform: translateY(-2px);
  filter: drop-shadow(0 10px 20px rgba(128, 203, 153, 0.6));
}

.newimage:active {
  transform: translateY(1px);
  filter: drop-shadow(0 2px 4px rgba(128, 203, 153, 0.8));
}
.newimage img {
  width: 80px;
  height: 80px;
}

.image2x {
  border-radius: 5px;
  width: 150px;
  height: 150px;
  cursor: pointer;
}
.action-buttons {
  display: flex;
  gap: 5px;
  margin-top: 5px;
}
</style>
