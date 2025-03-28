package aybu.graduationproject.okuyorum.donation.mapper;

import aybu.graduationproject.okuyorum.donation.dto.DonationRequestDto;
import aybu.graduationproject.okuyorum.donation.entity.DonationRequest;
import org.springframework.stereotype.Component;

@Component
public class DonationRequestMapper {
    
    public DonationRequest toEntity(DonationRequestDto dto) {
        DonationRequest entity = new DonationRequest();
        
        entity.setBookTitle(dto.getBookTitle());
        entity.setAuthor(dto.getAuthor());
        entity.setGenre(dto.getGenre());
        entity.setQuantity(dto.getQuantity());
        entity.setType(dto.getType());
        entity.setDescription(dto.getDescription());
        entity.setInstitutionName(dto.getInstitutionName());
        entity.setAddress(dto.getAddress());
        entity.setLatitude(dto.getLatitude());
        entity.setLongitude(dto.getLongitude());
        
        return entity;
    }
    
    public DonationRequestDto toDto(DonationRequest entity) {
        DonationRequestDto dto = new DonationRequestDto();
        
        dto.setId(entity.getId());
        dto.setRequesterId(entity.getRequester().getId());
        dto.setRequesterName(entity.getRequester().getUsername());
        dto.setBookTitle(entity.getBookTitle());
        dto.setAuthor(entity.getAuthor());
        dto.setGenre(entity.getGenre());
        dto.setQuantity(entity.getQuantity());
        dto.setType(entity.getType());
        dto.setStatus(entity.getStatus());
        dto.setDescription(entity.getDescription());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setInstitutionName(entity.getInstitutionName());
        dto.setAddress(entity.getAddress());
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        
        if (entity.getDonation() != null) {
            dto.setDonationId(entity.getDonation().getId());
        }
        
        return dto;
    }
} 