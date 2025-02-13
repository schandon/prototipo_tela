import { api } from './api_sr.ts';
import { readFields } from '../utils/extractFields';
import { v4 as uuidv4 } from 'uuid';
import { hashPdf } from '../utils/hashPdf.ts';
// import { Response } from 'express';

interface DataVerification {
  id: string;
  hash_id: string;
  fk_service_report: string;
}

export class CreateVerification {
  static async createRelationship(file: File) {
    try {
      const pdf = await readFields(file);
      const data: DataVerification = {
        id: uuidv4(),
        hash_id: hashPdf.Createhash(pdf.service_report_service_date, pdf.fk_service_order, pdf.required_work, pdf.report_text),
        fk_service_report: pdf.id,
      };
      await CreateVerification.sendToServer(data);
      return true;
    } catch (error) {
      console.error('Error in createRelationship:', error);
      throw error;
    }
  }

  private static async sendToServer(data: DataVerification): Promise<any> {
    try {
      const jsonData = JSON.stringify(data);
      const response = await api.post('/verification_report', jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
      console.log('Response sent to server', response);
      return response.status;
    } catch (error) {
      console.error('Error in sendToServer:', error);
      throw error;
    }
  }
}
