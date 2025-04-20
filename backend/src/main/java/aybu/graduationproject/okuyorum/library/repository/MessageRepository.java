package aybu.graduationproject.okuyorum.library.repository;

import aybu.graduationproject.okuyorum.library.entity.Message;
import aybu.graduationproject.okuyorum.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByReceiver(User receiver);
    List<Message> findBySender(User sender);
    List<Message> findByReceiverAndIsReadFalse(User receiver);
    List<Message> findBySenderAndReceiver(User sender, User receiver);
} 