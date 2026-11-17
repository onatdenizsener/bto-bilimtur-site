"""TÜM FİRMA BİLGİLERİ BURADA. "TEST" yazan her şey yayından önce firmadan teyit edilmeli.
Değiştirince `python3 build2.py` çalıştır."""

SITE = {
    "url": "https://www.btotravel.com",            # yayın adresi
    "name": "BTO Bilimtur",
    "legal": "BTO Bilimtur Turizm Organizasyon Transfer",  # sitede böyle yazıyor; ticaret unvanı TEST
    "legal_test": True,
    "tel": "+903124687580", "tel_show": "0312 468 75 80",   # mevcut siteden
    "wa": "903124687580", "wa_test": True,                    # TEST: WhatsApp hattı sitede yok, sabit hat varsayıldı
    "mail": "bto@btobilimtur.com.tr",                        # mevcut siteden
    "address": "Ankara",                                      # TEST: açık adres sitede yok
    "address_full": "[TEST ADRES] Çankaya, Ankara",           # TEST: KVKK metni ve iletişim için açık adres gerekli
    "maps": "https://www.google.com/maps/search/?api=1&query=BTO+Bilimtur+Ankara",
    "hours": "Hafta içi 09:00–18:00, Cumartesi 10:00–14:00",  # TEST
    "tursab": "[TEST] 0000",                                  # TEST: TÜRSAB belge no
    "mersis": "[TEST] 0000000000000000",                      # TEST
    "founded": 1995,
    "preview": True,    # True yapılırsa her sayfaya "Tasarım önizlemesidir" şeridi ve noindex eklenir
}

TEST_ITEMS = [
    "WhatsApp numarası (şu an sabit hat 0312 468 75 80 kullanılıyor)",
    "Açık adres (KVKK metninde ve iletişim sayfasında [TEST ADRES] yazıyor)",
    "Çalışma saatleri",
    "TÜRSAB belge numarası ve MERSİS numarası",
    "Ticaret unvanı (sitede 'BTO Bilimtur Turizm Organizasyon Transfer' yazıyor)",
    "Araç kapasiteleri (4, 8, 16, 27 kişi model bilgisine göre tahmin)",
    "Tur süreleri (Premium'daki '2 gece', '7 gece' gibi bilgiler örnek)",
    "Kapadokya programı, mavi yolculuk rotaları, transfer hizmet sözleri (rötar bekleme, bebek koltuğu)",
    "Premium'daki tüm görseller çizimdir; firmanın gerçek fotoğraflarıyla değiştirilmeli",
    "Vize evrak listeleri genel bilgidir",
]
