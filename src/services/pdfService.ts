
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Doctor, Patient, PrescriptionProduct } from '../types/api';

export interface PrescriptionPDFData {
  doctor: Doctor;
  patient: Patient;
  products: PrescriptionProduct[];
  prescriptionId: string;
  createdAt: string;
  signature?: string;
}

class PDFService {
  async generatePrescriptionPDF(data: PrescriptionPDFData): Promise<Blob> {
    // Create a temporary div to render the prescription
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '210mm';
    tempDiv.style.padding = '20mm';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.fontSize = '12px';
    tempDiv.style.lineHeight = '1.4';
    tempDiv.style.backgroundColor = 'white';

    const totalAmount = data.products.reduce((total, product) => {
      const subtotal = product.unitPrice * product.quantity;
      const vat = subtotal * (product.vatRate / 100);
      return total + subtotal + vat;
    }, 0);

    tempDiv.innerHTML = `
      <div style="max-width: 170mm; margin: 0 auto;">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
          <h1 style="margin: 0; color: #2563eb; font-size: 24px;">PRESCRIPTION</h1>
          <p style="margin: 5px 0 0 0; font-size: 10px; color: #666;">Prescription ID: ${data.prescriptionId}</p>
        </div>

        <!-- Doctor Information -->
        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Doctor Information</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <strong>Name:</strong> ${data.doctor.title} ${data.doctor.name}<br>
              <strong>Registration:</strong> ${data.doctor.registrationNumber}<br>
            </div>
            <div>
              <strong>Phone:</strong> ${data.doctor.phone}<br>
              <strong>Email:</strong> ${data.doctor.email}<br>
            </div>
          </div>
        </div>

        <!-- Patient Information -->
        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Patient Information</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <strong>Name:</strong> ${data.patient.fullName}<br>
              <strong>ID Number:</strong> ${data.patient.idNumber}<br>
            </div>
            <div>
              <strong>Phone:</strong> ${data.patient.contactNumber}<br>
              ${data.patient.email ? `<strong>Email:</strong> ${data.patient.email}<br>` : ''}
            </div>
          </div>
        </div>

        <!-- Prescribed Medications -->
        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Prescribed Medications</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Medication</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Qty</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Dosage Instructions</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Repeat</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Unit Price</th>
              </tr>
            </thead>
            <tbody>
              ${data.products.map(product => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">
                    <strong>${product.name}</strong><br>
                    <small style="color: #666;">${product.description}</small>
                  </td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${product.quantity}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${product.dosageInstructions}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${product.repeatFrequency}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">R${product.unitPrice.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Total Amount -->
        <div style="margin-bottom: 20px; text-align: right;">
          <div style="display: inline-block; border: 1px solid #ddd; padding: 10px; background-color: #f9f9f9;">
            <strong>Total Amount: R${totalAmount.toFixed(2)}</strong>
          </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 30px; border-top: 1px solid #ccc; padding-top: 15px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <p style="margin: 0; font-size: 10px; color: #666;">
                Date: ${new Date(data.createdAt).toLocaleDateString()}<br>
                Time: ${new Date(data.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div style="text-align: right;">
              <div style="border-top: 1px solid #333; width: 150px; margin-left: auto; padding-top: 5px;">
                <p style="margin: 0; font-size: 10px; text-align: center;">Doctor's Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(tempDiv);

    try {
      // Convert HTML to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      return pdf.output('blob');
    } finally {
      document.body.removeChild(tempDiv);
    }
  }
}

export const pdfService = new PDFService();
