package aybu.graduationproject.okuyorum.milletKiraathaneleri.repository;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.KiraathaneEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface KiraathaneEventRepository extends JpaRepository<KiraathaneEvent, Long> {
    
    @Query("SELECT e FROM KiraathaneEvent e WHERE e.kiraathane.id = :kiraathaneId AND e.eventDate >= :now AND e.isActive = true ORDER BY e.eventDate ASC")
    List<KiraathaneEvent> findUpcomingEventsByKiraathaneId(@Param("kiraathaneId") Long kiraathaneId, @Param("now") LocalDateTime now);
    
    @Query("SELECT e FROM KiraathaneEvent e WHERE e.eventDate >= :now AND e.isActive = true ORDER BY e.eventDate ASC")
    List<KiraathaneEvent> findAllUpcomingEvents(@Param("now") LocalDateTime now);
    
    @Query("SELECT e FROM KiraathaneEvent e WHERE e.eventDate >= :startDate AND e.eventDate <= :endDate AND e.isActive = true ORDER BY e.eventDate ASC")
    List<KiraathaneEvent> findEventsBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT e FROM KiraathaneEvent e WHERE e.kiraathane.id = :kiraathaneId AND e.eventDate >= :startDate AND e.eventDate <= :endDate AND e.isActive = true ORDER BY e.eventDate ASC")
    List<KiraathaneEvent> findEventsByKiraathaneIdBetweenDates(@Param("kiraathaneId") Long kiraathaneId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT e FROM KiraathaneEvent e WHERE e.eventType = :eventType AND e.eventDate >= :now AND e.isActive = true ORDER BY e.eventDate ASC")
    List<KiraathaneEvent> findUpcomingEventsByType(@Param("eventType") KiraathaneEvent.EventType eventType, @Param("now") LocalDateTime now);
} 