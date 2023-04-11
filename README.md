
# Mevn Stack Basic Shopping Cart

Mevn yığını ile basit alışveriş uygulaması

## Yapılandırma

```env
NODE_ENV=development

APP_NAME='MEVN STACK APP'
APP_PORT=3000

-> Eğer docker kullanılıyorsa, docker-compose.yaml içindeki servis adı 'database' ayarlanmalı.
-> Docker kullanılmıyorsa localhost veya 127.0.0.1 ayarlanmalı.
DB_HOST=
DB_PORT=MONGO PORT
DB_NAME=DOKÜMAN ADI

ORIGIN=http://localhost:5173

-> S3 Disk ayarlarınız
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_BUCKET=
S3_ACL=

-> Rastgele randomBytes ile anahtar ile oluşturabilir.
Örnek : eb1370ebcfb7d7f59341912f56465a09444b217be4d9710c4163ef4dfc2031297a35c86c1b5c65d1db124c05d957d9bc4609c8b35c10b416b3349b72030565e5
SESSION_SECRET= 
```


## Yükleme

Docker ile

```bash 
  clone https://github.com/atakansn/mevn-stack-app.git
  cd mevn-stack-app
  docker-compose up

  Herhangi bir değişiklikte docker da tekrardan build alınmalı
  docker-compose build --no-cache
```

Docker olmadan

```bash 
  clone https://github.com/atakansn/mevn-stack-app.git
  cd mevn-stack-app
  cd client npm run dev
  cd server node app.js
```
## Docker Compose

```docker
version: "3.9"

services:
  client:
    container_name: VueJS
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "5173:5173"

  backend:
    container_name: NodeJS
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./backend/:/user/src/app

  database:
    container_name: MongoDB
    image: mongo
    ports:
      - "27017:27017"
    volumes:
      - "./db:/data/db"
```


## Ekran Görüntüleri

![Anasayfa](https://i.hizliresim.com/pv0u9uk.png)

![Ürün Ekleme ve Doğrulama](https://i.hizliresim.com/k8tf2f7.png)

![Ürün Detayı ve İlgili Ürünler](https://i.hizliresim.com/mxmyrjl.png)

![Sepet](https://i.hizliresim.com/7ztdw6f.png)

![Ödeme Sayfası](https://i.hizliresim.com/nbilfu9.png)

![Sipariş Tamamlandı](https://i.hizliresim.com/bhvsv94.png)

![Siparişler](https://i.hizliresim.com/r1fzizf.png)

![Sipariş Detayı](https://i.hizliresim.com/nwd8qyn.png)
