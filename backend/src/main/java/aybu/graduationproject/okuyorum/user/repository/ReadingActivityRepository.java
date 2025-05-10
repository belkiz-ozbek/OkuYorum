package aybu.graduationproject.okuyorum.user.repository;

import aybu.graduationproject.okuyorum.user.entity.ReadingActivity;
import aybu.graduationproject.okuyorum.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReadingActivityRepository extends JpaRepository<ReadingActivity, Long> {
    List<ReadingActivity> findByUserOrderByActivityDateDesc(User user);
    List<ReadingActivity> findByUserIdOrderByActivityDateDesc(Long userId);
    Optional<ReadingActivity> findFirstByUserIdOrderByLastReadDateDesc(Long userId);

    @Query("SELECT ra FROM ReadingActivity ra WHERE ra.user.id = :userId AND ra.activityDate BETWEEN :startDate AND :endDate")
    List<ReadingActivity> findByUserIdAndDateRange(
        @Param("userId") Long userId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    @Query("SELECT SUM(ra.readingMinutes) FROM ReadingActivity ra WHERE ra.user.id = :userId")
    Integer getTotalReadingMinutes(@Param("userId") Long userId);

    @Query("SELECT SUM(ra.pagesRead) FROM ReadingActivity ra WHERE ra.user.id = :userId")
    Integer getTotalPagesRead(@Param("userId") Long userId);

    @Query("SELECT SUM(ra.booksRead) FROM ReadingActivity ra WHERE ra.user.id = :userId")
    Integer getTotalBooksRead(@Param("userId") Long userId);
} 