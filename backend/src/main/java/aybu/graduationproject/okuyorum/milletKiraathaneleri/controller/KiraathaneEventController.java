package aybu.graduationproject.okuyorum.milletKiraathaneleri.controller;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.dto.KiraathaneEventDTO;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.KiraathaneEvent;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.service.KiraathaneEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/kiraathane-events")
@RequiredArgsConstructor
public class KiraathaneEventController {

    private final KiraathaneEventService eventService;

    @GetMapping
    public ResponseEntity<List<KiraathaneEventDTO>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KiraathaneEventDTO> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<KiraathaneEventDTO>> getAllUpcomingEvents() {
        return ResponseEntity.ok(eventService.getAllUpcomingEvents());
    }

    @GetMapping("/kiraathane/{kiraathaneId}/upcoming")
    public ResponseEntity<List<KiraathaneEventDTO>> getUpcomingEventsByKiraathaneId(@PathVariable Long kiraathaneId) {
        return ResponseEntity.ok(eventService.getUpcomingEventsByKiraathaneId(kiraathaneId));
    }

    @GetMapping("/between-dates")
    public ResponseEntity<List<KiraathaneEventDTO>> getEventsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(eventService.getEventsBetweenDates(startDate, endDate));
    }

    @GetMapping("/kiraathane/{kiraathaneId}/between-dates")
    public ResponseEntity<List<KiraathaneEventDTO>> getEventsByKiraathaneIdBetweenDates(
            @PathVariable Long kiraathaneId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(eventService.getEventsByKiraathaneIdBetweenDates(kiraathaneId, startDate, endDate));
    }

    @GetMapping("/upcoming/type/{eventType}")
    public ResponseEntity<List<KiraathaneEventDTO>> getUpcomingEventsByType(
            @PathVariable KiraathaneEvent.EventType eventType) {
        return ResponseEntity.ok(eventService.getUpcomingEventsByType(eventType));
    }

    @PostMapping
    public ResponseEntity<KiraathaneEventDTO> createEvent(@RequestBody KiraathaneEventDTO eventDTO) {
        return new ResponseEntity<>(eventService.createEvent(eventDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KiraathaneEventDTO> updateEvent(
            @PathVariable Long id,
            @RequestBody KiraathaneEventDTO eventDTO) {
        return ResponseEntity.ok(eventService.updateEvent(id, eventDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
} 