export interface PlanCapacity {
  downloadAndUploadCount: {
    downloadCount: {
      total: number;
      max: number;
    };
    uploadCount: {
      total: number;
      max: number;
    };
  };

  univCounting: {
    total: number;
    max: number;
  };

  finalOutput: {
    downloadUploadCapacity: PlanCapacity['downloadAndUploadCount'];
    adminCount: PlanCapacity['univCounting'];
    studentEnrollmentCapacity: PlanCapacity['univCounting'];
    remainingDays: PlanCapacity['univCounting'];
  };
}
