package aybu.graduationproject.okuyorum.recommendation.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "book_recommendations")
@Data
public class BookRecommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String genre;
    private String expectation;
    private String readingTime;
    private boolean canFocus;
    
    @Column(length = 2000)
    private String recommendation;

    private LocalDateTime createdAt;
} 