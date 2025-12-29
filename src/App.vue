<template>
  <header>
    <div class="topbar">
      <a href="#" class="brand">
        <i class="fa-solid fa-layer-group"></i>
        <span class="headtext">ProjectAPI</span>
      </a>
      <nav>
        <RouterLink to="/">Anasayfa</RouterLink>
           
        <template v-if="!isAuthenticated">
          <RouterLink to="/login">Giriş Yap</RouterLink>
          <RouterLink to="/register">Kayıt Ol</RouterLink>
        </template>
        <template v-else>
           <RouterLink to="/Projects">{{!isAdmin?"Projelerim":"Projeler"}}</RouterLink> 
          <template v-if="isAdmin">
            <RouterLink to="/admin">Admin Panel</RouterLink>            
          </template>
            <RouterLink v-else to="/myfiles">Yüklenen Dosyalarım</RouterLink>
            <RouterLink to="/profile"><img class="ProfileImage" :src="ProfileDetails.profileImgUrl"></img>{{ProfileDetails.UserName}}<i class="fa fa-angle-down"></i></RouterLink>
       
          <button class="btn btn-danger" @click="logout">Çıkış Yap</button>
        </template>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
 <footer class="footer-container">
    <div class="footer-content">
    <div class="div4">
      <div class="brand">
        <h3>Project<span>API</span></h3>
      </div>
      <div>
      <ul class="nav-links">
        <li><a href="#">Anasayfa</a></li>
        <li><a href="#">Servisler</a></li>
        <li><a href="#">Gizlilik</a></li>
      </ul>
      </div>
      </div>

      <p class="copyright">
        &copy; {{ currentYear }} ProjectAPI. Tüm hakları saklıdır.
      </p>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth"; // Store'u import et
import { useCategoryStore } from "@/stores/categoryStore";
import { useStatusStore } from "@/stores/statusStore";
const categoryStore = useCategoryStore();
const statusStore = useStatusStore();
const currentYear = computed(() => new Date().getFullYear())
const router = useRouter();
const authStore = useAuthStore(); // Store'u kullan

// 🏆 KRİTİK: Computed property'ler artık Pinia'daki reaktif state'i kullanıyor!
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAdmin = computed(() => authStore.isAdmin);
const ProfileDetails = computed(() => authStore.ProfileDetails);
onMounted(() => {  
  categoryStore.fetchCategories();
  statusStore.fetchStatus();
});
const logout = () => {
  authStore.clearAuth(); // Pinia action'ı çağır
  router.push("/login");
};
</script>

<style>
.div4{
  display:flex;
  justify-content:space-between;
  gap:10px;
}
:root {
  --bg-color: #f4f7f6;
  --bar-bg: rgba(255, 255, 255, 0.95);
  --card-bg: #ffffff;
  --primary-green: #2e7d32;
  --primary-hover: #1b5e20;
  --danger-color: #d32f2f;
  --danger-hover: #b71c1c;
  --warning-color: #d3732fff;
  --warning-hover: #ba6528ff;
  --recovery-color: rgb(0, 200, 200);
  --recovery-hover: rgb(0, 150, 150);
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
/* Scoped OLMADAN, global stil olarak */
.ql-editor img {
  display: inline-block; /* Block olursa bazen sürüklenmez */
  vertical-align: middle;
  cursor: grabbing; /* Tutulabilir hissi ver */
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
  text-decoration: none;
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
.ProfileImage{
  width:1.5rem;
  height:1.5rem;
  border-radius:50%;
}
.card-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-navigate {
  display: flex;
  justify-content: space-between;
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
.avatar-wrapper .upload-button {
  position: absolute;
  bottom: 0; /* Alt kısma yapıştır */
  right: 0;  /* Sağ kısma yapıştır */
  
  /* Tam yuvarlak yapmak için */
  border-radius: 50%;
  width: 35px;  /* Genişlik ve yükseklik eşit olmalı */
  height: 35px;
  
  /* İkonu tam ortalamak için */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0; /* Bootstrap padding'ini sıfırla */
  
  /* Estetik dokunuş: Resimden ayrılması için beyaz kenarlık */
  border: 3px solid #fff; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 10; /* Resmin üzerinde kaldığından emin olalım */
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
  font-family: "Poppins", sans-serif;
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
.form-group h2 {
  margin-bottom: 1.2rem;
  text-align: center;
}
.form-group label {
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
.btn-recover {
  background: var(--recovery-color);
  color: white;
}
.btn-recover:hover {
  background: var(--recovery-hover);
}
.btn-warning {
  background: var(--warning-color);
  color: white;
}
.btn-warning:hover {
  background: var(--warning-hover);
}
/* Küçük Buton (Tablo için) */
.btn-sm {
  margin-left: 2px;
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
  border-radius: 3px 3px 0 0;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}
.fl-table thead tr {
   background: linear-gradient(0deg, rgba(62, 166, 46, 1) 0%, rgba(3, 138, 3, 1) 100%);
   color: #ffffff;
  text-align: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.9);
}
th:first-child {
  border-top-left-radius: 5px;
}
th:last-child {
  border-top-right-radius: 5px;
}
.redhead th {
   background: linear-gradient(0deg, rgba(166, 62, 46, 1) 0%, rgba(138, 3, 3, 1) 100%);
  
}
.redhead tr:last-of-type {
  border-bottom: 1px solid rgb(150, 0, 0) !important;
}
.fl-table th,
.fl-table td {
  padding: 12px 15px;
  vertical-align: middle;
}
.fl-table tbody tr {
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.fl-table tbody tr:nth-of-type(even) {
  background-color: #f9f9f9;
}
.fl-table tbody tr:hover {
  background-color: #00cb0e2d;
  transition:scale(1.005);
}
.redhead tbody tr:hover {
  background-color: #cb000e2d;
  transition:scale(1.005);
}
.fl-table tbody tr:last-of-type {
  border-bottom: 2px solid rgba(62, 166, 46, 1);
}
/* Başlık içindeki aksiyonlar (Filtre + Arama) */
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.footer-container {
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 2rem 0;
  margin-top: auto; /* Sayfanın en altına iter */
  font-family: 'Inter', sans-serif;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
}

.brand h3 {  
  font-size: 1.5rem;
  font-weight: 700;
}

.brand span {
  color: #42b883; /* Vue Yeşili :) */
}

.nav-links {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 20px;
}

.nav-links a {
  text-decoration: none;
  color: #b0b0b0;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #ffffff;
}

.copyright {
  font-size: 0.9rem;
  color: #666;
  margin-top: 1rem;
  border-top: 1px solid #333;
  padding-top: 1rem;
  width: 80%;
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
