import { api } from './api_sr.ts';
import { readFields } from '../utils/extractFields';
import { hashPdf } from '../utils/hashPdf.ts';

export class VerificationPdf {
  static async getLastService(file: File) {
    try {
      const pdf = await readFields(file);
      const hash = hashPdf.Createhash(pdf.service_report_service_date, pdf.fk_service_order, pdf.required_work, pdf.report_text);
      const result = await this.verifyReport(hash);
      if (!result[0]) {
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  }
  private static async verifyReport(codigo_verificador: string): Promise<any> {
    try {
      const response = await api.get(`/verification_report/${codigo_verificador}`);
      return response.data;
    } catch (error) {
      console.error('Error to Verification:', error);
      throw error;
    }
  }
}
