import { createRouter, createWebHistory } from 'vue-router';
// Component'lerinizi import edin
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Profile from '@/views/Profile.vue';
import AdminPanel from '@/views/AdminPanel.vue';
import Projects from '@/views/Projects.vue'
import MyFiles from '@/views/MyFiles.vue'
// Eğer ana sayfanız varsa
import Home from '@/views/Home.vue'; 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home // Ana sayfa component'iniz
    },
     {
      path: '/Projects',
      name: 'Projects',
      component: Projects // Ana sayfa component'iniz
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresAuth: false } // Giriş gerektirmez
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { requiresAuth: false } // Giriş gerektirmez
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: { requiresAuth: true } // Giriş gerektirir (Normal Kullanıcı veya Admin)
    },
     {
      path: '/myfiles',
      name: 'MyFiles',
      component: MyFiles,
      meta: { requiresAuth: true } // Giriş gerektirir (Normal Kullanıcı veya Admin)
    },
    {
      path: '/admin',
      name: 'AdminPanel',
      component: AdminPanel,
      // Hem giriş gerektirir hem de 'Admin' rolü gerektirir
      meta: { requiresAuth: true, requiresAdmin: true } 
    },
    // Diğer rotalar...
  ]
});

// Yardımcı Fonksiyonlar
// Gerçek uygulamada bu kontrolü daha güvenilir bir yerden yapmalısınız (örn: Pinia store)
const isAuthenticated = () => {
    // Local Storage'da token varsa giriş yapmış kabul ediyoruz
    return !!localStorage.getItem('authToken'); 
}

// Admin rol kontrolü (Basit bir kontrol, gerçekte JWT payload'undan bakılmalı)
const isAdmin = () => {
    // Gerçek bir uygulamada, token'ın kendisi parse edilip rol claim'ine bakılmalıdır.
    // Şimdilik sadece Admin Panel sayfasına gitmeye çalıştığını ve token'ı olduğunu varsayalım.
    // **GÜVENLİK NOTU:** Bu kontrol sadece UI tarafında bir yönlendirmedir. API her zaman sunucu tarafında rolü kontrol edecektir.
    // Rol kontrolünü token'ın içeriğine göre yapmak daha doğrudur.
    return localStorage.getItem('userRole') === 'Admin'; // Giriş yaparken bu bilgiyi kaydetmeniz gerek
}


// Navigasyon Koruması (Guard)
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const requiresAdmin = to.meta.requiresAdmin;

  if (requiresAuth && !isAuthenticated()) {
    // Giriş gerekiyorsa ve giriş yapılmamışsa login sayfasına yönlendir
    alert('Bu sayfaya erişmek için giriş yapmalısınız.');
    next('/login');
  } else if (requiresAdmin && !isAdmin()) {
    // Admin yetkisi gerekiyorsa ve Admin değilse ana sayfaya yönlendir
    alert('Bu sayfaya erişim yetkiniz yok (Yönetici yetkisi gerekli).');
    next('/'); 
  } else if (isAuthenticated() && (to.name === 'Login' || to.name === 'Register')) {
    // Giriş yapmış bir kullanıcı, tekrar Login/Register sayfasına gidememeli
    next('/profile'); 
  } 
  else {
    // Her şey yolundaysa devam et
    next();
  }
});


export default router;