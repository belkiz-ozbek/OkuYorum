package aybu.graduationproject.okuyorum.library.dto;

public class CreateCommentRequest {
    private Long quoteId;
    private String content;

    public Long getQuoteId() {
        return quoteId;
    }

    public void setQuoteId(Long quoteId) {
        this.quoteId = quoteId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
} 