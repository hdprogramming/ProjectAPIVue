// stores/categoryStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api.js'

export const useCategoryStore = defineStore('category', () => {
  // 1. State: Kategorileri tutacağımız boş liste
  const categories = ref([])

  // 2. Action: API'den veriyi çeken fonksiyon
  async function fetchCategories() {
    // Zaten veri varsa tekrar çekme (Optimistic)
    if (categories.value.length > 0) return 

    try {
      const response = await api.get('/ProjectCategories') 
      categories.value = response.data 
    } catch (error) {
      console.error('Kategoriler çekilemedi', error)
    }
  }

  // 3. Getter: İŞİN SIRRI BURADA! 
  // ID verince adını dönen otomatik fonksiyon
  const getCategoryName = computed(() => {
    return (id) => {
      const cat = categories.value.find(c => c.id === id)
      return cat ? cat.name : 'Bilinmiyor' // Bulamazsa ne yazsın?
    }
  })
  const getCategoryNamesList = computed(() => {
  return (idsArray) => {
    // 1. Güvenlik: Eğer gelen veri array değilse veya boşsa hata vermesin, boş dönsün.
    if (!idsArray || !Array.isArray(idsArray)) return []

    // 2. İşlem: Senin yazdığın mantığın aynısı (Map kullanımı)
    // categories.value içinden bulup isimlerini çıkarıyor.
    return idsArray.map(id => {
      const cat = categories.value.find(c => c.id === id)
      return cat ? cat.name : 'Bilinmiyor'
    })
  }
})

  return { categories, fetchCategories, getCategoryName,getCategoryNamesList }
})