import CryptoJS from 'crypto-js';

export class hashPdf {
  static CreateHashObject(pdf: Object): string {
    const pdf_json = JSON.stringify(pdf);
    const hashResult = CryptoJS.SHA256(pdf_json).toString(CryptoJS.enc.Hex);
    return hashResult;
  }
  static Createhash(date_service: string, os: string, problem_reported: string, report_text: string): string {
    if (!os || !problem_reported || !date_service) {
      throw new Error('Todos os campos devem estar preenchidos para gerar o hash.');
    }

    const hashResult = CryptoJS.SHA256(date_service + os + problem_reported + report_text).toString(CryptoJS.enc.Hex);
    return hashResult;
  }
}
