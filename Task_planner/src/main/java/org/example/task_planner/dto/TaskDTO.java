package org.example.task_planner.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TaskDTO {
    private String title;
    private String description;
    private Boolean isCompleted;
    private LocalDateTime dueDate;
}