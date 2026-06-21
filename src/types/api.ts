export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors: null | Record<string, string[]>;
};
