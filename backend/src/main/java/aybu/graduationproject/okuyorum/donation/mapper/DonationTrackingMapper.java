package aybu.graduationproject.okuyorum.donation.mapper;

import aybu.graduationproject.okuyorum.donation.dto.DonationTrackingDto;
import aybu.graduationproject.okuyorum.donation.entity.DonationTracking;
import org.springframework.stereotype.Component;

@Component
public class DonationTrackingMapper {
    
    /**
     * Convert a DonationTracking entity to a DonationTrackingDto
     * 
     * @param entity The entity to convert
     * @return The converted DTO
     */
    public DonationTrackingDto toDto(DonationTracking entity) {
        if (entity == null) {
            return null;
        }
        
        DonationTrackingDto dto = new DonationTrackingDto();
        dto.setId(entity.getId());
        dto.setDonationId(entity.getDonation().getId());
        dto.setStatus(entity.getStatus());
        dto.setNotes(entity.getNotes());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setCreatedBy(entity.getCreatedBy());
        dto.setCreatedByName(entity.getCreatedByName());
        
        return dto;
    }
} 