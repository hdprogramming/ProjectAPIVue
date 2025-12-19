<template>
   <div v-if="loading">Dosyalar yükleniyor...</div>
  <div v-if="error">Hata:{{error}}</div>
  <div class="page-wrapper">
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Yüklenen Dosyalar</h2>
      </div>  

      <div class="table-container">
        <div class="file-container">
         <FileExplorer
            Mode="Edit"
            :files="myfiles" 
            @upload="uploadImage"         
            @refresh="refresh"
            @fetchMyFiles="fetchMyFiles" />         
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h2 class="card-title" style="color:var(--danger-color)">Geri Dönüşüm Kutusu</h2>
      </div>

      <div class="file-container">
        <FileExplorer
            Mode="Deleted"
            :files="mydeletedfiles"
            @refresh="refresh"
             @fetchMyFiles="fetchMyFiles"         
          />
      </div>
    </div>
  </div>
</template>
<style>
.file-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  box-shadow: var(--shadow-soft);
}
</style>
<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/services/api.js";
import FileExplorer from "@/components/FileExplorer.vue"
const myfiles = ref([]);
const mydeletedfiles = ref([]);
const loading = ref(true);
const error = ref(null);
const success = ref(null);

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

const refresh = async () => {
  await fetchMyFiles();
  await fetchDeletedMyFiles();
};
onMounted(() => refresh());
</script>
