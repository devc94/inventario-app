import {Injectable} from '@angular/core';
import {jsPDF} from 'jspdf';
import autoTable from "jspdf-autotable";

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor() {
  }

  print(head: string[], body: Array<any>, title: string, format: string, save?: boolean): void {
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: format,
    });

    doc.text(title, doc.internal.pageSize.width / 2, 25, {align: 'center'});
    autoTable(doc, {
      head: [head],
      body: body
    });

    const today = new Date();
    if (save) {
      doc.autoPrint({variant: 'non-conform'});
      doc.save(today.getDate() + today.getMonth() + today.getFullYear() + today.getTime() + '.pdf')
    } else {
      doc.output('dataurlnewwindow', {filename: today.getDate() + today.getMonth() + today.getFullYear() + today.getTime() + '.pdf'});
    }
  }
}
