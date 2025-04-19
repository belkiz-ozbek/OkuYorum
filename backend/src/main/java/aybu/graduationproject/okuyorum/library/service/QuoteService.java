package aybu.graduationproject.okuyorum.library.service;

import aybu.graduationproject.okuyorum.library.dto.CreateQuoteRequest;
import aybu.graduationproject.okuyorum.library.dto.QuoteDTO;

import java.util.List;

public interface QuoteService {
    QuoteDTO createQuote(CreateQuoteRequest request, Long userId);
    QuoteDTO getQuote(Long id, Long userId);
    List<QuoteDTO> getUserQuotes(Long userId, Long currentUserId);
    List<QuoteDTO> getBookQuotes(Long bookId, Long userId);
    List<QuoteDTO> getUserBookQuotes(Long userId, Long bookId);
    void deleteQuote(Long id, Long userId);
    QuoteDTO toggleLike(Long quoteId, Long userId);
    QuoteDTO toggleSave(Long quoteId, Long userId);
    List<QuoteDTO> getLikedQuotes(Long userId);
    List<QuoteDTO> getSavedQuotes(Long userId);
    QuoteDTO updateQuote(Long id, CreateQuoteRequest request, Long userId);
    String shareQuote(Long id, Long userId);
} 