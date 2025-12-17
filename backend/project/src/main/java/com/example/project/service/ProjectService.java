package com.example.project.service;

import com.example.project.dto.ProjectRequest;
import com.example.project.dto.ProjectResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface ProjectService {

    Page<ProjectResponse> getAll(Pageable pageable);
    ProjectResponse getById(Long id);
    ProjectResponse create(ProjectRequest request);
    ProjectResponse update(Long id, ProjectRequest request);
    void delete(Long id);
}
