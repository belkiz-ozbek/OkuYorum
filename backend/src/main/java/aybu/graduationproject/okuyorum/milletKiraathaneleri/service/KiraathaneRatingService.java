package aybu.graduationproject.okuyorum.milletKiraathaneleri.service;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.KiraathaneRatingDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface KiraathaneRatingService {
    
    KiraathaneRatingDTO addRating(Long kiraathaneId, Long userId, KiraathaneRatingDTO ratingDTO);
    
    KiraathaneRatingDTO updateRating(Long ratingId, Long userId, KiraathaneRatingDTO ratingDTO);
    
    void deleteRating(Long ratingId, Long userId);
    
    KiraathaneRatingDTO getRatingById(Long ratingId);
    
    List<KiraathaneRatingDTO> getRatingsByKiraathaneId(Long kiraathaneId);
    
    Page<KiraathaneRatingDTO> getRatingsByKiraathaneId(Long kiraathaneId, Pageable pageable);
    
    List<KiraathaneRatingDTO> getRatingsByUserId(Long userId);
    
    KiraathaneRatingDTO getUserRatingForKiraathane(Long kiraathaneId, Long userId);
    
    boolean hasUserRatedKiraathane(Long kiraathaneId, Long userId);
} 