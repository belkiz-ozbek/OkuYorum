package aybu.graduationproject.okuyorum.donation.repository;

import aybu.graduationproject.okuyorum.donation.entity.DonationRequest;
import aybu.graduationproject.okuyorum.donation.entity.RequestStatus;
import aybu.graduationproject.okuyorum.donation.entity.RequestType;
import aybu.graduationproject.okuyorum.signup.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRequestRepository extends JpaRepository<DonationRequest, Long> {
    List<DonationRequest> findByRequester(User requester);
    List<DonationRequest> findByStatus(RequestStatus status);
    List<DonationRequest> findByType(RequestType type);
    
    @Query("SELECT dr FROM DonationRequest dr WHERE dr.type = :type AND dr.status = :status")
    List<DonationRequest> findByTypeAndStatus(RequestType type, RequestStatus status);
    
    @Query("SELECT dr FROM DonationRequest dr WHERE " +
           "dr.status = 'ACTIVE' AND " +
           "(:type IS NULL OR dr.type = :type) AND " +
           "(:genre IS NULL OR dr.genre = :genre)")
    List<DonationRequest> findActiveRequests(RequestType type, String genre);
} 