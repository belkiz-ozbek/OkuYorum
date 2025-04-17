package aybu.graduationproject.okuyorum.library.service.impl;

import aybu.graduationproject.okuyorum.library.dto.CreateQuoteRequest;
import aybu.graduationproject.okuyorum.library.dto.QuoteDTO;
import aybu.graduationproject.okuyorum.library.entity.Book;
import aybu.graduationproject.okuyorum.library.entity.Quote;
import aybu.graduationproject.okuyorum.library.repository.BookRepository;
import aybu.graduationproject.okuyorum.library.repository.QuoteRepository;
import aybu.graduationproject.okuyorum.library.service.QuoteService;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuoteServiceImpl implements QuoteService {
    private final QuoteRepository quoteRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public QuoteServiceImpl(QuoteRepository quoteRepository, BookRepository bookRepository, UserRepository userRepository) {
        this.quoteRepository = quoteRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public QuoteDTO createQuote(CreateQuoteRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Quote quote = new Quote();
        quote.setContent(request.getContent());
        quote.setPageNumber(request.getPageNumber());
        quote.setBook(book);
        quote.setUser(user);

        Quote savedQuote = quoteRepository.save(quote);
        return convertToDTO(savedQuote);
    }

    @Override
    public QuoteDTO getQuote(Long id) {
        Quote quote = quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found"));
        return convertToDTO(quote);
    }

    @Override
    public List<QuoteDTO> getUserQuotes(Long userId) {
        return quoteRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuoteDTO> getBookQuotes(Long bookId) {
        return quoteRepository.findByBookId(bookId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuoteDTO> getUserBookQuotes(Long userId, Long bookId) {
        return quoteRepository.findByUserIdAndBookId(userId, bookId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteQuote(Long id, Long userId) {
        Quote quote = quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found"));
        
        if (!quote.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this quote");
        }
        
        quoteRepository.delete(quote);
    }

    private QuoteDTO convertToDTO(Quote quote) {
        QuoteDTO dto = new QuoteDTO();
        dto.setId(quote.getId());
        dto.setContent(quote.getContent());
        dto.setPageNumber(quote.getPageNumber());
        dto.setBookId(quote.getBook().getId());
        dto.setBookTitle(quote.getBook().getTitle());
        dto.setUserId(quote.getUser().getId());
        dto.setUsername(quote.getUser().getUsername());
        return dto;
    }
} 