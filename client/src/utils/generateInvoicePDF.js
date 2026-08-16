import jsPDF from 'jspdf';

export const generateInvoicePDF = (booking) => {
  if (!booking) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const {
    _id,
    bookingId = `TQ-${_id?.slice(-6).toUpperCase()}`,
    car = {},
    pickupLocation = 'Main Hub',
    dropoffLocation = 'Main Hub',
    pickupDate,
    returnDate,
    totalDays = 1,
    dailyRate = 0,
    billing = {},
    customerDetails = {},
    status = 'Confirmed',
    paymentStatus = 'Paid',
    paymentDetails = {},
    createdAt = new Date()
  } = booking;

  const invoiceNumber = bookingId;
  const formattedInvoiceDate = new Date(createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const formattedPickup = new Date(pickupDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const formattedReturn = new Date(returnDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const subtotal = billing.subtotal || (dailyRate * totalDays);
  const deposit = billing.securityDeposit || 3000;
  const taxes = billing.taxes || Math.round(subtotal * 0.08);
  const totalAmount = billing.totalAmount || (subtotal + deposit + taxes);

  // Background Header Banner
  doc.setFillColor(15, 23, 42); // Asphalt / Graphite dark
  doc.rect(0, 0, 210, 40, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('TORQUE', 15, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(56, 189, 248); // Neon accent cyan
  doc.text('LUXURY & EXECUTIVE CAR RENTAL SYSTEM', 15, 27);

  // Invoice Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('OFFICIAL INVOICE', 195, 20, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`Invoice #: ${invoiceNumber}`, 195, 27, { align: 'right' });

  let y = 50;

  // Metadata Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, y, 180, 22, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE DATE:', 20, y + 8);
  doc.text('BOOKING STATUS:', 75, y + 8);
  doc.text('PAYMENT STATUS:', 135, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(formattedInvoiceDate, 20, y + 15);
  doc.text(status.toUpperCase(), 75, y + 15);
  doc.text((paymentStatus || 'Paid').toUpperCase(), 135, y + 15);

  y += 30;

  // Two Column Details (Customer & Rental Info)
  // Left Box: Customer Details
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(15, y, 86, 45, 2, 2, 'D');

  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, 86, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('CLIENT DETAILS', 20, y + 5.5);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Name: ${customerDetails.fullName || 'Valued Customer'}`, 20, y + 15);
  doc.text(`Email: ${customerDetails.email || 'N/A'}`, 20, y + 22);
  doc.text(`Phone: ${customerDetails.phone || 'N/A'}`, 20, y + 29);
  doc.text(`License #: ${customerDetails.driverLicense || 'N/A'}`, 20, y + 36);

  // Right Box: Rental & Vehicle Info
  doc.roundedRect(109, y, 86, 45, 2, 2, 'D');

  doc.setFillColor(241, 245, 249);
  doc.rect(109, y, 86, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('RENTAL & VEHICLE DETAILS', 114, y + 5.5);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Vehicle: ${car.brand || ''} ${car.model || 'Rental Vehicle'}`, 114, y + 15);
  doc.text(`Pickup Hub: ${pickupLocation}`, 114, y + 22);
  doc.text(`Drop-off Hub: ${dropoffLocation || pickupLocation}`, 114, y + 29);
  doc.text(`Rental Period: ${formattedPickup} to ${formattedReturn} (${totalDays} Days)`, 114, y + 36);

  y += 53;

  // Itemized Pricing Table Header
  doc.setFillColor(15, 23, 42);
  doc.rect(15, y, 180, 8, 'F');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('DESCRIPTION', 20, y + 5.5);
  doc.text('QTY / DAYS', 110, y + 5.5);
  doc.text('RATE', 145, y + 5.5);
  doc.text('AMOUNT', 190, y + 5.5, { align: 'right' });

  y += 8;

  // Item Rows
  const items = [
    { desc: `Vehicle Rental Hire (${car.brand || ''} ${car.model || 'Car'})`, qty: `${totalDays} Days`, rate: `INR ${dailyRate.toLocaleString()}`, amount: `INR ${subtotal.toLocaleString()}` },
    { desc: 'Refundable Security Deposit', qty: '1', rate: `INR ${deposit.toLocaleString()}`, amount: `INR ${deposit.toLocaleString()}` },
    { desc: 'Government Taxes & Service Charge (8%)', qty: '1', rate: `INR ${taxes.toLocaleString()}`, amount: `INR ${taxes.toLocaleString()}` }
  ];

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  items.forEach((item, index) => {
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, 180, 8, 'F');
    }
    doc.text(item.desc, 20, y + 5.5);
    doc.text(item.qty, 110, y + 5.5);
    doc.text(item.rate, 145, y + 5.5);
    doc.text(item.amount, 190, y + 5.5, { align: 'right' });
    y += 8;
  });

  // Table Bottom Divider
  doc.setDrawColor(203, 213, 225);
  doc.line(15, y, 195, y);
  y += 6;

  // Total Summary & Payment Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(115, y, 80, 28, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('SUBTOTAL:', 120, y + 8);
  doc.text('TAXES (8%):', 120, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.text(`INR ${subtotal.toLocaleString()}`, 190, y + 8, { align: 'right' });
  doc.text(`INR ${taxes.toLocaleString()}`, 190, y + 14, { align: 'right' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL PAID:', 120, y + 23);
  doc.setTextColor(14, 165, 233); // Cyan
  doc.text(`INR ${totalAmount.toLocaleString()}`, 190, y + 23, { align: 'right' });

  // Left Payment Details
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('PAYMENT METHOD & TRANSACTION', 15, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Method: ${paymentDetails.paymentMethod || 'Credit/Debit Card'}`, 15, y + 15);
  doc.text(`Transaction ID: ${paymentDetails.transactionId || 'TXN-N/A'}`, 15, y + 22);

  y += 40;

  // Terms & Contact Footer Banner
  doc.setDrawColor(226, 232, 240);
  doc.line(15, y, 195, y);
  y += 6;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('TORQUE SUPPORT & CONTACT INFORMATION', 15, y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Email: punittak2005@gmail.com | Phone: +91 6367088841 | Web: https://torque-car-rental-system.vercel.app', 15, y + 5);
  doc.text('Thank you for choosing TORQUE Car Rental! Have a safe and enjoyable journey.', 15, y + 10);

  // Trigger browser download
  const cleanFileName = `Torque-Invoice-${invoiceNumber}.pdf`;
  doc.save(cleanFileName);
};
