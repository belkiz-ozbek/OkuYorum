package aybu.graduationproject.okuyorum.library.service;

import aybu.graduationproject.okuyorum.library.entity.Message;
import aybu.graduationproject.okuyorum.library.repository.MessageRepository;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Message createMessage(Message message) {
        if (message.getContent() == null || message.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Mesaj içeriği boş olamaz");
        }

        // Get current authenticated user
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new IllegalStateException("Oturum açmış kullanıcı bulunamadı"));

        // Verify that the sender is the current user
        if (!currentUser.getId().equals(message.getSender().getId())) {
            throw new IllegalArgumentException("Başkası adına mesaj gönderemezsiniz");
        }
        
        // Load receiver from database
        User receiver = userRepository.findById(message.getReceiver().getId())
                .orElseThrow(() -> new IllegalArgumentException("Alıcı bulunamadı"));
        
        // Set the sender and receiver
        message.setSender(currentUser);
        message.setReceiver(receiver);
        
        return messageRepository.save(message);
    }

    @Transactional
    public Message updateMessage(Long id, Message message) {
        Message existingMessage = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        if (message.getContent() != null && !message.getContent().trim().isEmpty()) {
            existingMessage.setContent(message.getContent());
        }
        
        if (message.isRead() != existingMessage.isRead()) {
            existingMessage.setRead(message.isRead());
        }
        
        return messageRepository.save(existingMessage);
    }

    @Transactional
    public void deleteMessage(Long id) {
        if (!messageRepository.existsById(id)) {
            throw new IllegalArgumentException("Mesaj bulunamadı");
        }
        messageRepository.deleteById(id);
    }

    public Message getMessage(Long id) {
        return messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
    }

    public List<Message> getMessagesByReceiver(Long receiverId) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı"));
        return messageRepository.findByReceiver(receiver);
    }

    public List<Message> getMessagesBySender(Long senderId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı"));
        return messageRepository.findBySender(sender);
    }

    public List<Message> getUnreadMessages(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı"));
        return messageRepository.findByReceiverAndIsReadFalse(user);
    }

    public List<Message> getMessagesBetweenUsers(Long senderId, Long receiverId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return messageRepository.findBySenderAndReceiver(sender, receiver);
    }

    @Transactional
    public void markAsRead(Long id) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Mesaj bulunamadı"));
        message.setRead(true);
        messageRepository.save(message);
    }
} 