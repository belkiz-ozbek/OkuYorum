package aybu.graduationproject.okuyorum.milletKiraathaneleri.service;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.EventRegistrationDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.EventRegistration;

import java.util.List;

public interface EventRegistrationService {
    
    List<EventRegistrationDTO> getAllRegistrations();
    
    EventRegistrationDTO getRegistrationById(Long id);
    
    List<EventRegistrationDTO> getRegistrationsByEventId(Long eventId);
    
    List<EventRegistrationDTO> getRegistrationsByUserId(Long userId);
    
    EventRegistrationDTO registerUserForEvent(Long eventId, Long userId);
    
    void cancelRegistration(Long eventId, Long userId);
    
    boolean isUserRegisteredForEvent(Long eventId, Long userId);
    
    void markAsAttended(Long registrationId);
    
    EventRegistrationDTO convertToDTO(EventRegistration registration);
    
    EventRegistration convertToEntity(EventRegistrationDTO registrationDTO);
} 