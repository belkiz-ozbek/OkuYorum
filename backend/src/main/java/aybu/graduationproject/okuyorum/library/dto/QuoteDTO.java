package aybu.graduationproject.okuyorum.library.dto;

public class QuoteDTO {
    private Long id;
    private String content;
    private Integer pageNumber;
    private Long bookId;
    private String bookTitle;
    private Long userId;
    private String username;

    public QuoteDTO() {
    }

    public QuoteDTO(Long id, String content, Integer pageNumber, Long bookId, String bookTitle, Long userId, String username) {
        this.id = id;
        this.content = content;
        this.pageNumber = pageNumber;
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.userId = userId;
        this.username = username;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getBookTitle() {
        return bookTitle;
    }

    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
} 