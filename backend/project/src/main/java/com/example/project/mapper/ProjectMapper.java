package com.example.project.mapper;

import com.example.project.dto.ProjectRequest;
import com.example.project.dto.ProjectResponse;
import com.example.project.entity.Project;

public class ProjectMapper {

    private ProjectMapper() {}

    public static Project toEntity(ProjectRequest req) {
        Project p = new Project();
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setStartDate(req.getStartDate());
        p.setEndDate(req.getEndDate());
        return p;
    }

    public static void updateEntity(Project p, ProjectRequest req) {
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setStartDate(req.getStartDate());
        p.setEndDate(req.getEndDate());
    }

    public static ProjectResponse toResponse(Project p) {
        return new ProjectResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getStartDate(),
                p.getEndDate()
        );
    }
}
