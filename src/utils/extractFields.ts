import { PDFDocument } from 'pdf-lib';
import { gerarCodeReport } from './code_report/naming_report';
import { v4 as uuidv4 } from 'uuid';

interface ServicedEquipment {
  fk_model: string;
  fk_serial_number: string;
  maker: string;
  date: string;
}

interface WarehouseItem {
  fk_warehouse_item: string;
  description: string;
  serial_number: string;
  quantity: number;
}

interface TimeSheet {
  date: string;
  men: number;
  lv_shop: string;
  arv_job: string;
  lv_job: string;
  arv_shop: string;
}

interface EquipmentType {
  type: string;
  model: string;
  serial_number: string;
}

interface PDFData {
  id: string;
  name: string | undefined;
  imo: string | undefined;
  mmsi: string | undefined;
  port_name: string;
  country_name: string | undefined;
  class_society: string;
  owner_or_ordered_by: string | undefined;
  customer_work_order: string | undefined;
  service_date: string | undefined;
  service_report_service_date: string;
  collaborator_name: string | undefined;
  fk_service_order: string;
  code_report: string | undefined;
  required_work: string;
  serviced_equip: Array<any> | undefined;
  report_text: string;
  warehouse_item: Array<any> | undefined;
  timesheets: Array<any> | undefined;
  test_equipments: Array<any> | undefined;
  obs_report: string | undefined;
}

export async function readFields(pdfFile: File): Promise<PDFData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async function (event) {
      try {
        if (!event.target?.result) {
          throw new Error('Failed to read file');
        }

        const arrayBuffer = event.target.result as ArrayBuffer;
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const form = pdfDoc.getForm();

        const serviced_equipments_matriz: ServicedEquipment[] = [];
        const warehouse_items_matriz: WarehouseItem[] = [];
        const time_sheets_matriz: TimeSheet[] = [];
        const equipments_type_matriz: EquipmentType[] = [];

        // Get form fields
        const collaborator_name = form.getTextField('collaborator_name').getText();
        const vessel_name = form.getTextField('vessel_name').getText();
        const vessel_imo = form.getTextField('vessel_imo').getText();
        const vessel_mmsi = form.getTextField('vessel_mmsi').getText();
        const class_society = form.getDropdown('class_society_fantasy_name').getSelected()[0] || '';
        const country_name = form.getTextField('country_name').getText();
        const service_orders_owner_or_ordered_by = form.getTextField('service_orders_owner_or_ordered_by').getText();
        const service_orders_customer_work_order = form.getTextField('service_orders_customer_work_order').getText();
        const service_orders_os = form.getTextField('service_orders_os').getText() || '';
        const port_name = form.getDropdown('port_name').getSelected()[0] || '';
        const service_report_service_date = form.getTextField('service_report_service_date').getText() || '';
        const service_report_code_report = await gerarCodeReport(service_report_service_date, service_orders_os, false);
        const service_report_required_work = form.getTextField('service_report_required_work').getText() || '';
        const service_report_report_text = form.getTextField('service_report_report_text').getText() || '';
        const service_report_obs_report = form.getTextField('service_report_obs_report').getText();

        // Process serviced equipment
        for (let i = 0; i <= 2; i++) {
          const new_serviced_equipments: ServicedEquipment = {
            fk_model: form.getTextField(`serviced_equipments_model_${i}`).getText() || '',
            fk_serial_number: form.getTextField(`serviced_equipments_serial_number_${i}`).getText() || '',
            maker: form.getTextField(`serviced_equipments_maker_${i}`).getText() || '',
            date: form.getTextField(`serviced_equipments_date_${i}`).getText() || '',
          };

          if (new_serviced_equipments.fk_model && new_serviced_equipments.fk_serial_number) {
            serviced_equipments_matriz.push(new_serviced_equipments);
          }
        }

        // Process warehouse items
        for (let y = 0; y <= 4; y++) {
          const new_warehouse_items = {
            fk_warehouse_item: form.getTextField(`warehouse_items_code_${y}`).getText() || '',
            description: form.getTextField(`warehouse_items_description_${y}`).getText() || '',
            serial_number: form.getTextField(`warehouse_items_serial_number_${y}`).getText() || '',
            quantity: parseInt(form.getTextField(`warehouse_items_qtd_${y}`).getText() ?? '', 10) || 0,
          };

          if (new_warehouse_items.description) {
            warehouse_items_matriz.push(new_warehouse_items);
          }
        }

        // Process time sheets
        for (let a = 0; a <= 4; a++) {
          const new_time_sheets = {
            date: form.getTextField(`time_sheets_date_${a}`).getText() || '',
            men: Number(form.getTextField(`time_sheets_men_${a}`).getText() || 0),
            lv_shop: form.getTextField(`time_sheets_lv_shop_${a}`).getText() || '',
            arv_job: form.getTextField(`time_sheets_arv_job_${a}`).getText() || '',
            lv_job: form.getTextField(`time_sheets_lv_job_${a}`).getText() || '',
            arv_shop: form.getTextField(`time_sheets_arv_shop_${a}`).getText() || '',
          };

          if (new_time_sheets.date) {
            time_sheets_matriz.push(new_time_sheets);
          }
        }

        // Process equipment types
        for (let i = 0; i <= 4; i++) {
          const new_equipments_types = {
            type: form.getTextField(`equipments_types_type_${i}`).getText() || '',
            model: form.getTextField(`equipments_types_model_${i}`).getText() || '',
            serial_number: form.getTextField(`equipments_types_serial_number_${i}`).getText() || '',
          };

          if (new_equipments_types.model && new_equipments_types.serial_number && new_equipments_types.type) {
            equipments_type_matriz.push(new_equipments_types);
          }
        }

        const data: PDFData = {
          id: uuidv4(),
          name: vessel_name,
          imo: vessel_imo,
          mmsi: vessel_mmsi,
          port_name: port_name,
          country_name: country_name,
          class_society: class_society,
          owner_or_ordered_by: service_orders_owner_or_ordered_by,
          customer_work_order: service_orders_customer_work_order,
          service_date: service_report_service_date,
          collaborator_name: collaborator_name,
          fk_service_order: service_orders_os,
          service_report_service_date: service_report_service_date,
          code_report: service_report_code_report,
          required_work: service_report_required_work,
          serviced_equip: serviced_equipments_matriz,
          report_text: service_report_report_text,
          warehouse_item: warehouse_items_matriz,
          timesheets: time_sheets_matriz,
          test_equipments: equipments_type_matriz,
          obs_report: service_report_obs_report,
        };

        resolve(data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(pdfFile);
  });
}
