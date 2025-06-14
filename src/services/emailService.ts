
import { apiClient } from './api';

export interface EmailAttachment {
  filename: string;
  content: Blob;
  type: string;
}

export interface SendEmailRequest {
  to: string;
  subject: string;
  htmlContent: string;
  attachments?: EmailAttachment[];
}

class EmailService {
  async sendEmail(request: SendEmailRequest): Promise<void> {
    // Mock implementation - in production this would call your backend API
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Email would be sent:', {
      to: request.to,
      subject: request.subject,
      attachments: request.attachments?.map(a => a.filename)
    });

    // In production:
    // const formData = new FormData();
    // formData.append('to', request.to);
    // formData.append('subject', request.subject);
    // formData.append('htmlContent', request.htmlContent);
    // 
    // request.attachments?.forEach((attachment, index) => {
    //   formData.append(`attachment_${index}`, attachment.content, attachment.filename);
    // });
    //
    // await apiClient.post('/email/send', formData);
  }

  async sendPrescriptionEmail(
    doctorName: string,
    patientName: string,
    prescriptionId: string,
    pdfBlob: Blob
  ): Promise<void> {
    const emailRequest: SendEmailRequest = {
      to: 'hannesfuel@gmail.com',
      subject: `Prescription for ${patientName} - ${prescriptionId}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Prescription</h2>
          <p>Dear Pharmacy,</p>
          <p>Please find attached the prescription for patient <strong>${patientName}</strong>.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Prescription Details:</h3>
            <ul style="margin: 0;">
              <li><strong>Prescription ID:</strong> ${prescriptionId}</li>
              <li><strong>Patient:</strong> ${patientName}</li>
              <li><strong>Prescribing Doctor:</strong> ${doctorName}</li>
              <li><strong>Date:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>
          
          <p>The prescription PDF is attached to this email.</p>
          
          <p>Best regards,<br>
          ${doctorName}</p>
          
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #ccc;">
          <p style="font-size: 12px; color: #666;">
            This is an automated email from the Prescription Management System.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `prescription_${prescriptionId}_${patientName.replace(/\s+/g, '_')}.pdf`,
          content: pdfBlob,
          type: 'application/pdf'
        }
      ]
    };

    await this.sendEmail(emailRequest);
  }
}

export const emailService = new EmailService();
