package aybu.graduationproject.okuyorum.milletKiraathaneleri.dto;

import aybu.graduationproject.okuyorum.milletKiraathaneleri.model.AttendanceStatus;
import lombok.Data;

@Data
public class UpdateAttendanceStatusRequest {
    private AttendanceStatus status;
    private String notes;
    private String checkedInBy;
    private String noShowReason;
} 