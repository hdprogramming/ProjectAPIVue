<template>
  <div class="formvaluearea">
    <input 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder=" " 
      v-bind="$attrs"
    />
    <label>{{ label }}</label>
  </div>
</template>

<script setup>
// v-model'in çalışması için modelValue ve etiket metni için label prop'u
defineProps({
  label: {
    type: String,
    default: 'Label'
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
})

// update:modelValue eventi v-model senkronizasyonu için gereklidir
defineEmits(['update:modelValue'])

// Attribute'ların (örneğin type="password") en dıştaki div yerine 
// direkt input'a gitmesi için inheritance'ı kapatıyoruz.
defineOptions({
  inheritAttrs: false
})
</script>

<style scoped>
.formvaluearea {
    position: relative;
    margin-top: 25px;
    width: 100%;
    display: flex;
    justify-content: center;
    font-family: 'Poppins', sans-serif;
}

.formvaluearea label {
    position: absolute;
    left: 40px;
    top: 12px;
    padding: 0 5px;
    font-weight: 500;
    font-size: 11pt;
    /* Label rengi: Arkaplan açık olduğu için orta koyulukta bir gri */
    color: rgba(0, 0, 0, 0.5); 
    transition: 0.3s ease all;
    pointer-events: none;
}

.formvaluearea input {
    /* Arkaplan: Temiz bir beyazdan çok hafif griye geçiş */
    background: linear-gradient(175deg, #ffffff 0%, #f4f4f4 66%, #e0e0e0 100%);
    
    /* Yazı rengi: Koyu gri/Siyah */
    color: #333; 
    
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    font-size: 11pt;
    border: none;
    
    /* Alt çizgi: Silik siyah */
    border-bottom: 2px solid rgba(0, 0, 0, 0.1); 
    
    border-radius: 5px;
    padding: 12px 15px;
    width: 80%;
    outline: none;
    transition: 0.3s;
}

/* Focus olunca */
.formvaluearea input:focus {
    /* Vurgu Rengi: Beyaz zeminde okunabilir koyu turkuaz/teal */
    border-bottom: 2px solid #00b894; 
    
    /* Gölge: Daha hafif ve transparan bir parlama */
    box-shadow: 0 5px 15px rgba(0, 184, 148, 0.15); 
    
    /* Hafifçe yukarı kalkma efekti eklersek şık durur */
    transform: translateY(-1px); 
}

.formvaluearea input:focus + label,
.formvaluearea input:not(:placeholder-shown) + label {
    top: -20px;
    left: 35px;
    font-size: 9pt;
    
    /* Aktif Label Rengi: Input border ile aynı renk */
    color: #00b894; 
    
    font-weight: 700;
}
</style>