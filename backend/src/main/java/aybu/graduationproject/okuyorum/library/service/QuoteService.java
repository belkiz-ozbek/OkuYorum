package aybu.graduationproject.okuyorum.library.service;

import aybu.graduationproject.okuyorum.library.entity.Quote;
import aybu.graduationproject.okuyorum.library.repository.QuoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuoteService {
    private final QuoteRepository quoteRepository;

    @Autowired
    public QuoteService(QuoteRepository quoteRepository) {
        this.quoteRepository = quoteRepository;
    }

    public Quote createQuote(Quote quote) {
        return quoteRepository.save(quote);
    }

    public Quote updateQuote(Long id, Quote quote) {
        Quote existingQuote = quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found"));
        
        existingQuote.setContent(quote.getContent());
        existingQuote.setPageNumber(quote.getPageNumber());
        
        return quoteRepository.save(existingQuote);
    }

    public void deleteQuote(Long id) {
        quoteRepository.deleteById(id);
    }

    public Quote getQuote(Long id) {
        return quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found"));
    }

    public List<Quote> getQuotesByUser(Long userId) {
        return quoteRepository.findByUserId(userId);
    }

    public List<Quote> getQuotesByBook(Long bookId) {
        return quoteRepository.findByBookId(bookId);
    }

    public List<Quote> getQuotesByUserAndBook(Long userId, Long bookId) {
        return quoteRepository.findByUserIdAndBookId(userId, bookId);
    }
} 