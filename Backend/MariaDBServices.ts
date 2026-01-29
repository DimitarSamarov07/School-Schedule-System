import { RoomRepository } from './repositories/RoomRepository.ts';
import { TeacherRepository } from './repositories/TeacherRepository.ts';
import { ScheduleRepository } from "./repositories/ScheduleRepository.js";
import {SubjectRepository} from "./repositories/SubjectRepository.ts";
import {PeriodRepository} from "./repositories/PeriodRepository.ts";
import {ClassRepository} from "./repositories/ClassRepository.ts";

const MariaDBServices = {
    Rooms: RoomRepository,
    Teachers: TeacherRepository,
    Schedules: ScheduleRepository,
    Subjects: SubjectRepository,
    Periods: PeriodRepository,
    Classes: ClassRepository
};

export default MariaDBServices;