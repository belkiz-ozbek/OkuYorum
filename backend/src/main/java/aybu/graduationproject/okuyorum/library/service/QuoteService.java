package aybu.graduationproject.okuyorum.library.service;

import aybu.graduationproject.okuyorum.library.dto.CreateQuoteRequest;
import aybu.graduationproject.okuyorum.library.dto.QuoteDTO;

import java.util.List;

public interface QuoteService {
    QuoteDTO createQuote(CreateQuoteRequest request, Long userId);
    QuoteDTO getQuote(Long id);
    List<QuoteDTO> getUserQuotes(Long userId);
    List<QuoteDTO> getBookQuotes(Long bookId);
    List<QuoteDTO> getUserBookQuotes(Long userId, Long bookId);
    void deleteQuote(Long id, Long userId);
} 