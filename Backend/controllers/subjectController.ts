import {SubjectService as subjectService} from "../Services/data/SubjectService.ts";
import {SchoolIdSchema} from "../Validators/SchoolValidators.ts";
import {CreateSubjectSchema, SubjectIdPayloadSchema, UpdateSubjectSchema} from "../Validators/SubjectValidators.ts";

export const getAllSubjects = async (req, res) => {
    const payload = SchoolIdSchema.parse(req.query);
    const result = await subjectService.getAllSubjectsForSchool(payload);

    return res.send(result);
}

export const getSubjectById = async (req, res) => {
    const payload = SubjectIdPayloadSchema.parse(req.query);
    const result = await subjectService.getSubjectByIdForSchool(payload);

    return res.send(result);

}

export const createSubject = async (req, res) => {
    const payload = CreateSubjectSchema.parse({...req.query, ...req.body});
    const result = await subjectService.createSubject(payload);

    return res.send(result);

};

export const deleteSubject = async (req, res) => {
    const payload = SubjectIdPayloadSchema.parse(req.query)
    const result = await subjectService.deleteSubject(payload);

    return result ? res.send(result) : res.status(422).send(false);
};

export const updateSubject = async (req, res) => {
    const payload = UpdateSubjectSchema.parse({...req.query, ...req.body});
    const result = await subjectService.updateSubject(payload);

    return res.send(result);
};