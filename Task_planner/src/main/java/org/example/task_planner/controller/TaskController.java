package org.example.task_planner.controller;

import org.example.task_planner.dto.TaskDTO;
import org.example.task_planner.dto.TaskResponseDTO;
import org.example.task_planner.model.Task;
import org.example.task_planner.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // Convert Task entity to TaskResponseDTO
    private TaskResponseDTO convertToResponseDTO(Task task) {
        TaskResponseDTO responseDTO = new TaskResponseDTO();
        responseDTO.setId(task.getId());
        responseDTO.setTitle(task.getTitle());
        responseDTO.setDescription(task.getDescription());
        responseDTO.setIsCompleted(task.getIsCompleted());
        responseDTO.setDueDate(task.getDueDate());
        responseDTO.setCreatedAt(task.getCreatedAt());
        responseDTO.setUpdatedAt(task.getUpdatedAt());
        return responseDTO;
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getAllTasks() {
        List<TaskResponseDTO> tasks = taskService.getAllTasks()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskService.getTaskById(id);

        if (task.isPresent()) {
            return ResponseEntity.ok(convertToResponseDTO(task.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskDTO taskDTO) {
        try {
            Task createdTask = taskService.createTask(taskDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Task created successfully");
            response.put("task", convertToResponseDTO(createdTask));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating task: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO) {
        Optional<Task> updatedTask = taskService.updateTask(id, taskDTO);

        if (updatedTask.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Task updated successfully");
            response.put("task", convertToResponseDTO(updatedTask.get()));

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        boolean deleted = taskService.deleteTask(id);

        if (deleted) {
            return ResponseEntity.ok("Task deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/completed")
    public ResponseEntity<List<TaskResponseDTO>> getCompletedTasks() {
        List<TaskResponseDTO> tasks = taskService.getCompletedTasks()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<TaskResponseDTO>> getPendingTasks() {
        List<TaskResponseDTO> tasks = taskService.getPendingTasks()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TaskResponseDTO>> searchTasks(@RequestParam String title) {
        List<TaskResponseDTO> tasks = taskService.searchTasksByTitle(title)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<TaskResponseDTO>> getOverdueTasks() {
        List<TaskResponseDTO> tasks = taskService.getOverdueTasks()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(tasks);
    }
}