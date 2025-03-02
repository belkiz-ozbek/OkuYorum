package aybu.graduationproject.okuyorum.donation.service;

import aybu.graduationproject.okuyorum.donation.dto.DonationTrackingDto;
import aybu.graduationproject.okuyorum.donation.entity.Donation;
import aybu.graduationproject.okuyorum.donation.entity.DonationStatus;
import aybu.graduationproject.okuyorum.donation.entity.DonationTracking;
import aybu.graduationproject.okuyorum.donation.mapper.DonationTrackingMapper;
import aybu.graduationproject.okuyorum.donation.repository.DonationRepository;
import aybu.graduationproject.okuyorum.donation.repository.DonationTrackingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DonationTrackingServiceImpl implements DonationTrackingService {

    private final DonationRepository donationRepository;
    private final DonationTrackingRepository trackingRepository;
    private final DonationTrackingMapper trackingMapper;

    @Autowired
    public DonationTrackingServiceImpl(
            DonationRepository donationRepository,
            DonationTrackingRepository trackingRepository,
            DonationTrackingMapper trackingMapper) {
        this.donationRepository = donationRepository;
        this.trackingRepository = trackingRepository;
        this.trackingMapper = trackingMapper;
    }

    @Override
    public List<DonationTrackingDto> getDonationTrackingHistory(Long donationId) {
        List<DonationTracking> trackingHistory = trackingRepository.findByDonationIdOrderByCreatedAtDesc(donationId);
        return trackingHistory.stream()
                .map(trackingMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DonationTrackingDto updateDonationStatus(Long donationId, DonationStatus newStatus, String notes) {
        // Get the current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        // Find the donation
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Bağış bulunamadı: " + donationId));
        
        // Update the donation status
        donation.setStatus(newStatus);
        donation.setStatusUpdatedAt(LocalDateTime.now());
        donationRepository.save(donation);
        
        // Create a tracking record
        DonationTracking tracking = new DonationTracking();
        tracking.setDonation(donation);
        tracking.setStatus(newStatus);
        tracking.setNotes(notes);
        tracking.setCreatedAt(LocalDateTime.now());
        tracking.setUpdatedAt(LocalDateTime.now());
        tracking.setCreatedBy(1L); // TODO: Get actual user ID
        tracking.setCreatedByName(currentUsername);
        
        DonationTracking savedTracking = trackingRepository.save(tracking);
        return trackingMapper.toDto(savedTracking);
    }

    @Override
    public Map<String, Object> getDonationStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // Count donations by status
        long totalDonations = donationRepository.count();
        long pendingDonations = donationRepository.countByStatus(DonationStatus.PENDING);
        long completedDonations = donationRepository.countByStatus(DonationStatus.COMPLETED);
        long cancelledDonations = donationRepository.countByStatus(DonationStatus.CANCELLED);
        
        statistics.put("totalDonations", totalDonations);
        statistics.put("pendingDonations", pendingDonations);
        statistics.put("completedDonations", completedDonations);
        statistics.put("cancelledDonations", cancelledDonations);
        
        // Get donations by month
        List<Map<String, Object>> donationsByMonth = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        
        // Get data for the last 6 months
        for (int i = 0; i < 6; i++) {
            LocalDateTime monthStart = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime monthEnd = monthStart.plusMonths(1).minusNanos(1);
            
            long count = donationRepository.countByCreatedAtBetween(monthStart, monthEnd);
            
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", monthStart.getMonth().toString());
            monthData.put("count", count);
            
            donationsByMonth.add(monthData);
        }
        
        statistics.put("donationsByMonth", donationsByMonth);
        
        return statistics;
    }
} 