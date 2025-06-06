package aybu.graduationproject.okuyorum.milletKiraathaneleri.service;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.KiraathaneDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.KiraathaneRatingDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.Kiraathane;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface KiraathaneService {
    
    List<KiraathaneDTO> getAllKiraathanes();
    
    KiraathaneDTO getKiraathaneById(Long id);
    
    List<KiraathaneDTO> getKiraathanesByCity(String city);
    
    List<KiraathaneDTO> getKiraathanesByCityAndDistrict(String city, String district);
    
    KiraathaneDTO createKiraathane(KiraathaneDTO kiraathaneDTO);
    
    KiraathaneDTO updateKiraathane(Long id, KiraathaneDTO kiraathaneDTO);
    
    void deleteKiraathane(Long id);
    
    KiraathaneDTO convertToDTO(Kiraathane kiraathane);
    
    Kiraathane convertToEntity(KiraathaneDTO kiraathaneDTO);

    @Transactional
    void rateKiraathane(Long kiraathaneId, KiraathaneRatingDTO ratingDTO, Long userId);
} 