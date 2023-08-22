import express from 'express';
import { addNewCafe, deleteExistingCafe, getCafesByLocation, updateExistingCafe } from '../controllers/cafesController.js';
import { deleteAllEmployeesByCafe, getEmployeeCount } from '../controllers/employeesController.js';
import { validateCafeForUpdate } from '../utils/validations.js';

const cafeRouter = express.Router();

// GET /cafes?location=<location>
cafeRouter.get('/', async (req, res) => {
  try {
    const location = req.query.location;
    const cafes = await getCafesByLocation(location)

    const result = await Promise.all(
      cafes.map(async cafe => {
        const employeeCount = await getEmployeeCount(cafe.id);
        return {
          ...cafe,
          employees: employeeCount
        };
      })
    );

    result.sort((a, b) => b.employees - a.employees);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /cafe
cafeRouter.post('/', async (req, res) => {
  try {
    const cafe = addNewCafe(req.body)
    if (!cafe.error) {
        res.status(201).json(cafe);
    } else {
        res.status(400).json({ error });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /cafe
cafeRouter.put('/', async (req, res) => {
  try {
    const cafeId = req.body.id;
    const cafeForUpdate = req.body;
    if (!cafeId || !validateCafeForUpdate(cafeForUpdate)) res.status(400).json({error: "Invalid cafeId or cafe object"});

    const cafe = await updateExistingCafe(req.body.id, req.body);
    if (cafe.error === 'Cafe not found') return res.status(404).json({ error: 'Cafe not found' });
    res.json(cafe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /cafe
cafeRouter.delete('/', async (req, res) => {
  try {
    const cafeId = req.body.id
    if (!cafeId) res.status(400).json({message: "no cafe id provided"});
    const deletedCafe = await deleteExistingCafe(cafeId);
    if (!deletedCafe) return res.status(404).json({ error: 'Cafe not found' });

    // Delete all employees under the deleted cafe
    const employeesDeleted = deleteAllEmployeesByCafe(cafeId);
    
    employeesDeleted ? res.json({ message: 'Cafe deleted successfully' }) : res.status(400).json({ error: 'Unsuccessful deletion operation' })
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default cafeRouter;
