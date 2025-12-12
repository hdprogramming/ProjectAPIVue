<template>  
  <div class="file-content">
    <img class="image" :src="file.url" @click="$emit('click-image', file)" />
    <label>{{ file.name }}</label>

    <div class="action-buttons">
      
      <template v-if="!isDeleted">
        <button class="btn btn-primary btn-sm" @click="$emit('edit', file)">
          <i class="fa-solid fa-edit"></i>
        </button>
        <button class="btn btn-warning btn-sm" @click="$emit('delete', file.id)">
          <i class="fa-solid fa-trash"></i>
        </button>
      </template>

      <template v-else>
        <button class="btn btn-recover btn-sm" @click="$emit('recover', file.id)">
          <i class="fa-solid fa-recycle"></i>
        </button>
        <button class="btn btn-danger btn-sm" @click="$emit('permanent-delete', file.id)">
          <i class="fa-solid fa-fire"></i>
        </button>
      </template>

    </div>
  </div>
</template>

<script setup>
// Dışarıdan gelen verileri (Props) tanımlıyoruz
const props = defineProps({
  file: {
    type: Object,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false // Varsayılan olarak normal dosya muamelesi yap
  }
})

// Dışarıya haber vereceğimiz olayları (Emits) tanımlıyoruz
const emit = defineEmits(['edit', 'delete', 'recover', 'permanent-delete', 'click-image'])
</script>

<style scoped>
.file-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.file-container label {
}
.image {
  border-radius: 5px;
  width: 50px;
  height: 50px;
  cursor: pointer;
}
.newimage {
  position: relative;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.12));
}

.newimage:hover {
  transform: translateY(-2px);
  filter: drop-shadow(0 10px 20px rgba(128, 203, 153, 0.6));
}

.newimage:active {
  transform: translateY(1px);
  filter: drop-shadow(0 2px 4px rgba(128, 203, 153, 0.8));
}
.newimage img {
  width: 100px;
  height: 100px;
}

.image2x {
  border-radius: 5px;
  width: 150px;
  height: 150px;
  cursor: pointer;
}
.action-buttons {
    display: flex;
    gap: 5px;
    margin-top: 5px;
}
</style>