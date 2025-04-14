package aybu.graduationproject.okuyorum.library.controller;

import aybu.graduationproject.okuyorum.library.dto.BookDto;
import aybu.graduationproject.okuyorum.library.entity.Book;
import aybu.graduationproject.okuyorum.library.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
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

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookDto>> getUserBooks(@PathVariable Long userId) {
        return ResponseEntity.ok(bookService.getUserBooks(userId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BookDto> updateBook(@PathVariable Long id, @RequestBody BookDto bookDto) {
        return ResponseEntity.ok(bookService.updateBook(id, bookDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
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

    @GetMapping("/quick-search")
    public ResponseEntity<List<BookDto>> quickSearchBooks(@RequestParam String query) {
        return ResponseEntity.ok(bookService.quickSearchBooks(query));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BookDto> updateBookStatus(
            @PathVariable Long id,
            @RequestBody String status) {
        Book.ReadingStatus readingStatus = Book.ReadingStatus.valueOf(status);
        return ResponseEntity.ok(bookService.updateBookStatus(id, readingStatus));
    }
} 