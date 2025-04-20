package aybu.graduationproject.okuyorum.notification.entity;

import aybu.graduationproject.okuyorum.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User recipient;

    @ManyToOne(fetch = FetchType.LAZY)
    private User actor;

    private String type; // LIKE, COMMENT, FOLLOW, etc.

    private String message;

    private String link;

    private boolean read;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
