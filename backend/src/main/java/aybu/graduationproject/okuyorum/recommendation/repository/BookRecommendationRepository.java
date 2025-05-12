package aybu.graduationproject.okuyorum.recommendation.repository;

import aybu.graduationproject.okuyorum.recommendation.model.BookRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRecommendationRepository extends JpaRepository<BookRecommendation, Long> {
    // Ek sorgular gerekirse buraya eklenebilir
} 