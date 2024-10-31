package doczilla.testing.todo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Builder
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Todo {
    private UUID id;
    private String name;
    private String shortDesc;
    private String fullDesc;
    private String date;
    private String status;
}
