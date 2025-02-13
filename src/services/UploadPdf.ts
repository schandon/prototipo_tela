import { readFields } from '../utils/extractFields';
import { api } from './api_sr.ts';

export class UploadPdf {
  static async processFile(file: File): Promise<void> {
    try {
      const pdf = await readFields(file);
      await this.sendToServer(pdf);
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  }
  private static async sendToServer(pdf: any): Promise<void> {
    const response = await api.post('/service_reports/file_updated', pdf, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    try {
      return response.data;
    } catch (error) {
      console.error('Error sending file to server:', error);
      throw error;
    }
  }
}
