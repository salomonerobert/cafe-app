import express from "express";
import {
  addNewCafe,
  deleteExistingCafe,
  getCafesByLocation,
  updateExistingCafe,
} from "../controllers/cafesController.js";
import {
  deleteAllEmployeesByCafe,
  getEmployeeCount,
} from "../controllers/employeesController.js";
import { validateCafeForUpdate } from "../utils/validations.js";

const cafeRouter = express.Router();

// GET /cafes?location=<location>
cafeRouter.get("/", async (req, res) => {
  try {
    const location = req.query.location;
    const cafes = await getCafesByLocation(location);

    const result = await Promise.all(
      cafes.map(async (cafe) => {
        const employeeCount = await getEmployeeCount(cafe._id);
        return {
          ...cafe,
          employees: employeeCount,
        };
      })
    );

    result.sort((a, b) => b.employees - a.employees);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error getting cafes: " + err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /cafe
cafeRouter.post("/", async (req, res) => {
  try {
    if (!req.body.cafe) {
      res.status(400).json({ error: "Missing cafe object in request." });
      return;
    }

    if (!validateCafeForUpdate(req.body.cafe, false)) {
      res.status(400).json({ error: "Cafe object validation failed." });
      return;
    }

    const cafe = addNewCafe(req.body.cafe);

    if (!cafe.error) {
      res.status(201).json(cafe);
    } else {
      res.status(400).json({ error: cafe.error });
    }
  } catch (err) {
    console.error(`Error in creating cafe: ${err.message}`); // Logging the error
    res.status(500).json({ error: "Internal server error." });
  }
});

// PUT /cafe
cafeRouter.put("/", async (req, res) => {
  try {
    const cafeId = req.body.cafe._id;
    const cafeForUpdate = req.body.cafe;
    if (!cafeId) {
      res.status(400).json({ error: "Missing cafeId from request body" });
      return;
    }

    if (!validateCafeForUpdate(cafeForUpdate)) {
      res.status(400).json({ error: "Invalid cafe object" });
      return;
    }

    const cafe = await updateExistingCafe(cafeId, cafeForUpdate);
    if (cafe) {
      res.status(200).json({ cafe });
      return;
    } else {
      res.status(404).json({ error: cafe.error });
      return;
    }
  } catch (err) {
    console.error("Error updating cafe: " + err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /cafe
cafeRouter.delete("/", async (req, res) => {
    try {
      const cafeId = req.body.cafeId;
      
      if (!cafeId) {
        return res.status(400).json({ error: "A cafe ID is required but was not provided." });
      }
  
      const deletedCafe = await deleteExistingCafe(cafeId);
      
      if (!deletedCafe) {
        return res.status(404).json({ error: "Cafe not found." });
      }
  
      const employeesDeleted = await deleteAllEmployeesByCafe(cafeId);
      
      if (employeesDeleted) {
        res.json({ message: "Cafe and its associated employees deleted successfully." });
      } else {
        res.status(400).json({ error: "Failed to delete all associated employees." });
      }
      
    } catch (err) {
      console.error(`Error deleting cafe with ID ${cafeId}: ${err.message}`);
      res.status(500).json({ error: "Internal server error." });
    }
  });

export default cafeRouter;
