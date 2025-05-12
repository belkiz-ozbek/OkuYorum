package aybu.graduationproject.okuyorum.milletKiraathaneleri.controller;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.EventRegistrationDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.UpdateAttendanceStatusRequest;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.service.EventRegistrationService;
import aybu.graduationproject.okuyorum.security.service.JwtService;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.EventRegistration;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event-registrations")
@RequiredArgsConstructor
public class EventRegistrationController {

    private final EventRegistrationService registrationService;
    private final JwtService jwtService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventRegistrationDTO>> getAllRegistrations() {
        return ResponseEntity.ok(registrationService.getAllRegistrations());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventRegistrationDTO> getRegistrationById(@PathVariable Long id) {
        return ResponseEntity.ok(registrationService.getRegistrationById(id));
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventRegistrationDTO>> getRegistrationsByEventId(@PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.getRegistrationsByEventId(eventId));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @jwtService.isCurrentUser(#userId)")
    public ResponseEntity<List<EventRegistrationDTO>> getRegistrationsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(registrationService.getRegistrationsByUserId(userId));
    }

    @PostMapping("/event/{eventId}/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @jwtService.isCurrentUser(#userId)")
    public ResponseEntity<EventRegistrationDTO> registerUserForEvent(
            @PathVariable Long eventId,
            @PathVariable Long userId) {
        // Log authentication details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("registerUserForEvent - Current authentication: " + auth);
        System.out.println("registerUserForEvent - User roles: " + auth.getAuthorities());
        System.out.println("registerUserForEvent - Is authenticated: " + auth.isAuthenticated());
        System.out.println("registerUserForEvent - Event ID: " + eventId + ", User ID: " + userId);
        
        // Yetkilendirme kontrolü
        if (!auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) &&
            !jwtService.isCurrentUser(userId)) {
            throw new AccessDeniedException("Bu işlem için yetkiniz bulunmamaktadır");
        }
        
        EventRegistrationDTO registration = registrationService.registerUserForEvent(eventId, userId);
        System.out.println("registerUserForEvent - Registration completed: " + registration);
        
        return new ResponseEntity<>(registration, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> cancelRegistration(@PathVariable Long id) {
        registrationService.cancelRegistration(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/event/{eventId}/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @jwtService.isCurrentUser(#userId)")
    public ResponseEntity<Void> cancelRegistrationByEventAndUser(
            @PathVariable Long eventId,
            @PathVariable Long userId) {
        // Log authentication details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("cancelRegistrationByEventAndUser - Current authentication: " + auth);
        System.out.println("cancelRegistrationByEventAndUser - User roles: " + auth.getAuthorities());
        System.out.println("cancelRegistrationByEventAndUser - Is authenticated: " + auth.isAuthenticated());
        System.out.println("cancelRegistrationByEventAndUser - Event ID: " + eventId + ", User ID: " + userId);
        
        EventRegistration registration = registrationService.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Kayıt bulunamadı"));
        registrationService.cancelRegistration(registration.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check/event/{eventId}/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @jwtService.isCurrentUser(#userId)")
    public ResponseEntity<Boolean> isUserRegisteredForEvent(
            @PathVariable Long eventId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(registrationService.isUserRegisteredForEvent(eventId, userId));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventRegistrationDTO> updateAttendanceStatus(
            @PathVariable Long id,
            @RequestBody UpdateAttendanceStatusRequest request) {
        return ResponseEntity.ok(registrationService.updateAttendanceStatus(id, request));
    }
} 