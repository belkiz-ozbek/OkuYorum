package aybu.graduationproject.okuyorum.user.repository;

import aybu.graduationproject.okuyorum.user.entity.Achievement;
import aybu.graduationproject.okuyorum.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByUserOrderByProgressDesc(User user);
    Optional<Achievement> findByIdAndUser(Long id, User user);
} 