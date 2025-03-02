package aybu.graduationproject.okuyorum.donation.repository;

import aybu.graduationproject.okuyorum.donation.entity.DonationTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationTrackingRepository extends JpaRepository<DonationTracking, Long> {
    
    /**
     * Find tracking records for a donation ordered by creation date descending
     * 
     * @param donationId The donation ID
     * @return List of tracking records
     */
    List<DonationTracking> findByDonationIdOrderByCreatedAtDesc(Long donationId);
} 