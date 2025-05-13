package aybu.graduationproject.okuyorum.recommendation.dto;

import lombok.Data;

@Data
public class BookRecommendationRequest {
    private String genre; // Kurgu, Kurgudışı, Şiir, vb.
    private String expectation; // Kendimi geliştirmek, Biraz uzaklaşmak, vb.
    private String readingTime; // 10-15 dk, 30 dk, 1 saatten fazla
    private boolean canFocus; // Dikkat toplama durumu
    private String userId; // Kullanıcı kimliği
} 