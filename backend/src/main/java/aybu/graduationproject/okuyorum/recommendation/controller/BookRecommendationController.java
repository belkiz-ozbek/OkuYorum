package aybu.graduationproject.okuyorum.recommendation.controller;

import aybu.graduationproject.okuyorum.recommendation.dto.BookRecommendationRequest;
import aybu.graduationproject.okuyorum.recommendation.service.BookRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BookRecommendationController {
    private static final Logger logger = LoggerFactory.getLogger(BookRecommendationController.class);
    private final BookRecommendationService bookRecommendationService;

    @Autowired
    public BookRecommendationController(BookRecommendationService bookRecommendationService) {
        this.bookRecommendationService = bookRecommendationService;
    }

    @PostMapping("/books")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> getBookRecommendation(@RequestBody BookRecommendationRequest request) {
        try {
            logger.info("Received book recommendation request");
        String recommendation = bookRecommendationService.recommendAndSave(request);
        return ResponseEntity.ok(recommendation);
        } catch (Exception e) {
            logger.error("Error processing book recommendation request", e);
            return ResponseEntity.badRequest()
                .body("Error getting book recommendation: " + e.getMessage());
        }
    }

    private String buildPrompt(BookRecommendationRequest request) {
        return String.format(
            "Aşağıdaki kriterlere göre bir kitap önerisi yap:\n" +
            "Tür: %s\n" +
            "Beklenti: %s\n" +
            "Okuma Süresi: %s\n" +
            "Dikkat Durumu: %s\n\n" +
            "Lütfen kitabın adını, yazarını ve kısa bir açıklamasını ver.",
            request.getGenre(),
            request.getExpectation(),
            request.getReadingTime(),
            request.isCanFocus() ? "İyi" : "Zayıf"
        );
    }
} 