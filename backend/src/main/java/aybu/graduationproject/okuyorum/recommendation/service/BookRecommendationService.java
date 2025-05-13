package aybu.graduationproject.okuyorum.recommendation.service;

import aybu.graduationproject.okuyorum.recommendation.dto.BookRecommendationRequest;
import aybu.graduationproject.okuyorum.library.entity.Book;
import aybu.graduationproject.okuyorum.library.repository.BookRepository;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookRecommendationService {
    private static final Logger logger = LoggerFactory.getLogger(BookRecommendationService.class);
    private final GeminiService geminiService;
    private final BookRepository bookRepository;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    @Autowired
    public BookRecommendationService(
        GeminiService geminiService,
        BookRepository bookRepository,
        UserService userService,
        ObjectMapper objectMapper
    ) {
        this.geminiService = geminiService;
        this.bookRepository = bookRepository;
        this.userService = userService;
        this.objectMapper = objectMapper;
    }

    public String recommendAndSave(BookRecommendationRequest request) throws IOException {
        logger.info("Starting book recommendation process");
        
        User currentUser = getCurrentAuthenticatedUser();
        logger.info("Processing recommendation for user: {}", currentUser.getUsername());

        // Get AI recommendation
        String prompt = buildPrompt(request);
        String aiRecommendation = geminiService.getRecommendation(prompt);
        logger.info("Received AI recommendation: {}", aiRecommendation);

        // Parse AI recommendation
        Map<String, String> parsedRecommendation = parseAIRecommendation(aiRecommendation);
        logger.info("Parsed recommendation: {}", parsedRecommendation);

        // Find best matching book using AI recommendation
        Optional<Book> bestMatch = findBestMatchingBook(parsedRecommendation, request);
        
        if (bestMatch.isEmpty()) {
            // If no match found, get another recommendation from AI
            logger.info("No matching book found, requesting another recommendation");
            aiRecommendation = geminiService.getRecommendation(prompt + "\nLütfen farklı bir kitap öner.");
            parsedRecommendation = parseAIRecommendation(aiRecommendation);
            bestMatch = findBestMatchingBook(parsedRecommendation, request);
            
            if (bestMatch.isEmpty()) {
                return createJsonResponse(
                    "Üzgünüm, kriterlerinize uygun bir kitap bulunamadı. Lütfen farklı kriterlerle tekrar deneyin.",
                    null, null, null, null,
                    "Veritabanımızda bu kriterlere uygun kitap bulunmuyor."
                );
            }
        }

        Book recommendedBook = bestMatch.get();
        logger.info("Selected book for recommendation: {}", recommendedBook.getTitle());

        String recommendationText = String.format(
            "%s\n\nSize \"%s\" kitabını öneriyorum. %s tarafından yazılan bu kitap, %s türünde. %s",
            parsedRecommendation.get("explanation"),
            recommendedBook.getTitle(),
            recommendedBook.getAuthor(),
            recommendedBook.getGenre(),
            recommendedBook.getSummary() != null ? "\n\nKitap Özeti: " + recommendedBook.getSummary() : ""
        );

        return createJsonResponse(
            recommendationText,
            recommendedBook.getTitle(),
            recommendedBook.getAuthor(),
            recommendedBook.getGenre(),
            recommendedBook.getImageUrl(),
            recommendedBook.getSummary()
        );
    }

    private Optional<Book> findBestMatchingBook(Map<String, String> aiRecommendation, BookRecommendationRequest request) {
        return bookRepository.findAll().stream()
            .filter(book -> isBookSuitable(book, aiRecommendation, request))
            .max(Comparator.comparingDouble(book -> calculateMatchScore(book, aiRecommendation)));
    }

    private boolean isBookSuitable(Book book, Map<String, String> aiRecommendation, BookRecommendationRequest request) {
        // Check if book matches the basic criteria
        if (book.getTitle() == null || book.getAuthor() == null || book.getGenre() == null) {
            return false;
        }

        // Calculate match scores
        double titleSimilarity = calculateSimilarity(book.getTitle(), aiRecommendation.get("title"));
        double authorSimilarity = calculateSimilarity(book.getAuthor(), aiRecommendation.get("author"));
        double genreSimilarity = calculateSimilarity(book.getGenre(), aiRecommendation.get("genre"));

        // Book is suitable if it has high similarity in any aspect
        return titleSimilarity > 0.8 || 
               (authorSimilarity > 0.7 && genreSimilarity > 0.6) ||
               (genreSimilarity > 0.8 && request.getGenre().equalsIgnoreCase(book.getGenre()));
    }

    private double calculateMatchScore(Book book, Map<String, String> aiRecommendation) {
        double titleSimilarity = calculateSimilarity(book.getTitle(), aiRecommendation.get("title"));
        double authorSimilarity = calculateSimilarity(book.getAuthor(), aiRecommendation.get("author"));
        double genreSimilarity = calculateSimilarity(book.getGenre(), aiRecommendation.get("genre"));
        
        // Weighted scoring
        return (titleSimilarity * 0.4) + (authorSimilarity * 0.3) + (genreSimilarity * 0.3);
    }

    private String buildPrompt(BookRecommendationRequest request) {
        return String.format(
            "Sen bir kitap öneri uzmanısın. Aşağıdaki kriterlere göre en uygun kitabı öner:\n" +
            "- Tür: %s\n" +
            "- Beklenti: %s\n" +
            "- Okuma Süresi: %s\n" +
            "- Dikkat Durumu: %s\n\n" +
            "Lütfen şu formatta yanıt ver:\n" +
            "Başlık: [kitap adı]\n" +
            "Yazar: [yazar adı]\n" +
            "Tür: [kitap türü]\n" +
            "Açıklama: [neden bu kitabı önerdiğine dair kısa açıklama]\n" +
            "Zorluk: [kolay/orta/zor]",
            request.getGenre(),
            request.getExpectation(),
            request.getReadingTime(),
            request.isCanFocus() ? "İyi" : "Zayıf"
        );
    }

    private Map<String, String> parseAIRecommendation(String aiResponse) {
        Map<String, String> parsed = new HashMap<>();
        String[] lines = aiResponse.split("\n");
        
        for (String line : lines) {
            if (line.contains(":")) {
                String[] parts = line.split(":", 2);
                String key = parts[0].trim().toLowerCase();
                String value = parts[1].trim();
                
                switch (key) {
                    case "başlık" -> parsed.put("title", value);
                    case "yazar" -> parsed.put("author", value);
                    case "tür" -> parsed.put("genre", value);
                    case "açıklama" -> parsed.put("explanation", value);
                    case "zorluk" -> parsed.put("difficulty", value);
                }
            }
        }
        return parsed;
    }

    private double calculateSimilarity(String s1, String s2) {
        if (s1 == null || s2 == null) {
            return 0.0;
        }
        
        s1 = s1.toLowerCase().trim();
        s2 = s2.toLowerCase().trim();
        
        if (s1.equals(s2)) {
            return 1.0;
        }
        
        // Simple contains check
        if (s1.contains(s2) || s2.contains(s1)) {
            return 0.8;
        }
        
        // Levenshtein distance based similarity
        int distance = levenshteinDistance(s1, s2);
        int maxLength = Math.max(s1.length(), s2.length());
        return 1.0 - ((double) distance / maxLength);
    }

    private int levenshteinDistance(String s1, String s2) {
        int[][] dp = new int[s1.length() + 1][s2.length() + 1];
        
        for (int i = 0; i <= s1.length(); i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= s2.length(); j++) {
            dp[0][j] = j;
        }
        
        for (int i = 1; i <= s1.length(); i++) {
            for (int j = 1; j <= s2.length(); j++) {
                int cost = (s1.charAt(i - 1) == s2.charAt(j - 1)) ? 0 : 1;
                dp[i][j] = Math.min(
                    Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1),
                    dp[i - 1][j - 1] + cost
                );
            }
        }
        
        return dp[s1.length()][s2.length()];
    }

    private String createJsonResponse(String recommendation, String title, String author, String genre, String imageUrl, String summary) throws IOException {
        ObjectNode response = objectMapper.createObjectNode();
        response.put("recommendation", recommendation);
        response.put("title", title);
        response.put("author", author);
        response.put("genre", genre);
        response.put("imageUrl", imageUrl);
        response.put("summary", summary);
        return objectMapper.writeValueAsString(response);
    }

    private User getCurrentAuthenticatedUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            logger.error("No authentication found");
            throw new SecurityException("No authentication found");
        }

        if (auth.getPrincipal() instanceof User) {
            return (User) auth.getPrincipal();
        } else if (auth.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            return userService.getUserByUsername(userDetails.getUsername());
        } else {
            logger.error("Unexpected principal type: {}", auth.getPrincipal().getClass());
            throw new SecurityException("Invalid authentication type");
        }
    }
} 