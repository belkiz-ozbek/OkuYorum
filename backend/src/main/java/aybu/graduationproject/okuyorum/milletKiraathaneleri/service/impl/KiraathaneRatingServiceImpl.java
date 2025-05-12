package aybu.graduationproject.okuyorum.milletKiraathaneleri.service.impl;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.KiraathaneRatingDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.Kiraathane;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.KiraathaneRating;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.repository.KiraathaneRatingRepository;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.repository.KiraathaneRepository;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.service.KiraathaneRatingService;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KiraathaneRatingServiceImpl implements KiraathaneRatingService {

    private final KiraathaneRatingRepository ratingRepository;
    private final KiraathaneRepository kiraathaneRepository;
    private final UserService userService;

    @Override
    @Transactional
    public KiraathaneRatingDTO addRating(Long kiraathaneId, Long userId, KiraathaneRatingDTO ratingDTO) {
        Kiraathane kiraathane = kiraathaneRepository.findById(kiraathaneId)
                .orElseThrow(() -> new EntityNotFoundException("Kiraathane not found"));
        
        User user = userService.getUserById(userId);
        
        if (ratingRepository.existsByKiraathaneIdAndUserId(kiraathaneId, userId)) {
            throw new IllegalStateException("User has already rated this kiraathane");
        }

        KiraathaneRating rating = new KiraathaneRating();
        rating.setKiraathane(kiraathane);
        rating.setUser(user);
        rating.setRating(ratingDTO.getRating());
        rating.setComment(ratingDTO.getComment());

        KiraathaneRating savedRating = ratingRepository.save(rating);
        kiraathane.addRating(rating.getRating());
        kiraathaneRepository.save(kiraathane);

        return convertToDTO(savedRating);
    }

    @Override
    @Transactional
    public KiraathaneRatingDTO updateRating(Long ratingId, Long userId, KiraathaneRatingDTO ratingDTO) {
        KiraathaneRating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new EntityNotFoundException("Rating not found"));

        if (!rating.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Not authorized to update this rating");
        }

        int oldRating = rating.getRating();
        rating.setRating(ratingDTO.getRating());
        rating.setComment(ratingDTO.getComment());

        KiraathaneRating updatedRating = ratingRepository.save(rating);
        
        Kiraathane kiraathane = rating.getKiraathane();
        kiraathane.updateRating(oldRating, rating.getRating());
        kiraathaneRepository.save(kiraathane);

        return convertToDTO(updatedRating);
    }

    @Override
    @Transactional
    public void deleteRating(Long ratingId, Long userId) {
        KiraathaneRating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new EntityNotFoundException("Rating not found"));

        if (!rating.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Not authorized to delete this rating");
        }

        Kiraathane kiraathane = rating.getKiraathane();
        kiraathane.removeRating(rating.getRating());
        kiraathaneRepository.save(kiraathane);

        ratingRepository.delete(rating);
    }

    @Override
    public KiraathaneRatingDTO getRatingById(Long ratingId) {
        return ratingRepository.findById(ratingId)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Rating not found"));
    }

    @Override
    public List<KiraathaneRatingDTO> getRatingsByKiraathaneId(Long kiraathaneId) {
        return ratingRepository.findByKiraathaneId(kiraathaneId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<KiraathaneRatingDTO> getRatingsByKiraathaneId(Long kiraathaneId, Pageable pageable) {
        return ratingRepository.findByKiraathaneId(kiraathaneId, pageable)
                .map(this::convertToDTO);
    }

    @Override
    public List<KiraathaneRatingDTO> getRatingsByUserId(Long userId) {
        return ratingRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public KiraathaneRatingDTO getUserRatingForKiraathane(Long kiraathaneId, Long userId) {
        return ratingRepository.findByKiraathaneIdAndUserId(kiraathaneId, userId)
                .map(this::convertToDTO)
                .orElse(null);
    }

    @Override
    public boolean hasUserRatedKiraathane(Long kiraathaneId, Long userId) {
        return ratingRepository.existsByKiraathaneIdAndUserId(kiraathaneId, userId);
    }

    private KiraathaneRatingDTO convertToDTO(KiraathaneRating rating) {
        KiraathaneRatingDTO dto = new KiraathaneRatingDTO();
        dto.setId(rating.getId());
        dto.setKiraathaneId(rating.getKiraathane().getId());
        dto.setUserId(rating.getUser().getId());
        dto.setUserName(rating.getUser().getUsername());
        dto.setRating(rating.getRating());
        dto.setComment(rating.getComment());
        dto.setCreatedAt(rating.getCreatedAt());
        return dto;
    }
} 