import { api } from './api_sr.ts';

export class VerifyReport {
  static async checkReport(os: string): Promise<number> {
    try {
      return await this.verify(os);
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  }
  private static async verify(os: string): Promise<number> {
    const response = await api.get(`/service_reports/os_count/${os}`);
    try {
      return response.data;
    } catch (error) {
      console.error('Error sending file to server:', error);
      throw error;
    }
  }
}
