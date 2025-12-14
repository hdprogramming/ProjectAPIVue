<template>
  <div class="editor-wrapper">
    <div v-if="isUploading" class="upload-loader">
      Resim yükleniyor...
    </div>
    
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
import api from "@/services/api.js";
import {API_URL} from "@/services/api.js";
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);
const localContent = ref('');
const quillEditorRef = ref(null);
const isUploading = ref(false);

// --- WATCHERS ---
watch(() => props.modelValue, (newVal) => {
  if (newVal !== localContent.value) {
    localContent.value = newVal;
  }
}, { immediate: true });

watch(localContent, (newVal) => {
  emit('update:modelValue', newVal);
});

// --- API UPLOAD ---
const uploadImageToServer = async (file) => {
  const body = new FormData();
  body.append('image', file);
  body.append("name", file.name);
  
  try {
    const res = await api.post('/Uploads/Image', body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
      
      let url=res.data.url;
     
    return url; 
  
  } catch (error) {
    console.error('Resim yükleme hatası:', error);
    return null;
  }
};

// --- HANDLER ---
const imageHandler = () => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;

    isUploading.value = true;
    try {
      // Vue-Quill instance'ı üzerinden Quill nesnesini alıyoruz
      const quill = quillEditorRef.value.getQuill();
      const range = quill.getSelection(true) || { index: 0 };

      const url = await uploadImageToServer(file);

      if (url) {
        quill.insertEmbed(range.index, 'image', url);
        quill.setSelection(range.index + 1);
      }
    } catch (e) {
      console.error("Yükleme işlemi sırasında hata:", e);
    } finally {
      isUploading.value = false;
    }
  };
};

// --- CONFIGURATION ---

// 1. Toolbar butonlarını ayrı bir değişkene aldık (modules içine koymuyoruz!)
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

// 2. Modules dizisine SADECE harici eklentileri (Plugin) koyuyoruz.
const modules = [
  {
    name: 'blotFormatter',  
    module: BlotFormatter, 
    options: {}
  }
];

// 3. EN ÖNEMLİ KISIM: Editör hazır olduğunda Handler'ı ekliyoruz.
const onEditorReady = (quill) => {
  // Quill instance geldiğinde toolbar modülünü alıp, image handler'ı override ediyoruz.
  const toolbar = quill.getModule('toolbar');
  toolbar.addHandler('image', imageHandler);
};

</script>

<style scoped>
.editor-wrapper {
  position: relative;
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