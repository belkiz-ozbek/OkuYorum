package aybu.graduationproject.okuyorum.profile.entity;

public enum AchievementType {
    BOOK_WORM(100, "Kitap Kurdu", "100 kitap okuyarak bu başarıyı kazanabilirsin"),
    SOCIAL_READER(50, "Sosyal Okur", "İleti, inceleme veya alıntılara toplam 50 yorum yaparak bu başarıyı kazanabilirsin"),
    QUOTE_MASTER(200, "Alıntı Ustası", "200 alıntı paylaşarak bu başarıyı kazanabilirsin"),
    MARATHON_READER(30, "Maraton Okuyucu", "30 gün arka arkaya okuyarak bu başarıyı kazanabilirsin");

    private final int requirement;
    private final String title;
    private final String description;

    AchievementType(int requirement, String title, String description) {
        this.requirement = requirement;
        this.title = title;
        this.description = description;
    }

    public int getRequirement() {
        return requirement;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }
} 