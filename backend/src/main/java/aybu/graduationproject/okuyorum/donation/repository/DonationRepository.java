package aybu.graduationproject.okuyorum.donation.repository;

import aybu.graduationproject.okuyorum.donation.entity.Donation;
import aybu.graduationproject.okuyorum.signup.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByUser(User user);

    @Query("SELECT COUNT(d) FROM Donation d WHERE d.donationType = :type")
    Long countByDonationType(String type);
    
    @Query("SELECT COUNT(d) FROM Donation d WHERE d.user = :user")
    Long countByUser(User user);
} 