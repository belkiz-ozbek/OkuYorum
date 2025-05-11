package aybu.graduationproject.okuyorum.milletKiraathaneleri.service.impl;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.EventRegistrationDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.EventRegistration;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.KiraathaneEvent;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.repository.EventRegistrationRepository;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.repository.KiraathaneEventRepository;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.service.EventRegistrationService;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventRegistrationServiceImpl implements EventRegistrationService {

    private final EventRegistrationRepository registrationRepository;
    private final KiraathaneEventRepository eventRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<EventRegistrationDTO> getAllRegistrations() {
        return registrationRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EventRegistrationDTO getRegistrationById(Long id) {
        EventRegistration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Registration not found with id: " + id));
        return convertToDTO(registration);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventRegistrationDTO> getRegistrationsByEventId(Long eventId) {
        // Check if event exists
        eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + eventId));
        
        return registrationRepository.findByEventId(eventId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventRegistrationDTO> getRegistrationsByUserId(Long userId) {
        // Check if user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        
        return registrationRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EventRegistrationDTO registerUserForEvent(Long eventId, Long userId) {
        KiraathaneEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + eventId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        
        // Check if user is already registered for the event
        if (isUserRegisteredForEvent(eventId, userId)) {
            throw new IllegalStateException("User is already registered for this event");
        }
        
        // Check if the event has capacity
        if (event.getCapacity() != null && event.getRegisteredAttendees() >= event.getCapacity()) {
            throw new IllegalStateException("Event has reached its maximum capacity");
        }
        
        // Create new registration
        EventRegistration registration = new EventRegistration();
        registration.setEvent(event);
        registration.setUser(user);
        registration.setAttended(false);
        
        EventRegistration savedRegistration = registrationRepository.save(registration);
        
        // Update event attendee count
        event.setRegisteredAttendees(event.getRegisteredAttendees() + 1);
        eventRepository.save(event);
        
        return convertToDTO(savedRegistration);
    }

    @Override
    @Transactional
    public void cancelRegistration(Long eventId, Long userId) {
        EventRegistration registration = registrationRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Registration not found for event id: " + eventId + " and user id: " + userId));
        
        KiraathaneEvent event = registration.getEvent();
        
        registrationRepository.delete(registration);
        
        // Update event attendee count
        if (event.getRegisteredAttendees() > 0) {
            event.setRegisteredAttendees(event.getRegisteredAttendees() - 1);
            eventRepository.save(event);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isUserRegisteredForEvent(Long eventId, Long userId) {
        return registrationRepository.findByEventIdAndUserId(eventId, userId).isPresent();
    }

    @Override
    @Transactional
    public void markAsAttended(Long registrationId) {
        EventRegistration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new EntityNotFoundException("Registration not found with id: " + registrationId));
        
        registration.setAttended(true);
        registrationRepository.save(registration);
    }

    @Override
    public EventRegistrationDTO convertToDTO(EventRegistration registration) {
        EventRegistrationDTO dto = new EventRegistrationDTO();
        dto.setId(registration.getId());
        dto.setEventId(registration.getEvent().getId());
        dto.setEventTitle(registration.getEvent().getTitle());
        dto.setEventDate(registration.getEvent().getEventDate());
        dto.setUserId(registration.getUser().getId());
        dto.setUserName(registration.getUser().getUsername());
        dto.setRegisteredAt(registration.getRegisteredAt());
        dto.setAttended(registration.getAttended());
        return dto;
    }

    @Override
    public EventRegistration convertToEntity(EventRegistrationDTO registrationDTO) {
        EventRegistration registration = new EventRegistration();
        
        // Set event reference
        if (registrationDTO.getEventId() != null) {
            KiraathaneEvent event = eventRepository.findById(registrationDTO.getEventId())
                    .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + registrationDTO.getEventId()));
            registration.setEvent(event);
        }
        
        // Set user reference
        if (registrationDTO.getUserId() != null) {
            User user = userRepository.findById(registrationDTO.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + registrationDTO.getUserId()));
            registration.setUser(user);
        }
        
        registration.setAttended(registrationDTO.getAttended());
        
        return registration;
    }
} 