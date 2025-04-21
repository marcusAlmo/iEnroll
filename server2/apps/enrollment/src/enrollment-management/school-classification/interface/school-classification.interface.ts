export interface SchoolClassification {
  schoolInfoReturn: {
    schoolType: string | null;
    acadLevels: string[];
  };

  schoolInfoParam: {
    schoolType: string;
    acadLevels: string[];
  };
}
