package aybu.graduationproject.okuyorum.notification.service;

import aybu.graduationproject.okuyorum.notification.dto.NotificationDTO;
import aybu.graduationproject.okuyorum.notification.entity.Notification;
import aybu.graduationproject.okuyorum.notification.repository.NotificationRepository;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.model.AttendanceStatus;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createNotification(Long recipientId, Long actorId, String type, String message, String link) {
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));
        User actor = userRepository.findById(actorId)
                .orElseThrow(() -> new RuntimeException("Actor not found"));

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setActor(actor);
        notification.setType(type);
        notification.setMessage(message);
        notification.setLink(link);
        notification.setRead(false);

        notificationRepository.save(notification);
    }

    public List<NotificationDTO> getNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByRecipientAndReadOrderByCreatedAtDesc(user, false)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.countByRecipientAndRead(user, false);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getRecipient().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to mark this notification as read");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Notification> unreadNotifications = notificationRepository.findByRecipientAndReadOrderByCreatedAtDesc(user, false);
        unreadNotifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }

    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setActorId(notification.getActor().getId());
        dto.setActorUsername(notification.getActor().getUsername());
        dto.setActorAvatar(notification.getActor().getProfileImage());
        dto.setType(notification.getType());
        dto.setMessage(notification.getMessage());
        dto.setLink(notification.getLink());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt().toString());
        return dto;
    }

    public void sendEventRegistrationStatusUpdate(User user, String eventTitle, AttendanceStatus oldStatus, AttendanceStatus newStatus, String notes) {
        String message = String.format("%s etkinliği için katılım durumunuz %s olarak güncellendi.", 
            eventTitle, 
            getStatusText(newStatus)
        );
        
        if (notes != null && !notes.isEmpty()) {
            message += " Not: " + notes;
        }
        
        createNotification(
            user.getId(),
            user.getId(), // Sistem bildirimi olduğu için user'ın kendisi actor
            "EVENT_STATUS_UPDATE",
            message,
            "/events/" + eventTitle // Frontend route'una göre düzenlenebilir
        );
    }

    private String getStatusText(AttendanceStatus status) {
        return switch (status) {
            case REGISTERED -> "Kayıtlı";
            case CONFIRMED -> "Onaylandı";
            case ATTENDED -> "Katıldı";
            case NO_SHOW -> "Katılmadı";
            case CANCELLED -> "İptal Edildi";
        };
    }
    
    public void sendEventUpdateNotification(
        Long eventId,
        String eventTitle,
        String updateType,
        String message
    ) {
        // Implementation of sendEventUpdateNotification method
    }
    
    public void sendEventReminderNotification(
        User user,
        String eventTitle,
        String eventDateTime,
        String eventLocation
    ) {
        // Implementation of sendEventReminderNotification method
    }
}
