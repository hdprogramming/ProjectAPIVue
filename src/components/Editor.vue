<template>
  <div class="editor-wrapper">
    <div v-if="isUploading" class="upload-loader">
      Resim yükleniyor...
    </div>

    <modal v-model="isImageModalOpen">
      <div class="AddImageContainer">
        <h3>Görsel Seç veya Yükle</h3>
        
        <FileExplorer
          :files="myfiles"
          @click-image="onSelectImage" 
          @upload="onUploadImage" 
        />
        
        <div style="margin-top: 10px; text-align: right;">
          <button class="btn btn-secondary" @click="isImageModalOpen = false">Kapat</button>
        </div>
      </div>
    </modal>

    <QuillEditor
      ref="quillEditorRef"
      theme="snow"
      :toolbar="toolbarOptions" 
      :modules="modules"
      contentType="html"
      v-model:content="localContent"
      style="height: 300px"
      @ready="onEditorReady"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import BlotFormatter from 'quill-blot-formatter'; 
import modal from '@/components/modal.vue';
import FileExplorer from '@/components/FileExplorer.vue';
import api from "@/services/api.js";

const props = defineProps({
  modelValue: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue']);
const localContent = ref('');
const quillEditorRef = ref(null);
const isUploading = ref(false);
const isImageModalOpen = ref(false);

const myfiles = ref([]);
const loading = ref(true);

// İMLEÇ KONUMUNU SAKLAYACAK DEĞİŞKEN (ÇOK ÖNEMLİ)
const savedRange = ref(null);

// --- WATCHERS ---
watch(() => props.modelValue, (newVal) => {
  if (newVal !== localContent.value) {
    localContent.value = newVal;
  }
}, { immediate: true });

watch(localContent, (newVal) => {
  emit('update:modelValue', newVal);
});

// --- API FETCH ---
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

// --- API UPLOAD ---
const uploadImageToServer = async (file) => {
  const body = new FormData();
  body.append('image', file);
  body.append("name", file.name);
  
  try {
    const res = await api.post('/Uploads/Image', body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    // Backend tam URL dönüyorsa direkt al, yoksa path birleştir
    return res.data.url; 
  } catch (error) {
    console.error('Resim yükleme hatası:', error);
    alert("Resim yüklenemedi!");
    return null;
  }
};

// --- CORE: RESMİ EDİTÖRE GÖMME İŞLEMİ ---
const insertToEditor = (url) => {
    const quill = quillEditorRef.value.getQuill();
    
    // Eğer kaydedilmiş bir konum varsa oraya, yoksa en başa (0) ekle
    const rangeIndex = savedRange.value ? savedRange.value.index : 0;
    
    // 1. Resmi ekle
    quill.insertEmbed(rangeIndex, 'image', url);
    
    // 2. İmleci resmin sağına at (bir sonraki karakter)
    quill.setSelection(rangeIndex + 1);
    
    // 3. Modalı kapat
    isImageModalOpen.value = false;
}

// --- EVENTS: FileExplorer'dan Gelenler ---

// A) Var olan resme tıklandığında
const onSelectImage = (file) => {
    // FileExplorer'dan gelen file objesinde .url olduğunu varsayıyoruz
    insertToEditor(file.url);
};

// B) Yeni resim yüklendiğinde
const onUploadImage = async (file) => {
    isUploading.value = true;
    // Modalı kapatmıyoruz, yükleme bitince insert yapıp kapatacağız
    
    const url = await uploadImageToServer(file);
    
    if (url) {
        insertToEditor(url);
        // İstersen listeyi de güncelle
        fetchMyFiles(); 
    }
    isUploading.value = false;
};

// --- HANDLER: Editör Butonuna Basınca ---
const imageHandler = () => {
  const quill = quillEditorRef.value.getQuill();
  
  // 1. ŞU ANKİ KONUMU KAYDET! (Focus kaybolmadan önce)
  savedRange.value = quill.getSelection(true) || { index: 0 };
  
  // 2. Dosyaları çek
  fetchMyFiles();
  
  // 3. Modalı aç
  isImageModalOpen.value = true;
};

// --- CONFIG ---
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['link', 'image', 'video'],
  ['clean']
];

const modules = [
  {
    name: 'blotFormatter',
    module: BlotFormatter, 
    options: {
      overlay: {
        style: {
          border: '2px solid red', // Seçili olduğunu belli etmek için
        }
      },
      align: {
        icons: {
          left: "<i class='fa fa-align-left'></i>", // İkonları özelleştirebilirsin
          center: "<i class='fa fa-align-center'></i>",
          right: "<i class='fa fa-align-right'></i>"
        }
      }
    }
  }
];

const onEditorReady = (quill) => {
  const toolbar = quill.getModule('toolbar');
  toolbar.addHandler('image', imageHandler);
};
</script>

<style scoped>
.editor-wrapper {
  position: relative;
}
.AddImageContainer{
  display:flex;
  flex-direction:column;
  align-items:center;
  padding: 5px;
}
.AddImageContainer h3{
  color:green;
  margin-bottom:10px;
}
.upload-loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  font-weight: bold;
  color: #333;
  font-family: sans-serif;
}
</style>