package org.example.task_planner.repository;

import org.example.task_planner.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Find tasks by completion status
    List<Task> findByIsCompleted(Boolean isCompleted);

    // Find tasks by title containing keyword (case insensitive)
    List<Task> findByTitleContainingIgnoreCase(String title);

    // Find overdue tasks
    @Query("SELECT t FROM Task t WHERE t.dueDate < CURRENT_TIMESTAMP AND t.isCompleted = false")
    List<Task> findOverdueTasks();

    // Find tasks by user ID (through the relationship)
    @Query("SELECT t FROM Task t JOIN t.userIds ut WHERE ut.user.id = :userId")
    List<Task> findTasksByUserId(@Param("userId") Long userId);
}