import {SchoolService as schoolService} from "../Services/data/SchoolService.ts";

export const getAllSchools = async (req, res) => {
    try {
        const result = await schoolService.getAllSchools();
        return res.send(result);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
}

export const getSchoolById = async (req, res) => {
    const {schoolId} = req.query;
    if (!schoolId) {
        return res.status(406).send("Malformed parameters");
    }
    try {
        const result = await schoolService.getSchoolById(schoolId);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
}
export const getUsersBySchoolId = async (req, res) => {
    const {schoolId} = req.query;
    if (!schoolId) {
        return res.status(406).send("Malformed parameters");
    }
    try {
        const result = await schoolService.getUsersOfSchool(schoolId);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
}

export const getSchoolWorkWeekConfig = async (req, res) => {
    const {schoolId} = req.query;
    if (!schoolId) {
        return res.status(406).send("Malformed parameters");
    }
    try {
        const result = await schoolService.getSchoolWorkWeekConfigById(schoolId);
        return res.send(result);
    } catch (err) {
        return res.status(500).send({"error": err});
    }
}