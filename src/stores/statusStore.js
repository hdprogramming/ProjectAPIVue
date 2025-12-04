// stores/statusStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api.js'

export const useStatusStore = defineStore('status', () => {
  // 1. State: Kategorileri tutacağımız boş liste
  const statusvalues = ref([])

  // 2. Action: API'den veriyi çeken fonksiyon
  async function fetchStatus() {
    // Zaten veri varsa tekrar çekme (Optimistic)
    if (statusvalues.value.length > 0) return 

    try {
      const response = await api.get('/ProjectStatusMessages') 
      statusvalues.value = response.data 
    } catch (error) {
      console.error('Durum değerleri çekilemedi', error)
    }
  }

  // 3. Getter: İŞİN SIRRI BURADA! 
  // ID verince adını dönen otomatik fonksiyon
  const getStatusName = computed(() => {
    return (id) => {
      const status = statusvalues.value.find(c => c.id === id)
      return status ? status.name : 'Bilinmiyor' // Bulamazsa ne yazsın?
    }
  })  

  return { StatusValues: statusvalues, fetchStatus, getStatusName }
})