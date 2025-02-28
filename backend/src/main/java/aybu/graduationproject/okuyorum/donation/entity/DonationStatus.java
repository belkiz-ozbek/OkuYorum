package aybu.graduationproject.okuyorum.donation.entity;

public enum DonationStatus {
    PENDING,                // Bağış beklemede
    APPROVED,               // Bağış onaylandı
    PREPARING,              // Bağış hazırlanıyor
    READY_FOR_PICKUP,       // Bağış teslim almaya hazır
    IN_TRANSIT,             // Bağış taşınıyor
    DELIVERED,              // Bağış teslim edildi
    RECEIVED_BY_RECIPIENT,  // Bağış alıcı tarafından alındı
    COMPLETED,              // Bağış süreci tamamlandı
    REJECTED,               // Bağış reddedildi
    CANCELLED               // Bağış iptal edildi
}