package aybu.graduationproject.okuyorum.milletKiraathaneleri.dto;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.model.AttendanceStatus;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventRegistrationDTO {
    private Long id;
    private Long eventId;
    private Long userId;
    private String username;
    private String userEmail;
    private String eventTitle;
    private LocalDateTime eventDate;
    private LocalDateTime registrationDate;
    private boolean attended;
    private AttendanceStatus attendanceStatus;
    private String attendanceNotes;
    private LocalDateTime checkedInAt;
    private String checkedInBy;
    private String noShowReason;
} 