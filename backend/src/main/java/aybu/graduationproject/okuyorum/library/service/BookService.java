package aybu.graduationproject.okuyorum.library.service;

import aybu.graduationproject.okuyorum.library.dto.BookDto;
import aybu.graduationproject.okuyorum.library.entity.Book;
import aybu.graduationproject.okuyorum.library.repository.BookRepository;
import aybu.graduationproject.okuyorum.signup.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public BookService(BookRepository bookRepository, UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    public BookDto createBook(BookDto bookDto) {
        Book book = new Book();
        book.setTitle(bookDto.getTitle());
        book.setAuthor(bookDto.getAuthor());
        book.setSummary(bookDto.getSummary());
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
        
        book.setTitle(bookDto.getTitle());
        book.setAuthor(bookDto.getAuthor());
        book.setSummary(bookDto.getSummary());
        
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

    private BookDto convertToDto(Book book) {
        BookDto dto = new BookDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setSummary(book.getSummary());
        dto.setUserId(book.getUser().getId());
        return dto;
    }
} 