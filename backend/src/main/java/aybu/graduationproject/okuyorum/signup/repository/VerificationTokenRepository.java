package aybu.graduationproject.okuyorum.signup.repository;

import aybu.graduationproject.okuyorum.signup.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByTokenAndUsedFalse(String token);
    Optional<VerificationToken> findByIdAndUsedFalse(Long id);
} 