package aybu.graduationproject.okuyorum.donation.service;

import aybu.graduationproject.okuyorum.donation.dto.DonationTrackingDto;
import aybu.graduationproject.okuyorum.donation.entity.DonationStatus;

import java.util.List;
import java.util.Map;

public interface DonationTrackingService {
    
    /**
     * Get the tracking history for a donation
     * 
     * @param donationId The ID of the donation
     * @return List of tracking records
     */
    List<DonationTrackingDto> getDonationTrackingHistory(Long donationId);
    
    /**
     * Update the status of a donation and create a tracking record
     * 
     * @param donationId The ID of the donation
     * @param newStatus The new status
     * @param notes Optional notes about the status change
     * @return The created tracking record
     */
    DonationTrackingDto updateDonationStatus(Long donationId, DonationStatus newStatus, String notes);
    
    /**
     * Get donation statistics
     * 
     * @return Map containing statistics
     */
    Map<String, Object> getDonationStatistics();
} 