export interface MicroserviceUtility<T = any> {
  returnValue: {
    statusCode: number;
    message: string;
    data: T;
  };

  successDataFormat: {
    message: string;
    timeExecuted: Date;
  };
}
