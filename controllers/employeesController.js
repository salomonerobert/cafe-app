import { Employee } from "../models/Employee.js";
import mongoose from "mongoose";

export async function getEmployeeCount(cafeId) {
  const cafeObjectId = new mongoose.Types.ObjectId(cafeId);
  const employeeCount = await Employee.countDocuments({ cafe: cafeObjectId });
  return employeeCount;
}

export async function getEmployeesByCafe(cafeId) {
  const cafeObjectId = new mongoose.Types.ObjectId(cafeId);
  const query = cafeId ? { cafe: cafeObjectId } : {};
  try {
    const employees = await Employee.find(query);
    return employees.map(employee => employee._doc);
  } catch (error) {
    console.log("Error while finding employees by cafe id: " + error);
    throw error;
  }
}

export async function deleteAllEmployeesByCafe(cafeId) {
  const cafeObjectId = new mongoose.Types.ObjectId(cafeId);
  try {
    const deletedEmployees = await Employee.deleteMany({ cafe: cafeObjectId });
    return deletedEmployees.acknowledged;
  } catch (error) {
    console.log("Error while deleting employees by cafe id: " + error);
    throw error;
  }
}

export async function addEmployeeToCafe(employee) {
  try {
    const employeeObject = new Employee(employee);
    const employeeExists = await Employee.find({
      employee_id: employeeObject.employee_id,
    });
    let savedEmployee = null;
    if (employeeExists.length === 0) {
      try {
        savedEmployee = await employeeObject.save();
        return savedEmployee;
      } catch (error) {
        console.error("Error saving employee:", error.message);
        return { error: "An error occurred while saving employee" };
      }
    } else {
      return { error: "Employee already exists" };
    }
  } catch (error) {
    console.log("Error occurred while adding employee: " + error);
    throw error;
  }
}

export async function updateEmployee(employee) {
  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { employee_id: employee.employee_id },
      { $set: employee },
      { returnDocument: true }
    );
    if (!updatedEmployee) return { error: "unable to update employee" };
    return updatedEmployee;
  } catch (error) {
    console.log("Error occurred while updating employee: " + error);
    throw error;
  }
}

export async function deleteEmployee(employee_id) {
  try {
    const deletedEmployee = await Employee.deleteOne({
      employee_id,
    });
    return deletedEmployee.acknowledged;
  } catch (error) {
    console.log("Error occurred while deleting employee: " + error);
    throw error;
  }
}
