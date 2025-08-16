// Extend Axios types to include custom metadata
import 'axios';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}
