<script setup>
// Props'u bir değişkene atadık ama içinde sadece gerekli olanlar kaldı
const props = defineProps({
  // Modalı açıp kapatan değer
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})

// Sadece modelValue (aç/kapa) için emit yeterli
const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="close">
        
        <div class="modal-content">
          <div class="modal-header">
            <h5>{{ title }}</h5>
            <button class="close-btn" @click="close">×</button>
          </div>

          <div class="modal-body">
            <slot></slot> 
          </div>
          
          <div class="modal-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* CSS kodların gayet güzel, aynen kalabilir */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>