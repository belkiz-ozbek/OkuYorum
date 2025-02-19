package aybu.graduationproject.okuyorum.library.controller;

import aybu.graduationproject.okuyorum.library.dto.BookDto;
import aybu.graduationproject.okuyorum.library.service.BookService;
import aybu.graduationproject.okuyorum.library.service.GoogleBooksService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Collections;

@RestController
@RequestMapping("/api/books")
@PreAuthorize("hasRole('USER')")
public class BookController {

    private final BookService bookService;
    private final GoogleBooksService googleBooksService;

    public BookController(BookService bookService, GoogleBooksService googleBooksService) {
        this.bookService = bookService;
        this.googleBooksService = googleBooksService;
    }

    @PostMapping
    public ResponseEntity<BookDto> createBook(@RequestBody BookDto bookDto) {
        return ResponseEntity.ok(bookService.createBook(bookDto));
    }

    @GetMapping
    public ResponseEntity<Page<BookDto>> getAllBooks(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(bookService.getAllBooks(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDto> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookDto> updateBook(@PathVariable Long id, @RequestBody BookDto bookDto) {
        return ResponseEntity.ok(bookService.updateBook(id, bookDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<BookDto>> searchBooks(
            @RequestParam String query,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(bookService.searchBooks(query, pageable));
    }

    @GetMapping("/google-search")
    public ResponseEntity<Map<String, Object>> searchGoogleBooks(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") Integer page) {
        
        try {
            int startIndex = page * 10;
            List<BookDto> books = googleBooksService.searchBooks(query, startIndex);
            Long totalItems = googleBooksService.getTotalItems(query);
            
            Map<String, Object> response = new HashMap<>();
            response.put("books", books);
            response.put("totalItems", Math.min(totalItems != null ? totalItems : 0L, 40L));
            response.put("currentPage", page);
            response.put("hasNextPage", startIndex + 10 < Math.min(totalItems != null ? totalItems : 0L, 40L));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch books: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/import-from-google")
    public ResponseEntity<BookDto> importGoogleBook(@RequestBody BookDto bookDto, 
                                                  @RequestParam Long userId) {
        bookDto.setUserId(userId);
        return ResponseEntity.ok(bookService.createBook(bookDto));
    }

    @PostMapping("/import-multiple-from-google")
    public ResponseEntity<List<BookDto>> importMultipleGoogleBooks(
            @RequestBody List<String> googleBookIds,
            @RequestParam Long userId) {
        return ResponseEntity.ok(bookService.createBooksFromGoogleIds(googleBookIds, userId));
    }

    @GetMapping("/quick-search")
    public ResponseEntity<List<BookDto>> quickSearch(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(bookService.quickSearchBooks(query.trim()));
    }
} 