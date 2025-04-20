package aybu.graduationproject.okuyorum.notification.dto;

import lombok.Data;

@Data
public class NotificationDTO {
    private Long id;
    private Long actorId;
    private String actorUsername;
    private String actorAvatar;
    private String type;
    private String message;
    private String link;
    private boolean read;
    private String createdAt;
}
