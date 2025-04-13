package aybu.graduationproject.okuyorum.library.controller;

import aybu.graduationproject.okuyorum.library.entity.Message;
import aybu.graduationproject.okuyorum.library.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class MessageController {
    private final MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Message> createMessage(@RequestBody Message message) {
        try {
            return ResponseEntity.ok(messageService.createMessage(message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Message> updateMessage(@PathVariable Long id, @RequestBody Message message) {
        try {
            return ResponseEntity.ok(messageService.updateMessage(id, message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        try {
            messageService.deleteMessage(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Message> getMessage(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(messageService.getMessage(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Message>> getMessagesByUser(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(messageService.getMessagesByReceiver(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Message>> getUnreadMessages(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(messageService.getUnreadMessages(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}/sent")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Message>> getSentMessages(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(messageService.getMessagesBySender(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{senderId}/receiver/{receiverId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Message>> getMessagesBetweenUsers(
            @PathVariable Long senderId,
            @PathVariable Long receiverId) {
        try {
            return ResponseEntity.ok(messageService.getMessagesBetweenUsers(senderId, receiverId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        try {
            messageService.markAsRead(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 