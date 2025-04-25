package aybu.graduationproject.okuyorum.user.repository;

import aybu.graduationproject.okuyorum.user.entity.ReadingActivity;
import aybu.graduationproject.okuyorum.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReadingActivityRepository extends JpaRepository<ReadingActivity, Long> {
    List<ReadingActivity> findByUserOrderByMonthDesc(User user);
    List<ReadingActivity> findByUserIdOrderByMonthDesc(Long userId);
    Optional<ReadingActivity> findFirstByUserIdOrderByLastReadDateDesc(Long userId);
} 