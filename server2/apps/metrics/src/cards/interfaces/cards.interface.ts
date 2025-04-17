import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

export interface academic_year {
  start: Date;
  end: Date;
}

export interface EnrollmentTotal {
  enrollment_total: number;
}

// eslint-disable-next-line
export interface AcademicYear extends MicroserviceUtility<academic_year | null> {}
