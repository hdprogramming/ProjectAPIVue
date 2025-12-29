<template>
 <MessageBox 
    v-if="showBox"  
    :loading="loading" 
    :error="error"
    @close="showBox = false"  
  />  
<div class="card">
    <div class="card-header">
        <h2 class="card-title">Projeler</h2>
        
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
                >
                <button class="btn btn-primary"><i class="fa-solid fa-search"></i></button>
            </div>
        </div>
    </div>
    
    <div class="table-container">
    <div class="card-navigate">
        <button class="btn btn-primary" :disabled="ProjectPageNo < 1" @click="PageBack()">
          Geri
        </button>
        <button class="btn btn-primary" v-if="projects.length != 0" @click="PageNext()">
          Sonraki Sayfa
        </button>
      </div>
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
                                       
                </tr>
            </thead>
            <tbody>
                <tr v-for="project in filteredProjects" :key="project.id" @click="router.push({ name: 'Project', params: { id: project.id } });" >
                    <td><i :class="`fa fa-2x fa-${project.icon}`" /></td>
                    <td><strong>{{project.title}}</strong></td>
                    <td>{{project.description}}</td>
                    <td>{{ new Date(project.date).toLocaleDateString('tr-TR') }}</td> 
                    <td>{{project.lastdate}}</td>
                    <td>{{project.status}}</td>
                    <td><CategoryBox :CategoriesIDs="project.categoryIds"/></td>
                   
                    
                </tr>
              
                <tr v-if="filteredProjects.length === 0 && !loading">
                    <td colspan="9" style="text-align:center; padding: 20px;">
                        Aradığınız kriterlere uygun proje bulunamadı.
                    </td>
                </tr>
                
            </tbody>
              
        </table>
    </div>
     
</div>
</template>
<style scoped>
.buttonarea{
    display:flex;
    justify-content:center;    
    align-content:center;
}
.categoryarea{
    position:relative;
    margin-top: 25px; 
    align-items:center;  
    width: 100%;
    display: flex;    
    flex-direction:column;    
    font-family: 'Poppins', sans-serif;
}

.categoryarea label{ 
    position:absolute;
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
import { ref, onMounted,computed } from "vue";
import api from '@/services/api.js'
import modal from '@/components/modal.vue'
import CategoryBox from '../components/categoriesbox.vue'
import custominput from '@/components/custominput.vue'
import StatusBox from '@/components/statusbox.vue'
import MessageBox from "@/components/messagebox.vue";
import { useAuthStore } from "@/stores/auth"; 
import {  useRouter } from "vue-router";
const authStore=useAuthStore();
const router=useRouter();
const modalVals = ref({});
const loading = ref(true);
const error = ref(null);
const success = ref(null);
const projects = ref([]);
const showBox = ref(false);
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
        const query = searchQuery.value.toLocaleLowerCase('tr');
        result = result.filter(p => 
            p.title.toLocaleLowerCase('tr').includes(query) || 
            p.description?.toLocaleLowerCase('tr').includes(query)
        );
    }

    // C. Sıralama Mantığı (Sort)
    switch (sortOption.value) {
        case 'name-asc': // A'dan Z'ye
            result.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
            break;
        case 'name-desc': // Z'den A'ya
            result.sort((a, b) => b.title.localeCompare(a.title, 'tr'));
            break;
        case 'date-new': // Tarih (Yeniden Eskiye)
            result.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date-old': // Tarih (Eskiden Yeniye)
            result.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
    }

    return result;
});
const openEditModal = (project) => {
    PageNo.value=1;
   modalVals.value = { ...project };
  isModalOpen.value = true;
};
const fetchProjects = async (page = 1, length = 4) => {
  try {    
    loading.value = true;
    let response = await api.get(`/Projects/MyProjects?page=${page}&length=${length}`);
    projects.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
    showBox.value=false;
  }
};
const updateProject=async(_id)=>{
try {
        loading.value = true;        
        let updateData = {id:_id}; // new Object() yerine {} kullanmak daha modern ve yaygındır.

// 1. Projeyi bul
const oldproject = projects.value.find((p) => p.id == _id);

// 1. Kontrol etmek istediğin alanları buraya yaz (Whitelist mantığı)
const fieldsToCheck = ['title','icon', 'description','date', 'statusID',
'categoryIds','isAlive']; 

// 2. Sadece bu alanlar için döngü kur
fieldsToCheck.forEach(field => {
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

        let response = await api.patch(`/Projects/${_id}`,updateData);        
      
    } catch (err) {
        console.error(err);
         } finally {
        fetchProjects();
        loading.value = false;
        isModalOpen.value = false;
    }
}
const fetchFiles=async()=>{
  try {
    let response=await api.get("/Uploads/MyFiles");
   console.log(response.data);
  
  } catch (err) {
    error.value=err;
  }
}
onMounted(fetchProjects);
</script>