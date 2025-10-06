package org.example.task_planner.service;

import org.example.task_planner.dto.TaskDTO;
import org.example.task_planner.model.Task;
import org.example.task_planner.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task createTask(TaskDTO taskDTO) {
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setIsCompleted(taskDTO.getIsCompleted() != null ? taskDTO.getIsCompleted() : false);
        task.setDueDate(taskDTO.getDueDate());

        return taskRepository.save(task);
    }

    public Optional<Task> updateTask(Long id, TaskDTO taskDTO) {
        Optional<Task> existingTask = taskRepository.findById(id);

        if (existingTask.isPresent()) {
            Task task = existingTask.get();
            task.setTitle(taskDTO.getTitle());
            task.setDescription(taskDTO.getDescription());
            task.setIsCompleted(taskDTO.getIsCompleted());
            task.setDueDate(taskDTO.getDueDate());

            return Optional.of(taskRepository.save(task));
        }

        return Optional.empty();
    }

    public boolean deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Task> getCompletedTasks() {
        return taskRepository.findByIsCompleted(true);
    }

    public List<Task> getPendingTasks() {
        return taskRepository.findByIsCompleted(false);
    }

    public List<Task> searchTasksByTitle(String keyword) {
        return taskRepository.findByTitleContainingIgnoreCase(keyword);
    }

    public List<Task> getOverdueTasks() {
        return taskRepository.findOverdueTasks();
    }
}