<template>  
<template v-if="!DeletedFiles">
    <modal v-model="isNewModalOpen">
        <div class="modal-container">
          <img class="image2x" :src="previewUrl"  />
          <custominput xtype="CustomFile" label="resim" v-model="newFile" />
          <button class="btn btn-primary" @click="onUploadClick()">Yükle</button>
        </div>
      </modal>
 <div class="file-content newimage" @click="newImage()">
            <img src="../assets/image.svg" />
            <label>Yeni Resim Ekle</label>
          </div>
          </template>
  <div class="file-container">
  <div class="file-content" v-for="file in files" :key="file.id">
    <img class="image" :src="file.url" @click="$emit('click-image', file)" />
    <label>{{ file.name }}</label>

    <div class="action-buttons">
      
      <template v-if="!DeletedFiles">
        <button class="btn btn-primary btn-sm" @click="$emit('edit', file)">
          <i class="fa-solid fa-edit"></i>
        </button>
        <button class="btn btn-warning btn-sm" @click="$emit('delete', file.id)">
          <i class="fa-solid fa-trash"></i>
        </button>
      </template>

      <template v-else>
        <button class="btn btn-recover btn-sm" @click="$emit('recover', file.id)">
          <i class="fa-solid fa-recycle"></i>
        </button>
        <button class="btn btn-danger btn-sm" @click="$emit('permanent-delete', file.id)">
          <i class="fa-solid fa-fire"></i>
        </button>
      </template>

    </div>
  </div>
  </div>
</template>

<script setup>
import {ref,watch,onUnmounted} from "vue";
import modal from "@/components/modal.vue";
import custominput from "@/components/custominput.vue";
// Placeholder görseli import ediyoruz (Vite/Webpack yolu bulsun diye)
import defaultImage from '../assets/image.svg'
const previewUrl = ref(defaultImage) // Ekranda görünecek URL
const isNewModalOpen = ref(false);
const newFile=ref();
// Dışarıdan gelen verileri (Props) tanımlıyoruz
// newFile her değiştiğinde çalışacak yapı
watch(newFile, (file, oldFile) => {
  // 1. Eğer önceki bir Blob URL varsa, hafızadan temizle (Memory Leak önlemi)
  if (oldFile && previewUrl.value !== defaultImage) {
    URL.revokeObjectURL(previewUrl.value)
  }

  // 2. Yeni dosya varsa Blob URL oluştur, yoksa varsayılanı göster
  if (file) {
    previewUrl.value = URL.createObjectURL(file)
  } else {
    previewUrl.value = defaultImage
  }
})

const newImage = async () => {
  isNewModalOpen.value = true;
};
const props = defineProps({
  files: {
    type: Array,
    required: true
  },
  DeletedFiles: {
    type: Boolean,
    default: false // Varsayılan olarak normal dosya muamelesi yap
  }
})
const onUploadClick = () => {
  // 1. Önce dosya seçilmiş mi kontrol et (Güvenlik)
  if (!newFile.value) {
    alert("Lütfen bir dosya seçin!");
    return;
  }

  // 2. Parent'a 'upload' sinyaliyle beraber DOSYAYI gönder
  emit('upload', newFile.value);

  // 3. Temizlik yap (UX için önemli)
  isNewModalOpen.value = false; // Modalı kapat
  newFile.value = null;         // Dosya değişkenini sıfırla
};
// Bileşen ekrandan giderse son kalan URL'i de temizleyelim
onUnmounted(() => {
  if (previewUrl.value !== defaultImage) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
// Dışarıya haber vereceğimiz olayları (Emits) tanımlıyoruz
const emit = defineEmits(['upload','edit', 'delete', 'recover', 'permanent-delete', 'click-image'])
</script>

<style scoped>
.file-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.file-container label {
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
  width: 100px;
  height: 100px;
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