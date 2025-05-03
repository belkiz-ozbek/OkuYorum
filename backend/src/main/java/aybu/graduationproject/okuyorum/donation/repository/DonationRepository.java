package aybu.graduationproject.okuyorum.donation.repository;

import aybu.graduationproject.okuyorum.donation.entity.Donation;
import aybu.graduationproject.okuyorum.donation.entity.DonationStatus;
import aybu.graduationproject.okuyorum.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByUser(User user);

    @Query("SELECT COUNT(d) FROM Donation d WHERE d.donationType = :type")
    Long countByDonationType(String type);
    
    @Query("SELECT COUNT(d) FROM Donation d WHERE d.user = :user")
    Long countByUser(User user);

    /**
     * Count donations by status
     * 
     * @param status The status to count
     * @return The count of donations with the given status
     */
    long countByStatus(DonationStatus status);
    
    /**
     * Count donations created between the given dates
     * 
     * @param start The start date
     * @param end The end date
     * @return The count of donations created between the given dates
     */
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    /**
     * Find the latest donation by user
     */
    Optional<Donation> findFirstByUserOrderByCreatedAtDesc(User user);
} 