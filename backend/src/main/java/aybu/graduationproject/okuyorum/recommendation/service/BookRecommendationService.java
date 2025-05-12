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

import java.io.IOException;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class BookRecommendationService {
    private static final Logger logger = LoggerFactory.getLogger(BookRecommendationService.class);
    private final GeminiService geminiService;
    private final BookRepository bookRepository;
    private final UserService userService;
    private final Random random = new Random();
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
        
        // Get current user
        User currentUser = getCurrentAuthenticatedUser();
        logger.info("Processing recommendation for user: {}", currentUser.getUsername());

        // Get books matching the genre
        List<Book> matchingBooks = bookRepository.findByGenre(request.getGenre());
        
        if (matchingBooks.isEmpty()) {
            // If no exact genre match, try to find books with similar genres
            matchingBooks = bookRepository.findAll().stream()
                .filter(book -> book.getGenre() != null)
                .collect(Collectors.toList());
        }

        if (matchingBooks.isEmpty()) {
            return createJsonResponse("Üzgünüm, şu anda uygun kitap önerisi bulunamadı.", null, null, null, null, null);
        }

        // Select a random book from matching books
        Book recommendedBook = matchingBooks.get(random.nextInt(matchingBooks.size()));

        // Create recommendation text
        String recommendationText = String.format(
            "Size \"%s\" kitabını öneriyorum. %s tarafından yazılan bu kitap, %s türünde. %s",
            recommendedBook.getTitle(),
            recommendedBook.getAuthor(),
            recommendedBook.getGenre(),
            recommendedBook.getSummary() != null ? "\n\nKitap Özeti: " + recommendedBook.getSummary() : ""
        );

        logger.info("Generated recommendation for book: {}", recommendedBook.getTitle());
        
        return createJsonResponse(
            recommendationText,
            recommendedBook.getTitle(),
            recommendedBook.getAuthor(),
            recommendedBook.getGenre(),
            recommendedBook.getImageUrl(),
            recommendedBook.getSummary()
        );
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