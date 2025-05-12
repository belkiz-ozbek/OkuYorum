package aybu.graduationproject.okuyorum.milletKiraathaneleri.repository;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.EventRegistration;
import aybu.graduationproject.okuyorum.milletKiraathaneleri.model.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    
    @Query("SELECT COUNT(er) FROM EventRegistration er WHERE er.event.id = :eventId")
    Integer countByEventId(@Param("eventId") Long eventId);
    
    List<EventRegistration> findByEventId(Long eventId);
    
    List<EventRegistration> findByUserId(Long userId);
    
    Optional<EventRegistration> findByEventIdAndUserId(Long eventId, Long userId);
    
    @Query("SELECT er FROM EventRegistration er WHERE er.event.id = :eventId AND er.event.kiraathane.id = :kiraathaneId")
    List<EventRegistration> findByEventIdAndKiraathaneId(@Param("eventId") Long eventId, @Param("kiraathaneId") Long kiraathaneId);

    boolean existsByEventIdAndUserId(Long eventId, Long userId);

    boolean existsByEventIdAndUserIdAndAttendanceStatusNot(Long eventId, Long userId, AttendanceStatus status);

    List<EventRegistration> findByAttendanceStatus(AttendanceStatus status);
    
    List<EventRegistration> findByEventIdAndAttendanceStatus(Long eventId, AttendanceStatus status);
} 