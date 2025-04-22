export interface MicroserviceUtility<T = any> {
  returnValue: {
    statusCode: number;
    message: string;
    data: T;
  };

  successDataFormat: {
    statusCode: number;
    message: string;
  };
}
