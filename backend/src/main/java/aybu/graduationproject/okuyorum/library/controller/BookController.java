package aybu.graduationproject.okuyorum.library.controller;

import aybu.graduationproject.okuyorum.library.dto.BookDto;
import aybu.graduationproject.okuyorum.library.entity.UserBook;
import aybu.graduationproject.okuyorum.library.service.BookService;
import aybu.graduationproject.okuyorum.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.util.Map;


@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    private final BookService bookService;
    private final UserService userService;

    public BookController(BookService bookService, UserService userService) {
        this.bookService = bookService;
        this.userService = userService;
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
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @PageableDefault(size = 20) Pageable pageable) {
        String searchQuery = query;
        if (searchQuery == null && (title != null || author != null)) {
            searchQuery = (title != null ? title : "") + " " + (author != null ? author : "");
            searchQuery = searchQuery.trim();
        }
        return ResponseEntity.ok(bookService.searchBooks(searchQuery, pageable));
    }

    @GetMapping("/quick-search")
    public ResponseEntity<List<BookDto>> quickSearchBooks(@RequestParam String query) {
        return ResponseEntity.ok(bookService.quickSearchBooks(query));
    }

    @PutMapping("/{bookId}/status")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BookDto> updateBookStatus(
            @PathVariable Long bookId,
            @RequestBody Map<String, String> request) {
        Long userId = Long.parseLong(request.get("userId"));
        String statusStr = request.get("status");
        UserBook.ReadingStatus status = null;
        if (statusStr != null) {
            status = UserBook.ReadingStatus.valueOf(statusStr);
        }
        BookDto updatedBook = bookService.updateBookStatus(bookId, status, userId);
        return ResponseEntity.ok(updatedBook);
    }

    @PutMapping("/{bookId}/favorite")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BookDto> toggleFavorite(@PathVariable Long bookId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Long userId = userService.getUserIdByUsername(username);
        
        return ResponseEntity.ok(bookService.toggleFavorite(bookId, userId));
    }

    @GetMapping("/favorites")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<BookDto>> getFavoriteBooks() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Long userId = userService.getUserIdByUsername(username);
        
        return ResponseEntity.ok(bookService.getFavoriteBooks(userId));
    }

    @GetMapping("/library/{userId}")
    public ResponseEntity<List<BookDto>> getUserLibrary(@PathVariable Long userId) {
        List<BookDto> books = bookService.getUserBooks(userId);
        return ResponseEntity.ok(books);
    }

    @PostMapping("/{bookId}/library")
    public ResponseEntity<Void> addToLibrary(
            @PathVariable Long bookId,
            @RequestParam(required = false) Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        bookService.addBookToUserLibrary(bookId, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/library")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> removeBookFromLibrary(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        Long userId = userService.getUserIdByUsername(username);
        bookService.removeBookFromUserLibrary(id, userId);
        return ResponseEntity.ok().build();
    }
} 