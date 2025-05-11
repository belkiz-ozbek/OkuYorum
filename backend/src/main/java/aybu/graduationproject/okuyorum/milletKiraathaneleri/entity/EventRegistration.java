package aybu.graduationproject.okuyorum.milletKiraathaneleri.entity;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.model.AttendanceStatus;
import aybu.graduationproject.okuyorum.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_registrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private KiraathaneEvent event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "registered_at", nullable = false)
    private LocalDateTime registeredAt;

    @Column(nullable = false)
    private boolean attended;

    @Enumerated(EnumType.STRING)
    @Column(name = "attendance_status", nullable = false)
    private AttendanceStatus attendanceStatus = AttendanceStatus.REGISTERED;

    @Column(name = "attendance_notes")
    private String attendanceNotes;

    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;

    @Column(name = "checked_in_by")
    private String checkedInBy;

    @Column(name = "no_show_reason")
    private String noShowReason;
} 