package com.example.project.controller;

import com.example.project.dto.ProjectRequest;
import com.example.project.dto.ProjectResponse;
import com.example.project.service.ProjectService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProjectController.class)
class ProjectControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockBean ProjectService projectService;


    private String validProjectJson() throws Exception {
        ObjectNode node = objectMapper.createObjectNode();
        node.put("name", "Test Project");

        return objectMapper.writeValueAsString(node);
    }

    @Test
    void getAllProjects_returnsPage() throws Exception {
        List<ProjectResponse> content = List.of(
                mock(ProjectResponse.class),
                mock(ProjectResponse.class)
        );
        Page<ProjectResponse> page = new PageImpl<>(content, PageRequest.of(0, 10), 2);

        when(projectService.getAll(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(2));

        verify(projectService).getAll(any(Pageable.class));
    }

    @Test
    void getAllProjects_whenSortedByName_makesSortIgnoreCaseAndNullsLast() throws Exception {
        when(projectService.getAll(any(Pageable.class)))
                .thenReturn(Page.empty(PageRequest.of(0, 10)));

        mockMvc.perform(get("/api/projects")
                        .param("page", "0")
                        .param("size", "5")
                        .param("sort", "name,asc"))
                .andExpect(status().isOk());

        ArgumentCaptor<Pageable> captor = ArgumentCaptor.forClass(Pageable.class);
        verify(projectService).getAll(captor.capture());

        Pageable passed = captor.getValue();
        assertThat(passed.getPageNumber()).isEqualTo(0);
        assertThat(passed.getPageSize()).isEqualTo(5);

        Sort.Order nameOrder = passed.getSort().getOrderFor("name");
        assertThat(nameOrder).isNotNull();
        assertThat(nameOrder.getDirection()).isEqualTo(Sort.Direction.ASC);
        assertThat(nameOrder.isIgnoreCase()).isTrue();
        assertThat(nameOrder.getNullHandling()).isEqualTo(Sort.NullHandling.NULLS_LAST);
    }

    @Test
    void getProjectById_returnsOk() throws Exception {
        when(projectService.getById(1L)).thenReturn(mock(ProjectResponse.class));

        mockMvc.perform(get("/api/projects/1"))
                .andExpect(status().isOk());

        verify(projectService).getById(1L);
    }



    @Test
    void createProject_whenInvalid_returns400() throws Exception {
        // Empty JSON should violate @Valid constraints (e.g., missing name)
        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());

        verify(projectService, never()).create(any());
    }



    @Test
    void deleteProject_returns204() throws Exception {
        doNothing().when(projectService).delete(1L);

        mockMvc.perform(delete("/api/projects/1"))
                .andExpect(status().isNoContent());

        verify(projectService).delete(1L);
    }
}
