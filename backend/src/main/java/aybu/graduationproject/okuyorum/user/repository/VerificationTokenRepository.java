package aybu.graduationproject.okuyorum.user.repository;

import aybu.graduationproject.okuyorum.user.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByIdAndUsedFalse(Long id);
} 