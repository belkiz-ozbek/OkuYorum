package aybu.graduationproject.okuyorum.library.service;

import aybu.graduationproject.okuyorum.library.dto.BookDto;
import aybu.graduationproject.okuyorum.library.entity.Book;
import aybu.graduationproject.okuyorum.library.entity.UserBook;
import aybu.graduationproject.okuyorum.library.repository.BookRepository;
import aybu.graduationproject.okuyorum.library.repository.UserBookRepository;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import aybu.graduationproject.okuyorum.library.repository.ReviewRepository;
import aybu.graduationproject.okuyorum.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final UserBookRepository userBookRepository;
    private final GoogleBooksService googleBooksService;
    private final UserService userService;
    private final ReviewRepository reviewRepository;

    public BookService(BookRepository bookRepository, 
                      UserRepository userRepository, 
                      UserBookRepository userBookRepository,
                      GoogleBooksService googleBooksService,
                      UserService userService,
                      ReviewRepository reviewRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.userBookRepository = userBookRepository;
        this.googleBooksService = googleBooksService;
        this.userService = userService;
        this.reviewRepository = reviewRepository;
    }

    @Transactional
    public BookDto createBook(BookDto bookDto) {
        if (bookDto.getGoogleBooksId() != null) {
            Optional<Book> existingBook = bookRepository.findByGoogleBooksId(bookDto.getGoogleBooksId());
            if (existingBook.isPresent()) {
                throw new IllegalArgumentException("This book is already in your library");
            }
        }

        Book book = convertToEntity(bookDto);
        book.setUser(userRepository.findById(bookDto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found")));
        
        Book savedBook = bookRepository.save(book);
        
        // Create UserBook entry with initial status
        UserBook userBook = new UserBook();
        userBook.setUser(savedBook.getUser());
        userBook.setBook(savedBook);
        userBook.setStatus(Book.ReadingStatus.WILL_READ); // Default status
        userBookRepository.save(userBook);
        
        return convertToDto(savedBook, userBook);
    }

    public List<BookDto> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public BookDto getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Book not found"));
        
        // Get the current user's ID from SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Long userId = userService.getUserIdByUsername(username);
        
        // Get user's reading status for this book
        UserBook userBook = userBookRepository.findByUserIdAndBookId(userId, id)
                .orElse(null);
        
        return convertToDto(book, userBook);
    }

    public BookDto updateBook(Long id, BookDto bookDto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Book not found"));
        
        updateBookFromDto(book, bookDto);
        Book updatedBook = bookRepository.save(book);
        return convertToDto(updatedBook);
    }

    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new EntityNotFoundException("Book not found");
        }
        bookRepository.deleteById(id);
    }

    public Page<BookDto> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable)
                .map(this::convertToDto);
    }

    public Page<BookDto> searchBooks(String query, Pageable pageable) {
        if (query == null || query.trim().isEmpty()) {
            return getAllBooks(pageable);
        }
        return bookRepository.searchBooks(query.trim(), pageable)
                .map(this::convertToDto);
    }

    public List<BookDto> createBooksFromGoogleIds(List<String> googleBookIds, Long userId) {
        List<BookDto> addedBooks = new ArrayList<>();
        List<String> existingIds = bookRepository.findByGoogleBooksIdIn(googleBookIds)
                .stream()
                .map(Book::getGoogleBooksId)
                .collect(Collectors.toList());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        for (String googleId : googleBookIds) {
            if (!existingIds.contains(googleId)) {
                try {
                    BookDto bookDto = googleBooksService.getBookById(googleId);
                    bookDto.setUserId(userId);
                    Book book = convertToEntity(bookDto);
                    book.setUser(user);
                    addedBooks.add(convertToDto(bookRepository.save(book)));
                } catch (Exception e) {
                    System.err.println("Error importing book with ID: " + googleId + " - " + e.getMessage());
                }
            }
        }
        return addedBooks;
    }

    public List<BookDto> quickSearchBooks(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        return bookRepository.findByTitleStartingWithIgnoreCaseOrAuthorStartingWithIgnoreCaseOrderById(query.trim())
            .stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public BookDto updateBookStatus(Long bookId, Long userId, Book.ReadingStatus status) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        UserBook userBook = userBookRepository.findByUserIdAndBookId(userId, bookId)
                .orElseGet(() -> {
                    UserBook newUserBook = new UserBook();
                    newUserBook.setUser(user);
                    newUserBook.setBook(book);
                    return newUserBook;
                });
        
        // Eğer durum "READ" olarak değiştirildiyse ve önceki durum "READ" değilse
        if (status == Book.ReadingStatus.READ && userBook.getStatus() != Book.ReadingStatus.READ) {
            user.setBooksRead(user.getBooksRead() + 1);
            userRepository.save(user);
        }
        // Eğer durum "READ"den başka bir duruma değiştirildiyse ve önceki durum "READ" ise
        else if (status != Book.ReadingStatus.READ && userBook.getStatus() == Book.ReadingStatus.READ) {
            user.setBooksRead(Math.max(0, user.getBooksRead() - 1));
            userRepository.save(user);
        }
        
        userBook.setStatus(status);
        userBookRepository.save(userBook);
        
        return convertToDto(book, userBook);
    }

    public List<BookDto> getUserBooks(Long userId) {
        List<UserBook> userBooks = userBookRepository.findByUserId(userId);
        return userBooks.stream()
                .map(userBook -> convertToDto(userBook.getBook(), userBook))
                .collect(Collectors.toList());
    }

    public List<BookDto> getUserBooksByStatus(Long userId, Book.ReadingStatus status) {
        List<UserBook> userBooks = userBookRepository.findByUserIdAndStatus(userId, status);
        return userBooks.stream()
                .map(userBook -> convertToDto(userBook.getBook(), userBook))
                .collect(Collectors.toList());
    }

    private BookDto convertToDto(Book book) {
        return convertToDto(book, null);
    }

    private BookDto convertToDto(Book book, UserBook userBook) {
        BookDto dto = new BookDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setSummary(book.getSummary());
        dto.setUserId(book.getUser().getId());
        dto.setGoogleBooksId(book.getGoogleBooksId());
        dto.setImageUrl(book.getImageUrl());
        dto.setPublishedDate(book.getPublishedDate());
        dto.setPageCount(book.getPageCount());
        
        // Get status from UserBook if available
        if (userBook != null) {
            dto.setStatus(userBook.getStatus());
        }

        // Calculate total readers (users who have read the book)
        int readCount = userBookRepository.findByBookIdAndStatus(book.getId(), Book.ReadingStatus.READ).size();
        dto.setReadCount(readCount);
        
        // Calculate average rating and review count
        Double avgRating = reviewRepository.getAverageRatingByBookId(book.getId());
        Long reviewCount = reviewRepository.getReviewCountByBookId(book.getId());
        dto.setRating(avgRating != null ? avgRating : null);
        dto.setReviewCount(reviewCount != null ? reviewCount.intValue() : 0);
        
        return dto;
    }

    private Book convertToEntity(BookDto bookDto) {
        Book book = new Book();
        updateBookFromDto(book, bookDto);
        return book;
    }

    private void updateBookFromDto(Book book, BookDto bookDto) {
        book.setTitle(bookDto.getTitle());
        book.setAuthor(bookDto.getAuthor());
        book.setSummary(bookDto.getSummary());
        book.setGoogleBooksId(bookDto.getGoogleBooksId());
        book.setImageUrl(bookDto.getImageUrl());
        book.setPublishedDate(formatPublishedDate(bookDto.getPublishedDate()));
        book.setPageCount(bookDto.getPageCount());
    }

    private String formatPublishedDate(String publishedDate) {
        if (publishedDate == null) return null;
        return publishedDate.length() > 10 ? publishedDate.substring(0, 10) : publishedDate;
    }
} 