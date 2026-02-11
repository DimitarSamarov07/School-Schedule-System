import {SchoolService as schoolService} from "../Services/data/SchoolService.ts";

export const getAllSchools = async (req, res) => {
    try {
        const result = await schoolService.getAllSchools();
        return res.send(result);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
}