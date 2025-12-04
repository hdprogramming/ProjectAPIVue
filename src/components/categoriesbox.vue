<template>
  <div class="category-manager" >
    
    <TransitionGroup name="list" tag="div" class="CategoriesDiv" :class="[EditMode ? 'EditModeBorder' : '']">
      <label v-for="(id, index) in CategoriesIDs" :key="id">
        {{ categoryStore.getCategoryName(id) }}
        
        <span v-if="props.EditMode" class="remove-icon" @click="removeCategory(id)">
          <i class="fa fa-times"></i>
        </span>
      </label>
       
    </TransitionGroup>
<div v-if="props.EditMode" class="add-section" >
      <select  v-model="selectedNewId" @change="addCategory" class="category-select">
        <option value="" disabled selected>+ Kategori Ekle</option>
        <option 
          v-for="cat in availableCategories" 
          :key="cat.id" 
          :value="cat.id"
        >
          {{ cat.name }}
        </option>
      </select>
    </div>
   

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCategoryStore } from '@/stores/categoryStore'

// Parent'tan gelen ID listesi ve güncelleme emiti
const props = defineProps({
  CategoriesIDs: {
    type: Array,
    default: () => []
  },
  EditMode:{
    type:Boolean,
    default:false
    }
})

// Değişiklikleri yukarıya (Parent'a) bildirmek için
const emit = defineEmits(['update:CategoriesIDs'])

const categoryStore = useCategoryStore()
const selectedNewId = ref("")

// --- COMPUTED: Sadece Seçili Olmayanları Listele ---
// Bu sayede adam "Elektronik" ekliyse listede bir daha "Elektronik" görmez.
const availableCategories = computed(() => {
  return categoryStore.categories.filter(c => !props.CategoriesIDs.includes(c.id))
})

// --- EKLEME FONKSİYONU ---
const addCategory = () => {
  if (!selectedNewId.value) return;

  // Mevcut listeyi kopyala ve yeniyi ekle
  const newList = [...props.CategoriesIDs, selectedNewId.value];
  
  // Parent'a yeni listeyi gönder
  emit('update:CategoriesIDs', newList);
  
  // Select'i sıfırla
  selectedNewId.value = "";
}

// --- SİLME FONKSİYONU ---
const removeCategory = (idToRemove) => {
  // Silinecek ID haricindekileri filtrele
  const newList = props.CategoriesIDs.filter(id => id !== idToRemove);
  
  // Parent'a yeni listeyi gönder
  emit('update:CategoriesIDs', newList);
}
</script>

<style scoped>
/* Ana Kapsayıcı */
.category-manager {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom:7px;
 
}
.EditModeBorder{
   border: 1px solid #00b894;
  border-radius:5px;
  max-height:80px;
}
/* Etiketlerin Kutusu */
.CategoriesDiv {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 3px;
  align-items: center;
  min-height: 30px; /* Hiç etiket yoksa bile alan kaplasın */
  padding:8px;
  
}

/* Etiket Tasarımı (Senin stilin + Silme butonu ayarı) */
.CategoriesDiv label {
  display: flex; /* İkon ve yazıyı hizalamak için */
  align-items: center;
  gap: 6px;      /* Yazı ile X arasındaki boşluk */
  
  background-color: #eff7f0;
  color: #2e7d32;
  border: 1px solid #c8e6c9; /* Rengi biraz yumuşattım */
  padding: 3px 7px;
  border-radius: 10px; /* Daha modern yuvarlaklık */
  font-size: 0.80rem;
  font-weight: 600;
  cursor: default;
  transition: all 0.2s ease;
}

/* Silme İkonu (X) */
.remove-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: transparent;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.75rem; /* X işareti biraz küçük olsun */
}

/* Silme İkonuna Hover */
.remove-icon:hover {
  background-color: #ffcdd2; /* Kırmızımsı arka plan */
  color: #d32f2f;
}

/* Select Box Tasarımı */
.category-select {
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 0.85rem;
  color: #555;
  background-color: white;
  cursor: pointer;
  outline: none;
  max-width: 200px; /* Çok geniş olmasın */
}

.category-select:hover {
  border-color: #4caf50;
}
/* Liste Animasyonları */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.8); /* Hafif küçülerek kaybolsun */
}
</style>