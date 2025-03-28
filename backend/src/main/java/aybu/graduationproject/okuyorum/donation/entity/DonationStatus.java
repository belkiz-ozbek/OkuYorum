package aybu.graduationproject.okuyorum.donation.entity;

public enum DonationStatus {
    PENDING("Bağış Beklemede", "Bağışınız inceleme aşamasındadır."),
    APPROVED("Onaylandı", "Bağışınız onaylandı ve işleme alındı."),
    PREPARING("Hazırlanıyor", "Bağışınız teslim için hazırlanıyor."),
    READY_FOR_PICKUP("Teslime Hazır", "Bağışınız teslim alınmaya hazır."),
    IN_TRANSIT("Taşınıyor", "Bağışınız alıcıya ulaştırılmak üzere yolda."),
    DELIVERED("Teslim Edildi", "Bağışınız teslim noktasına ulaştı."),
    RECEIVED_BY_RECIPIENT("Alıcı Teslim Aldı", "Bağışınız alıcı tarafından teslim alındı."),
    COMPLETED("Tamamlandı", "Bağış süreci başarıyla tamamlandı."),
    REJECTED("Reddedildi", "Bağışınız kriterlere uygun bulunmadı."),
    CANCELLED("İptal Edildi", "Bağış işlemi iptal edildi.");

    private final String displayName;
    private final String description;

    DonationStatus(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}