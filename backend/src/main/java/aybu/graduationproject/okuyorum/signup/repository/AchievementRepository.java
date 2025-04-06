package aybu.graduationproject.okuyorum.signup.repository;

import aybu.graduationproject.okuyorum.signup.entity.Achievement;
import aybu.graduationproject.okuyorum.signup.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByUser(User user);
    List<Achievement> findByUserOrderByProgressDesc(User user);
} 