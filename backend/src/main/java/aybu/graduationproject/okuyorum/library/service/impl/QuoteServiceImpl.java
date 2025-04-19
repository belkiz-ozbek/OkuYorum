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
        return convertToDTO(savedQuote, user);
    }

    @Override
    public QuoteDTO getQuote(Long id) {
        Quote quote = quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found"));
        return convertToDTO(quote, null);
    }

    @Override
    public List<QuoteDTO> getUserQuotes(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return quoteRepository.findByUserId(userId).stream()
                .map(quote -> convertToDTO(quote, user))
                .collect(Collectors.toList());
    }

    @Override
    public List<QuoteDTO> getBookQuotes(Long bookId) {
        return quoteRepository.findByBookId(bookId).stream()
                .map(quote -> convertToDTO(quote, null))
                .collect(Collectors.toList());
    }

    @Override
    public List<QuoteDTO> getUserBookQuotes(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return quoteRepository.findByUserIdAndBookId(userId, bookId).stream()
                .map(quote -> convertToDTO(quote, user))
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

    @Override
    @Transactional
    public QuoteDTO toggleLike(Long quoteId, Long userId) {
        Quote quote = quoteRepository.findById(quoteId)
                .orElseThrow(() -> new RuntimeException("Quote not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        quote.toggleLike(user);
        Quote savedQuote = quoteRepository.save(quote);
        return convertToDTO(savedQuote, user);
    }

    @Override
    @Transactional
    public QuoteDTO toggleSave(Long quoteId, Long userId) {
        Quote quote = quoteRepository.findById(quoteId)
                .orElseThrow(() -> new RuntimeException("Quote not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        quote.toggleSave(user);
        Quote savedQuote = quoteRepository.save(quote);
        return convertToDTO(savedQuote, user);
    }

    @Override
    public List<QuoteDTO> getLikedQuotes(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return quoteRepository.findByLikedByContaining(user).stream()
                .map(quote -> convertToDTO(quote, user))
                .collect(Collectors.toList());
    }

    @Override
    public List<QuoteDTO> getSavedQuotes(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return quoteRepository.findBySavedByContaining(user).stream()
                .map(quote -> convertToDTO(quote, user))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public QuoteDTO updateQuote(Long id, CreateQuoteRequest request, Long userId) {
        Quote quote = quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found"));

        if (!quote.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to update this quote");
        }

        quote.setContent(request.getContent());
        quote.setPageNumber(request.getPageNumber());

        Quote savedQuote = quoteRepository.save(quote);
        return convertToDTO(savedQuote, quote.getUser());
    }

    private QuoteDTO convertToDTO(Quote quote, User currentUser) {
        QuoteDTO dto = new QuoteDTO();
        dto.setId(quote.getId());
        dto.setContent(quote.getContent());
        dto.setPageNumber(quote.getPageNumber());
        dto.setBookId(quote.getBook().getId());
        dto.setBookTitle(quote.getBook().getTitle());
        dto.setBookAuthor(quote.getBook().getAuthor());
        dto.setBookCoverImage(quote.getBook().getImageUrl());
        dto.setUserId(quote.getUser().getId());
        dto.setUsername(quote.getUser().getUsername());
        dto.setUserAvatar(quote.getUser().getProfileImage());
        dto.setLikes(quote.getLikedBy().size());
        if (currentUser != null) {
            dto.setIsLiked(quote.isLikedBy(currentUser));
            dto.setIsSaved(quote.isSavedBy(currentUser));
        }
        if (quote.getCreatedAt() != null) {
            dto.setCreatedAt(quote.getCreatedAt().toString());
        }
        if (quote.getUpdatedAt() != null) {
            dto.setUpdatedAt(quote.getUpdatedAt().toString());
        }
        return dto;
    }
} 