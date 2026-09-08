import PDFDocument from 'pdfkit';
import { prisma } from '../config/index.js';
import { PaymentStatus } from '../types/index.js';

export class ReportGenerator {
  static async generateSalesCsv(dateRange: string = '30d'): Promise<string> {
    const days = dateRange === 'today' ? 1 : dateRange === '7d' ? 7 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    if (dateRange === 'today') {
      startDate.setHours(0, 0, 0, 0);
    }

    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: PaymentStatus.SUCCESS,
        createdAt: { gte: startDate },
      },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { foodItem: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Order Number',
      'Date Time',
      'Student Name',
      'Student Email',
      'Items Summary',
      'Total Amount (INR)',
      'Status',
      'Payment Method',
      'Transaction Ref',
    ];

    const rows = orders.map((o) => {
      const itemsSummary = o.items.map((i) => `${i.foodItem.name} (x${i.quantity})`).join('; ');
      return [
        `"${o.orderNumber}"`,
        `"${o.createdAt.toISOString()}"`,
        `"${o.user.name}"`,
        `"${o.user.email}"`,
        `"${itemsSummary}"`,
        o.totalAmount,
        `"${o.status}"`,
        `"${o.payment?.method || 'N/A'}"`,
        `"${o.payment?.transactionReference || 'N/A'}"`,
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  static async generatePdfReport(dateRange: string = '30d'): Promise<Buffer> {
    const days = dateRange === 'today' ? 1 : dateRange === '7d' ? 7 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: PaymentStatus.SUCCESS,
        createdAt: { gte: startDate },
      },
      include: {
        items: { include: { foodItem: true } },
      },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0;

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on('error', reject);

      // Title & Header
      doc.fontSize(22).font('Helvetica-Bold').fillColor('#ea580c').text('CAMPUSBITE', { align: 'center' });
      doc.fontSize(12).font('Helvetica').fillColor('#64748b').text('Smart Campus Food Ordering & Insight Platform', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(16).font('Helvetica-Bold').fillColor('#0f172a').text(`Sales & Operations Report (${dateRange.toUpperCase()})`, { align: 'center' });
      doc.fontSize(9).font('Helvetica').fillColor('#94a3b8').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown(1.5);

      // Executive Summary Box
      doc.rect(40, doc.y, 532, 70).fillAndStroke('#fff7ed', '#fdba74');
      const boxY = doc.y + 12;
      doc.fillColor('#9a3412').fontSize(11).font('Helvetica-Bold');
      doc.text(`Total Revenue: INR ${totalRevenue.toLocaleString()}`, 60, boxY);
      doc.text(`Total Completed Orders: ${totalOrders}`, 60, boxY + 20);
      doc.text(`Average Order Value: INR ${avgOrderValue}`, 60, boxY + 40);

      doc.moveDown(4);

      // Section: Recent Orders Table Header
      doc.fontSize(13).font('Helvetica-Bold').fillColor('#0f172a').text('Order Transaction Log (Sample)', 40, doc.y + 10);
      doc.moveDown(0.5);

      const tableTop = doc.y;
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#475569');
      doc.text('Order ID', 40, tableTop);
      doc.text('Date', 150, tableTop);
      doc.text('Amount (INR)', 300, tableTop);
      doc.text('Status', 420, tableTop);

      doc.moveTo(40, tableTop + 14).lineTo(570, tableTop + 14).stroke('#cbd5e1');

      let rowY = tableTop + 20;
      doc.font('Helvetica').fillColor('#334155');

      const sampleOrders = orders.slice(0, 15);
      for (const ord of sampleOrders) {
        if (rowY > 700) {
          doc.addPage();
          rowY = 50;
        }
        doc.text(ord.orderNumber, 40, rowY);
        doc.text(ord.createdAt.toLocaleDateString(), 150, rowY);
        doc.text(`INR ${ord.totalAmount}`, 300, rowY);
        doc.text(ord.status, 420, rowY);
        rowY += 18;
      }

      doc.moveDown(2);
      doc.fontSize(8).fillColor('#94a3b8').text('CampusBite Platform — Generated for Academic Evaluation & Presentation', { align: 'center' });

      doc.end();
    });
  }
}
