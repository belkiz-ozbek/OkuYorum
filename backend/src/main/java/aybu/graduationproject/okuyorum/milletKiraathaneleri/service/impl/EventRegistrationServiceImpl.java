package aybu.graduationproject.okuyorum.milletKiraathaneleri.service.impl;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.EventRegistrationDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.UpdateAttendanceStatusRequest;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.EventRegistration;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.KiraathaneEvent;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.model.AttendanceStatus;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.repository.EventRegistrationRepository;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.repository.KiraathaneEventRepository;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.service.EventRegistrationService;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.service.UserService;
import aybu.graduationproject.okuyorum.notification.service.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventRegistrationServiceImpl implements EventRegistrationService {

    private final EventRegistrationRepository registrationRepository;
    private final KiraathaneEventRepository eventRepository;
    private final UserService userService;
    private final NotificationService notificationService;

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
        return registrationRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Kayıt bulunamadı: " + id));
    }

    @Override
    public List<EventRegistrationDTO> getRegistrationsByEventId(Long eventId) {
        return registrationRepository.findByEventId(eventId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventRegistrationDTO> getRegistrationsByUserId(Long userId) {
        return registrationRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EventRegistrationDTO updateAttendanceStatus(Long registrationId, UpdateAttendanceStatusRequest request) {
        EventRegistration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new EntityNotFoundException("Kayıt bulunamadı: " + registrationId));
        
        AttendanceStatus oldStatus = registration.getAttendanceStatus();
        registration.setAttendanceStatus(request.getStatus());
        registration.setAttendanceNotes(request.getNotes());
        
        if (request.getStatus() == AttendanceStatus.ATTENDED) {
            registration.setAttended(true);
            registration.setCheckedInAt(LocalDateTime.now());
            registration.setCheckedInBy(request.getCheckedInBy());
        } else if (request.getStatus() == AttendanceStatus.NO_SHOW) {
            registration.setAttended(false);
            registration.setNoShowReason(request.getNoShowReason());
        }
        
        EventRegistration updatedRegistration = registrationRepository.save(registration);
        
        // Send notification
        notificationService.sendEventRegistrationStatusUpdate(
            registration.getUser(),
            registration.getEvent().getTitle(),
            oldStatus,
            request.getStatus(),
            request.getNotes()
        );
        
        return convertToDTO(updatedRegistration);
    }

    @Override
    @Transactional
    public EventRegistrationDTO registerUserForEvent(Long eventId, Long userId) {
        if (isUserRegisteredForEvent(eventId, userId)) {
            throw new IllegalStateException("Bu etkinliğe zaten kayıtlısınız");
        }

        KiraathaneEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Etkinlik bulunamadı"));

        if (event.getCapacity() != null && event.getRegisteredAttendees() >= event.getCapacity()) {
            throw new IllegalStateException("Etkinlik kapasitesi dolu");
        }

        User user = userService.getUserById(userId);

        EventRegistration registration = new EventRegistration();
        registration.setEvent(event);
        registration.setUser(user);
        registration.setRegisteredAt(LocalDateTime.now());
        registration.setAttended(false);
        registration.setAttendanceStatus(AttendanceStatus.REGISTERED);

        event.setRegisteredAttendees(event.getRegisteredAttendees() + 1);
        eventRepository.save(event);

        EventRegistration savedRegistration = registrationRepository.save(registration);
        
        // Send notification
        notificationService.sendEventRegistrationStatusUpdate(
            user,
            event.getTitle(),
            null,
            AttendanceStatus.REGISTERED,
            "Etkinliğe başarıyla kayıt oldunuz."
        );

        return convertToDTO(savedRegistration);
    }

    @Override
    @Transactional
    public void cancelRegistration(Long registrationId) {
        EventRegistration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new EntityNotFoundException("Kayıt bulunamadı"));
        registration.setAttendanceStatus(AttendanceStatus.CANCELLED);
        registrationRepository.save(registration);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isUserRegisteredForEvent(Long eventId, Long userId) {
        return registrationRepository.existsByEventIdAndUserIdAndAttendanceStatusNot(
            eventId, userId, AttendanceStatus.CANCELLED
        );
    }

    @Override
    public EventRegistrationDTO convertToDTO(EventRegistration registration) {
        return EventRegistrationDTO.builder()
                .id(registration.getId())
                .eventId(registration.getEvent().getId())
                .userId(registration.getUser().getId())
                .username(registration.getUser().getUsername())
                .userEmail(registration.getUser().getEmail())
                .eventTitle(registration.getEvent().getTitle())
                .eventDate(registration.getEvent().getEventDate())
                .registrationDate(registration.getRegisteredAt())
                .attended(registration.isAttended())
                .attendanceStatus(registration.getAttendanceStatus())
                .attendanceNotes(registration.getAttendanceNotes())
                .checkedInAt(registration.getCheckedInAt())
                .checkedInBy(registration.getCheckedInBy())
                .noShowReason(registration.getNoShowReason())
                .build();
    }

    @Override
    public EventRegistration convertToEntity(EventRegistrationDTO dto) {
        EventRegistration registration = new EventRegistration();
        registration.setId(dto.getId());
        registration.setEvent(eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new EntityNotFoundException("Etkinlik bulunamadı")));
        registration.setUser(userService.getUserById(dto.getUserId()));
        registration.setRegisteredAt(dto.getRegistrationDate());
        registration.setAttended(dto.isAttended());
        registration.setAttendanceStatus(dto.getAttendanceStatus());
        registration.setAttendanceNotes(dto.getAttendanceNotes());
        registration.setCheckedInAt(dto.getCheckedInAt());
        registration.setCheckedInBy(dto.getCheckedInBy());
        registration.setNoShowReason(dto.getNoShowReason());
        return registration;
    }
} 