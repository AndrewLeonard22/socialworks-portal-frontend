export interface ApiEnvelope<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}
