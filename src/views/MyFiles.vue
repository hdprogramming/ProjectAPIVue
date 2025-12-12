<template>
  <div class="page-wrapper">
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Yüklenen Dosyalar</h2>
      </div>

      <modal v-model="isNewModalOpen">
        <div class="modal-container">
          <img class="image2x" src="../assets/image.svg" />
          <custominput xtype="CustomFile" label="resim" v-model="newFile" />
          <button class="btn btn-primary" @click="uploadImage()">Yükle</button>
        </div>
      </modal>

      <modal name="EditModal" v-model="isEditModalOpen">
        <div class="modal-container">
          <img class="image2x" :src="selectedFile.url" />
          <custominput type="text" label="Resim Adı:" v-model="selectedFile.name" />
          <button class="btn btn-primary" @click="updateFileName()">Kaydet</button>
        </div>
      </modal>

      <div class="table-container">
        <div class="file-container">
          <div class="file-content newimage" @click="newImage()">
            <img src="../assets/image.svg" />
            <label>Yeni Resim Ekle</label>
          </div>

         <FileCard v-for="file in myfiles" 
            :key="file.id" 
            :file="file"
            @click-image="editImage"
            @edit="editImage"
            @delete="deleteImage"/>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Geri Dönüşüm Kutusu</h2>
      </div>

      <div class="file-container">
        <FileCard 
            v-for="file in mydeletedfiles" 
            :key="file.id" 
            :file="file"
            :is-deleted="true"
            @recover="recoverImage"
            @permanent-delete="permanentDeleteImage"
          />
      </div>
    </div>
  </div>
</template>
<style>
.modal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.file-container {
  display: flex;
  wrap: wrap;
  gap: 10px;
  padding: 10px;
  box-shadow: --shadow-soft;
}
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
</style>
<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/services/api.js";
import modal from "@/components/modal.vue";
import custominput from "@/components/custominput.vue";
import FileCard from "@/components/FileCard.vue"
const myfiles = ref([]);
const mydeletedfiles = ref([]);
const loading = ref(true);
const error = ref(null);
const success = ref(null);
const isEditModalOpen = ref(false);
const isNewModalOpen = ref(false);
const selectedFile = ref({});
const newFile = ref({});
const newImage = async () => {
  isNewModalOpen.value = true;
};
const editImage = async (file) => {
  selectedFile.value = { ...file };
  isEditModalOpen.value = true;
};
const uploadImage = async () => {
  console.log(newFile.value);
  try {
    loading.value = true;
    let formdata = new FormData();
    formdata.append("name", newFile.value.name);
    formdata.append("image", newFile.value);
    let response = await api.post(`/Uploads/Image`, formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data) {
      isNewModalOpen.value = false;
      await fetchMyFiles();
      alert("Upload işlemi tamamdır");
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
const fetchMyFiles = async () => {
  try {
    loading.value = true;
    let response = await api.get(`/Uploads/MyFiles`);
    myfiles.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
const fetchDeletedMyFiles = async () => {
  try {
    loading.value = true;
    let response = await api.get(`/Uploads/MyDeletedFiles`);
    mydeletedfiles.value = response.data;
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
    fetchMyFiles();
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
    refresh();
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
    refresh();
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
      refresh();
      isEditModalOpen.value = false;
    } catch (error) {
      console.log(error);
      error.value = error.message;
    } finally {
      loading.value = false;
    }
};
const refresh = async () => {
  await fetchMyFiles();
  await fetchDeletedMyFiles();
};
onMounted(() => refresh());
</script>
