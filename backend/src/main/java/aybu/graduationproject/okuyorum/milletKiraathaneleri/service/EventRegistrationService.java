package aybu.graduationproject.okuyorum.milletKiraathaneleri.service;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.EventRegistrationDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.UpdateAttendanceStatusRequest;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.EventRegistration;

import java.util.List;
import java.util.Optional;

public interface EventRegistrationService {
    List<EventRegistrationDTO> getAllRegistrations();
    
    EventRegistrationDTO getRegistrationById(Long id);
    
    List<EventRegistrationDTO> getRegistrationsByEventId(Long eventId);
    
    List<EventRegistrationDTO> getRegistrationsByUserId(Long userId);
    
    EventRegistrationDTO registerUserForEvent(Long eventId, Long userId);
    
    void cancelRegistration(Long registrationId);
    
    boolean isUserRegisteredForEvent(Long eventId, Long userId);
    
    EventRegistrationDTO updateAttendanceStatus(Long registrationId, UpdateAttendanceStatusRequest request);
    
    EventRegistrationDTO convertToDTO(EventRegistration registration);
    
    EventRegistration convertToEntity(EventRegistrationDTO registrationDTO);
    
    Optional<EventRegistration> findByEventIdAndUserId(Long eventId, Long userId);
} 