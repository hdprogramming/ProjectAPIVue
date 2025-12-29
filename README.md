# ProjectCLVue

> **⚠️ GELİŞTİRME SÜRECİ HAKKINDA NOT**
>
> Bu proje şu anda aktif geliştirme aşamasındadır (Work In Progress).
> Bazı özellikler tamamlanmamış olabilir ve hatalar (bug) içerebilir.
> Kullanırken veya incelerken lütfen bunu göz önünde bulundurunuz.

## 📋 Proje Hakkında

ProjectCLVue, **Vue 3** ve **Vite** altyapısı üzerine kurulmuş; özel dosya yönetimi, zengin metin editörü entegrasyonu ve güvenlik önlemleri (XSS koruması) içeren modern bir Frontend projesidir.

---

## 💻 Önerilen IDE Kurulumu

Bu proje için en verimli geliştirme deneyimi için aşağıdakileri kullanmanız önerilir:

- **[VS Code](https://code.visualstudio.com/)**
- **[Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)** eklentisi.
  - *Önemli: Eğer yüklüyse `Vetur` eklentisini devre dışı bırakın.*

---

## 🌐 Önerilen Tarayıcı Ayarları

Vue 3'ün reaktivite sistemini ve değişkenleri konsolda düzgün görüntüleyebilmek için tarayıcı ayarlarınızı aşağıdaki gibi yapılandırın:

### Chromium Tabanlı Tarayıcılar (Chrome, Edge, Brave vb.)
1. **[Vue.js devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)** eklentisini yükleyin.
2. F12 ile DevTools'u açın.
3. Ayarlar (Settings) > Preferences > Console bölümüne gidin.
4. **"Enable custom formatters"** seçeneğini işaretleyin.

### Firefox
1. **[Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)** eklentisini yükleyin.
2. DevTools Ayarlarını açın.
3. **"Enable custom formatters"** seçeneğini aktif hale getirin.

---

## ⚙️ Proje Kurulumu ve Çalıştırma

Projeyi yerel makinenize indirdikten sonra gerekli paketleri yüklemek için terminalde şu komutu çalıştırın:

```sh
npm install
Geliştirme Modunda Çalıştırma (Hot-Reload)
Geliştirme yaparken anlık değişiklikleri görmek için:

Bash

npm run dev
Canlı Ortam İçin Derleme (Production Build)
Projeyi yayına hazırlamak, sıkıştırmak ve optimize etmek için:

Bash

npm run build
🚀 Öne Çıkan Özellikler
Vue 3 Composition API: <script setup> sözdizimi ile temiz ve modern kod yapısı.

Güvenlik (Sanitization): DOMPurify entegrasyonu ile XSS saldırılarına karşı korumalı HTML render işlemleri.

Dosya Yönetimi (File Explorer): Resim yükleme, silme, düzenleme ve "Geri Dönüşüm Kutusu" özellikleri.

Zengin Metin Editörü: Görsel destekli ve özelleştirilebilir Quill Editor entegrasyonu.

Backend Entegrasyonu: RESTful API yapısı ile tam uyumlu veri iletişimi.

🔧 Konfigürasyon
Vite ayarlarını özelleştirmek için Vite Configuration Reference sayfasını inceleyebilirsiniz.
