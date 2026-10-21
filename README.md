# Farkle

Kindle Paperwhite ve Signature Edition (2024) tarayıcısında oynanan zar oyunu. Ekran siyah-beyazdır, dokunuşlar arasında yenilenmez. Puanlama, PlayMonster Farkle tablosuna uyar. Ana ekrandan klasik düzen de seçilebilir: üç 1, 1000 puandır.

Oyun adresi: <https://obilginozi.github.io/kindle-farkle/>

## Kindle’da açma

1. Ana ekranda menüyü aç, **Web Browser**’ı seç.
2. Yukarıdaki adresi yaz ve sayfayı yer imine ekle.
3. **Çevrimdışı hazır. Uçak modunu aç.** yazısını gör.
4. Uçak modunu aç. Sonraki açılışlar Wi-Fi istemez.
5. JavaScript açık kalsın. Article Mode kapalı kalsın.
6. Parlaklığı kitap okurken kullandığın seviyede bırak. Sayfa parlaklığı değiştiremez.

**Güncelle** yalnızca Wi-Fi açıkken yeni sürümü indirir. Oyun açılışta ağa sormaz.

Bu modelin tarayıcısı USB’ye kopyalanan HTML dosyasını açmaz. İlk indirme için bir kez Wi-Fi gerekir.

## Oynanış

Yeni oyunda 1–4 isim sorulur. Boş bırakılan ad, Oyuncu 1 / Player 1 olarak kalır. Dil ana ekrandan TR veya EN seçilir; yazılmış isimler dil değişince durur.

İlk yazış için tur toplamı en az 500 olmalıdır. 10.000 puandan sonra diğer oyuncuların birer turu kalır. En yüksek puan kazanır.

## Geliştirme

```sh
node test/farkle.test.js
```

## English

Open the address above in the Kindle web browser and bookmark it. When the page says **Ready offline. Turn on airplane mode.**, turn airplane mode on. Leave JavaScript enabled and Article Mode off. Keep the front light as low as you do while reading.

**Update** downloads a new version only while Wi-Fi is on. The game does not contact the network when it opens. A copied HTML file will not open in the 2024 Paperwhite browser.

A new game asks for 1–4 names. Choose TR or EN on the home screen. The first bank needs 500 points. After 10,000, every other player gets one last turn.
