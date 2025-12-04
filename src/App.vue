<template>
  <header>
    <div class="topbar">
      <a href="#" class="brand">
        <i class="fa-solid fa-layer-group"></i>
        <span class="headtext">Admin Paneli</span>
      </a>
      <nav>
        <RouterLink to="/">Anasayfa</RouterLink> |
        <template v-if="!isAuthenticated">
          <RouterLink to="/login">Giriş Yap</RouterLink> |
          <RouterLink to="/register">Kayıt Ol</RouterLink>
        </template>
        <template v-else>
          <RouterLink to="/profile">Profilim</RouterLink>
          <template v-if="isAdmin">
            | <RouterLink to="/admin">Admin Panel</RouterLink>
          </template>
          | <button class="btn btn-danger" @click="logout">Çıkış Yap</button>
        </template>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<script setup>
import { ref,computed,onMounted } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth"; // Store'u import et
import { useCategoryStore } from '@/stores/categoryStore'
import { useStatusStore } from '@/stores/statusStore'
const categoryStore = useCategoryStore()
const statusStore=useStatusStore();
onMounted(()=>{
categoryStore.fetchCategories();
statusStore.fetchStatus();
});
const router = useRouter();
const authStore = useAuthStore(); // Store'u kullan

// 🏆 KRİTİK: Computed property'ler artık Pinia'daki reaktif state'i kullanıyor!
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAdmin = computed(() => authStore.isAdmin);

const logout = () => {
  authStore.clearAuth(); // Pinia action'ı çağır
  router.push("/login");
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@400;600&family=Poppins:wght@300;400;500;600&display=swap");

:root {
  --bg-color: #f4f7f6;
  --bar-bg: rgba(255, 255, 255, 0.95);
  --card-bg: #ffffff;
  --primary-green: #2e7d32;
  --primary-hover: #1b5e20;
  --danger-color: #d32f2f;
  --danger-hover: #b71c1c;
  --text-color: #333;
  --text-light: #666;
  --border-color: #e0e0e0;
  --shadow-soft: 0 10px 30px rgba(0, 0, 0, 0.05);
  --shadow-bar: 0 4px 20px rgba(0, 0, 0, 0.05);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-color);
  font-family: "Poppins", sans-serif;
  color: var(--text-color);
  padding-bottom: 50px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 2rem;
  background: var(--bar-bg);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: var(--shadow-bar);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.brand i {
  font-size: 1.5rem;
  color: var(--primary-green);
}
.brand .headtext {
  color: var(--primary-hover);
  font-size: 1.4rem;
  font-family: "Oswald", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.topbar nav {
  display: flex;
  gap: 10px;
}
.topbar a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: var(--text-light);
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}
.topbar a:hover {
  background-color: rgba(46, 125, 50, 0.08);
  color: var(--primary-green);
}
.dashboard-grid {
  display: grid;
  grid-template-columns: 350px 1fr; /* Sol taraf sabit, sağ taraf esnek */
  gap: 2rem;
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

/* --- GENEL KART STİLİ (YENİDEN DÜZENLENDİ) --- */
.card {
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  padding: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.02);
  height: fit-content; /* İçerik kadar yükseklik */
}

.card-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-family: "Oswald", sans-serif;
  font-size: 1.3rem;
  color: var(--primary-green);
}

/* --- PROFİL & AVATAR --- */
.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}
.avatar-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
}
.avatar-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
.v-stack {
  display: flex;
  align-items: center;  
  flex-direction: column;
}
/* Modern Select Kutusu */
.form-select {
    padding: 10px 30px 10px 15px; /* Ok işareti için sağda boşluk */
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.9rem;
    color: var(--text-color);
    background-color: #fafafa;
    cursor: pointer;
    outline: none;
    /* Varsayılan tarayıcı okunu değiştirmek/kaldırmak istersen: appearance: none; */
}

.form-select:focus {
    border-color: var(--primary-green);
    background-color: #fff;
}
.form-group { 
  margin-bottom: 1.2rem;  
}
.form-group h2{
  margin-bottom:1.2rem;
  text-align:center;
}
.form-group label{
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-light);
}
.form-group textarea,
input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
  background-color: #fafafa;
  transition: all 0.3s;
}
.form-group textarea,
input[type="text"],
input[type="email"],
input[type="password"]:focus {
  outline: none;
  border-color: var(--primary-green);
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
}

/* Arama Alanı (Yan yana input ve buton) */
.search-row {
  display: flex;
  gap: 10px;
}
.search-row .form-control {
  flex: 1;
}

/* --- BUTONLAR --- */
.btn {
  margin: 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.btn-full {
  width: 100%;
}

.btn-primary {
  background: var(--primary-green);
  color: white;
  box-shadow: 0 4px 10px rgba(46, 125, 50, 0.2);
}
.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-danger {
  background: var(--danger-color);
  color: white;
}
.btn-danger:hover {
  background: var(--danger-hover);
}

/* Küçük Buton (Tablo için) */
.btn-sm {
  padding: 6px 12px;
  font-size: 0.8rem;
  border-radius: 4px;
}
.form-select:focus {
  border-color: var(--primary-green);
  background-color: #fff;
}
/* --- TABLO STİLLERİ --- */
.table-container {
  overflow-x: auto;
}
.fl-table {
  border-collapse: collapse;
  width: 100%;
  margin: 10px 0;
  font-size: 0.9em;
  min-width: 600px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}
.fl-table thead tr {
  background-color: #009879;
  color: #ffffff;
  text-align: left;
}
.fl-table th,
.fl-table td {
  padding: 12px 15px;
  vertical-align: middle;
}
.fl-table tbody tr {
  border-bottom: 1px solid #eee;
}
.fl-table tbody tr:nth-of-type(even) {
  background-color: #f9f9f9;
}
.fl-table tbody tr:hover {
  background-color: #f1f1f1;
}
.fl-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}
/* Başlık içindeki aksiyonlar (Filtre + Arama) */
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
/* --- MOBİL UYUMLULUK --- */
@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .topbar button span {
    display: none;
  }
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  .header-actions {
    width: 100%;
    flex-direction: column;
  }
  .form-select,
  .search-row {
    width: 100%;
  }
}
</style>
