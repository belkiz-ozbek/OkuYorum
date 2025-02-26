package aybu.graduationproject.okuyorum.donation.mapper;

import aybu.graduationproject.okuyorum.donation.dto.DonationDto;
import aybu.graduationproject.okuyorum.donation.entity.Donation;
import org.springframework.stereotype.Component;

@Component
public class DonationMapper {
    
    public Donation toEntity(DonationDto dto) {
        Donation donation = new Donation();
        donation.setBookTitle(dto.getBookTitle());
        donation.setAuthor(dto.getAuthor());
        donation.setGenre(dto.getGenre());
        donation.setCondition(dto.getCondition());
        donation.setQuantity(dto.getQuantity());
        donation.setDescription(dto.getDescription());
        donation.setLatitude(dto.getLatitude());
        donation.setLongitude(dto.getLongitude());
        donation.setInstitutionName(dto.getInstitutionName());
        donation.setRecipientName(dto.getRecipientName());
        donation.setAddress(dto.getAddress());
        donation.setDonationType(dto.getDonationType());
        return donation;
    }

    public DonationDto toDto(Donation entity) {
        DonationDto dto = new DonationDto();
        dto.setBookTitle(entity.getBookTitle());
        dto.setAuthor(entity.getAuthor());
        dto.setGenre(entity.getGenre());
        dto.setCondition(entity.getCondition());
        dto.setQuantity(entity.getQuantity());
        dto.setDescription(entity.getDescription());
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        dto.setInstitutionName(entity.getInstitutionName());
        dto.setRecipientName(entity.getRecipientName());
        dto.setAddress(entity.getAddress());
        dto.setDonationType(entity.getDonationType());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setStatus(entity.getStatus());
        return dto;
    }
} 