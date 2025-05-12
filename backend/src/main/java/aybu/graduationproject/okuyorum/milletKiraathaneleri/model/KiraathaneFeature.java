package aybu.graduationproject.okuyorum.milletKiraathaneleri.model;

public enum KiraathaneFeature {
    UCRETSIZ_WIFI("Ücretsiz Wifi"),
    CAY_KAHVE("Çay & Kahve"),
    CALISMA_ALANLARI("Çalışma Alanları"),
    SESSIZ_OKUMA_BOLUMU("Sessiz Okuma Bölümü"),
    BAHCE_ALANI("Bahçe Alanı"),
    ETKINLIK_ALANI("Etkinlik Alanı"),
    COCUK_BOLUMU("Çocuk Bölümü"),
    GRUP_CALISMA_ALANLARI("Grup Çalışma Alanları"),
    SEMINER_SALONU("Seminer Salonu"),
    SESLI_CALISMA_ALANI("Sesli Çalışma Alanı");

    private final String displayName;

    KiraathaneFeature(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 