package aybu.graduationproject.okuyorum.library.service.impl;

import aybu.graduationproject.okuyorum.library.dto.CreateQuoteRequest;
import aybu.graduationproject.okuyorum.library.dto.QuoteDTO;
import aybu.graduationproject.okuyorum.library.entity.Book;
import aybu.graduationproject.okuyorum.library.entity.Quote;
import aybu.graduationproject.okuyorum.library.repository.BookRepository;
import aybu.graduationproject.okuyorum.library.repository.QuoteRepository;
import aybu.graduationproject.okuyorum.library.service.QuoteService;
import aybu.graduationproject.okuyorum.profile.service.AchievementService;
import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import aybu.graduationproject.okuyorum.notification.service.NotificationService;

@Service
public class QuoteServiceImpl implements QuoteService {
    private final QuoteRepository quoteRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AchievementService achievementService;

    public QuoteServiceImpl(QuoteRepository quoteRepository, BookRepository bookRepository, UserRepository userRepository, NotificationService notificationService, AchievementService achievementService) {
        this.quoteRepository = quoteRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.achievementService = achievementService;
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
        
        // Update achievement progress
        int quoteCount = quoteRepository.findByUserId(userId).size();
        achievementService.updateQuoteMasterProgress(userId, quoteCount);
        
        return convertToDTO(savedQuote, user);
    }

    @Override
    public QuoteDTO getQuote(Long id, Long userId) {
        Quote quote = quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found"));
        User currentUser = userId != null ? userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found")) : null;
        return convertToDTO(quote, currentUser);
    }

    @Override
    public List<QuoteDTO> getUserQuotes(Long userId, Long currentUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User currentUser = currentUserId != null ? userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found")) : null;
        return quoteRepository.findByUserId(userId).stream()
                .filter(quote -> !quote.isDeleted())
                .map(quote -> convertToDTO(quote, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    public List<QuoteDTO> getBookQuotes(Long bookId, Long userId) {
        User currentUser = userId != null ? userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found")) : null;
        return quoteRepository.findByBookId(bookId).stream()
                .filter(quote -> !quote.isDeleted())
                .map(quote -> convertToDTO(quote, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    public List<QuoteDTO> getUserBookQuotes(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return quoteRepository.findByUserIdAndBookId(userId, bookId).stream()
                .filter(quote -> !quote.isDeleted())
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
        
        quote.setDeleted(true);
        quote.getComments().clear();
        quote.getLikedBy().clear();
        quote.getSavedBy().clear();
        quoteRepository.save(quote);
    }

    @Override
    @Transactional
    public QuoteDTO toggleLike(Long quoteId, Long userId) {
        Quote quote = quoteRepository.findById(quoteId)
                .orElseThrow(() -> new RuntimeException("Quote not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean wasLiked = quote.isLikedBy(user);
        quote.toggleLike(user);
        Quote savedQuote = quoteRepository.save(quote);

        // Eğer alıntı beğenildiyse ve beğenen kişi alıntının sahibi değilse bildirim gönder
        if (!wasLiked && !quote.getUser().getId().equals(userId)) {
            notificationService.createNotification(
                quote.getUser().getId(),
                userId,
                "QUOTE_LIKE",
                String.format("%s alıntınızı beğendi", user.getUsername()),
                String.format("/features/quotes/%d", quote.getId())
            );
        }

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
                .filter(quote -> !quote.isDeleted())
                .map(quote -> convertToDTO(quote, user))
                .collect(Collectors.toList());
    }

    @Override
    public List<QuoteDTO> getSavedQuotes(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return quoteRepository.findBySavedByContaining(user).stream()
                .filter(quote -> !quote.isDeleted())
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

    @Override
    public String shareQuote(Long id, Long userId) {
        Quote quote = quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Şimdilik sadece frontend'e paylaşım URL'i döndürüyoruz
        // İleride sosyal medya entegrasyonu eklenebilir
        return String.format("/quotes/%d", quote.getId());
    }

    private QuoteDTO convertToDTO(Quote quote, User currentUser) {
        if (quote == null) {
            return null;
        }

        QuoteDTO dto = new QuoteDTO();
        dto.setId(quote.getId());
        dto.setContent(quote.getContent());
        dto.setPageNumber(quote.getPageNumber());

        Book book = quote.getBook();
        if (book != null) {
            dto.setBookId(book.getId());
            dto.setBookTitle(book.getTitle());
            dto.setBookAuthor(book.getAuthor());
            dto.setBookCoverImage(book.getImageUrl());
        }

        User user = quote.getUser();
        if (user != null) {
            dto.setUserId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setUserAvatar(user.getProfileImage());
        }

        dto.setLikes(quote.getLikedBy() != null ? quote.getLikedBy().size() : 0);
        
        if (currentUser != null) {
            dto.setLiked(quote.isLikedBy(currentUser));
            dto.setSaved(quote.isSavedBy(currentUser));
        } else {
            dto.setLiked(false);
            dto.setSaved(false);
        }

        dto.setCreatedAt(quote.getCreatedAt() != null ? quote.getCreatedAt().toString() : null);
        dto.setUpdatedAt(quote.getUpdatedAt() != null ? quote.getUpdatedAt().toString() : null);
        return dto;
    }
} 