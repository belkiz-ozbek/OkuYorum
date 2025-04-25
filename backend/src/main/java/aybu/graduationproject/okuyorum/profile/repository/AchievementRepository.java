package aybu.graduationproject.okuyorum.profile.repository;

import aybu.graduationproject.okuyorum.profile.entity.Achievement;
import aybu.graduationproject.okuyorum.profile.entity.AchievementType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByUserId(Long userId);
    List<Achievement> findAllByUserId(Long userId);
    Optional<Achievement> findByUserIdAndType(Long userId, AchievementType type);
    boolean existsByUserIdAndType(Long userId, AchievementType type);
    boolean existsByUserIdAndTypeAndEarnedIsTrue(Long userId, AchievementType type);
    List<Achievement> findByUserIdOrderByProgressDesc(Long userId);
    Optional<Achievement> findByIdAndUserId(Long id, Long userId);
} 