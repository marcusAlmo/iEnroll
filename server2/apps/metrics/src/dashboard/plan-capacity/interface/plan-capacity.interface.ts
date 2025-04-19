export interface PlanCapacity {
  subDays: {
    remainingDays: number;
    totalDays: number;
  };

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

  adminCount: {
    total: number;
    max: number;
  };
}
