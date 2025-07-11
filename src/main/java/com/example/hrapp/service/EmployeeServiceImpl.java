package com.example.hrapp.service;

import com.example.hrapp.dao.EmployeeRepository;
import com.example.hrapp.entity.Employee;
import com.example.hrapp.jaxb.EmployeeXml;
import com.example.hrapp.jaxb.EmployeesWrapper;
import jakarta.transaction.Transactional;
import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.JAXBException;
import jakarta.xml.bind.Unmarshaller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class EmployeeServiceImpl  implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    @Override
    public Employee save(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public void delete(Long id) {
        employeeRepository.deleteById(id);
    }

    @Override
    public List<Employee> importFromXml(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {
            JAXBContext jaxbContext = JAXBContext.newInstance(EmployeesWrapper.class, Employee.class);
            Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
            EmployeesWrapper wrapper = (EmployeesWrapper) unmarshaller.unmarshal(inputStream);
            List<Employee> employees = wrapper.getEmployees();
            if (employees != null && !employees.isEmpty()) {
               return employees;

            } else {
                throw new RuntimeException("No employees found in XML file");
            }
        } catch (JAXBException | IOException e) {
            throw new RuntimeException("Failed to import XML: " + e.getMessage());
        }
    }
}
