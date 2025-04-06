package aybu.graduationproject.okuyorum.library.service;

import aybu.graduationproject.okuyorum.library.dto.BookDto;
import aybu.graduationproject.okuyorum.library.entity.Book;
import aybu.graduationproject.okuyorum.library.repository.BookRepository;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final GoogleBooksService googleBooksService;

    public BookService(BookRepository bookRepository, UserRepository userRepository, GoogleBooksService googleBooksService) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.googleBooksService = googleBooksService;
    }

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
        return convertToDto(savedBook);
    }

    public List<BookDto> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public BookDto getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Book not found"));
        return convertToDto(book);
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
        return bookRepository.findByTitleStartingWithIgnoreCaseOrderById(query)
            .stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    private BookDto convertToDto(Book book) {
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