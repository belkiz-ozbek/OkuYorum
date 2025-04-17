package aybu.graduationproject.okuyorum.user.exception;

public class UserAdminException extends RuntimeException {
    public UserAdminException(String message) {
        super(message);
    }

    public UserAdminException(String message, Throwable cause) {
        super(message, cause);
    }
} 