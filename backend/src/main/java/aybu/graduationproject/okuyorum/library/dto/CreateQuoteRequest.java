package aybu.graduationproject.okuyorum.library.dto;

public class CreateQuoteRequest {
    private String content;
    private Integer pageNumber;
    private Long bookId;

    public CreateQuoteRequest() {
    }

    public CreateQuoteRequest(String content, Integer pageNumber, Long bookId) {
        this.content = content;
        this.pageNumber = pageNumber;
        this.bookId = bookId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(Integer pageNumber) {
        this.pageNumber = pageNumber;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }
} 