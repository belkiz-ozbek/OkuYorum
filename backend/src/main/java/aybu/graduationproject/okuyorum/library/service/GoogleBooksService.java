package aybu.graduationproject.okuyorum.library.service;

import aybu.graduationproject.okuyorum.library.dto.BookDto;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Service
public class GoogleBooksService {
    
    private static final String GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";
    private static final int MAX_RESULTS = 10;
    private static final int MAX_START_INDEX = 40;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GoogleBooksService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public List<BookDto> searchBooks(String query, Integer startIndex) {
        try {
            if (startIndex >= MAX_START_INDEX) {
                return new ArrayList<>();
            }

            String url = String.format("%s?q=%s&startIndex=%d&maxResults=%d", 
                GOOGLE_BOOKS_API_URL, query, startIndex, MAX_RESULTS);

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode items = root.get("items");

            List<BookDto> bookDtos = new ArrayList<>();
            if (items != null && items.isArray()) {
                for (JsonNode item : items) {
                    JsonNode volumeInfo = item.get("volumeInfo");
                    String googleBooksId = item.get("id").asText();
                    if (volumeInfo != null) {
                        BookDto bookDto = convertToBookDto(volumeInfo, googleBooksId);
                        bookDtos.add(bookDto);
                    }
                }
            }
            return bookDtos;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching books from Google API", e);
        }
    }

    public Long getTotalItems(String query) {
        try {
            String url = String.format("%s?q=%s&maxResults=1", GOOGLE_BOOKS_API_URL, query);
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            return root.has("totalItems") ? root.get("totalItems").asLong() : 0L;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching total items from Google API", e);
        }
    }

    private String getTextValue(JsonNode node, String fieldName, String defaultValue) {
        return node.has(fieldName) && !node.get(fieldName).isNull() ? 
            node.get(fieldName).asText() : defaultValue;
    }

    private String getAuthors(JsonNode volumeInfo) {
        if (volumeInfo.has("authors") && volumeInfo.get("authors").isArray()) {
            List<String> authors = new ArrayList<>();
            volumeInfo.get("authors").forEach(author -> authors.add(author.asText()));
            return String.join(", ", authors);
        }
        return "Unknown Author";
    }

    private BookDto convertToBookDto(JsonNode volumeInfo, String googleBooksId) {
        BookDto bookDto = new BookDto();
        bookDto.setGoogleBooksId(googleBooksId);
        bookDto.setTitle(getTextValue(volumeInfo, "title", "Unknown Title"));
        bookDto.setAuthor(getAuthors(volumeInfo));
        bookDto.setSummary(getTextValue(volumeInfo, "description", "No description available"));
        
        // Kitap kapak görseli URL'sini HTTPS'e çevir
        JsonNode imageLinks = volumeInfo.get("imageLinks");
        if (imageLinks != null && imageLinks.has("thumbnail")) {
            String imageUrl = imageLinks.get("thumbnail").asText();
            imageUrl = imageUrl.replace("http://", "https://");
            bookDto.setImageUrl(imageUrl);
        }
        
        bookDto.setPublishedDate(getTextValue(volumeInfo, "publishedDate", null));
        
        if (volumeInfo.has("pageCount")) {
            bookDto.setPageCount(volumeInfo.get("pageCount").asInt());
        }
        
        return bookDto;
    }

    public BookDto getBookById(String googleBookId) {
        try {
            String url = String.format("%s/%s", GOOGLE_BOOKS_API_URL, googleBookId);
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode volumeInfo = root.get("volumeInfo");
            
            if (volumeInfo != null) {
                return convertToBookDto(volumeInfo, googleBookId);
            }
            throw new RuntimeException("Book not found");
        } catch (Exception e) {
            throw new RuntimeException("Error fetching book from Google API", e);
        }
    }
}