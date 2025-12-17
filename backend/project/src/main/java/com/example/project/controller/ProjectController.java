package com.example.project.controller;

import com.example.project.dto.ProjectRequest;
import com.example.project.dto.ProjectResponse;
import com.example.project.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public Page<ProjectResponse> getAllProjects(
            @PageableDefault(size = 10, sort = "id") Pageable pageable
    ) {
        Pageable fixed = applyNameIgnoreCaseSort(pageable);
        return projectService.getAll(fixed);
    }

    /**
     * Makes sorting by "name" case-insensitive and null-safe.
     * Uses PageRequest.of(...) for compatibility (no Pageable.withSort()).
     */
    private Pageable applyNameIgnoreCaseSort(Pageable pageable) {
        Sort sort = pageable.getSort();
        if (sort.isUnsorted()) return pageable;

        Sort newSort = Sort.by(
                sort.stream()
                        .map(order -> {
                            if ("name".equals(order.getProperty())) {
                                return Sort.Order.by("name")
                                        .with(order.getDirection())
                                        .ignoreCase()
                                        .nullsLast();
                            }
                            return order;
                        })
                        .toList()
        );

        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), newSort);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.status(201).body(projectService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request
    ) {
        return ResponseEntity.ok(projectService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
