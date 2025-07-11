angular.module('employeeApp', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                template: `
                    <div class="mb-3">
                        <div class="input-group mb-2" style="max-width: 300px;">
                            <input type="number" class="form-control" ng-model="searchId" placeholder="Enter Employee ID">
                            <div class="input-group-append">
                                <button class="btn btn-primary" ng-click="findEmployeeById()">Find by ID</button>
                            </div>
                        </div>
                        <div ng-if="foundEmployee" class="card mb-3">
                            <div class="card-header">Employee Details</div>
                            <div'>
                                <div class="card-body">
                                    <p><strong>ID:</strong> {{foundEmployee.id}}</p>
                                    <p><strong>First Name:</strong> {{foundEmployee.firstName}}</p>
                                    <p><strong>Last Name:</strong> {{foundEmployee.lastName}}</p>
                                    <p><strong>Title:</strong> {{foundEmployee.title}}</p>
                                    <p><strong>Division:</strong> {{foundEmployee.division}}</p>
                                    <p><strong>Building:</strong> {{foundEmployee.building}}</p>
                                    <p><strong>Room:</strong> {{foundEmployee.room}}</p>
                                    <button class="btn btn-sm btn-warning" ng-click="showUpdateForm(foundEmployee)">Edit</button>
                                    <button class="btn btn-sm btn-danger" ng-click="deleteEmployee(foundEmployee.id)">Delete</button>
                                    <button class="btn btn-sm Appending a new line...sm btn-secondary" ng-click="clearFoundEmployee()">Clear</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <button class="btn btn-primary" ng-click="showCreateForm()">Add Employee</button>
                        <input type="file" id="xmlFile" accept=".xml" class="mt-2">
                        <button class="btn btn-secondary" ng-click="importEmployees()">Import from XML</button>
                    </div>
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Title</th>
                                <th>Division</th>
                                <th>Building</th>
                                <th>Room</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat="employee in employees">
                                <td>{{employee.id}}</td>
                                <td>{{employee.firstName}}</td>
                                <td>{{employee.lastName}}</td>
                                <td>{{employee.title}}</td>
                                <td>{{employee.division}}</td>
                                <td>{{employee.building}}</td>
                                <td>{{employee.room}}</td>
                                <td>
                                    <button class="btn btn-sm btn-warning" ng-click="showUpdateForm(employee)">Edit</button>
                                    <button class="btn btn-sm btn-danger" ng-click="deleteEmployee(employee.id)">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div ng-show="showForm" class="card mt-4">
                        <div class="card-header">{{formTitle}}</div>
                        <div class="card-body">
                            <form name="employeeForm" ng-submit="saveEmployee()" novalidate>
                                <div class="form-group">
                                    <label>First Name</label>
                                    <input type="text" class="form-control" ng-model="currentEmployee.firstName" required>
                                    <div ng-show="employeeForm.firstName.$touched && employeeForm.firstName.$invalid" class="text-danger">
                                        First Name is required
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Last Name</label>
                                    <input type="text" class="form-control" ng-model="currentEmployee.lastName" required>
                                    <div ng-show="employeeForm.lastName.$touched && employeeForm.lastName.$invalid" class="text-danger">
                                        Last Name is required
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Title</label>
                                    <input type="text" class="form-control" ng-model="currentEmployee.title" required>
                                    <div ng-show="employeeForm.title.$touched && employeeForm.title.$invalid" class="text-danger">
                                        Title is required
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Division</label>
                                    <input type="text" class="form-control" ng-model="currentEmployee.division" required>
                                    <div ng-show="employeeForm.division.$touched && employeeForm.division.$invalid" class="text-danger">
                                        Division is required
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Building</label>
                                    <input type="number" class="form-control" ng-model="currentEmployee.building" required>
                                    <div ng-show="employeeForm.building.$touched && employeeForm.building.$invalid" class="text-danger">
                                        Building is required
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Room</label>
                                    <input type="number" class="form-control" ng-model="currentEmployee.room" required>
                                    <div ng-show="employeeForm.room.$touched && employeeForm.room.$invalid" class="text-danger">
                                        Room is required
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary" ng-disabled="employeeForm.$invalid">{{formTitle}}</button>
                                <button type="button" class="btn btn-secondary" ng-click="cancelForm()">Cancel</button>
                            </form>
                        </div>
                    </div>
                `,
                controller: 'EmployeeController'
            });
    }])
    .controller('EmployeeController', ['$scope', '$http', function ($scope, $http) {
        $scope.employees = [];
        $scope.currentEmployee = {};
        $scope.showForm = false;
        $scope.formTitle = '';
        $scope.searchId = null;
        $scope.foundEmployee = null;

        // Fetch all employees
        $scope.loadEmployees = function () {
            $http.get('/api/employees')
                .then(function (response) {
                    $scope.employees = response.data;
                })
                .catch(function (error) {
                    console.error('Error fetching employees:', error);
                    alert('Failed to load employees');
                });
        };

        // Find employee by ID
        $scope.findEmployeeById = function () {
            if (!$scope.searchId) {
                alert('Please enter an Employee ID');
                return;
            }
            $http.get('/api/employees/' + $scope.searchId)
                .then(function (response) {
                    $scope.foundEmployee = response.data;
                })
                .catch(function (error) {
                    console.error('Error finding employee:', error);
                    alert('Employee not found or error occurred');
                    $scope.foundEmployee = null;
                });
        };

        // Show create form
        $scope.showCreateForm = function () {
            $scope.currentEmployee = {};
            $scope.formTitle = 'Create Employee';
            $scope.showForm = true;
        };

        // Show update form
        $scope.showUpdateForm = function (employee) {
            $scope.currentEmployee = angular.copy(employee);
            $scope.formTitle = 'Update Employee';
            $scope.showForm = true;
        };

        // Save or update employee
        $scope.saveEmployee = function () {
            var method = $scope.currentEmployee.id ? 'PUT' : 'POST';
            var url = $scope.currentEmployee.id ?
                '/api/employees/' + $scope.currentEmployee.id :
                '/api/employees';

            $http({
                method: method,
                url: url,
                data: $scope.currentEmployee
            }).then(function (response) {
                $scope.loadEmployees();
                $scope.cancelForm();
                $scope.foundEmployee = null; // Clear found employee after save
            }).catch(function (error) {
                console.error('Error saving employee:', error);
                alert('Failed to save employee');
            });
        };

        // Delete employee
        $scope.deleteEmployee = function (id) {
            if (confirm('Are you sure you want to delete this employee?')) {
                $http.delete('/api/employees/' + id)
                    .then(function () {
                        $scope.loadEmployees();
                        $scope.foundEmployee = null; // Clear found employee after delete
                    })
                    .catch(function (error) {
                        console.error('Error deleting employee:', error);
                        alert('Failed to delete employee');
                    });
            }
        };

        // Import employees from XML
        $scope.importEmployees = function () {
            var fileInput = document.getElementById('xmlFile');
            var file = fileInput.files[0];
            if (!file) {
                alert('Please select an XML file');
                return;
            }
            var formData = new FormData();
            formData.append('file', file);

            $http.post('/api/employees/import', formData, {
                headers: {'Content-Type': undefined}
            }).then(function (response) {
                alert(response.data);
                $scope.loadEmployees();
                fileInput.value = '';
            }).catch(function (error) {
                console.error('Error importing employees:', error);
                alert('Failed to import employees: ' + error.data);
            });
        };

        // Clear found employee
        $scope.clearFoundEmployee = function () {
            $scope.foundEmployee = null;
            $scope.searchId = null;
        };

        // Cancel form
        $scope.cancelForm = function () {
            $scope.showForm = false;
            $scope.currentEmployee = {};
            $scope.formTitle = '';
        };

        // Initial load
        $scope.loadEmployees();
    }]);