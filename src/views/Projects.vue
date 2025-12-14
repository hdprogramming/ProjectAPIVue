<template>
  <div v-if="loading">Kullanıcılar yükleniyor...</div>
  <div v-if="error">Hata:{{error}}</div>
  <div class="card">
    <div class="card-header">
      <h2 class="card-title">Proje Yönetimi</h2>

      <div class="header-actions">
        <select v-model="sortOption" id="tableFilter" class="form-select">
          <option value="date-new">Tarih (Yeniden Eskiye)</option>
          <option value="date-old">Tarih (Eskiden Yeniye)</option>
          <option value="name-asc">İsim (A-Z)</option>
          <option value="name-desc">İsim (Z-A)</option>
        </select>

        <div class="search-row">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Proje ara..."
          />
          <button class="btn btn-primary"><i class="fa-solid fa-search"></i></button>
        </div>
      </div>
    </div>
    <modal v-model="isModalOpen">
      <div class="form-group">
        <h2>Projeyi Düzenle</h2>
        <div v-if="ModalPageNo == 1">
          <custominput
            label="Proje Simgesi"
            xtype="IconPicker"
            v-model="modalVals.icon"
          />
          <custominput label="Proje Adı" v-model="modalVals.title" />
          <custominput
            xtype="Textarea"
            label="Açıklama"
            v-model="modalVals.description"
          />
          <custominput
            type="checkbox"
            xtype="Checkbox"
            label="Yayındamı"
            v-model="modalVals.isAlive"
          />
        </div>
        <div v-if="ModalPageNo == 2">
          <custominput
            xtype="CategoryBox"
            label="Kategoriler"
            v-model="modalVals.categoryIds"
          />
          <custominput xtype="StatusBox" label="Durum" v-model="modalVals.statusID" />
          <custominput
            v-if="isAdmin"
            xtype="Date"
            label="Tarih"
            v-model="modalVals.date"
          />
          <custominput 
           xtype="Editor"
           label="İçerik"
           v-model="modalVals.content"
           />
        </div>
        <div class="buttonarea">
          <button class="btn btn-primary" @click="updateProject(modalVals.id)">
            Güncelle
          </button>
          <button
            v-if="ModalPageNo < maxpage"
            class="btn btn-primary"
            @click="ModalPageNext()"
          >
            <i class="fa fa-arrow-right"></i> İleri
          </button>
          <button v-if="ModalPageNo > 1" class="btn btn-primary" @click="ModalPageBack()">
            <i class="fa fa-arrow-left"></i> Geri
          </button>
        </div>
      </div>
    </modal>

    <div class="table-container">
      <table class="fl-table">
        <thead>
          <tr>
            <th>Simge</th>
            <th>Proje Adı</th>
            <th>Açıklama</th>
            <th>Tarih</th>
            <th>Son Değiştirme</th>
            <th>Durum</th>
            <th>Kategoriler</th>
            <th>Yayında mı?</th>
            <th v-if="isAuthenticated" style="text-align: center">İşlem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in filteredProjects" :key="project.id">
            <td><i :class="`fa fa-2x fa-${project.icon}`" /></td>
            <td>
              <strong>{{ project.title }}</strong>
            </td>
            <td>{{ project.description }}</td>
            <td>{{ new Date(project.date).toLocaleDateString("tr-TR") }}</td>
            <td>{{ project.lastdate }}</td>
            <td>{{ project.status }}</td>
            <td><CategoryBox :CategoriesIDs="project.categoryIds" /></td>
            <td>
              <span :class="project.isAlive ? 'text-success' : 'text-danger'">
                {{ project.isAlive ? "Evet" : "Hayır" }}
              </span>
            </td>
            <td v-if="isAuthenticated" style="text-align: center">
              <div style="display: flex; flex-direction: row">
                <button class="btn btn-primary btn-sm" @click="openEditModal(project)">
                  <i class="fa-solid fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" @click="deleteProject(project.id)">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="filteredProjects.length === 0 && !loading">
            <td colspan="9" style="text-align: center; padding: 20px">
              Aradığınız kriterlere uygun proje bulunamadı.
            </td>
          </tr>
        </tbody>
      </table>

      <div class="card-navigate">
        <button class="btn btn-primary" v-if="ProjectPageNo > 1" @click="PageBack()">
          Geri
        </button>
        <button class="btn btn-primary" v-if="projects.length != 0" @click="PageNext()">
          Sonraki Sayfa
        </button>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h2 class="card-title">Silinen Projeler</h2>
    </div>
    <div class="table-container">
      <table class="fl-table redhead">
        <thead>
          <tr>
            <th>Simge</th>
            <th>Proje Adı</th>
            <th>Açıklama</th>
            <th>Tarih</th>
            <th>Son Değiştirme</th>
            <th>Durum</th>
            <th>Kategoriler</th>
            <th>Yayında mı?</th>
            <th v-if="isAuthenticated" style="text-align: center">İşlem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in deletedprojects" :key="project.id">
            <td><i :class="`fa fa-2x fa-${project.icon}`" /></td>
            <td>
              <strong>{{ project.title }}</strong>
            </td>
            <td>{{ project.description }}</td>
            <td>{{ new Date(project.date).toLocaleDateString("tr-TR") }}</td>
            <td>{{ project.lastdate }}</td>
            <td>{{ project.status }}</td>
            <td><CategoryBox :CategoriesIDs="project.categoryIds" /></td>
            <td>
              <span :class="project.isAlive ? 'text-success' : 'text-danger'">
                {{ project.isAlive ? "Evet" : "Hayır" }}
              </span>
            </td>
            <td v-if="isAuthenticated" style="text-align: center">
              <div style="display: flex; flex-direction: row">
                <button
                  class="btn btn-recover btn-sm"
                  @click="recoverProject(project.id)"
                >
                  <i class="fa-solid fa-recycle"></i>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="deletedprojects.length === 0 && !loading">
            <td colspan="9" style="text-align: center; padding: 20px">
              Silinmiş proje bulunamadı.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>

.buttonarea {
  display: flex;
  justify-content: center;
  align-content: center;
}
.categoryarea {
  position: relative;
  margin-top: 25px;
  align-items: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: "Poppins", sans-serif;
}

.categoryarea label {
  position: absolute;
  top: -20px;
  left: 35px;
  padding: 0 5px;
  font-size: 9pt;
  /* Aktif Label Rengi: Input border ile aynı renk */
  color: #00b894;
  font-weight: 700;
  transition: 0.3s ease all;
  pointer-events: none;
}
</style>
<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/services/api.js";
import modal from "@/components/modal.vue";
import CategoryBox from "../components/categoriesbox.vue";
import custominput from "@/components/custominput.vue";
import StatusBox from "@/components/statusbox.vue";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const isModalOpen = ref(false);
const maxpage = 2;
const modalVals = ref({});
const loading = ref(true);
const error = ref(null);
const success = ref(null);
const projects = ref([]);
const deletedprojects = ref([]);
const ModalPageNo = ref(1);
const ModalPageNext = () => {
  if (ModalPageNo.value + 1 <= maxpage) ModalPageNo.value += 1;
};
const ModalPageBack = () => {
  if (ModalPageNo.value - 1 > 0) ModalPageNo.value -= 1;
};
const ProjectPageNo = ref(1);
const PageNext = () => {
  ProjectPageNo.value += 1;
  fetchProjects(ProjectPageNo.value);
};
const PageBack = () => {
  if (ProjectPageNo.value - 1 > 0) ProjectPageNo.value -= 1;
  fetchProjects(ProjectPageNo.value);
};
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAdmin = computed(() => authStore.isAdmin);
// 1. Filtreleme Değişkenleri
const searchQuery = ref(""); // Arama kutusu buna bağlanacak
const sortOption = ref("date-new"); // Select kutusu buna bağlanacak
const filteredProjects = computed(() => {
  // A. Önce Orijinal Verinin Kopyasını Al
  let result = [...projects.value];

  // B. Arama Filtresi (Search)
  if (searchQuery.value) {
    const query = searchQuery.value.toLocaleLowerCase("tr");
    result = result.filter(
      (p) =>
        p.title.toLocaleLowerCase("tr").includes(query) ||
        p.description?.toLocaleLowerCase("tr").includes(query)
    );
  }

  // C. Sıralama Mantığı (Sort)
  switch (sortOption.value) {
    case "name-asc": // A'dan Z'ye
      result.sort((a, b) => a.title.localeCompare(b.title, "tr"));
      break;
    case "name-desc": // Z'den A'ya
      result.sort((a, b) => b.title.localeCompare(a.title, "tr"));
      break;
    case "date-new": // Tarih (Yeniden Eskiye)
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case "date-old": // Tarih (Eskiden Yeniye)
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
  }

  return result;
});
const openEditModal = (project) => {
  ModalPageNo.value = 1;
  modalVals.value = { ...project };
  isModalOpen.value = true;
};
const fetchProjects = async (page = 1, length = 3) => {
  try {
    loading.value = true;
    let response = await api.get(`/Projects/MyProjects?page=${page}&length=${length}`);
    projects.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
const fetchDeletedProjects = async (page = 1, length = 10) => {
  try {
    loading.value = true;
    let response = await api.get(
      `/Projects/MyDeletedProjects?page=${page}&length=${length}`
    );
    deletedprojects.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
const updateProject = async (_id) => {
  try {
    loading.value = true;
    let updateData = { id: _id }; // new Object() yerine {} kullanmak daha modern ve yaygındır.

    // 1. Projeyi bul
    const oldproject = projects.value.find((p) => p.id == _id);

    // 1. Kontrol etmek istediğin alanları buraya yaz (Whitelist mantığı)
    const fieldsToCheck = [
      "title",
      "icon",
      "description",
      "date",
      "statusID",
      "categoryIds",
      "isAlive",
    ];

    // 2. Sadece bu alanlar için döngü kur
    fieldsToCheck.forEach((field) => {
      // Hem oldproject'te hem modalVals'te bu alanın varlığını ve farkını kontrol et
      const oldValue = oldproject[field];
      const newValue = modalVals.value[field];

      // Değerler eşit değilse updateData'ya ekle
      if (oldValue != newValue) {
        updateData[field] = newValue;
      }
    });
    console.log(updateData);
    // Sonuç: updateData sadece değişen alanları içerir.

    let response = await api.patch(`/Projects/${_id}`, updateData);
  } catch (error) {
    console.error(error);
  } finally {
    fetchProjects();
    loading.value = false;
    isModalOpen.value = false;
  }
};
const deleteProject = async (_id) => {
  if (confirm("Projeyi silmek istediğinizden eminmisiniz?"))
    try {
      let response = await api.delete(`/Projects/${_id}`);
    } catch (error) {
      console.error(error);
    } finally {
      refresh();
      loading.value = false;
    }
};
const recoverProject = async (_id) => {
  try {
    let response = await api.post(`/Projects/Recover/${_id}`);
  } catch (error) {
    console.error(error);
  } finally {
    refresh();
    loading.value = false;
  }
};
const fetchFiles = async () => {
  try {
    let response = await api.get("/Uploads/MyFiles");
    console.log(response.data);
  } catch (error) {}
};
const refresh = async () => {
  await fetchProjects();
  await fetchDeletedProjects();
};
onMounted(refresh);
</script>
