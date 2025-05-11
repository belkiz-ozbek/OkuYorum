package aybu.graduationproject.okuyorum.milletKiraathaneleri.controller;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.EventRegistrationDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.service.EventRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event-registrations")
@RequiredArgsConstructor
public class EventRegistrationController {

    private final EventRegistrationService registrationService;

    @GetMapping
    public ResponseEntity<List<EventRegistrationDTO>> getAllRegistrations() {
        return ResponseEntity.ok(registrationService.getAllRegistrations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventRegistrationDTO> getRegistrationById(@PathVariable Long id) {
        return ResponseEntity.ok(registrationService.getRegistrationById(id));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<EventRegistrationDTO>> getRegistrationsByEventId(@PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.getRegistrationsByEventId(eventId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EventRegistrationDTO>> getRegistrationsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(registrationService.getRegistrationsByUserId(userId));
    }

    @PostMapping("/event/{eventId}/user/{userId}")
    public ResponseEntity<EventRegistrationDTO> registerUserForEvent(
            @PathVariable Long eventId,
            @PathVariable Long userId) {
        return new ResponseEntity<>(registrationService.registerUserForEvent(eventId, userId), HttpStatus.CREATED);
    }

    @DeleteMapping("/event/{eventId}/user/{userId}")
    public ResponseEntity<Void> cancelRegistration(
            @PathVariable Long eventId,
            @PathVariable Long userId) {
        registrationService.cancelRegistration(eventId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check/event/{eventId}/user/{userId}")
    public ResponseEntity<Boolean> isUserRegisteredForEvent(
            @PathVariable Long eventId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(registrationService.isUserRegisteredForEvent(eventId, userId));
    }

    @PatchMapping("/{registrationId}/mark-attended")
    public ResponseEntity<Void> markAsAttended(@PathVariable Long registrationId) {
        registrationService.markAsAttended(registrationId);
        return ResponseEntity.ok().build();
    }
} 