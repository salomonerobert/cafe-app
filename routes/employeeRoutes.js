import express from 'express';
import { getEmployeesByCafe, updateEmployee, deleteEmployee, addEmployeeToCafe } from '../controllers/employeesController.js';
import { computeDaysWorked, validateEmployeeRequestBody } from '../utils/validations.js';

const employeeRouter = express.Router();

employeeRouter.get('/', async (req, res) => {
    try {
        const cafeId = req.query.cafeId;
        const employees = await getEmployeesByCafe(cafeId);
        const result = employees.map(employee => {
            return {
                ...employee,
                days_worked : computeDaysWorked(employee.start_date)
            }
        })
        result.sort((a, b) => b.days_worked - a.days_worked)
        res.status(200).json(result);
    } catch (error) {
        console.log('Error while getting employees by cafe: ' + error)
        res.status(400).json({error: "Error occured while getting employees"})
    }
})

employeeRouter.post('/', async (req, res) => {
    try {
        const employee = req.body.employee;
        if (!validateEmployeeRequestBody(employee)) res.status(400).json({ message: "Invalid employee object"})
        const addedEmployee = await addEmployeeToCafe(employee);

        if (!addedEmployee.error) {
            res.status(200).json({message: "Successfully added employee to cafe"})
        } else {
            res.status(400).json({message: "Error occured while adding employee to cafe: " + addedEmployee.error})
        }
    } catch (error) {
        console.log('Error while creating new employee: ' + error)
        res.status(400).json({error: "Error occured while creating new employee"})
    }
})

employeeRouter.put('/', async (req, res) => {
    try {
        const employee = req.body.employee;
        if (!validateEmployeeRequestBody(employee)) res.status(400).json({ message: "Invalid employee object"})
        const updatedEmployee = await updateEmployee(employee);

        if (!updatedEmployee.error) {
            res.status(200).json({message: "Successfully updated employee to cafe"})
        } else {
            res.status(400).json({message: "Error occured while updating employee"})
        }
    } catch (error) {
        console.log('Error while creating new employee: ' + error)
        res.status(400).json({error: "Error occured while updating employee"})
    }
})

employeeRouter.delete('/', async (req, res) => {
    try {
        const employeeId = req.body.id;
        if (!employeeId) res.status(400).json({message: "No employee id provided"});
        const deletedEmployee = await deleteEmployee(employeeId);
        if (deletedEmployee) {
            res.status(200).json({message: "Successfully deleted employee"})
        } else {
            res.status(400).json({message: "Error deleting employee, please try again."})
        }
    } catch (error) {
        console.log("Error while deleting employee: " + error);
        res.status(400).json({error: "Error occured while deleting employee"})
    }
})

export default employeeRouter;