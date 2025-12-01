// 1. Vue uygulamasını oluşturmak için gerekli import
import { createApp } from 'vue';

// 2. Ana App component'inizi import edin
import App from './App.vue';

// 3. Router dosyanızı import edin (Bu, sizin oluşturduğunuz router/index.js dosyasıdır)
import router from './router'; 
// 1. Pinia'yı import edin
import { createPinia } from 'pinia'; 

// 2. Pinia instance'ını oluşturun
const pinia = createPinia();



// Uygulamayı oluştur
const app = createApp(App);

// ----------------------------------------------------
// KRİTİK ADIM: Router'ı uygulamaya 'use' ile ekleyin.
// ----------------------------------------------------
app.use(router);
app.use(pinia);

// Uygulamayı HTML'deki hedef elemente bağla
app.mount('#app');