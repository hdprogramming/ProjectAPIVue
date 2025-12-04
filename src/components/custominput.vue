<template>
  <div class="form-wrapper">
    
    <div class="formvaluearea" v-if="xtype === 'General'">
       <input 
         :id="uniqueId"
         :value="modelValue"
         @input="$emit('update:modelValue', $event.target.value)"
         v-bind="$attrs"
         placeholder=" "
       />
       <label :for="uniqueId">{{ label }}</label>
    </div>

    <div v-if="xtype === 'Checkbox'" class="checkbox-wrapper">
       <input 
         type="checkbox"
         :id="uniqueId"
         :checked="modelValue" 
         @change="$emit('update:modelValue', $event.target.checked)"
       />
       <label :for="uniqueId" class="chk-label">{{ label }}</label>
    </div>

    <div class="formvaluearea" v-if="xtype === 'Textarea'">
       <textarea 
         :id="uniqueId"   
         :value="modelValue"
         @input="$emit('update:modelValue', $event.target.value)"
         placeholder=" "
         v-bind="$attrs"
       ></textarea>
       <label :for="uniqueId">{{ label }}</label>
    </div>

    <div class="formvaluearea" v-if="xtype === 'CategoryBox'">
        <CategoryBox 
            EditMode="true"
            v-model:CategoriesIDs="proxyModel" 
        />
        <label :for="uniqueId" class="static-label">{{ label }}</label>
    </div>

     <div class="formvaluearea" v-if="xtype === 'StatusBox'">
        <StatusBox                        
            v-model:statusid="proxyModel" 
            v-bind="$attrs"
        />
        <label :for="uniqueId" class="static-label">{{ label }}</label>
    </div>
    <div class="formvaluearea" v-if="xtype === 'Date'">
       <input 
         type="date"
         :id="uniqueId"
         :value="dateModel" 
         @input="handleDateUpdate($event.target.value)"
         v-bind="$attrs"
       />
       <label :for="uniqueId" class="static-label">{{ label }}</label>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import CategoryBox from '../components/categoriesbox.vue'
import StatusBox from '@/components/statusbox.vue'

const props = defineProps({
  label: { type: String, default: 'Label' },
  xtype:{ type: String, default: "General" },
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

defineOptions({ inheritAttrs: false })

const uniqueId = computed(() => `field-${Math.random().toString(36).substr(2, 9)}`)

const proxyModel = computed({
    get() { return props.modelValue },
    set(val) { emit('update:modelValue', val); }
})
/* --- TARİH FORMATLAMA MANTIĞI --- */

// 1. Gelen Veriyi (modelValue) Input'un anlayacağı YYYY-MM-DD formatına çevir
const dateModel = computed(() => {
  if (!props.modelValue) return '';
  
  // Eğer gelen veri "2023-12-05T00:00:00" gibiyse sadece ilk 10 karakteri al
  if (typeof props.modelValue === 'string') {
     return props.modelValue.substring(0, 10);
  }
  
  // Eğer gelen veri JS Date Objesi ise stringe çevir
  if (props.modelValue instanceof Date) {
     return props.modelValue.toISOString().split('T')[0];
  }

  return props.modelValue;
});

// 2. Inputtan seçilen tarihi (YYYY-MM-DD) olduğu gibi yukarı emit et
const handleDateUpdate = (val) => {
  // Eğer backend TAM tarih istiyorsa (Örn: 2023-10-20T00:00:00) burayı açabilirsin:
  // val = val + 'T00:00:00'; 
  
  // Genelde backend sadece string tarihi (2023-10-20) kabul eder, bu yeterlidir:
    emit('update:modelValue', val);
}
</script>

<style scoped>
/* Genel Wrapper */
.form-wrapper {
    width: 100%;
    margin-bottom: 20px;
    font-family: 'Poppins', sans-serif;
}

.formvaluearea {
    position: relative;
    width: 100%;   
}

/* Input ve Textarea stilleri */
.formvaluearea input,
.formvaluearea textarea {
    width: 100%; 
    box-sizing: border-box; 
    background: linear-gradient(175deg, #ffffff 0%, #f9f9f9 100%);
    color: #333;    
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    font-size: 10pt;
    border: 1px solid rgba(0, 0, 0, 0.1);    
    border-radius: 8px; 
    padding: 16px 15px 12px 15px; 
    outline: none;
    transition: all 0.3s ease;
}

.formvaluearea textarea {
    min-height: 70px;
    resize: vertical;
}

/* Dinamik Label (Floating Label) */
.formvaluearea label {
    position: absolute;
    left: 15px;
    top: 50%; 
    transform: translateY(-50%);
    padding: 0 5px;
    font-weight: 500;
    font-size: 11pt;
    color: #999; 
    transition: 0.3s ease all;
    pointer-events: none;
    background-color: transparent;
}

/* Textarea Label düzeltmesi */
.formvaluearea textarea + label {
    top: 20px;
    transform: none;
}

/* Focus Efektleri */
.formvaluearea input:focus,
.formvaluearea textarea:focus {
    border-color: #00b894;
    box-shadow: 0 4px 10px rgba(0, 184, 148, 0.1);
    background: #fff;
}

/* Label Animasyonu (Yukarı Kayma) */
.formvaluearea input:focus + label,
.formvaluearea textarea:focus + label,
.formvaluearea input:not(:placeholder-shown) + label,
.formvaluearea textarea:not(:placeholder-shown) + label {
    top: -10px;
    left: 10px;
    font-size: 9pt;
    color: #00b894;
    font-weight: 600;
    background-color: #fff; 
    transform: translateY(0);
    border-radius: 4px;
    z-index: 2; /* Çizgilerin üstünde dursun */
}

/* --- STATİK LABEL (CategoryBox ve StatusBox için) --- */
/* Bu bileşenlerde floating effect zor olduğu için label'ı her zaman yukarıda (aktif) tutuyoruz */
.formvaluearea .static-label {
    top: -10px !important; /* Diğer inputların aktif haliyle aynı hiza */
    left: 10px !important;
    font-size: 9pt !important;
    color: #00b894 !important; 
    font-weight: 600 !important;
    background-color: #fff; 
    transform: translateY(0) !important;
    border-radius: 4px;
    z-index: 2;
}

/* Checkbox */
.checkbox-wrapper {
    display: flex;    
    align-items: center; 
    margin-top: 15px;
    padding-left: 5px;
    cursor: pointer;
}

.checkbox-wrapper input[type="checkbox"] {
    width: 20px; 
    height: 20px;
    margin-right: 10px;
    accent-color: #00b894;
    cursor: pointer;  
}

.checkbox-wrapper .chk-label {
    font-size: 10pt;
    color: #555;
    cursor: pointer;
    font-weight: 500;
}
</style>