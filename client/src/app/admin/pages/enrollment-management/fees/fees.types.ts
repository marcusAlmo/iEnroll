export type GradeLevelsWithSections = {
    id: number;
    gradeLevel: number;
    sections: Sections[];
  };
  
  export type Sections = {
    id: number;
    name: string;
  };