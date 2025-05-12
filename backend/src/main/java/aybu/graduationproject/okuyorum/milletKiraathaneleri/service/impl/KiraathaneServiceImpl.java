package aybu.graduationproject.okuyorum.milletKiraathaneleri.service.impl;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.KiraathaneDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.KiraathaneEventDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.KiraathaneRatingDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.Kiraathane;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.KiraathaneRating;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.repository.KiraathaneRatingRepository;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.repository.KiraathaneRepository;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.service.KiraathaneEventService;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.service.KiraathaneRatingService;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.service.KiraathaneService;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KiraathaneServiceImpl implements KiraathaneService {

    private final KiraathaneRepository kiraathaneRepository;
    private final KiraathaneEventService kiraathaneEventService;
    private final KiraathaneRatingService kiraathaneRatingService;
    private final KiraathaneRatingRepository ratingRepository;
    private final UserService userService;

    @Override
    @Transactional(readOnly = true)
    public List<KiraathaneDTO> getAllKiraathanes() {
        return kiraathaneRepository.findAllByOrderByNameAsc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public KiraathaneDTO getKiraathaneById(Long id) {
        Kiraathane kiraathane = kiraathaneRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Kiraathane not found with id: " + id));
        return convertToDTO(kiraathane);
    }

    @Override
    @Transactional(readOnly = true)
    public List<KiraathaneDTO> getKiraathanesByCity(String city) {
        return kiraathaneRepository.findByCity(city).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<KiraathaneDTO> getKiraathanesByCityAndDistrict(String city, String district) {
        return kiraathaneRepository.findByCityAndDistrict(city, district).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public KiraathaneDTO createKiraathane(KiraathaneDTO kiraathaneDTO) {
        Kiraathane kiraathane = convertToEntity(kiraathaneDTO);
        Kiraathane savedKiraathane = kiraathaneRepository.save(kiraathane);
        return convertToDTO(savedKiraathane);
    }

    @Override
    @Transactional
    public KiraathaneDTO updateKiraathane(Long id, KiraathaneDTO kiraathaneDTO) {
        Kiraathane kiraathane = kiraathaneRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Kiraathane not found with id: " + id));
        
        kiraathane.setName(kiraathaneDTO.getName());
        kiraathane.setAddress(kiraathaneDTO.getAddress());
        kiraathane.setDescription(kiraathaneDTO.getDescription());
        kiraathane.setCity(kiraathaneDTO.getCity());
        kiraathane.setDistrict(kiraathaneDTO.getDistrict());
        kiraathane.setPhoneNumber(kiraathaneDTO.getPhoneNumber());
        kiraathane.setEmail(kiraathaneDTO.getEmail());
        kiraathane.setOpeningTime(kiraathaneDTO.getOpeningTime());
        kiraathane.setClosingTime(kiraathaneDTO.getClosingTime());
        kiraathane.setPhotoUrls(kiraathaneDTO.getPhotoUrls());
        kiraathane.setFeaturedPhotoUrl(kiraathaneDTO.getFeaturedPhotoUrl());
        kiraathane.setMapCoordinates(kiraathaneDTO.getMapCoordinates());
        kiraathane.setBookCount(kiraathaneDTO.getBookCount());
        kiraathane.setFeatures(kiraathaneDTO.getFeatures());
        
        Kiraathane updatedKiraathane = kiraathaneRepository.save(kiraathane);
        return convertToDTO(updatedKiraathane);
    }

    @Override
    @Transactional
    public void deleteKiraathane(Long id) {
        Kiraathane kiraathane = kiraathaneRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Kiraathane not found with id: " + id));
        kiraathaneRepository.delete(kiraathane);
    }

    @Override
    public KiraathaneDTO convertToDTO(Kiraathane kiraathane) {
        KiraathaneDTO dto = new KiraathaneDTO();
        dto.setId(kiraathane.getId());
        dto.setName(kiraathane.getName());
        dto.setAddress(kiraathane.getAddress());
        dto.setDescription(kiraathane.getDescription());
        dto.setCity(kiraathane.getCity());
        dto.setDistrict(kiraathane.getDistrict());
        dto.setPhoneNumber(kiraathane.getPhoneNumber());
        dto.setEmail(kiraathane.getEmail());
        dto.setOpeningTime(kiraathane.getOpeningTime());
        dto.setClosingTime(kiraathane.getClosingTime());
        dto.setPhotoUrls(kiraathane.getPhotoUrls());
        dto.setFeaturedPhotoUrl(kiraathane.getFeaturedPhotoUrl());
        dto.setMapCoordinates(kiraathane.getMapCoordinates());
        dto.setBookCount(kiraathane.getBookCount());
        dto.setAverageRating(kiraathane.getAverageRating());
        dto.setTotalRatings(kiraathane.getTotalRatings());
        dto.setFeatures(kiraathane.getFeatures());
        dto.setCreatedAt(kiraathane.getCreatedAt());
        
        // Get upcoming events for this kiraathane
        List<KiraathaneEventDTO> upcomingEvents = kiraathaneEventService.getUpcomingEventsByKiraathaneId(kiraathane.getId());
        dto.setUpcomingEvents(upcomingEvents);
        
        // Get recent ratings for this kiraathane
        List<KiraathaneRatingDTO> recentRatings = kiraathaneRatingService
                .getRatingsByKiraathaneId(kiraathane.getId(), PageRequest.of(0, 5))
                .getContent();
        dto.setRecentRatings(recentRatings);
        
        return dto;
    }

    @Override
    public Kiraathane convertToEntity(KiraathaneDTO kiraathaneDTO) {
        Kiraathane kiraathane = new Kiraathane();
        kiraathane.setName(kiraathaneDTO.getName());
        kiraathane.setAddress(kiraathaneDTO.getAddress());
        kiraathane.setDescription(kiraathaneDTO.getDescription());
        kiraathane.setCity(kiraathaneDTO.getCity());
        kiraathane.setDistrict(kiraathaneDTO.getDistrict());
        kiraathane.setPhoneNumber(kiraathaneDTO.getPhoneNumber());
        kiraathane.setEmail(kiraathaneDTO.getEmail());
        kiraathane.setOpeningTime(kiraathaneDTO.getOpeningTime());
        kiraathane.setClosingTime(kiraathaneDTO.getClosingTime());
        kiraathane.setPhotoUrls(kiraathaneDTO.getPhotoUrls());
        kiraathane.setFeaturedPhotoUrl(kiraathaneDTO.getFeaturedPhotoUrl());
        kiraathane.setMapCoordinates(kiraathaneDTO.getMapCoordinates());
        kiraathane.setBookCount(kiraathaneDTO.getBookCount());
        kiraathane.setFeatures(kiraathaneDTO.getFeatures());
        // ID, ratings ve timestamps will be handled by JPA/DB
        
        return kiraathane;
    }

    @Override
    @Transactional
    public void rateKiraathane(Long kiraathaneId, KiraathaneRatingDTO ratingDTO, Long userId) {
        Kiraathane kiraathane = kiraathaneRepository.findById(kiraathaneId)
                .orElseThrow(() -> new EntityNotFoundException("Kiraathane not found with id: " + kiraathaneId));

        KiraathaneRating rating = ratingRepository.findByKiraathaneIdAndUserId(kiraathaneId, userId)
                .orElse(new KiraathaneRating());

        rating.setKiraathane(kiraathane);
        rating.setUser(userService.getUserById(userId));
        rating.setRating(ratingDTO.getRating());
        rating.setComment(ratingDTO.getComment());

        KiraathaneRating savedRating = ratingRepository.save(rating);
        kiraathane.addRating(savedRating.getRating());
        kiraathaneRepository.save(kiraathane);
    }
} 