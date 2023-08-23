import { Cafe } from "../models/Cafe.js";

export async function getCafesByLocation(location) {
    try {
        let query = location ? { location } : {};
        const cafes = await Cafe.find(query).lean();
        return cafes;
    } catch (error) {
        console.log('Error while getting cafes by location:' + error);
        throw error;
    }
}

export async function addNewCafe(cafeDetails) {
    try {
        const cafe = new Cafe(cafeDetails);
        const savedCafe = await cafe.save();

        return savedCafe ?? { error: 'Failed to save cafe' }
    } catch (error) {
        console.log('Error while adding new cafe:' + error);
        throw error;
    }
}

export async function updateExistingCafe(cafeId, cafeDetails) {
    try {
        const updatedCafe = await Cafe.findByIdAndUpdate(cafeId, cafeDetails, { new: true });

        if (!updatedCafe) {
            throw new Error('Cafe not found for ID: ' + cafeId);
        }

        return updatedCafe;
    } catch (error) {
        console.error(`Error occurred while updating cafe with ID ${cafeId}: ${error.message}`);
        throw error;
    }
}

export async function deleteExistingCafe(cafeId) {
    try {
        const cafe = await Cafe.findOneAndDelete({_id: cafeId});
        return cafe;
    } catch (error) {
        console.error(`Error while deleting cafe by ID ${cafeId}: ` + error.message);
        throw error;
    }
}

export async function getCafeById(cafeId) {
    try {
        const cafe = Cafe.findById(cafeId);
        return cafe
    } catch (error) {
        console.log('Error while finding cafe by id' + error);
        throw error;
    }
}