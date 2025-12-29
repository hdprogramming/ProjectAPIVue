<template>
  <Transition name="fade">
    <div v-if="isVisible" class="notification-overlay">
      <div class="notification-box" :class="computedType">
        
        <div class="icon-area">
          <div v-if="loading" class="spinner"></div>
          
          <template v-else>
            <span v-if="computedType === 'success'">✅</span>
            <span v-else-if="computedType === 'error'">❌</span>
            <span v-else-if="computedType === 'warning'">⚠️</span>
            <span v-else>ℹ️</span>
          </template>
        </div>

        <div class="content-area">
          <h3 class="title">{{ computedTitle }}</h3>
          <p class="message">{{ computedMessage }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';

const props = defineProps({
  Title: { type: String, default: '' },
  Message: { type: String, default: '' },
  Duration: { type: Number, default: 800 }, //Duration is milisecond 
  loading: { type: Boolean, default: false },
  error: { type: [String, Object], default: null },
  success :{ type: [String, Object], default: null },
  Type: { type: String, default: 'info' } // Eksik olan Type prop'unu da ekledim
});

const emit = defineEmits(['close']);
const isVisible = ref(false);
let timer = null;

// --- COMPUTED LOGIC ---

// Mesajı Belirle
const computedMessage = computed(() => {
  if (props.loading) return 'İşlem yapılıyor...';
  if (props.error) return typeof props.error === 'string' ? props.error : 'Bir hata oluştu';
  if (props.success) return typeof props.success === 'string' ? props.success : props.Message;
  return props.Message;
});

// Tipi (Rengi) Belirle
const computedType = computed(() => {
  if (props.loading) return 'info';
  if (props.error) return 'error';
  if (props.success) return 'success';
  return props.Type;
});

// Başlığı Belirle
const computedTitle = computed(() => {
  const defaults = {
    success: 'Başarılı',
    error: 'Hata',
    warning: 'Dikkat',
    info: 'Bilgi'
  };
  if (props.Title) return props.Title;
  
  if (props.loading) return 'Lütfen Bekleyin';
  if (props.error) return 'Bir Sorun Oluştu';
  
  return defaults[computedType.value];
});

// --- İZLEME VE TETİKLEME (Düzeltilen Kısım) ---

// Loading, Error veya Success değiştiğinde tepki ver
watch(
  [() => props.loading, () => props.error, () => props.success],
  ([newLoading, newError, newSuccess]) => {
    
    // Eğer yükleniyor, hata var veya başarı mesajı varsa -> GÖSTER
    // (!! kullanarak değerin "dolu" olup olmadığını kontrol ediyoruz)
    if (newLoading || !!newError || !!newSuccess) {
      isVisible.value = true;
      startTimer();
    } 
  },
  { immediate: true } // Sayfa ilk açıldığında da bu kontrolü yap
);

function startTimer() {
  if (timer) clearTimeout(timer);

  // Eğer loading ise timer başlatma, sonsuza kadar dönsün
  if (props.loading) return; 

  // Loading değilse (error veya success ise) süre bitince kapat
  timer = setTimeout(() => closeNotification(), props.Duration);
}

function closeNotification() {
  isVisible.value = false;
  // Animasyon bitince parent'a haber ver
  setTimeout(() => {
    emit('close');
    // State'leri temizlemek istersen burada emit ile parent'ı güncelleyebilirsin
  }, 400); // css transition süresiyle uyumlu olsun
}

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});
</script>

<style scoped>
/* Önceki CSS'ler aynen geçerli, sadece Spinner ekledik */

.notification-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  display: flex; justify-content: center; align-items: center;
  z-index: 9999; pointer-events: none;
}

.notification-box {
  display: flex; align-items: center;
  padding: 20px; border-radius: 12px;
  min-width: 320px; max-width: 450px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  pointer-events: auto; background: white;
  border-left: 6px solid #ccc;
  transition: all 0.3s ease; /* Renk değişimleri yumuşak olsun */
}

.icon-area { font-size: 2rem; margin-right: 15px; display: flex; align-items: center; }
.content-area { text-align: left; }
.title { margin: 0 0 5px 0; font-size: 1.1rem; font-weight: bold; color: #333; }
.message { margin: 0; font-size: 0.95rem; color: #555; }

/* Renk Temaları */
.notification-box.success { border-left-color: #2ecc71; background-color: #f0fdf4; }
.notification-box.success .title { color: #14532d; }

.notification-box.error { border-left-color: #e74c3c; background-color: #fef2f2; }
.notification-box.error .title { color: #7f1d1d; }

.notification-box.warning { border-left-color: #f1c40f; background-color: #fffbeb; }
.notification-box.warning .title { color: #78350f; }

.notification-box.info { border-left-color: #3498db; background-color: #f0f9ff; }

/* CSS Spinner (Loading Dönemeci) */
.spinner {
  width: 30px;
  height: 30px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: scale(0.9); }
</style>