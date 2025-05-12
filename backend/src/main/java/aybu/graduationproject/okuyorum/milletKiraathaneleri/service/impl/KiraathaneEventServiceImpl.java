package aybu.graduationproject.okuyorum.milletKiraathaneleri.service.impl;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.KiraathaneEventDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.Kiraathane;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.KiraathaneEvent;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.repository.KiraathaneEventRepository;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.repository.KiraathaneRepository;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.service.KiraathaneEventService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KiraathaneEventServiceImpl implements KiraathaneEventService {

    private final KiraathaneEventRepository eventRepository;
    private final KiraathaneRepository kiraathaneRepository;

    @Override
    @Transactional(readOnly = true)
    public List<KiraathaneEventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public KiraathaneEventDTO getEventById(Long id) {
        KiraathaneEvent event = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + id));
        return convertToDTO(event);
    }

    @Override
    @Transactional(readOnly = true)
    public List<KiraathaneEventDTO> getUpcomingEventsByKiraathaneId(Long kiraathaneId) {
        // Check if kiraathane exists
        kiraathaneRepository.findById(kiraathaneId)
                .orElseThrow(() -> new EntityNotFoundException("Kiraathane not found with id: " + kiraathaneId));
        
        return eventRepository.findUpcomingEventsByKiraathaneId(kiraathaneId, LocalDateTime.now()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<KiraathaneEventDTO> getAllUpcomingEvents() {
        return eventRepository.findAllUpcomingEvents(LocalDateTime.now()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<KiraathaneEventDTO> getEventsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return eventRepository.findEventsBetweenDates(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<KiraathaneEventDTO> getEventsByKiraathaneIdBetweenDates(Long kiraathaneId, LocalDateTime startDate, LocalDateTime endDate) {
        // Check if kiraathane exists
        kiraathaneRepository.findById(kiraathaneId)
                .orElseThrow(() -> new EntityNotFoundException("Kiraathane not found with id: " + kiraathaneId));
        
        return eventRepository.findEventsByKiraathaneIdBetweenDates(kiraathaneId, startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<KiraathaneEventDTO> getUpcomingEventsByType(KiraathaneEvent.EventType eventType) {
        return eventRepository.findUpcomingEventsByType(eventType, LocalDateTime.now()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public KiraathaneEventDTO createEvent(KiraathaneEventDTO eventDTO) {
        KiraathaneEvent event = convertToEntity(eventDTO);
        // Initialize registeredAttendees to 0
        if (event.getRegisteredAttendees() == null) {
            event.setRegisteredAttendees(0);
        }
        KiraathaneEvent savedEvent = eventRepository.save(event);
        return convertToDTO(savedEvent);
    }

    @Override
    @Transactional
    public KiraathaneEventDTO updateEvent(Long id, KiraathaneEventDTO eventDTO) {
        KiraathaneEvent event = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + id));
        
        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setEventDate(eventDTO.getEventDate());
        event.setEndDate(eventDTO.getEndDate());
        event.setEventType(eventDTO.getEventType());
        event.setImageUrl(eventDTO.getImageUrl());
        event.setCapacity(eventDTO.getCapacity());
        event.setIsActive(eventDTO.getIsActive());
        
        // If kiraathaneId has changed, update the kiraathane reference
        if (!event.getKiraathane().getId().equals(eventDTO.getKiraathaneId())) {
            Kiraathane kiraathane = kiraathaneRepository.findById(eventDTO.getKiraathaneId())
                    .orElseThrow(() -> new EntityNotFoundException("Kiraathane not found with id: " + eventDTO.getKiraathaneId()));
            event.setKiraathane(kiraathane);
        }
        
        KiraathaneEvent updatedEvent = eventRepository.save(event);
        return convertToDTO(updatedEvent);
    }

    @Override
    @Transactional
    public void deleteEvent(Long id) {
        KiraathaneEvent event = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + id));
        eventRepository.delete(event);
    }

    @Override
    public KiraathaneEventDTO convertToDTO(KiraathaneEvent event) {
        KiraathaneEventDTO dto = new KiraathaneEventDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setEventDate(event.getEventDate());
        dto.setEndDate(event.getEndDate());
        dto.setEventType(event.getEventType());
        dto.setImageUrl(event.getImageUrl());
        dto.setCapacity(event.getCapacity());
        dto.setRegisteredAttendees(event.getRegisteredAttendees());
        dto.setIsActive(event.getIsActive());
        dto.setCreatedAt(event.getCreatedAt());
        
        // Include kiraathane info
        dto.setKiraathaneId(event.getKiraathane().getId());
        dto.setKiraathaneName(event.getKiraathane().getName());
        dto.setKiraathaneAddress(event.getKiraathane().getAddress());
        
        return dto;
    }

    @Override
    public KiraathaneEvent convertToEntity(KiraathaneEventDTO eventDTO) {
        KiraathaneEvent event = new KiraathaneEvent();
        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setEventDate(eventDTO.getEventDate());
        event.setEndDate(eventDTO.getEndDate());
        event.setEventType(eventDTO.getEventType());
        event.setImageUrl(eventDTO.getImageUrl());
        event.setCapacity(eventDTO.getCapacity());
        event.setRegisteredAttendees(eventDTO.getRegisteredAttendees());
        event.setIsActive(eventDTO.getIsActive());
        
        // Set kiraathane reference
        if (eventDTO.getKiraathaneId() != null) {
            Kiraathane kiraathane = kiraathaneRepository.findById(eventDTO.getKiraathaneId())
                    .orElseThrow(() -> new EntityNotFoundException("Kiraathane not found with id: " + eventDTO.getKiraathaneId()));
            event.setKiraathane(kiraathane);
        }
        
        return event;
    }
} 