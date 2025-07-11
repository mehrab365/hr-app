package com.example.hrapp.service;

import com.example.hrapp.entity.Employee;

import java.io.File;
import java.util.List;

public interface EmployeeService {
    List<Employee> getAll();
    Employee getById(Long id);
    Employee save(Employee employee);
    void delete(Long id);
    void importFromXml(File file);
}
