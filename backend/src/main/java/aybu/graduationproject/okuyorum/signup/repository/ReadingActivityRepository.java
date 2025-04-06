package aybu.graduationproject.okuyorum.signup.repository;

import aybu.graduationproject.okuyorum.signup.entity.ReadingActivity;
import aybu.graduationproject.okuyorum.signup.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReadingActivityRepository extends JpaRepository<ReadingActivity, Long> {
    List<ReadingActivity> findByUserOrderByMonthDesc(User user);
    List<ReadingActivity> findTop12ByUserOrderByMonthDesc(User user);
} 