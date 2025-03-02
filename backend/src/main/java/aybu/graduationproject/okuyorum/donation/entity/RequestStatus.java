package aybu.graduationproject.okuyorum.donation.entity;

public enum RequestStatus {
    PENDING,        // Talep oluşturuldu, beklemede
    ACTIVE,         // Talep aktif, bağış bekliyor
    IN_PROGRESS,    // Bağış yapıldı, süreç devam ediyor
    COMPLETED,      // Talep karşılandı ve tamamlandı
    CANCELLED,      // Talep iptal edildi
    EXPIRED         // Talep süresi doldu
} 