package com.example.project.config;

import com.example.project.entity.Project;
import com.example.project.repository.ProjectRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedProjects(ProjectRepository projectRepository) {
        return args -> {
            // Prevent duplicates on every restart
            if (projectRepository.count() > 20) {
                return;
            }

            LocalDate base = LocalDate.now().minusDays(60);

            // Letters-only unique project names
            String[] projectNames = {
                    "Alpha", "Bravo", "Charlie", "Delta", "Echo",
                    "Foxtrot", "Golf", "Hotel", "India", "Juliet",
                    "Kilo", "Lima", "Mike", "November", "Oscar",
                    "Papa", "Quebec", "Romeo", "Sierra", "Tango",
                    "Uniform", "Victor", "Whiskey", "Xray", "Yankee",
                    "Zulu", "Aurora", "Nimbus", "Orion", "Zenith"
            };

            for (int i = 0; i < projectNames.length; i++) {
                Project p = new Project();
                p.setName(projectNames[i]); // ✔ letters only & unique
                p.setDescription("Seeded project " + projectNames[i]);
                p.setStartDate(base.plusDays(i * 3L));

                // Some projects have endDate, some are null
                if (i % 3 == 0) {
                    p.setEndDate(base.plusDays(i * 3L + 30));
                } else {
                    p.setEndDate(null);
                }

                projectRepository.save(p);
            }
        };
    }
}