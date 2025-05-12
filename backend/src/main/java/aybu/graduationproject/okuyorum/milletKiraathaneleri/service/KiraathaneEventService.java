package aybu.graduationproject.okuyorum.milletKiraathaneleri.service;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.KiraathaneEventDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.KiraathaneEvent;

import java.time.LocalDateTime;
import java.util.List;

public interface KiraathaneEventService {
    
    List<KiraathaneEventDTO> getAllEvents();
    
    KiraathaneEventDTO getEventById(Long id);
    
    List<KiraathaneEventDTO> getUpcomingEventsByKiraathaneId(Long kiraathaneId);
    
    List<KiraathaneEventDTO> getAllUpcomingEvents();
    
    List<KiraathaneEventDTO> getEventsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    
    List<KiraathaneEventDTO> getEventsByKiraathaneIdBetweenDates(Long kiraathaneId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<KiraathaneEventDTO> getUpcomingEventsByType(KiraathaneEvent.EventType eventType);
    
    KiraathaneEventDTO createEvent(KiraathaneEventDTO eventDTO);
    
    KiraathaneEventDTO updateEvent(Long id, KiraathaneEventDTO eventDTO);
    
    void deleteEvent(Long id);
    
    KiraathaneEventDTO convertToDTO(KiraathaneEvent event);
    
    KiraathaneEvent convertToEntity(KiraathaneEventDTO eventDTO);
} 