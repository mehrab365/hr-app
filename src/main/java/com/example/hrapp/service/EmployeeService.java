package com.example.hrapp.service;

import com.example.hrapp.entity.Employee;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface EmployeeService {
    List<Employee> getAll();

    Employee getById(Long id);

    Employee save(Employee employee);

    void delete(Long id);

    List<Employee> importFromXml(MultipartFile file);
}
