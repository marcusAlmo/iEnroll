import { Decimal } from '@prisma/client/runtime/library';

export interface Fees {
  // for retrieving fees
  gradeLevels: {
    grade_level: {
      grade_level_code: string;
      grade_level: string;
    };
  };

  grade_level_program: {
    enrollment_fee: {
      fee_id: number;
      name: string;
      amount: Decimal;
      description: string | null;
      due_date: Date;
      fee_type_id: number;
    }[];
  }[];

  gradeLevelAndFees: {
    grade_level: Fees['gradeLevels']['grade_level'];
    grade_level_program: Fees['grade_level_program'];
  }[];

  fetchValue: {
    gradeLevelCode: string;
    gradeLevel: string;
    fees: {
      feeTypeId: number;
      feeId: number;
      feeName: string;
      amount: number;
      description: string | null;
      dueDate: Date;
    }[];
  };

  receivedFeesCollection: {
    feeId: number;
    feeTypeId: number;
    feeName: string;
    amount: number;
    description: string | null;
    dueDate: Date;
  };

  // for storing fees
  receivedData: {
    gradeLevelCode: string;
    newFees: Fees['receivedFeesCollection'][];
    existingFees: Fees['receivedFeesCollection'][];
  };

  retrievedFeesCollection: {
    fee_id: number;
    name: string;
    description: string | null;
    amount: Decimal;
    due_date: Date;
    fee_type_id: number;
  }[];

  toInsertFees: {
    feeTypeId: number;
    feeName: string;
    amount: number;
    description: string | null;
    dueDate: Date;
  }[];

  // for retrieving grade levels
  grade_level: {
    gradeLevelCode: string;
    gradeLevel: string;
  }[];

  fee_type: {
    feeTypeId: number;
    feeType: string;
  }[];

  toBeCreated: {
    grade_level_program_id: number;
    name: string;
    amount: Decimal;
    description: string | null;
    due_date: Date;
    fee_type_id: number;
  };

  gradeSectionAndDetails: {
    name: string;
    amount: Decimal;
    description: string | null;
    feeTypeId: number;
  };
}
