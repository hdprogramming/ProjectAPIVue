<template>
  <div class="select-container">
    
    <select 
      class="custom-select" 
      :value="statusid" 
      @change="$emit('update:statusid', Number($event.target.value))"
      v-bind="$attrs"
    >
      <option 
        v-for="status in statusStore.StatusValues" 
        :key="status.id" 
        :value="status.id"
      >
        {{ status.name }}
      </option>
    </select>    
    
    <span class="custom-arrow">
      <i class="fa fa-chevron-down"></i>
    </span>

  </div>
</template>

<script setup>
import { useStatusStore } from '@/stores/statusStore'

const statusStore = useStatusStore()

defineProps({  
  statusid: { type: Number, default: null }
})

defineEmits(['update:statusid'])
defineOptions({ inheritAttrs: false })
</script>

<style scoped>
.select-container {
    position: relative;
    /* margin-top: 25px;  <-- BU KALDIRILDI, hizayı bozuyordu */
    width: 100%;
    display: flex;    
    font-family: 'Poppins', sans-serif;
}

/* --- SELECT KUTUSU --- */
.custom-select {
    /* CustomInput'taki inputlarla AYNI stil */
    width: 100%; 
    box-sizing: border-box; /* Padding dahil genişlik hesaplaması */
    background: linear-gradient(175deg, #ffffff 0%, #f9f9f9 100%);
    color: #333;
    
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    font-size: 10pt;
    
    /* Alt çizgi yerine tam çerçeve (Inputlarla uyumlu olması için) */
    border: 1px solid rgba(0, 0, 0, 0.1);    
    border-radius: 8px; 
    
    padding: 10px 9px 8px 10px; /* Input padding değerleriyle eşitlendi */
    padding-right: 40px; /* Ok işareti için sağdan boşluk */
    
    outline: none;
    cursor: pointer;
    transition: all 0.3s ease;
    
    /* Standart Ok İşaretini Yok Etme */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}

.custom-select:focus {
    border-color: #00b894;
    box-shadow: 0 4px 10px rgba(0, 184, 148, 0.1);
    background-color: #fff;
}

/* --- CUSTOM OK İŞARETİ --- */
.custom-arrow {
    position: absolute;
    right: 15px; /* Yüzde yerine sabit px, her zaman sağ kenarda durur */
    top: 50%;
    transform: translateY(-50%); /* Dikeyde tam ortalar */
    pointer-events: none;
    font-size: 0.8rem;
    color: #666;
    transition: transform 0.3s ease;
}

/* Select focus olunca oku döndür */
.custom-select:focus + .custom-arrow {
    transform: translateY(-50%) rotate(180deg);
    color: #00b894;
}
</style>