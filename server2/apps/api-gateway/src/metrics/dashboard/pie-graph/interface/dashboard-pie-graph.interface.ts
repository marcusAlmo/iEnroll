import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

export interface DashboardPieGraph {
  gradeLevels: { data: Array<string> };
}

export interface samplePieGraphData {
  gradeEnrollmentCollections: Array<{
    gradeLevel: string;
    gradeEnrollmentCount: number;
  }>;
  totalEnrollmentCount: number;
}

// eslint-disable-next-line
export interface PieGraphData extends MicroserviceUtility<samplePieGraphData> {}
