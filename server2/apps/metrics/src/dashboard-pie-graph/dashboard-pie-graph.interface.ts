import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

export interface DashboardPieGraph {
  gradeLevels: { data: Array<string> };

  pieGraphData: {
    gradeEnrollmentCollections: Array<{
      gradeLevel: string;
      gradeEnrollmentCount: number;
    }>;
    totalEnrollmentCount: number;
  };
}

// eslint-disable-next-line
export interface pieGraphData extends MicroserviceUtility<DashboardPieGraph['pieGraphData']> {}