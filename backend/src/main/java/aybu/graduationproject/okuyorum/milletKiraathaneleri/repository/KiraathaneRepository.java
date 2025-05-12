package aybu.graduationproject.okuyorum.milletKiraathaneleri.repository;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.entity.Kiraathane;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KiraathaneRepository extends JpaRepository<Kiraathane, Long> {
    
    List<Kiraathane> findByCity(String city);
    
    List<Kiraathane> findByCityAndDistrict(String city, String district);
    
    List<Kiraathane> findAllByOrderByNameAsc();
} 