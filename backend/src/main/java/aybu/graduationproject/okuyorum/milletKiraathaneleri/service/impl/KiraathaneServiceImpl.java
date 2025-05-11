package aybu.graduationproject.okuyorum.milletKiraathaneleri.service.impl;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.KiraathaneDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.KiraathaneEventDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.Kiraathane;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.KiraathaneEvent;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.repository.KiraathaneRepository;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.service.KiraathaneEventService;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.service.KiraathaneService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KiraathaneServiceImpl implements KiraathaneService {

    private final KiraathaneRepository kiraathaneRepository;
    private final KiraathaneEventService kiraathaneEventService;

    @Override
    @Transactional(readOnly = true)
    public List<KiraathaneDTO> getAllKiraathanes() {
        return kiraathaneRepository.findAllOrderByNameAsc().stream()
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
        kiraathane.setWorkingHours(kiraathaneDTO.getWorkingHours());
        kiraathane.setImageUrl(kiraathaneDTO.getImageUrl());
        kiraathane.setMapCoordinates(kiraathaneDTO.getMapCoordinates());
        
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
        dto.setWorkingHours(kiraathane.getWorkingHours());
        dto.setImageUrl(kiraathane.getImageUrl());
        dto.setMapCoordinates(kiraathane.getMapCoordinates());
        dto.setCreatedAt(kiraathane.getCreatedAt());
        
        // Get upcoming events for this kiraathane
        List<KiraathaneEventDTO> upcomingEvents = kiraathaneEventService.getUpcomingEventsByKiraathaneId(kiraathane.getId());
        dto.setUpcomingEvents(upcomingEvents);
        
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
        kiraathane.setWorkingHours(kiraathaneDTO.getWorkingHours());
        kiraathane.setImageUrl(kiraathaneDTO.getImageUrl());
        kiraathane.setMapCoordinates(kiraathaneDTO.getMapCoordinates());
        // ID and timestamps will be handled by JPA/DB
        
        return kiraathane;
    }
} 