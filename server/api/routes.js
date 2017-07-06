var express = require('express');
var app = module.exports = express();
var employees = require('./dummyEmployees.json');
var departments = require('./dummyDepartments.json');
var customers = require('./dummyCustomers.json');

function getNextId(list){
    var arr = list.map(x => x.id);
    var max = Math.max(...arr);
    return max + 1;
}

app.route('/department/')
    .get((req, res) => {
        res.send(departments.filter(x => x.id > 0));
    })
    .post((req, res) => {
        const data = req.body; // JSON.parse(req.body);
        data.id = getNextId(departments);
        console.log(data);
        departments.push(data);
        res.status(200).send(data);
    })
    .put((req, res) => { 
        const data = req.body; // JSON.parse(req.body);
        console.log(data);
        const idx = departments.findIndex((department) => department.id === data.id);
        departments[idx] = data;
        res.status(200).send(data);
    });

app.route('/department/:departmentId')
    .get((req, res) => {      
        const id = parseInt(req.params.departmentId);
        const idx = departments.findIndex((department) => department.id === id);
        console.log('get departmentId', id, idx);
        res.send(departments[idx]);
    })
    .delete((req, res) => {
        const id = parseInt(req.params.departmentId);
        const idx = departments.findIndex((department) => department.id === id);
        console.log('delete departmentId', id, idx);
        departments.splice(idx, 1);
        res.status(200).send();
    });

app.route('/employee/')
    .get((req, res) => {
        res.send(employees.filter(x => x.id > 0));
    })
    .post((req, res) => {
        const data = req.body;
        data.id = getNextId(employees);
        console.log(data);
        employees.push(data);
        res.status(200).send(data);
    })
    .put((req, res) => { 
        const data = req.body;
        console.log(data);
        const idx = employees.findIndex((employee) => employee.id === data.id);
        employees[idx] = data;
        res.status(200).send(data);
    })   

app.route('/employee/:employeeId')
    .get((req, res) => {      
        const id = parseInt(req.params.employeeId);
        const idx = employees.findIndex((employee) => employee.id === id);
        console.log('get employeeId', id, idx);
        res.send(employees[idx]);
    })
    .delete((req, res) => {
        const id = parseInt(req.params.employeeId);
        const idx = employees.findIndex((employee) => employee.id === id);
        console.log('delete employeeId', id, idx);
        employees.splice(idx, 1);
        res.status(200).send();
    });


app.route('/customer/')
    .get((req, res) => {
        res.send(customers.filter(x => x.id > 0));
    })
    .post((req, res) => {
        const data = req.body; // JSON.parse(req.body);
        console.log('post customerId', 0, data);
        data.id = getNextId(customers);
        console.log(data);
        customers.push(data);
        res.status(200).send(data);
    });    

app.route('/customer/:customerId')
    .get((req, res) => {      
        const id = parseInt(req.params.customerId);
        const idx = customers.findIndex((customer) => customer.id === id);
        console.log('get customerId', id, idx);
        res.send(customers[idx]);
    })    
    .put((req, res) => { 
        const id = parseInt(req.params.customerId);
        const data = req.body; // JSON.parse(req.body);
        const idx = customers.findIndex((customer) => customer.id === id);
        console.log('put customerId', id, idx, data);
        customers[idx] = data;
        res.status(200).send(data);
    })
    .delete((req, res) => {
        const id = parseInt(req.params.customerId);
        const idx = customers.findIndex((customer) => customer.id === id);
        console.log('delete customerId', id, idx);
        customers.splice(idx, 1);
        res.status(200).send();
    });
