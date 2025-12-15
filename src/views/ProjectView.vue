<template>
  <div class="detail-page">
    <modal v-model="isModalOpen">
      <div class="form-group">
        <h2>Projeyi Düzenle</h2>
        <div>
          <custominput
            label="Proje Simgesi"
            xtype="IconPicker"
            v-model="modalVals.icon"
          />
          <custominput label="Proje Adı" v-model="modalVals.title" />

          <custominput
            type="checkbox"
            xtype="Checkbox"
            label="Yayındamı"
            v-model="modalVals.isAlive"
          />
          <custominput xtype="StatusBox" label="Durum" v-model="modalVals.statusID" />

          <custominput xtype="Editor" label="İçerik" v-model="modalVals.content" />
        </div>

        <div class="buttonarea">
          <button class="btn btn-primary" @click="updateProject(modalVals.id)">
            Güncelle
          </button>
        </div>
      </div>
    </modal>
    <div v-if="loading" class="loading-state">
      <i class="fa fa-spinner fa-spin"></i> Veriler güncelleniyor...
    </div>

    <div v-else-if="error" class="error-state">Dosya bulunamadı veya silinmiş.</div>

    <div v-else>
      
      <div class="content">
        <div style="display: flex; flex-direction: row">
           <h2><i class="fa-solid fa-xl" :class="'fa-'+ project.icon"></i> {{ project.title }}</h2>
        </div>
        <div v-html="project.content"></div>
      </div>

      <div class="meta-info">
        <h4>
          Proje Durumu: <label>{{ project.status }}</label>
        </h4>
        <button
          v-if="isAuthenticated"
          class="btn btn-primary btn-sm"
          @click="openEditModal(project)"
        >
          <i class="fa-solid fa-edit"></i> Düzenle
        </button>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center">
        <button class="btn btn-recover" @click="router.push('/')">Geri</button>
      </div>
    </div>
  </div>
</template>
<style>
.content {
  margin: 30px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.meta-info {
  margin: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.meta-info h4 {
  color: green;
}
.meta-info h4 label {
  font-weight: 200;
  color: black;
}
</style>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api.js";
import modal from "@/components/modal.vue";
import custominput from "@/components/custominput.vue";
import { useAuthStore } from "@/stores/auth";
import DOMPurify from 'dompurify';
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAdmin = computed(() => authStore.isAdmin);
const route = useRoute();
const router = useRouter();
const project = ref({});
const modalVals = ref({});
const loading = ref(true);
const error = ref(null);
const isModalOpen = ref(false);

const openEditModal = (project) => {
  modalVals.value = { ...project };
  isModalOpen.value = true;
};
const updateProject = async (_id) => {
  try {
    loading.value = true;
    let updateData = { id: _id }; // new Object() yerine {} kullanmak daha modern ve yaygındır.

    const oldproject = project;

    // 1. Kontrol etmek istediğin alanları buraya yaz (Whitelist mantığı)
    const fieldsToCheck = ["title", "icon", "content", "statusID", "isAlive"];

    // 2. Sadece bu alanlar için döngü kur
    fieldsToCheck.forEach((field) => {
      // Hem oldproject'te hem modalVals'te bu alanın varlığını ve farkını kontrol et
      const oldValue = oldproject[field];
      const newValue = modalVals.value[field];

      // Değerler eşit değilse updateData'ya ekle
      if (oldValue != newValue ) {
        if (field == "content") {
          updateData[field] = DOMPurify.sanitize(newValue||'',{
    ADD_TAGS: ['iframe'], // Videolara izin ver
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target'] // Gerekli özelliklere izin ver
  });
        } else {
          updateData[field] = newValue;
        }
      }
    });
    console.log(updateData);
    // Sonuç: updateData sadece değişen alanları içerir.

    let response = await api.patch(`/Projects/${_id}`, updateData);
  } catch (error) {
    console.error(error);
  } finally {
    init(_id);
    loading.value = false;
    isModalOpen.value = false;
  }
};
const init = async (id) => {
  try {
    loading.value = true;
    // Gidip veritabanından en taze bilgiyi alıyoruz
    const res = await api.get(`/Projects/${id}`);
    project.value = res.data;
  } catch (e) {
    error.value = "Veri çekilemedi";
    console.error(e);
  } finally {
    loading.value = false;
  }
};
onMounted(async () => {
  // URL'deki ID'yi al: /detail/152 -> 152
  const id = route.params.id;

  await init(id);
});
</script>
