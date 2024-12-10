const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class ReportGenerator {
    static async generateSalesReport(startDate, endDate) {
        const doc = new PDFDocument();
        const filename = `sales-report-${Date.now()}.pdf`;
        const writeStream = fs.createWriteStream(path.join(__dirname, '../reports', filename));

        doc.pipe(writeStream);

        // Add report content
        doc.fontSize(25).text('Sales Report', 100, 50);
        doc.fontSize(12).text(`Period: ${startDate} to ${endDate}`, 100, 100);

        // Add sales data
        // ... Add more report content

        doc.end();
        return filename;
    }

    static async generateInventoryReport() {
        // Similar implementation for inventory report
    }
}

module.exports = ReportGenerator;