require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Car = require('./models/Car');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');

async function seedBookings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB:', process.env.MONGODB_URI);

    // 1. Ensure sample customers exist without duplicates
    const customerDefinitions = [
      { name: 'Verification Driver', email: 'verification_user_1786851658596@example.com', phone: '9888877776' },
      { name: 'User Alpha', email: 'usera_1786811757828@example.com', phone: '9111111111' },
      { name: 'Punit Tak', email: 'punittak2005@gmail.com', phone: '06367088841' },
      { name: 'Rahul Sharma', email: 'rahul.sharma@example.com', phone: '9823456789' },
      { name: 'Neha Patel', email: 'neha.patel@example.com', phone: '9834567890' },
      { name: 'Arjun Mehta', email: 'arjun.mehta@example.com', phone: '9845678901' }
    ];

    const customerMap = {};
    for (const custDef of customerDefinitions) {
      let u = await User.findOne({ email: custDef.email });
      if (!u) {
        u = await User.create({
          name: custDef.name,
          email: custDef.email,
          phone: custDef.phone,
          password: 'password123',
          role: 'customer',
          termsAccepted: true
        });
        console.log(`Created new customer account: ${u.name} (${u.email})`);
      } else {
        console.log(`Found existing customer account: ${u.name} (${u.email})`);
      }
      customerMap[custDef.email] = u;
    }

    // 2. Fetch fleet vehicle references
    const carIoniq = await Car.findOne({ brand: 'Hyundai', model: /IONIQ 5/i });
    const carLexus = await Car.findOne({ brand: 'Lexus', model: /ES 300h/i });
    const carScorpio = await Car.findOne({ brand: 'Mahindra', model: /Scorpio-N/i });
    const carTesla = await Car.findOne({ brand: 'Tesla', model: /Model S/i });
    const carFortuner = await Car.findOne({ brand: 'Toyota', model: /Fortuner/i });
    const carCreta = await Car.findOne({ brand: 'Hyundai', model: /Creta/i });
    const carThar = await Car.findOne({ brand: 'Mahindra', model: /Thar/i });

    const getCarId = (carObj, fallbackBrand) => {
      if (carObj) return carObj;
      throw new Error(`Vehicle not found: ${fallbackBrand}`);
    };

    // 3. Define 12 realistic sample bookings
    const bookingsData = [
      {
        bookingId: 'FE-529657',
        userEmail: 'verification_user_1786851658596@example.com',
        car: getCarId(carIoniq, 'Hyundai IONIQ 5'),
        pickupDate: new Date('2026-11-01T09:00:00Z'),
        returnDate: new Date('2026-11-05T18:00:00Z'),
        pickupLocation: 'Udaipur Airport',
        dropoffLocation: 'Udaipur Airport',
        status: 'Confirmed',
        paymentStatus: 'Paid',
        paymentMethod: 'UPI (Google Pay)',
        createdAt: new Date('2026-08-16T08:00:00Z')
      },
      {
        bookingId: 'OT-816654',
        userEmail: 'usera_1786811757828@example.com',
        car: getCarId(carLexus, 'Lexus ES 300h'),
        pickupDate: new Date('2026-12-01T10:00:00Z'),
        returnDate: new Date('2026-12-05T18:00:00Z'),
        pickupLocation: 'Delhi',
        dropoffLocation: 'Delhi',
        status: 'Confirmed',
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        createdAt: new Date('2026-08-16T07:30:00Z')
      },
      {
        bookingId: 'SC-213488',
        userEmail: 'punittak2005@gmail.com',
        car: getCarId(carScorpio, 'Mahindra Scorpio-N Z8L'),
        pickupDate: new Date('2026-11-01T10:00:00Z'),
        returnDate: new Date('2026-11-05T18:00:00Z'),
        pickupLocation: 'Jaipur Railway Station',
        dropoffLocation: 'Jaipur Railway Station',
        status: 'Cancelled',
        paymentStatus: 'Refunded',
        paymentMethod: 'UPI (PhonePe)',
        createdAt: new Date('2026-08-16T06:15:00Z')
      },
      {
        bookingId: 'LX-402911',
        userEmail: 'punittak2005@gmail.com',
        car: getCarId(carLexus, 'Lexus ES 300h'),
        pickupDate: new Date('2026-10-01T09:00:00Z'),
        returnDate: new Date('2026-10-05T18:00:00Z'),
        pickupLocation: 'Delhi Airport',
        dropoffLocation: 'Delhi Airport',
        status: 'Confirmed',
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        createdAt: new Date('2026-08-15T21:00:00Z')
      },
      {
        bookingId: 'TS-992014',
        userEmail: 'punittak2005@gmail.com',
        car: getCarId(carTesla, 'Tesla Model S Plaid'),
        pickupDate: new Date('2026-08-15T10:00:00Z'),
        returnDate: new Date('2026-08-18T18:00:00Z'),
        pickupLocation: 'Mumbai Hub',
        dropoffLocation: 'Mumbai Hub',
        status: 'Confirmed',
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        createdAt: new Date('2026-08-15T18:30:00Z')
      },
      {
        bookingId: 'LX-339102',
        userEmail: 'punittak2005@gmail.com',
        car: getCarId(carLexus, 'Lexus ES 300h'),
        pickupDate: new Date('2026-09-15T09:00:00Z'),
        returnDate: new Date('2026-09-18T18:00:00Z'),
        pickupLocation: 'Delhi',
        dropoffLocation: 'Delhi',
        status: 'Cancelled',
        paymentStatus: 'Refunded',
        paymentMethod: 'UPI (Paytm)',
        createdAt: new Date('2026-08-15T16:00:00Z')
      },
      {
        bookingId: 'LX-201948',
        userEmail: 'punittak2005@gmail.com',
        car: getCarId(carLexus, 'Lexus ES 300h'),
        pickupDate: new Date('2026-09-10T10:00:00Z'),
        returnDate: new Date('2026-09-12T18:00:00Z'),
        pickupLocation: 'Delhi Hub',
        dropoffLocation: 'Delhi Hub',
        status: 'Confirmed',
        paymentStatus: 'Paid',
        paymentMethod: 'UPI (Google Pay)',
        createdAt: new Date('2026-08-15T14:20:00Z')
      },
      {
        bookingId: 'LX-110293',
        userEmail: 'punittak2005@gmail.com',
        car: getCarId(carLexus, 'Lexus ES 300h'),
        pickupDate: new Date('2026-09-01T09:00:00Z'),
        returnDate: new Date('2026-09-03T18:00:00Z'),
        pickupLocation: 'Delhi Hub',
        dropoffLocation: 'Delhi Hub',
        status: 'Confirmed',
        paymentStatus: 'Paid',
        paymentMethod: 'UPI (Google Pay)',
        createdAt: new Date('2026-08-15T12:00:00Z')
      },
      {
        bookingId: 'TF-772019',
        userEmail: 'rahul.sharma@example.com',
        car: getCarId(carFortuner, 'Toyota Fortuner Legender'),
        pickupDate: new Date('2026-08-20T10:00:00Z'),
        returnDate: new Date('2026-08-23T18:00:00Z'),
        pickupLocation: 'Gurugram Hub',
        dropoffLocation: 'Gurugram Hub',
        status: 'Pending',
        paymentStatus: 'Pending',
        paymentMethod: 'Cash on Pickup',
        createdAt: new Date('2026-08-15T10:15:00Z')
      },
      {
        bookingId: 'HC-440291',
        userEmail: 'neha.patel@example.com',
        car: getCarId(carCreta, 'Hyundai Creta SX(O)'),
        pickupDate: new Date('2026-08-22T09:00:00Z'),
        returnDate: new Date('2026-08-25T18:00:00Z'),
        pickupLocation: 'Ahmedabad',
        dropoffLocation: 'Ahmedabad',
        status: 'Completed',
        paymentStatus: 'Paid',
        paymentMethod: 'UPI (PhonePe)',
        createdAt: new Date('2026-08-15T08:30:00Z')
      },
      {
        bookingId: 'MT-883012',
        userEmail: 'arjun.mehta@example.com',
        car: getCarId(carThar, 'Mahindra Thar LX 4x4'),
        pickupDate: new Date('2026-08-25T10:00:00Z'),
        returnDate: new Date('2026-08-28T18:00:00Z'),
        pickupLocation: 'Bengaluru Hub',
        dropoffLocation: 'Bengaluru Hub',
        status: 'Active',
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        createdAt: new Date('2026-08-15T06:45:00Z')
      },
      {
        bookingId: 'SC-990412',
        userEmail: 'rahul.sharma@example.com',
        car: getCarId(carScorpio, 'Mahindra Scorpio-N Z8L'),
        pickupDate: new Date('2026-09-05T09:00:00Z'),
        returnDate: new Date('2026-09-08T18:00:00Z'),
        pickupLocation: 'Delhi',
        dropoffLocation: 'Delhi',
        status: 'Confirmed',
        paymentStatus: 'Paid',
        paymentMethod: 'UPI (Google Pay)',
        createdAt: new Date('2026-08-14T20:10:00Z')
      }
    ];

    console.log('Seeding 12 sample bookings...');

    for (const bData of bookingsData) {
      const userObj = customerMap[bData.userEmail];
      const carObj = bData.car;

      const totalDays = Math.max(Math.ceil((bData.returnDate - bData.pickupDate) / (1000 * 3600 * 24)), 1);
      const dailyRate = carObj.pricePerDay;
      const subtotal = dailyRate * totalDays;
      const taxes = Math.round(subtotal * 0.08);
      const securityDeposit = carObj.securityDeposit || 8000;
      const totalAmount = subtotal + taxes + securityDeposit;

      // Upsert Booking without duplicating bookingId
      const existingBooking = await Booking.findOne({ bookingId: bData.bookingId });

      const bookingPayload = {
        bookingId: bData.bookingId,
        user: userObj._id,
        car: carObj._id,
        pickupLocation: bData.pickupLocation,
        dropoffLocation: bData.dropoffLocation,
        pickupDate: bData.pickupDate,
        returnDate: bData.returnDate,
        totalDays,
        dailyRate,
        billing: {
          subtotal,
          securityDeposit,
          taxes,
          totalAmount
        },
        customerDetails: {
          fullName: userObj.name,
          email: userObj.email,
          phone: userObj.phone,
          driverLicense: 'DL-' + bData.bookingId
        },
        status: bData.status,
        paymentStatus: bData.paymentStatus,
        paymentDetails: {
          transactionId: 'TXN-' + bData.bookingId,
          cardholderName: userObj.name,
          paymentMethod: bData.paymentMethod,
          paymentDate: bData.createdAt
        },
        createdAt: bData.createdAt
      };

      let savedBooking;
      if (existingBooking) {
        savedBooking = await Booking.findByIdAndUpdate(existingBooking._id, bookingPayload, { new: true });
        console.log(`Updated booking ${savedBooking.bookingId} (${carObj.brand} ${carObj.model}) for ${userObj.name}`);
      } else {
        savedBooking = await Booking.create(bookingPayload);
        console.log(`Created booking ${savedBooking.bookingId} (${carObj.brand} ${carObj.model}) for ${userObj.name}`);
      }

      // Create or update Payment record for paid bookings
      if (bData.paymentStatus === 'Paid' || bData.status === 'Completed' || bData.status === 'Confirmed') {
        const existingPayment = await Payment.findOne({ transactionId: 'TXN-' + bData.bookingId });
        if (!existingPayment) {
          await Payment.create({
            booking: savedBooking._id,
            user: userObj._id,
            transactionId: 'TXN-' + bData.bookingId,
            amount: totalAmount,
            status: 'Success',
            cardholderName: userObj.name,
            last4Digits: '4111',
            paymentMethod: bData.paymentMethod,
            createdAt: bData.createdAt
          });
        }
      }
    }

    console.log('\n--- SAMPLE BOOKING SEEDING COMPLETE ---');
    const finalBookingsCount = await Booking.countDocuments();
    console.log('Final Total Bookings in Database:', finalBookingsCount);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding bookings:', error);
    process.exit(1);
  }
}

seedBookings();
