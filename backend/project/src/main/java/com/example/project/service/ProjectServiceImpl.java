package com.example.project.service;

import com.example.project.dto.ProjectRequest;
import com.example.project.dto.ProjectResponse;
import com.example.project.entity.Project;
import com.example.project.mapper.ProjectMapper;
import com.example.project.repository.ProjectRepository;
import com.example.project.exception.ProjectNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }



    @Override
    @Transactional(readOnly = true)
    public Page<ProjectResponse> getAll(Pageable pageable) {
        return projectRepository.findAll(pageable)
                .map(ProjectMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException(id));
        return ProjectMapper.toResponse(project);
    }

    @Override
    public ProjectResponse create(ProjectRequest request) {
        Project saved = projectRepository.save(ProjectMapper.toEntity(request));
        return ProjectMapper.toResponse(saved);
    }

    @Override
    public ProjectResponse update(Long id, ProjectRequest request) {
        Project existing = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException(id));

        ProjectMapper.updateEntity(existing, request);
        Project saved = projectRepository.save(existing);
        return ProjectMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ProjectNotFoundException(id);
        }
        projectRepository.deleteById(id);
    }
}
