import express from "express";
import {
  getEmployeesByCafe,
  updateEmployee,
  deleteEmployee,
  addEmployeeToCafe,
  getEmployeeById,
} from "../controllers/employeesController.js";
import {
  computeDaysWorked,
  validateEmployeeRequestBody,
} from "../utils/validations.js";

const employeeRouter = express.Router();

employeeRouter.get("/", async (req, res) => {
  try {
    const cafeId = req.query.cafeId;
    const employees = await getEmployeesByCafe(cafeId);
    const result = employees.map((employee) => {
      return {
        ...employee,
        days_worked: computeDaysWorked(employee.start_date),
      };
    });
    result.sort((a, b) => b.days_worked - a.days_worked);
    res.status(200).json(result);
  } catch (error) {
    console.error(
      `Error getting employees by cafeId ${cafeId}: ${err.message}`
    );
    res.status(500).json({ error: "Internal server error" });
  }
});

employeeRouter.get("/search", async (req, res) => {
  try {
    const employeeId = req.query.employeeId;
    if (!employeeId) {
      res
        .status(400)
        .send({
          error: "Expected employeeId but not present in request query",
        });
    }
    const employees = await getEmployeeById(employeeId);
    let result = [];
    if (employees.length > 0) {
      result = employees.map((employee) => {
        return {
          ...employee,
          days_worked: computeDaysWorked(employee?.start_date),
        };
      });
    }
    result.sort((a, b) => b.days_worked - a.days_worked);
    res.status(200).json(result);
  } catch (error) {
    console.error(
      `Error finding employees by employeeId ${employeeId}: ${err.message}`
    );
    res.status(500).json({ error: "Internal server error" });
  }
});

employeeRouter.post("/", async (req, res) => {
  try {
    const employee = req.body.employee;
    if (!validateEmployeeRequestBody(employee, false)) {
      res.status(400).json({ error: "Invalid employee object" });
      return;
    }

    const addedEmployee = await addEmployeeToCafe(employee);

    if (!addedEmployee.error) {
      res.status(201).json({ message: "Successfully created new employee" });
    } else {
      res
        .status(400)
        .json({
          message:
            "Error occured while creating new employee: " + addedEmployee.error,
        });
    }
  } catch (error) {
    console.error(
      `Error creating employee ${employee.employee_id}: ${err.message}`
    );
    res.status(500).json({ error: "Internal server error" });
  }
});

employeeRouter.put("/", async (req, res) => {
  try {
    const employee = req.body.employee;
    if (!validateEmployeeRequestBody(employee)) {
      res.status(400).json({ error: "Invalid employee object" });
      return;
    }

    const updatedEmployee = await updateEmployee(employee);

    if (!updatedEmployee.error) {
      res
        .status(200)
        .json({ message: "Successfully updated employee" });
    } else {
      res.status(400).json({ error: "Error occured while updating employee" });
    }
  } catch (error) {
    console.error(
      `Error ocurred while updating employee ${employee.employee_id}: ${err.message}`
    );
    res.status(500).json({ error: "Internal server error" });
  }
});

employeeRouter.delete("/", async (req, res) => {
  try {
    const employeeId = req.body.id;
    if (!employeeId) {
        res.status(400).json({ error: "Expected employeeId but was not present in request body" });
        return;
    }

    const deletedEmployee = await deleteEmployee(employeeId);

    if (deletedEmployee) {
      res.status(200).json({ message: "Successfully deleted employee" });
    } else {
      res
        .status(400)
        .json({ error: "Error deleting employee, please try again." });
    }
  } catch (error) {
    console.error(
      `Error getting deleting employee ${employeeId}: ${err.message}`
    );
    res.status(500).json({ error: "Internal server error" });
  }
});

export default employeeRouter;
