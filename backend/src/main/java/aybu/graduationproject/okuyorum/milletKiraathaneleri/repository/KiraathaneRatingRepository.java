package aybu.graduationproject.okuyorum.milletKiraathaneleri.repository;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.KiraathaneRating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KiraathaneRatingRepository extends JpaRepository<KiraathaneRating, Long> {
    
    List<KiraathaneRating> findByKiraathaneId(Long kiraathaneId);
    
    Page<KiraathaneRating> findByKiraathaneId(Long kiraathaneId, Pageable pageable);
    
    Optional<KiraathaneRating> findByKiraathaneIdAndUserId(Long kiraathaneId, Long userId);
    
    List<KiraathaneRating> findByUserId(Long userId);
    
    boolean existsByKiraathaneIdAndUserId(Long kiraathaneId, Long userId);
    
    @Query("SELECT AVG(CAST(r.rating AS double)) FROM KiraathaneRating r WHERE r.kiraathane.id = :kiraathaneId")
    Double getAverageRatingForKiraathane(Long kiraathaneId);
} 