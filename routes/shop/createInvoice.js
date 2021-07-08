const fs = require("fs");
const PDFDocument = require("pdfkit");

function createInvoice(invoice, path) {
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(path));
}
if (!process.env.PWD) {
    process.env.PWD = process.cwd();
}
function generateHeader(doc) {
    doc.image(`${process.env.PWD}/static/assets/images/تیارا.jpg`, 50, 45, {
        width: 50,
    })
        .font(`${process.env.PWD}/static/assets/fonts/IRANSansWeb.ttf`)
        .fillColor("#444444")
        .fontSize(20)
        .text("شماره ثبت: 14506 - کد اقتصادی و شناسه ملی: 14009437830", 110, 57)
        .fontSize(10)
        .text("شرکت تجارت الکترونیک تیارا", 200, 50, { align: "right" })
        .moveDown();
}

function generateCustomerInformation(doc, invoice) {
    doc.fillColor("#444444").fontSize(20).text("صورتحساب شما", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 300;

    doc.fontSize(10)
        .text("شماره پیگیری:", 50, customerInformationTop)
        .font(`${process.env.PWD}/static/assets/fonts/IRANSansWeb.ttf`)
        .text(invoice.purchaseId, 150, customerInformationTop)
        .font(`${process.env.PWD}/static/assets/fonts/IRANSansWeb.ttf`)
        .text("تاریخ ثبت سفارش:", 50, customerInformationTop + 25)
        .text(invoice.paidTime, 150, customerInformationTop + 25)
        .text("قیمت کل:", 50, customerInformationTop + 50)
        .text(
            formatCurrency(invoice.subtotal),
            150,
            customerInformationTop + 50
        )

        .font(`${process.env.PWD}/static/assets/fonts/IRANSansWeb.ttf`)
        .text(invoice.shipping.name, 400, customerInformationTop)
        .font(`${process.env.PWD}/static/assets/fonts/IRANSansWeb.ttf`)
        .text(invoice.shipping.address, 400, customerInformationTop + 35)
        .text(
            invoice.shipping.phone + ", " + invoice.shipping.postal_code,
            300,
            customerInformationTop + 50
        )
        .moveDown();

    generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
    let i;
    const invoiceTableTop = 330;

    doc.font(`${process.env.PWD}/static/assets/fonts/IRANSansWeb.ttf`);
    generateTableRow(
        doc,
        invoiceTableTop,
        "کالا",
        "قیمت واحد (تومان)",
        "تعداد",
        "قیمت (تومان)"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font(`${process.env.PWD}/static/assets/fonts/IRANSansWeb.ttf`);

    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            item.name,
            formatCurrency(item.price / item.count),
            item.count,
            formatCurrency(item.price)
        );

        generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "قیمت کل (تومان)",
        "",
        formatCurrency(invoice.subtotal)
    );

    const paidToDatePosition = subtotalPosition + 20;
    generateTableRow(
        doc,
        paidToDatePosition,
        "",
        "",
        "زمان پرداخت",
        "",
        invoice.paidTime
    );
}

function generateFooter(doc) {
    doc.fontSize(10).text("متشکر از خرید شما", 50, 780, {
        align: "center",
        width: 500,
    });
}

function generateTableRow(
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    lineTotal
) {
    doc.fontSize(10)
        .text(item, 50, y)
        .text(description, 150, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc.strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(totalPrice) {
    return totalPrice;
}

module.exports = {
    createInvoice,
};
