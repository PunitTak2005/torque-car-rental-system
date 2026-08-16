require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Car = require('./models/Car');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const Payment = require('./models/Payment');
const Notification = require('./models/Notification');
const Contact = require('./models/Contact');

const ALL_CITIES = ['Udaipur', 'Jaipur', 'Jodhpur', 'Delhi', 'Mumbai', 'Ahmedabad', 'Pune', 'Goa', 'Gurugram', 'Bengaluru'];

const carsData = [
  // 0: Tesla Model S Plaid (MATCH FOUND: tesla.jpg)
  {
    brand: 'Tesla',
    model: 'Model S Plaid',
    category: 'Electric',
    images: [
      '/cars/tesla.jpg'
    ],
    description: 'Experience the pinnacle of electric acceleration with the Tesla Model S Plaid. Delivering 1,020 hp across tri-motor all-wheel drive, autopilot navigation, and a high-tech minimalist luxury interior.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Electric',
      seats: 5,
      doors: 4,
      mileage: '600 km range',
      engine: 'Tri-motor Electric',
      horsepower: 1020
    },
    features: ['Autopilot', '17-inch Cinematic Display', 'Dual Wireless Charging', 'Premium Audio', 'Heated & Ventilated Seats', 'GPS Navigation', 'Glass Sunroof'],
    pricePerDay: 6900,
    securityDeposit: 15000,
    rentalRequirements: ['Minimum age 25', 'Clean driving record', 'Credit card in driver name'],
    rating: 4.9,
    numReviews: 8,
    availability: true,
    location: ALL_CITIES
  },
  // 1: Ford Mustang GT (MATCH FOUND: 2020-ford-mustang-gt-premium-perf-package-ii-fastback.jpeg)
  {
    brand: 'Ford',
    model: 'Mustang GT Premium',
    category: 'Performance',
    images: [
      '/cars/2020-ford-mustang-gt-premium-perf-package-ii-fastback.jpeg'
    ],
    description: 'Command the road with the raw power of the Mustang GT. Featuring a 5.0L Coyote V8 engine delivering 450 hp, active valve performance exhaust, and selectable drive modes.',
    specifications: {
      transmission: 'Manual',
      fuelType: 'Petrol',
      seats: 4,
      doors: 2,
      mileage: '8 km/l combined',
      engine: '5.0L Coyote V8',
      horsepower: 450
    },
    features: ['Active Exhaust', 'Brembo Brakes', 'Apple CarPlay', 'Heated Steering Wheel', 'Launch Control', 'Rear View Camera'],
    pricePerDay: 9500,
    securityDeposit: 20000,
    rentalRequirements: ['Minimum age 23', 'Valid driving license', 'Major credit card'],
    rating: 4.8,
    numReviews: 12,
    availability: true,
    location: ALL_CITIES
  },
  // 2: Land Rover Range Rover Sport (MATCH FOUND: landrover_sport.jpg)
  {
    brand: 'Land Rover',
    model: 'Range Rover Sport',
    category: 'SUV',
    images: [
      '/cars/landrover_sport.jpg'
    ],
    description: 'The luxury SUV standard. Range Rover Sport combines dynamic on-road performance with off-road capabilities, leather captain chairs, dual touchscreens, and adaptive air suspension.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      doors: 5,
      mileage: '9 km/l combined',
      engine: '3.0L Turbocharged I6',
      horsepower: 355
    },
    features: ['Terrain Response 2', 'Panoramic Roof', 'Meridian Sound System', '360 Camera', 'Cooler Compartment'],
    pricePerDay: 8500,
    securityDeposit: 18000,
    rentalRequirements: ['Minimum age 25', 'Full coverage insurance', 'Credit card payment'],
    rating: 4.7,
    numReviews: 6,
    availability: true,
    location: ALL_CITIES
  },
  // 3: Audi A6 Premium Plus (MATCH FOUND: audi a6)
  {
    brand: 'Audi',
    model: 'A6 Premium Plus',
    category: 'Luxury',
    images: [
      '/cars/audi a6'
    ],
    description: 'Perfect for business trips or comfortable luxury getaways. The Audi A6 offers an exceptionally quiet cabin, Quattro all-wheel drive, premium leather stitching, and virtual cockpit.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      doors: 4,
      mileage: '14 km/l combined',
      engine: '2.0L Turbocharged 4-Cylinder',
      horsepower: 261
    },
    features: ['Quattro AWD', 'Audi Virtual Cockpit', 'Leather Seats', 'Three-Zone Climate Control', 'Ambient Lighting', 'Matrix LED Headlights'],
    pricePerDay: 7800,
    securityDeposit: 15000,
    rentalRequirements: ['Minimum age 21', 'Valid driver license'],
    rating: 4.6,
    numReviews: 15,
    availability: true,
    location: ALL_CITIES
  },
  // 4: Maruti Suzuki Swift ZXi+ (MATCH FOUND: maruti_swift.png)
  {
    brand: 'Maruti Suzuki',
    model: 'Swift ZXi+',
    category: 'City',
    images: [
      '/cars/maruti_swift.png'
    ],
    description: 'India\'s favorite city hatchback. Agile, highly fuel-efficient, and easy to park, featuring a responsive petrol engine, SmartPlay touchscreen, and LED projector headlamps.',
    specifications: {
      transmission: 'Manual',
      fuelType: 'Petrol',
      seats: 5,
      doors: 5,
      mileage: '22 km/l',
      engine: '1.2L DualJet Petrol',
      horsepower: 89
    },
    features: ['SmartPlay Infotainment', 'Apple CarPlay & Android Auto', 'Keyless Entry', 'Automatic Climate Control', 'Rear Parking Sensors'],
    pricePerDay: 1800,
    securityDeposit: 3500,
    rentalRequirements: ['Minimum age 21', 'Valid Indian Driving License'],
    rating: 4.7,
    numReviews: 32,
    availability: true,
    location: ALL_CITIES
  },
  // 5: Hyundai Grand i10 Nios (MATCH FOUND: hyundai_i10.png)
  {
    brand: 'Hyundai',
    model: 'Grand i10 Nios',
    category: 'City',
    images: [
      '/cars/hyundai_i10.png'
    ],
    description: 'A compact and stylish urban companion. Features a smooth automatic transmission, comfortable seats, wireless phone charger, and crisp rear view display.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      doors: 5,
      mileage: '20 km/l',
      engine: '1.2L Kappa Petrol',
      horsepower: 83
    },
    features: ['Wireless Phone Charger', 'Rear AC Vents', '8-inch Touchscreen', 'Dual Airbags', 'Rear Parking Camera'],
    pricePerDay: 1600,
    securityDeposit: 3000,
    rentalRequirements: ['Minimum age 21', 'Valid driver license'],
    rating: 4.5,
    numReviews: 19,
    availability: true,
    location: ALL_CITIES
  },
  // 6: Tata Altroz XZ+ (MATCH FOUND: tata_altroz.png)
  {
    brand: 'Tata',
    model: 'Altroz XZ+',
    category: 'City',
    images: [
      '/cars/tata_altroz.png'
    ],
    description: 'India\'s safest 5-star rated premium hatchback. Built on the ALFA architecture, offering rock-solid highway stability, Harman sound system, and comfortable long-distance seating.',
    specifications: {
      transmission: 'Manual',
      fuelType: 'Diesel',
      seats: 5,
      doors: 5,
      mileage: '23 km/l',
      engine: '1.5L Revotorq Diesel',
      horsepower: 110
    },
    features: ['5-Star Global NCAP Rating', 'Harman 8-Speaker Audio', '90-Degree Opening Doors', 'Cruise Control', 'Express Cool'],
    pricePerDay: 2100,
    securityDeposit: 4000,
    rentalRequirements: ['Minimum age 21', 'Valid driver license'],
    rating: 4.6,
    numReviews: 14,
    availability: true,
    location: ALL_CITIES
  },
  // 7: Hyundai i20 N Line (MATCH FOUND: hyundai_i20.png)
  {
    brand: 'Hyundai',
    model: 'i20 N Line',
    category: 'City',
    images: [
      '/cars/hyundai_i20.png'
    ],
    description: 'Sporty hot-hatch with tuned suspension and twin-tip exhaust. Turbocharged petrol engine combined with DCT automatic gearshifts for an exhilarating city drive.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      doors: 5,
      mileage: '20 km/l',
      engine: '1.0L Turbo GDi',
      horsepower: 120
    },
    features: ['Sporty Twin Exhaust', 'Paddle Shifters', 'Bose 7-Speaker Sound System', 'Sunroof', 'Leatherette Seats with Red Stitching'],
    pricePerDay: 2400,
    securityDeposit: 4500,
    rentalRequirements: ['Minimum age 21', 'Valid driver license'],
    rating: 4.8,
    numReviews: 21,
    availability: true,
    location: ALL_CITIES
  },
  // 8: Maruti Suzuki Baleno Alpha (MATCH FOUND: maruti_baleno.png)
  {
    brand: 'Maruti Suzuki',
    model: 'Baleno Alpha',
    category: 'City',
    images: [
      '/cars/maruti_baleno.png'
    ],
    description: 'Spacious premium hatchback with Head-Up Display (HUD) and 360 View Camera. Offers smooth Automatic transmission and supreme rear seat legroom for urban travel.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      doors: 5,
      mileage: '22 km/l',
      engine: '1.2L K-Series DualJet',
      horsepower: 89
    },
    features: ['Head-Up Display', '360-Degree Camera', '9-inch SmartPlay Pro+', 'Rear Fast Charging USB', 'LED DRLs'],
    pricePerDay: 1950,
    securityDeposit: 3500,
    rentalRequirements: ['Minimum age 21', 'Valid driver license'],
    rating: 4.6,
    numReviews: 28,
    availability: true,
    location: ALL_CITIES
  },
  // 9: Honda City ZX (MATCH FOUND: honda_city.png)
  {
    brand: 'Honda',
    model: 'City ZX',
    category: 'Sedan',
    images: [
      '/cars/honda_city.png'
    ],
    description: 'The benchmark executive sedan in India. Features Honda Sensing ADAS, plush leather upholstery, sunroof, and effortless CVT automatic driving dynamics.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      doors: 4,
      mileage: '18 km/l',
      engine: '1.5L i-VTEC Petrol',
      horsepower: 121
    },
    features: ['Honda Sensing ADAS', 'LaneWatch Camera', 'Electric Sunroof', 'Full LED Headlamps', 'Ambient Lighting'],
    pricePerDay: 2800,
    securityDeposit: 5000,
    rentalRequirements: ['Minimum age 21', 'Valid driver license'],
    rating: 4.7,
    numReviews: 26,
    availability: true,
    location: ALL_CITIES
  },
  // 10: Hyundai Verna SX(O) (MATCH FOUND: hyundai_verna.png)
  {
    brand: 'Hyundai',
    model: 'Verna SX(O)',
    category: 'Sedan',
    images: [
      '/cars/hyundai_verna.png'
    ],
    description: 'Futuristic sedan with full-width horizon LED positioning lamps and 1.5 Turbo petrol engine delivering 160 hp. Packed with ventilated front seats and dual screen display.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      doors: 4,
      mileage: '19 km/l',
      engine: '1.5L Turbo GDi',
      horsepower: 160
    },
    features: ['Horizon LED Lightbar', 'Ventilated & Heated Front Seats', 'Level 2 ADAS', 'Bose Premium Audio', 'Switchable Control Display'],
    pricePerDay: 3100,
    securityDeposit: 6000,
    rentalRequirements: ['Minimum age 21', 'Valid driver license'],
    rating: 4.8,
    numReviews: 18,
    availability: true,
    location: ALL_CITIES
  },
  // 11: Skoda Slavia Style (MATCH FOUND: skoda_slavia.png)
  {
    brand: 'Skoda',
    model: 'Slavia Style',
    category: 'Sedan',
    images: [
      '/cars/skoda_slavia.png'
    ],
    description: 'European engineering built for Indian roads. High ground clearance, solid build quality, ventilated front seats, and responsive DSG dual-clutch transmission.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      doors: 4,
      mileage: '18 km/l',
      engine: '1.5L TSI Turbo',
      horsepower: 150
    },
    features: ['DSG Transmission', '179mm Ground Clearance', 'Ventilated Leatherette Seats', 'Digital Cockpit', 'Subwoofer Audio System'],
    pricePerDay: 3300,
    securityDeposit: 6000,
    rentalRequirements: ['Minimum age 21', 'Valid driver license'],
    rating: 4.7,
    numReviews: 15,
    availability: true,
    location: ALL_CITIES
  },
  // 12: Volkswagen Virtus GT (MATCH FOUND: vw_virtus.png)
  {
    brand: 'Volkswagen',
    model: 'Virtus GT',
    category: 'Sedan',
    images: [
      '/cars/vw_virtus.png'
    ],
    description: 'Dynamic performance sedan built on the MQB-A0-IN platform. Features red brake calipers, GT badging, launch control, and class-leading high-speed stability.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      doors: 4,
      mileage: '18 km/l',
      engine: '1.5L TSI EVO',
      horsepower: 150
    },
    features: ['GT Performance Package', 'Digital Cockpit Pro', 'Wireless Android Auto / Apple CarPlay', '521L Boot Space', '6 Airbags'],
    pricePerDay: 3600,
    securityDeposit: 7000,
    rentalRequirements: ['Minimum age 21', 'Valid driver license'],
    rating: 4.9,
    numReviews: 22,
    availability: true,
    location: ALL_CITIES
  },
  // 13: Toyota Camry Hybrid (MATCH FOUND: toyota_camry.png)
  {
    brand: 'Toyota',
    model: 'Camry Hybrid',
    category: 'Sedan',
    images: [
      '/cars/toyota_camry.png'
    ],
    description: 'Executive hybrid luxury sedan combining silent electric drive mode with 2.5L self-charging hybrid engine, rear power-reclining seats, and JBL 9-speaker system.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      seats: 5,
      doors: 4,
      mileage: '23 km/l',
      engine: '2.5L Dynamic Force Hybrid',
      horsepower: 218
    },
    features: ['Rear Reclining Seats', 'JBL Premium Audio', '3-Zone Climate Control', 'HUD Display', '10 Airbags'],
    pricePerDay: 4800,
    securityDeposit: 10000,
    rentalRequirements: ['Minimum age 23', 'Valid driver license', 'Credit card hold'],
    rating: 4.8,
    numReviews: 17,
    availability: true,
    location: ALL_CITIES
  },
  // 14: Hyundai Creta SX(O) (MATCH FOUND: hyundai_creta.png)
  {
    brand: 'Hyundai',
    model: 'Creta SX(O)',
    category: 'SUV',
    images: [
      '/cars/hyundai_creta.png'
    ],
    description: 'India\'s top-selling midsize SUV. High seating position, panoramic sunroof, ventilated front seats, Bose sound system, and smooth automatic transmission.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      doors: 5,
      mileage: '17 km/l',
      engine: '1.5L MPi Petrol',
      horsepower: 115
    },
    features: ['Voice-Enabled Panoramic Sunroof', 'Bose 8-Speaker Sound', 'Ventilated Seats', 'Level 2 ADAS', 'Drive Modes'],
    pricePerDay: 3500,
    securityDeposit: 7000,
    rentalRequirements: ['Minimum age 21', 'Valid driver license'],
    rating: 4.8,
    numReviews: 45,
    availability: true,
    location: ALL_CITIES
  },
  // 15: Kia Seltos GTX+ (MATCH FOUND: kia_seltos.png)
  {
    brand: 'Kia',
    model: 'Seltos GTX+',
    category: 'SUV',
    images: [
      '/cars/kia_seltos.png'
    ],
    description: 'Aggressive styling paired with refined diesel torque. Dual 10.25-inch panoramic screens, 360-degree camera system, and heads-up display.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Diesel',
      seats: 5,
      doors: 5,
      mileage: '19 km/l',
      engine: '1.5L CRDi VGT',
      horsepower: 116
    },
    features: ['Dual 10.25-inch Displays', 'Bose Audio System', '360-Degree Camera', 'Smart Pure Air Purifier', 'All-Wheel Disc Brakes'],
    pricePerDay: 3800,
    securityDeposit: 7500,
    rentalRequirements: ['Minimum age 21', 'Valid driver license'],
    rating: 4.7,
    numReviews: 38,
    availability: true,
    location: ALL_CITIES
  },
  // 16: Tata Harrier Fearless+ (MATCH FOUND: tata_harrier.png)
  {
    brand: 'Tata',
    model: 'Harrier Fearless+',
    category: 'SUV',
    images: [
      '/cars/tata_harrier.png'
    ],
    description: 'Commanding road presence built on Land Rover-derived OMEGAARC platform. Kryotec 2.0L diesel engine delivering 170 hp with terrain response modes.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Diesel',
      seats: 5,
      doors: 5,
      mileage: '16 km/l',
      engine: '2.0L Kryotec Diesel',
      horsepower: 170
    },
    features: ['Land Rover Derived Platform', 'JBL Audio with Subwoofer', 'Panoramic Sunroof', 'Terrain Response Modes', 'Gesture Tailgate'],
    pricePerDay: 4200,
    securityDeposit: 8000,
    rentalRequirements: ['Minimum age 21', 'Valid driver license'],
    rating: 4.8,
    numReviews: 24,
    availability: true,
    location: ALL_CITIES
  },
  // 17: Mahindra XUV700 AX7L (MATCH FOUND: xuv.jpg)
  {
    brand: 'Mahindra',
    model: 'XUV700 AX7L',
    category: 'SUV',
    images: [
      '/cars/xuv.jpg'
    ],
    description: 'Feature-packed 7-seater flagship SUV with mHawk diesel engine delivering 185 hp, Skyroof, Sony 3D Immersive Audio, and Level 2 ADAS safety technology.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Diesel',
      seats: 7,
      doors: 5,
      mileage: '15 km/l',
      engine: '2.2L mHawk Diesel',
      horsepower: 185
    },
    features: ['Sony 3D Immersive 12-Speaker Audio', 'Skyroof (Largest Sunroof)', 'Level 2 ADAS', 'Flush Door Handles', 'Drive Modes (Zip, Zap, Zoom)'],
    pricePerDay: 4900,
    securityDeposit: 10000,
    rentalRequirements: ['Minimum age 23', 'Valid driver license'],
    rating: 4.9,
    numReviews: 31,
    availability: true,
    location: ALL_CITIES
  },
  // 18: Toyota Fortuner Legender (MATCH FOUND: legender.jpg)
  {
    brand: 'Toyota',
    model: 'Fortuner Legender',
    category: 'SUV',
    images: [
      '/cars/legender.jpg'
    ],
    description: 'The undisputed king of Indian SUVs. Featuring 500 Nm torque 2.8L diesel engine, 4x4 off-road capability, dual-tone roof, and unmatched reliability.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Diesel',
      seats: 7,
      doors: 5,
      mileage: '12 km/l',
      engine: '2.8L Turbo Diesel',
      horsepower: 204
    },
    features: ['4x4 High/Low Range', 'JBL 11-Speaker Audio', 'Kick-Sensor Power Back Door', 'Wireless Charging', 'Ventilated Seats'],
    pricePerDay: 5800,
    securityDeposit: 12000,
    rentalRequirements: ['Minimum age 25', 'Valid driving license', 'Credit card hold'],
    rating: 4.9,
    numReviews: 40,
    availability: true,
    location: ALL_CITIES
  },
  // 19: Toyota RAV4 Hybrid (MATCH FOUND: toyota_rav.jpg)
  {
    brand: 'Toyota',
    model: 'RAV4 Hybrid',
    category: 'SUV',
    images: [
      '/cars/toyota_rav.jpg'
    ],
    description: 'Eco-friendly, highly reliable, and immensely spacious. Offers electronic AWD, high fuel efficiency, Toyota Safety Sense, and a massive cargo hold.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      seats: 5,
      doors: 5,
      mileage: '18 km/l',
      engine: '2.5L 4-Cylinder Hybrid',
      horsepower: 219
    },
    features: ['All-Wheel Drive', 'Toyota Safety Sense', 'Touchscreen Infotainment', 'Spacious Cargo', 'Keyless Entry'],
    pricePerDay: 4100,
    securityDeposit: 8000,
    rentalRequirements: ['Minimum age 21', 'Standard driver license'],
    rating: 4.6,
    numReviews: 20,
    availability: true,
    location: ALL_CITIES
  },
  // 20: Mercedes-Benz C-Class C200 (MATCH FOUND: mercedez.webp)
  {
    brand: 'Mercedes-Benz',
    model: 'C-Class C200',
    category: 'Luxury',
    images: [
      '/cars/mercedez.webp'
    ],
    description: 'The "Baby S-Class". Features portrait MBUX central touchscreen display, 64-color ambient lighting, Burmester surround sound, and smooth mild-hybrid engine.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      doors: 4,
      mileage: '14 km/l',
      engine: '1.5L Turbo I4 with EQ Boost',
      horsepower: 204
    },
    features: ['11.9-inch Vertical MBUX Display', 'Burmester Surround Sound', 'Panoramic Sunroof', '64-Color Ambient Lighting', 'Memory Package Seats'],
    pricePerDay: 8500,
    securityDeposit: 18000,
    rentalRequirements: ['Minimum age 25', 'Credit card hold', 'Active premium insurance'],
    rating: 4.8,
    numReviews: 16,
    availability: true,
    location: ALL_CITIES
  },
  // 21: BMW 3 Series Gran Limousine (No matching 3 Series image file in cars/ -> KEEP CURRENT IMAGE)
  {
    brand: 'BMW',
    model: '3 Series Gran Limousine',
    category: 'Luxury',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Long-wheelbase luxury sedan offering extra rear legroom, BMW Curved Display, Harman Kardon surround audio, and legendary 50:50 weight distribution.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      doors: 4,
      mileage: '15 km/l',
      engine: '2.0L TwinPower Turbo I4',
      horsepower: 258
    },
    features: ['BMW Curved Display', 'Extra Rear Legroom', 'Harman Kardon 16-Speaker Audio', 'Panoramic Glass Roof', 'Comfort Access'],
    pricePerDay: 9200,
    securityDeposit: 20000,
    rentalRequirements: ['Minimum age 25', 'Credit card hold'],
    rating: 4.9,
    numReviews: 14,
    availability: true,
    location: ALL_CITIES
  },
  // 22: Volvo XC60 B5 Ultimate (MATCH FOUND: volvo.jpg)
  {
    brand: 'Volvo',
    model: 'XC60 B5 Ultimate',
    category: 'Luxury',
    images: [
      '/cars/volvo.jpg'
    ],
    description: 'Scandinavian luxury SUV with Google built-in infotainment system, Bowers & Wilkins high-fidelity sound, Nappa leather, and advanced air purifier system.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      seats: 5,
      doors: 5,
      mileage: '13 km/l',
      engine: '2.0L Turbo Hybrid',
      horsepower: 250
    },
    features: ['Bowers & Wilkins High Fidelity Audio', 'Google Built-in Services', 'Massage Seats', 'Pilot Assist ADAS', 'CleanZone Air Purifier'],
    pricePerDay: 10500,
    securityDeposit: 22000,
    rentalRequirements: ['Minimum age 25', 'Full coverage insurance'],
    rating: 4.8,
    numReviews: 10,
    availability: true,
    location: ALL_CITIES
  },
  // 23: Tata Nexon EV Max (MATCH FOUND: nexon ev.avif)
  {
    brand: 'Tata',
    model: 'Nexon EV Max',
    category: 'Electric',
    images: [
      '/cars/nexon ev.avif'
    ],
    description: 'India\'s most popular electric SUV. Features a 40.5 kWh battery pack offering up to 453 km range, multi-mode regenerative braking, and fast DC charging support.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Electric',
      seats: 5,
      doors: 5,
      mileage: '453 km range',
      engine: 'Ziptron Electric Motor',
      horsepower: 143
    },
    features: ['453 km ARAI Certified Range', 'Ventilated Front Seats', 'Wireless Smartphone Charger', 'Multi-Regen Modes', 'Electronic Parking Brake'],
    pricePerDay: 2800,
    securityDeposit: 5000,
    rentalRequirements: ['Minimum age 21', 'Valid driver license'],
    rating: 4.6,
    numReviews: 29,
    availability: true,
    location: ALL_CITIES
  },
  // 24: Chevrolet Bolt EV (MATCH FOUND: chevrolet_ev.jpg)
  {
    brand: 'Chevrolet',
    model: 'Bolt EV',
    category: 'Electric',
    images: [
      '/cars/chevrolet_ev.jpg'
    ],
    description: 'Affordable electric driving with surprising utility. Provides 259 miles range, instant torque acceleration, and a spacious hatchback interior.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Electric',
      seats: 5,
      doors: 5,
      mileage: '416 km range',
      engine: 'Electric Motor',
      horsepower: 200
    },
    features: ['One-Pedal Driving', 'Fast Charging Capability', 'Rear Vision Camera', 'Touchscreen Infotainment'],
    pricePerDay: 3200,
    securityDeposit: 6000,
    rentalRequirements: ['Minimum age 21', 'Standard driver license'],
    rating: 4.4,
    numReviews: 11,
    availability: true,
    location: ALL_CITIES
  },
  // 25: Hyundai IONIQ 5 (MATCH FOUND: hyudai_inoq.jpg)
  {
    brand: 'Hyundai',
    model: 'IONIQ 5',
    category: 'Electric',
    images: [
      '/cars/hyudai_inoq.jpg'
    ],
    description: 'Award-winning electric crossover. Combines ultra-fast 800V charging (10% to 80% in 18 mins) with retro-futuristic styling and Vehicle-to-Load (V2L) power output.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Electric',
      seats: 5,
      doors: 5,
      mileage: '631 km range',
      engine: 'Permanent Magnet Synchronous Motor',
      horsepower: 217
    },
    features: ['800V Ultra-Fast Charging', 'Relaxation Front Seats', 'Vehicle-to-Load (V2L)', 'Augmented Reality HUD', 'Vision Roof'],
    pricePerDay: 5500,
    securityDeposit: 12000,
    rentalRequirements: ['Minimum age 21', 'Standard driver license'],
    rating: 4.8,
    numReviews: 10,
    availability: true,
    location: ALL_CITIES
  },
  // 26: BMW M340i xDrive (MATCH FOUND: bmw_m340i.jpg)
  {
    brand: 'BMW',
    model: 'M340i xDrive',
    category: 'Performance',
    images: [
      '/cars/bmw_m340i.jpg'
    ],
    description: 'First locally assembled M Performance car in India. TwinPower Turbo inline-6 producing 387 hp, launching from 0-100 km/h in 4.4 seconds with xDrive AWD stability.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      doors: 4,
      mileage: '11 km/l',
      engine: '3.0L Straight-6 TwinPower Turbo',
      horsepower: 387
    },
    features: ['M Sport Differential', 'Adaptive M Suspension', 'M Sport Exhaust', '0-100 km/h in 4.4s', 'Harman Kardon Audio'],
    pricePerDay: 11500,
    securityDeposit: 25000,
    rentalRequirements: ['Minimum age 25', 'Credit card hold', 'Sports insurance required'],
    rating: 4.9,
    numReviews: 12,
    availability: true,
    location: ALL_CITIES
  },
  // 27: Audi S5 Sportback (MATCH FOUND: 2024-audi-s5-sportback4.avif)
  {
    brand: 'Audi',
    model: 'S5 Sportback',
    category: 'Performance',
    images: [
      '/cars/2024-audi-s5-sportback4.avif'
    ],
    description: 'Sleek 4-door sportback design powered by a 3.0L TFSI V6 engine delivering 354 hp through Quattro permanent all-wheel drive and sport differential.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      doors: 5,
      mileage: '10 km/l',
      engine: '3.0L TFSI V6',
      horsepower: 354
    },
    features: ['Quattro with Sport Differential', 'Bang & Olufsen 3D Sound', 'Matrix LED with Audi Laser Light', 'S Sport Seats with Massage'],
    pricePerDay: 12800,
    securityDeposit: 25000,
    rentalRequirements: ['Minimum age 25', 'Credit card hold'],
    rating: 4.8,
    numReviews: 9,
    availability: true,
    location: ALL_CITIES
  },
  // 28: Jeep Wrangler Rubicon 4xe (MATCH FOUND: jeep wrangler.jpg)
  {
    brand: 'Jeep',
    model: 'Wrangler Rubicon 4xe',
    category: 'Adventure',
    images: [
      '/cars/jeep wrangler.jpg'
    ],
    description: 'The ultimate off-road icon. Heavy-duty Dana 44 axles, Tru-Lok front/rear differential lockers, Rock-Trac 4WD system, and removable doors/roof.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      seats: 5,
      doors: 4,
      mileage: '20 km/l equivalent',
      engine: '2.0L Turbo Hybrid',
      horsepower: 375
    },
    features: ['Removable Roof & Doors', 'Rock-Trac 4WD', 'Dana 44 Axles', 'Alpine Audio System', '33-inch Off-Road Tires'],
    pricePerDay: 6500,
    securityDeposit: 15000,
    rentalRequirements: ['Minimum age 23', 'Standard driver license', 'Credit card payment'],
    rating: 4.7,
    numReviews: 14,
    availability: true,
    location: ALL_CITIES
  },
  // 29: Mahindra Thar LX 4x4 (MATCH FOUND: thar.jpg)
  {
    brand: 'Mahindra',
    model: 'Thar LX 4x4',
    category: 'Adventure',
    images: [
      '/cars/thar.jpg'
    ],
    description: 'India\'s legendary 4x4 off-roader. High-low manual shift transfer case, mechanical locking differential, removable hardtop, and 226mm ground clearance.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Diesel',
      seats: 4,
      doors: 3,
      mileage: '13 km/l',
      engine: '2.2L mHawk 130 Diesel',
      horsepower: 130
    },
    features: ['4x4 Low-Range Transfer Case', 'Mechanical Locking Differential', '650mm Water Wading Capacity', 'Drizzle Resistant Touchscreen', 'Roll Cage'],
    pricePerDay: 3800,
    securityDeposit: 8000,
    rentalRequirements: ['Minimum age 21', 'Valid driver license'],
    rating: 4.9,
    numReviews: 50,
    availability: true,
    location: ALL_CITIES
  },
  // 30: Land Rover Defender 110 (MATCH FOUND: Land Rover Defender 110.jpg)
  {
    brand: 'Land Rover',
    model: 'Defender 110',
    category: 'Adventure',
    images: [
      '/cars/Land Rover Defender 110.jpg'
    ],
    description: 'Unstoppable off-road capability combined with modern luxury. Air suspension with 291mm ground clearance, 900mm water wading capacity, and 3D Surround Camera.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 7,
      doors: 5,
      mileage: '9 km/l',
      engine: '2.0L Turbocharged I4',
      horsepower: 300
    },
    features: ['Electronic Air Suspension', '900mm Water Wading Depth', 'Terrain Response 2', 'ClearSight Ground View Camera', 'Meridian Sound'],
    pricePerDay: 9800,
    securityDeposit: 20000,
    rentalRequirements: ['Minimum age 25', 'Valid driving license', 'Credit card hold'],
    rating: 4.9,
    numReviews: 18,
    availability: true,
    location: ALL_CITIES
  },
  // 31: Toyota Innova Hycross ZX (MATCH FOUND: innova-hycross.avif)
  {
    brand: 'Toyota',
    model: 'Innova Hycross ZX',
    category: 'MPV',
    images: [
      '/cars/innova-hycross.avif'
    ],
    description: 'The ultimate family tourer in India. Self-charging hybrid powertrain, Ottoman captain seats with electric leg rest, panoramic sunroof, and Toyota Safety Sense.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      seats: 7,
      doors: 5,
      mileage: '21 km/l',
      engine: '2.0L TNGA Hybrid',
      horsepower: 186
    },
    features: ['Second-Row Ottoman Captain Chairs', 'JBL 9-Speaker Audio', 'Panoramic Sunroof', 'Powered Tailgate', 'Toyota Safety Sense'],
    pricePerDay: 4500,
    securityDeposit: 9000,
    rentalRequirements: ['Minimum age 21', 'Valid driver license'],
    rating: 4.8,
    numReviews: 35,
    availability: true,
    location: ALL_CITIES
  },
  // 32: Kia Carnival Limousine (MATCH FOUND: kia carnival.avif)
  {
    brand: 'Kia',
    model: 'Carnival Limousine',
    category: 'MPV',
    images: [
      '/cars/kia carnival.avif'
    ],
    description: 'First-class luxury MPV travel. Dual sunroofs, VIP rear seats with Nappa leather upholstery, 10.1-inch dual rear entertainment screens, and electric sliding doors.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Diesel',
      seats: 7,
      doors: 5,
      mileage: '14 km/l',
      engine: '2.2L Smartstream Diesel',
      horsepower: 200
    },
    features: ['Dual Rear Touchscreen Monitors', 'Electric One-Touch Sliding Doors', 'Dual Sunroofs', 'VIP Lounge Seating', 'Tri-Zone Climate Control'],
    pricePerDay: 5200,
    securityDeposit: 10000,
    rentalRequirements: ['Minimum age 23', 'Valid driver license'],
    rating: 4.7,
    numReviews: 22,
    availability: true,
    location: ALL_CITIES
  },
  // 33: Maruti Suzuki Invicto Alpha+ (MATCH FOUND: invicto.avif)
  {
    brand: 'Maruti Suzuki',
    model: 'Invicto Alpha+',
    category: 'MPV',
    images: [
      '/cars/invicto.avif'
    ],
    description: 'Flagship 7-seater hybrid MPV by Maruti Suzuki. Offers silent electric drive mode, 239L boot space with 3rd row up, panoramic sunroof, and 360 view camera.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      seats: 7,
      doors: 5,
      mileage: '21 km/l',
      engine: '2.0L Intelligent Electric Hybrid',
      horsepower: 186
    },
    features: ['Strong Hybrid Technology', 'Panoramic Sunroof', '360 View Camera', 'Powered Driver Seat with Memory', 'Ventilated Front Seats'],
    pricePerDay: 4200,
    securityDeposit: 8000,
    rentalRequirements: ['Minimum age 21', 'Valid driver license'],
    rating: 4.7,
    numReviews: 17,
    availability: true,
    location: ALL_CITIES
  },
  // 34: Lexus ES 300h (MATCH FOUND: lexus_es.jpg)
  {
    brand: 'Lexus',
    model: 'ES 300h',
    category: 'Luxury',
    images: [
      '/cars/lexus_es.jpg'
    ],
    description: 'Refined self-charging hybrid executive sedan delivering whisper-quiet cabin insulation, Mark Levinson Surround Sound, plush Semi-Aniline leather seats, and smooth ride comfort.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      seats: 5,
      doors: 4,
      mileage: '22 km/l',
      engine: '2.5L Hybrid Engine',
      horsepower: 215
    },
    features: ['Mark Levinson 17-Speaker Audio', 'Semi-Aniline Leather Seats', 'Hands-Free Power Trunk', 'Lexus Safety System+', '3-Zone Climate Control'],
    pricePerDay: 7500,
    securityDeposit: 15000,
    rentalRequirements: ['Minimum age 25', 'Valid driving license', 'Credit card hold'],
    rating: 4.9,
    numReviews: 12,
    availability: true,
    location: ALL_CITIES
  },
  // 35: Mahindra Scorpio-N Z8L (Off-Road / Adventure)
  {
    brand: 'Mahindra',
    model: 'Scorpio-N Z8L',
    category: 'Adventure',
    images: [
      '/cars/scorpio_n.jpg'
    ],
    description: 'The Big Daddy of SUVs. Built on an unyielding body-on-frame chassis with 4EXPLOR terrain management system, mHawk diesel power, Sony 3D Immersive audio, and high command seating.',
    specifications: {
      transmission: 'Automatic',
      fuelType: 'Diesel',
      seats: 7,
      doors: 5,
      mileage: '14 km/l',
      engine: '2.2L mHawk Turbo Diesel',
      horsepower: 175
    },
    features: ['4EXPLOR Terrain Management', 'Sony 3D Immersive Audio', 'Sunroof', 'Frequency Dependent Damping', 'Driver Drowsiness Detection'],
    pricePerDay: 4000,
    securityDeposit: 8000,
    rentalRequirements: ['Minimum age 21', 'Valid driving license'],
    rating: 4.8,
    numReviews: 25,
    availability: true,
    location: ALL_CITIES
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database Connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Car.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();
    await Payment.deleteMany();
    await Notification.deleteMany();
    await Contact.deleteMany();

    console.log('Cleared existing collections...');

    // Seed Users
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@torque.com',
      phone: '987-654-3210',
      password: 'admin123',
      role: 'admin',
      profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    });

    const customerUser = new User({
      name: 'John Doe',
      email: 'john@gmail.com',
      phone: '987-654-3210',
      password: 'john123',
      role: 'customer',
      profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    });

    await adminUser.save();
    await customerUser.save();
    console.log('Seeded User credentials successfully.');

    // Seed Cars with deterministic, persistent ObjectIds
    const carsWithFixedIds = carsData.map((car, idx) => ({
      ...car,
      _id: new mongoose.Types.ObjectId(`65801d8050291ee1b16810${idx < 10 ? '0' + idx : idx}`)
    }));
    const seededCars = await Car.insertMany(carsWithFixedIds);
    console.log(`Seeded ${seededCars.length} cars successfully across Indian fleet categories.`);

    // Add realistic demo reviews across all 36 seeded cars
    const sampleReviewTexts = {
      SUV: [
        { rating: 5, comment: 'Incredible ground clearance and command seating posture. Drove with family to Mount Abu and highway performance was smooth and effortless.' },
        { rating: 5, comment: 'Very spacious cabin with great luggage capacity. Car was delivered spotlessly clean.' },
        { rating: 4, comment: 'Rugged build quality and strong engine response on highway overtakes.' },
        { rating: 5, comment: 'Panoramic sunroof and ventilated seats made long-distance driving extremely comfortable.' }
      ],
      Luxury: [
        { rating: 5, comment: 'Supreme cabin insulation and top-tier ride quality. Perfect executive sedan for business travel across Delhi & Gurugram.' },
        { rating: 5, comment: 'Extremely smooth power delivery and premium interior finish. Exceptional rental experience.' },
        { rating: 4, comment: 'Chauffeur-like rear seat comfort with fantastic sound system.' },
        { rating: 5, comment: 'Immaculate vehicle condition. Pickup process took under 3 minutes.' }
      ],
      Performance: [
        { rating: 5, comment: 'Thrilling acceleration and responsive handling around bends. Machine arrived in peak condition.' },
        { rating: 5, comment: 'Unmatched exhaust note and precise steering feedback. Pure driving joy.' },
        { rating: 4, comment: 'Turns heads everywhere. Super clean handover and seamless dropoff.' }
      ],
      Electric: [
        { rating: 5, comment: 'Whisper quiet electric drive with excellent range. Super convenient charging experience and instant torque response.' },
        { rating: 5, comment: 'Futuristic tech suite and smooth single-pedal driving in city traffic.' },
        { rating: 4, comment: 'Great range efficiency and zero noise cabin comfort.' }
      ],
      City: [
        { rating: 5, comment: 'Extremely nimble and easy to park in busy city traffic. Outstanding fuel mileage and smooth gearbox.' },
        { rating: 4, comment: 'Ideal hatchback for local sightseeing around Udaipur lake roads.' },
        { rating: 5, comment: 'Very economical and reliable city runabout.' }
      ],
      Sedan: [
        { rating: 5, comment: 'Comfortable seating for 5 with impressive high-speed stability on expressway.' },
        { rating: 4, comment: 'Smooth automatic transmission and large boot space for luggage.' },
        { rating: 5, comment: 'Pristine interior condition and super responsive engine.' }
      ],
      Adventure: [
        { rating: 5, comment: 'Unstoppable 4x4 capability on rough mountain terrain. Handled rocky trails with total confidence.' },
        { rating: 4, comment: 'Bold styling and sturdy suspension setup.' },
        { rating: 5, comment: 'Memorable road trip machine for exploring offbeat Rajasthan routes.' }
      ],
      MPV: [
        { rating: 5, comment: 'Exceptionally spacious seating for 7 adults with generous luggage room. Perfect vehicle for our long family trip.' },
        { rating: 5, comment: 'Rear captain seats are super comfortable. Fuel efficiency was impressive for a big vehicle.' },
        { rating: 4, comment: 'Smooth highway cruiser with zero driver fatigue.' }
      ]
    };

    const harrierExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Harrier was extremely comfortable and felt very solid on the highway. The vehicle was clean and ready on time.' },
      { name: 'Priya Kapoor', rating: 5, comment: 'Excellent SUV for a family trip. Plenty of space, comfortable seats, and a very smooth overall experience.' },
      { name: 'Rohan Mehta', rating: 5, comment: 'Really enjoyed driving the Harrier. The road presence is impressive and the ride quality was excellent.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The car was in excellent condition and the interior was very comfortable. Perfect for our weekend trip.' },
      { name: 'Vikram Patel', rating: 5, comment: 'Very spacious SUV with a comfortable driving position. The pickup and return process were both smooth.' },
      { name: 'Neha Sharma', rating: 5, comment: 'Loved the premium feel of the Harrier. It was comfortable even during a long highway journey.' },
      { name: 'Aditya Verma', rating: 5, comment: 'The vehicle was clean, well maintained, and enjoyable to drive. Great choice for a longer trip.' },
      { name: 'Sneha Jain', rating: 5, comment: 'Very comfortable family SUV. The cabin felt spacious and the ride was smooth throughout our journey.' },
      { name: 'Rahul Gupta', rating: 5, comment: 'Excellent driving experience. The Harrier felt stable on highways and was surprisingly easy to handle.' },
      { name: 'Kavya Mehta', rating: 5, comment: 'The interior was comfortable and the vehicle looked fantastic. Booking and pickup were hassle-free.' },
      { name: 'Manish Joshi', rating: 5, comment: 'Great SUV for both city and highway driving. The vehicle was delivered in excellent condition.' },
      { name: 'Riya Sharma', rating: 5, comment: 'Very spacious and comfortable. Our family had plenty of room during the entire trip.' },
      { name: 'Karan Singh', rating: 5, comment: 'The Harrier gave us a very premium driving experience. Everything worked properly and the car was clean.' },
      { name: 'Pooja Verma', rating: 5, comment: 'One of the most comfortable SUVs I\'ve rented. The seats were excellent for long-distance travel.' },
      { name: 'Saurabh Patel', rating: 5, comment: 'The ride quality was impressive. The Harrier felt stable and confident on the highway.' },
      { name: 'Nisha Agarwal', rating: 5, comment: 'Excellent vehicle for a family vacation. Spacious cabin and a very comfortable ride.' },
      { name: 'Akash Jain', rating: 5, comment: 'The SUV was clean and ready at the scheduled time. Driving it was a really enjoyable experience.' },
      { name: 'Divya Mehta', rating: 5, comment: 'Loved the overall comfort and premium interior. The car was perfect for our road trip.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Very good SUV with plenty of space. The vehicle handled both city roads and highways comfortably.' },
      { name: 'Tanvi Singh', rating: 5, comment: 'The Harrier was comfortable, spacious, and easy to drive. The entire rental experience was excellent.' },
      { name: 'Yash Patel', rating: 5, comment: 'Fantastic SUV for long journeys. Comfortable seats and excellent highway stability.' },
      { name: 'Isha Verma', rating: 5, comment: 'The car was spotless when we received it. Very comfortable and enjoyable throughout our trip.' },
      { name: 'Rakesh Gupta', rating: 5, comment: 'Strong road presence and a comfortable cabin. Great vehicle for family travel.' },
      { name: 'Simran Kapoor', rating: 5, comment: 'Very impressed with the overall experience. The Harrier felt premium and spacious.' },
      { name: 'Nikhil Sharma', rating: 5, comment: 'Excellent car for a road trip. The ride was comfortable and the vehicle felt very stable.' },
      { name: 'Aditi Jain', rating: 5, comment: 'The interior was clean and spacious. We had a very comfortable journey.' },
      { name: 'Varun Mehta', rating: 5, comment: 'Great SUV with a smooth driving experience. Pickup and return were both quick and easy.' },
      { name: 'Muskan Verma', rating: 5, comment: 'Very comfortable vehicle for family travel. The Harrier handled long-distance driving beautifully.' },
      { name: 'Gaurav Singh', rating: 5, comment: 'The car felt solid and premium. Excellent choice for a weekend road trip.' },
      { name: 'Shreya Patel', rating: 5, comment: 'Loved the spacious cabin and comfortable seats. The vehicle was also very clean.' },
      { name: 'Aman Sharma', rating: 5, comment: 'The Harrier was a pleasure to drive. Very comfortable on highways and easy to control.' },
      { name: 'Pallavi Gupta', rating: 5, comment: 'Excellent family SUV. Plenty of space and a comfortable interior made our journey enjoyable.' },
      { name: 'Raj Mehta', rating: 5, comment: 'Very good rental experience. The vehicle was in excellent condition and ready on time.' },
      { name: 'Komal Singh', rating: 5, comment: 'The Harrier provided a smooth and comfortable ride. Perfect for our long weekend trip.' },
      { name: 'Vivek Patel', rating: 5, comment: 'Very impressive SUV. Comfortable driving position and excellent road stability.' },
      { name: 'Ritu Sharma', rating: 4, comment: 'Really good SUV for long trips. The cabin was comfortable and the vehicle was clean.' },
      { name: 'Deepak Verma', rating: 4, comment: 'Good driving experience and plenty of interior space. Overall, a very satisfying rental.' },
      { name: 'Shivani Jain', rating: 4, comment: 'The Harrier was comfortable and felt very stable. Pickup and return were straightforward.' },
      { name: 'Kunal Mehta', rating: 4, comment: 'Nice vehicle for family travel. Comfortable seats and a spacious cabin.' },
      { name: 'Preeti Singh', rating: 4, comment: 'The vehicle was clean and comfortable. Had a pleasant experience during our trip.' },
      { name: 'Arjun Patel', rating: 4, comment: 'Good SUV with a comfortable ride. The highway experience was particularly enjoyable.' },
      { name: 'Meenal Sharma', rating: 4, comment: 'Spacious and comfortable vehicle. Everything went smoothly during the rental.' },
      { name: 'Sachin Gupta', rating: 4, comment: 'Very good car for long-distance travel. The vehicle was well maintained.' },
      { name: 'Jyoti Verma', rating: 4, comment: 'Comfortable interior and good driving experience. Overall, a reliable rental choice.' },
      { name: 'Harsh Jain', rating: 4, comment: 'The Harrier was clean and comfortable. Good option for a family road trip.' },
      { name: 'Naveen Sharma', rating: 4, comment: 'Nice SUV with good comfort and space. The rental process was easy.' },
      { name: 'Kriti Mehta', rating: 4, comment: 'The vehicle was comfortable and performed well throughout our trip.' },
      { name: 'Rohit Patel', rating: 4, comment: 'Good overall experience. The Harrier felt stable and spacious.' },
      { name: 'Sonal Gupta', rating: 4, comment: 'Comfortable SUV with a premium feel. The car was in good condition when we received it.' },
      { name: 'Manav Singh', rating: 3, comment: 'Overall a good rental experience. The Harrier was comfortable and suitable for our family trip.' }
    ];

    const swiftExplicitReviews = [
      { name: 'Rahul Sharma', rating: 5, comment: 'The Swift was clean, comfortable, and very easy to drive around the city. The pickup process was smooth.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Great experience overall. The car was in excellent condition and perfect for our weekend trip.' },
      { name: 'Arjun Singh', rating: 5, comment: 'Very comfortable for daily driving. Good handling and the interior was well maintained.' },
      { name: 'Neha Jain', rating: 5, comment: 'Really enjoyed driving the Swift. It was easy to park and handled city traffic very well.' },
      { name: 'Karan Patel', rating: 5, comment: 'Smooth rental experience and a clean vehicle. The Swift was comfortable throughout the trip.' },
      { name: 'Ananya Verma', rating: 5, comment: 'Excellent experience. The car looked great and everything worked properly.' },
      { name: 'Rohit Gupta', rating: 5, comment: 'Good car for a family trip. Comfortable seats and a very convenient driving experience.' },
      { name: 'Vivek Joshi', rating: 5, comment: 'The Swift is a practical rental car. Easy to drive, comfortable, and suitable for both city and highway travel.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was clean when I received it. Booking and pickup were both straightforward.' },
      { name: 'Aditya Sharma', rating: 5, comment: 'Very good experience with the Swift ZXi+. Comfortable interior and enjoyable to drive.' },
      { name: 'Manish Agarwal', rating: 5, comment: 'The car was in good condition and felt reliable during the entire rental period.' },
      { name: 'Kavya Singh', rating: 5, comment: 'Perfect size for city travel. Parking was easy and the ride was comfortable.' },
      { name: 'Nikhil Jain', rating: 5, comment: 'Loved the overall driving experience. The vehicle was clean and ready on time.' },
      { name: 'Pooja Sharma', rating: 5, comment: 'Very convenient car for a short trip. The interior was neat and the pickup process was quick.' },
      { name: 'Saurabh Mehta', rating: 5, comment: 'Smooth experience from booking to return. The Swift was comfortable and easy to handle.' },
      { name: 'Riya Gupta', rating: 5, comment: 'The car was exactly as expected. Clean, comfortable, and perfect for our family outing.' },
      { name: 'Aman Verma', rating: 5, comment: 'Good driving experience and a well-maintained vehicle. Would consider renting it again.' },
      { name: 'Deepak Joshi', rating: 5, comment: 'Very easy to drive, especially in busy city areas. The car was delivered in good condition.' },
      { name: 'Simran Kaur', rating: 5, comment: 'Comfortable seats and a pleasant interior. The entire rental experience was hassle-free.' },
      { name: 'Harsh Patel', rating: 5, comment: 'The Swift was a great choice for our trip. Compact, comfortable, and easy to maneuver.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Clean car and smooth handover. Everything went as expected.' },
      { name: 'Isha Mehta', rating: 5, comment: 'Really liked the comfort and handling. It was a great car for our city and highway trip.' },
      { name: 'Varun Singh', rating: 5, comment: 'The vehicle was ready on time and in good condition. Very convenient rental experience.' },
      { name: 'Nandini Jain', rating: 5, comment: 'A comfortable and practical car. The interior was clean and the drive was smooth.' },
      { name: 'Yash Agarwal', rating: 5, comment: 'Good overall experience. The Swift handled traffic easily and was comfortable for longer drives.' },
      { name: 'Tanvi Sharma', rating: 5, comment: 'Very nice rental experience. The car was clean and the booking process was simple.' },
      { name: 'Akash Gupta', rating: 5, comment: 'Comfortable vehicle with easy handling. Perfect for our weekend travel.' },
      { name: 'Shreya Verma', rating: 5, comment: 'The car was in excellent condition and the pickup was quick. Very satisfied with the experience.' },
      { name: 'Rakesh Joshi', rating: 5, comment: 'Good car for everyday use. Comfortable driving position and easy to handle.' },
      { name: 'Muskan Patel', rating: 5, comment: 'Loved the Swift for city driving. It was convenient, clean, and comfortable.' },
      { name: 'Tarun Mehta', rating: 5, comment: 'The rental process was smooth and the vehicle performed well throughout our trip.' },
      { name: 'Aditi Singh', rating: 5, comment: 'Very comfortable car for a small family. The interior was clean and well presented.' },
      { name: 'Raj Verma', rating: 5, comment: 'Easy booking and quick vehicle handover. The Swift was in good condition.' },
      { name: 'Komal Jain', rating: 5, comment: 'Excellent experience overall. The car was comfortable and easy to drive.' },
      { name: 'Vikas Sharma', rating: 4, comment: 'Good rental car with comfortable seats and easy handling. The vehicle was clean when picked up.' },
      { name: 'Ritu Gupta', rating: 4, comment: 'The Swift was comfortable and practical for our trip. Overall, a good experience.' },
      { name: 'Gaurav Patel', rating: 4, comment: 'Nice car for city travel. Easy to park and comfortable for short journeys.' },
      { name: 'Pallavi Mehta', rating: 4, comment: 'The car was clean and the rental process was simple. Had a pleasant experience.' },
      { name: 'Sachin Joshi', rating: 4, comment: 'Good overall vehicle. Comfortable enough for our trip and easy to drive.' },
      { name: 'Meenal Sharma', rating: 4, comment: 'The Swift was in good condition and suitable for our weekend travel. Pickup was smooth.' },
      { name: 'Rohan Verma', rating: 4, comment: 'A practical and comfortable car. Everything went well during the rental.' },
      { name: 'Divya Singh', rating: 4, comment: 'Good driving experience and a clean interior. The car worked well for our trip.' },
      { name: 'Abhishek Jain', rating: 4, comment: 'Comfortable and easy to handle. The rental experience was straightforward.' },
      { name: 'Shivani Patel', rating: 4, comment: 'Nice car for everyday use. The vehicle was clean and ready at the scheduled time.' },
      { name: 'Kunal Mehta', rating: 3, comment: 'The overall experience was good. The car was comfortable and suitable for city driving.' },
      { name: 'Preeti Sharma', rating: 3, comment: 'A decent rental experience. The Swift was easy to drive and the vehicle was reasonably well maintained.' },
      { name: 'Naveen Gupta', rating: 3, comment: 'The car worked well for our short trip. Pickup and return were both fairly smooth.' },
      { name: 'Jyoti Verma', rating: 3, comment: 'Overall a satisfactory experience. The vehicle was comfortable for city travel.' }
    ];

    const tharExplicitReviews = [
      { name: 'Aman Sharma', rating: 5, comment: 'The Thar was fantastic for our weekend road trip. It felt powerful, comfortable, and handled rough roads confidently.' },
      { name: 'Riya Mehta', rating: 5, comment: 'Loved the overall experience. The vehicle was clean, well maintained, and perfect for our trip.' },
      { name: 'Rahul Singh', rating: 5, comment: 'Great SUV for highway and off-road driving. The Thar felt very capable and stable throughout the journey.' },
      { name: 'Neha Verma', rating: 5, comment: 'The car was delivered clean and ready on time. Driving the Thar was definitely the highlight of our trip.' },
      { name: 'Vikram Patel', rating: 5, comment: 'Excellent vehicle for an adventure trip. Plenty of character and very enjoyable to drive.' },
      { name: 'Sneha Jain', rating: 5, comment: 'The Thar was comfortable enough for our long weekend trip and handled uneven roads very well.' },
      { name: 'Arjun Mehta', rating: 5, comment: 'Very impressive SUV. The driving position is great and the vehicle feels extremely solid.' },
      { name: 'Priya Sharma', rating: 5, comment: 'Really enjoyed the Thar. It was clean, comfortable, and performed well on both highways and rough roads.' },
      { name: 'Rohan Gupta', rating: 5, comment: 'Perfect vehicle for a road trip. The Thar gave us a great driving experience throughout.' },
      { name: 'Kavya Singh', rating: 5, comment: 'Excellent rental experience. The vehicle was in great condition and the pickup process was quick.' },
      { name: 'Aditya Verma', rating: 5, comment: 'The Thar is an incredibly fun vehicle to drive. It felt strong and confident on different road surfaces.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Very comfortable for our trip and the vehicle looked amazing. Everything worked as expected.' },
      { name: 'Karan Sharma', rating: 5, comment: 'Loved the road presence of the Thar. It was a great choice for our mountain trip.' },
      { name: 'Ananya Patel', rating: 5, comment: 'The vehicle was clean and well maintained. We had a very enjoyable driving experience.' },
      { name: 'Vivek Jain', rating: 5, comment: 'Excellent SUV for adventurous trips. The Thar handled rough roads without any trouble.' },
      { name: 'Nisha Gupta', rating: 5, comment: 'Really happy with the rental. The car was ready on time and was very comfortable during our journey.' },
      { name: 'Mohit Singh', rating: 5, comment: 'Great experience driving the Thar. It feels strong, stable, and capable.' },
      { name: 'Divya Sharma', rating: 5, comment: 'Perfect car for a weekend getaway. The vehicle was clean and the entire rental process was smooth.' },
      { name: 'Yash Mehta', rating: 5, comment: 'The Thar performed beautifully on highways and uneven roads. Definitely a memorable driving experience.' },
      { name: 'Simran Verma', rating: 5, comment: 'Excellent vehicle for a road trip with friends. Comfortable and extremely fun to drive.' },
      { name: 'Nikhil Patel', rating: 5, comment: 'The SUV was in excellent condition. Very enjoyable to drive and perfect for our travel plans.' },
      { name: 'Isha Jain', rating: 5, comment: 'Loved the experience. The Thar looked great and handled our long journey comfortably.' },
      { name: 'Gaurav Sharma', rating: 5, comment: 'Very capable SUV. We drove through some rough roads and the Thar handled them confidently.' },
      { name: 'Shreya Gupta', rating: 5, comment: 'Great vehicle for an adventure trip. The rental process was easy and the car was clean.' },
      { name: 'Akash Verma', rating: 5, comment: 'The Thar was powerful and enjoyable to drive. It made our road trip much more exciting.' },
      { name: 'Tanvi Singh', rating: 5, comment: 'Excellent experience from pickup to return. The vehicle was clean and performed very well.' },
      { name: 'Rakesh Mehta', rating: 5, comment: 'Perfect SUV for a weekend getaway. Comfortable enough for long drives and very capable on rough roads.' },
      { name: 'Muskan Sharma', rating: 5, comment: 'The car was delivered on time and in excellent condition. Driving it was a lot of fun.' },
      { name: 'Varun Patel', rating: 5, comment: 'Really impressed with the Thar\'s stability and road presence. Great choice for our trip.' },
      { name: 'Aditi Jain', rating: 5, comment: 'Very enjoyable vehicle. The interior was clean and the driving experience was excellent.' },
      { name: 'Saurabh Gupta', rating: 5, comment: 'The Thar was exactly what we needed for our adventure trip. Strong performance and great handling.' },
      { name: 'Komal Sharma', rating: 5, comment: 'Loved the vehicle. It was comfortable, clean, and perfect for our weekend journey.' },
      { name: 'Raj Verma', rating: 5, comment: 'Excellent SUV with a very enjoyable driving experience. The vehicle was well maintained.' },
      { name: 'Pallavi Mehta', rating: 5, comment: 'The Thar made our trip much more memorable. Great vehicle and smooth rental experience.' },
      { name: 'Deepak Singh', rating: 5, comment: 'Very capable SUV. It performed well on highways and rough roads alike.' },
      { name: 'Ritu Patel', rating: 4, comment: 'Great vehicle for a road trip. The Thar was clean and comfortable, and pickup was easy.' },
      { name: 'Kunal Sharma', rating: 4, comment: 'Good overall experience. The vehicle felt strong and handled uneven roads confidently.' },
      { name: 'Meenal Gupta', rating: 4, comment: 'Very enjoyable SUV. It was in good condition and suitable for our weekend travel.' },
      { name: 'Sachin Verma', rating: 4, comment: 'The Thar was comfortable and fun to drive. Overall, a very good rental experience.' },
      { name: 'Jyoti Mehta', rating: 4, comment: 'Good vehicle for an adventure trip. The car was clean and the handover process was smooth.' },
      { name: 'Harsh Patel', rating: 4, comment: 'Nice driving experience and excellent road presence. The vehicle was well maintained.' },
      { name: 'Nandini Sharma', rating: 4, comment: 'The Thar was great for our short trip. Comfortable enough and very enjoyable to drive.' },
      { name: 'Manish Jain', rating: 4, comment: 'Good SUV for highway travel and weekend trips. The rental experience was straightforward.' },
      { name: 'Kriti Verma', rating: 4, comment: 'The vehicle was clean and in good condition. Overall, a pleasant experience.' },
      { name: 'Rohit Singh', rating: 4, comment: 'Very capable and fun SUV. It handled different road conditions well during our trip.' },
      { name: 'Shivani Gupta', rating: 4, comment: 'Good experience overall. The Thar was comfortable and ready when we arrived.' },
      { name: 'Naveen Patel', rating: 4, comment: 'Enjoyable vehicle for road trips. The car performed well throughout our rental.' },
      { name: 'Preeti Sharma', rating: 4, comment: 'The Thar was clean, comfortable, and easy enough to handle. Good choice for a weekend trip.' },
      { name: 'Manav Mehta', rating: 4, comment: 'Very good SUV for adventure travel. The vehicle was in good condition and enjoyable to drive.' },
      { name: 'Sonal Verma', rating: 3, comment: 'Overall a good rental experience. The Thar was fun to drive and suitable for our trip.' }
    ];

    const audiA6ExplicitReviews = [
      { name: 'Rohan Malhotra', rating: 5, comment: 'The A6 was exceptionally comfortable and smooth. The cabin felt premium and the car was spotless at pickup.' },
      { name: 'Ananya Kapoor', rating: 5, comment: 'Excellent car for a long drive. Very comfortable seats and a refined driving experience.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Loved the premium interior and smooth ride. The vehicle was in excellent condition.' },
      { name: 'Priya Mehta', rating: 5, comment: 'The A6 was perfect for our weekend trip. Comfortable, elegant, and very enjoyable to drive.' },
      { name: 'Arjun Khanna', rating: 5, comment: 'Fantastic driving experience. The car felt stable on the highway and the interior was impressive.' },
      { name: 'Neha Agarwal', rating: 5, comment: 'Very comfortable luxury sedan. The vehicle was clean and the pickup process was seamless.' },
      { name: 'Karan Sethi', rating: 5, comment: 'The A6 felt premium from the moment we received it. Smooth ride and excellent overall comfort.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'Beautiful car with a very comfortable cabin. Perfect for our family road trip.' },
      { name: 'Aditya Malhotra', rating: 5, comment: 'Excellent highway experience. The A6 felt composed, quiet, and comfortable throughout the journey.' },
      { name: 'Riya Sharma', rating: 5, comment: 'Really enjoyed the car. Everything was clean and well maintained, and the driving experience was excellent.' },
      { name: 'Rahul Bansal', rating: 5, comment: 'Very refined sedan with a comfortable interior. Great choice for a long-distance rental.' },
      { name: 'Isha Verma', rating: 5, comment: 'The car was delivered on time and in excellent condition. The cabin was spacious and luxurious.' },
      { name: 'Nikhil Arora', rating: 5, comment: 'Smooth and comfortable drive. The A6 made our highway journey extremely relaxing.' },
      { name: 'Pooja Mehra', rating: 5, comment: 'Loved the premium feel of the interior. The entire rental experience was very smooth.' },
      { name: 'Aman Gupta', rating: 5, comment: 'Excellent vehicle for business travel. Comfortable, sophisticated, and easy to drive.' },
      { name: 'Kavya Sinha', rating: 5, comment: 'The A6 was incredibly comfortable during our long trip. The car was also spotless.' },
      { name: 'Vikram Joshi', rating: 5, comment: 'Very impressive sedan. It felt stable and confident on the highway.' },
      { name: 'Simran Kaur', rating: 5, comment: 'Beautiful interior and very smooth driving experience. Definitely enjoyed the trip.' },
      { name: 'Manish Kapoor', rating: 5, comment: 'The vehicle was in excellent condition. Very comfortable for both city and highway driving.' },
      { name: 'Aditi Sharma', rating: 5, comment: 'Premium experience from pickup to return. The A6 was comfortable and enjoyable throughout.' },
      { name: 'Rajiv Mehta', rating: 5, comment: 'Excellent luxury car for a road trip. Very smooth ride and a quiet cabin.' },
      { name: 'Tanvi Malhotra', rating: 5, comment: 'The interior was beautiful and the seats were very comfortable. Great rental experience.' },
      { name: 'Saurabh Jain', rating: 5, comment: 'The A6 handled the highway beautifully. Very stable and comfortable.' },
      { name: 'Shreya Kapoor', rating: 5, comment: 'Really enjoyed driving this car. The vehicle was clean, comfortable, and well maintained.' },
      { name: 'Mohit Arora', rating: 5, comment: 'Great premium sedan. The driving experience was smooth and relaxing.' },
      { name: 'Nandini Gupta', rating: 5, comment: 'Very comfortable car for a family trip. Plenty of cabin space and excellent ride quality.' },
      { name: 'Yash Mehta', rating: 5, comment: 'The A6 was a pleasure to drive. Everything about the rental experience was excellent.' },
      { name: 'Divya Sharma', rating: 5, comment: 'Loved the comfort and premium feel. The vehicle was ready exactly when promised.' },
      { name: 'Akash Kapoor', rating: 5, comment: 'Excellent car for long-distance travel. Smooth, comfortable, and very refined.' },
      { name: 'Meenal Verma', rating: 5, comment: 'The car looked fantastic and drove beautifully. Very happy with the overall experience.' },
      { name: 'Harsh Bansal', rating: 5, comment: 'Very comfortable luxury sedan. The vehicle was clean and performed perfectly during our trip.' },
      { name: 'Komal Mehta', rating: 5, comment: 'The A6 was extremely comfortable and easy to drive. Great choice for a weekend getaway.' },
      { name: 'Rajat Sethi', rating: 5, comment: 'Excellent highway car. The ride was smooth and the cabin was very comfortable.' },
      { name: 'Pallavi Arora', rating: 5, comment: 'Beautiful and comfortable vehicle. Pickup and return were both quick and hassle-free.' },
      { name: 'Kunal Sharma', rating: 5, comment: 'The A6 provided a genuinely premium driving experience. Very impressed with the comfort.' },
      { name: 'Ritu Kapoor', rating: 4, comment: 'Very comfortable sedan and excellent for long journeys. The car was clean and well maintained.' },
      { name: 'Deepak Mehta', rating: 4, comment: 'Good overall experience. The A6 was smooth and comfortable throughout our trip.' },
      { name: 'Shivani Gupta', rating: 4, comment: 'Premium interior and a very pleasant ride. Everything went smoothly with the rental.' },
      { name: 'Sachin Malhotra', rating: 4, comment: 'Great car for highway travel. Comfortable seats and a refined driving experience.' },
      { name: 'Preeti Sharma', rating: 4, comment: 'The vehicle was clean and comfortable. Overall, a very good rental experience.' },
      { name: 'Gaurav Sinha', rating: 4, comment: 'Very nice luxury sedan. The car felt stable and comfortable during our journey.' },
      { name: 'Jyoti Mehra', rating: 4, comment: 'The A6 was comfortable and enjoyable to drive. Good experience overall.' },
      { name: 'Rakesh Kapoor', rating: 4, comment: 'Excellent vehicle for a business trip. Comfortable cabin and smooth highway driving.' },
      { name: 'Kriti Arora', rating: 4, comment: 'The car was in good condition and very comfortable for our weekend travel.' },
      { name: 'Naveen Sharma', rating: 4, comment: 'Good premium rental option. The A6 was smooth and pleasant to drive.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Comfortable interior and good driving experience. The rental process was straightforward.' },
      { name: 'Manav Gupta', rating: 4, comment: 'The A6 was clean and well maintained. Had a pleasant experience during the rental.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'Very comfortable car with a premium feel. Good choice for longer journeys.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Nice driving experience and a comfortable cabin. The vehicle was ready on time.' },
      { name: 'Pankaj Sethi', rating: 3, comment: 'Overall a good experience. The car was comfortable and suitable for our trip.' }
    ];

    const mustangExplicitReviews = [
      { name: 'Aarav Malhotra', rating: 5, comment: 'The Mustang was an incredible experience. The V8 performance and aggressive styling made the entire trip memorable.' },
      { name: 'Riya Kapoor', rating: 5, comment: 'Absolutely loved driving this car. It felt powerful, comfortable, and looked amazing everywhere we went.' },
      { name: 'Kunal Sharma', rating: 5, comment: 'The Mustang GT was a dream to drive. The highway experience was fantastic and the car felt extremely stable.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Beautiful car with an incredible road presence. The interior was comfortable and the driving experience was excellent.' },
      { name: 'Rahul Bansal', rating: 5, comment: 'The V8 sound and acceleration were the highlights. The car was clean and ready exactly on time.' },
      { name: 'Ananya Verma', rating: 5, comment: 'Such a fun car to drive. It felt powerful but remained comfortable during our longer journey.' },
      { name: 'Arjun Khanna', rating: 5, comment: 'The Mustang exceeded expectations. Excellent performance, great handling, and an unforgettable driving experience.' },
      { name: 'Neha Kapoor', rating: 5, comment: 'Loved the premium interior and sporty character. The car was in excellent condition when we picked it up.' },
      { name: 'Vikram Mehta', rating: 5, comment: 'Fantastic performance car. The Mustang felt planted on the highway and was incredibly enjoyable to drive.' },
      { name: 'Sneha Sharma', rating: 5, comment: 'The car looked stunning in person. The entire rental experience was smooth from pickup to return.' },
      { name: 'Rohan Malhotra', rating: 5, comment: 'An amazing car for a special weekend. The V8 made every drive exciting.' },
      { name: 'Kavya Jain', rating: 5, comment: 'Very impressive vehicle. The interior felt premium and the car attracted attention everywhere.' },
      { name: 'Aditya Kapoor', rating: 5, comment: 'The Mustang was incredibly fun to drive. Great performance and a very comfortable cabin.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Perfect choice for a memorable road trip. The car was clean, powerful, and beautifully maintained.' },
      { name: 'Aman Sharma', rating: 5, comment: 'The driving experience was exceptional. The Mustang felt confident and responsive throughout the trip.' },
      { name: 'Isha Verma', rating: 5, comment: 'Loved every moment behind the wheel. The car had an amazing presence and felt very refined.' },
      { name: 'Nikhil Bansal', rating: 5, comment: 'Excellent performance and a beautiful interior. Definitely one of the most enjoyable cars I\'ve rented.' },
      { name: 'Simran Kapoor', rating: 5, comment: 'The Mustang made our weekend trip special. It was comfortable and incredibly exciting to drive.' },
      { name: 'Yash Mehta', rating: 5, comment: 'The V8 performance is something else. The car felt powerful and stable on the highway.' },
      { name: 'Divya Sharma', rating: 5, comment: 'Beautiful muscle car with a premium feel. Pickup was quick and the vehicle was spotless.' },
      { name: 'Raj Malhotra', rating: 5, comment: 'Fantastic experience. The Mustang delivered exactly the kind of performance I was hoping for.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The car looked incredible and was surprisingly comfortable for our long drive.' },
      { name: 'Saurabh Jain', rating: 5, comment: 'Loved the handling and acceleration. The Mustang was easily the highlight of our trip.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'Excellent rental experience. The vehicle was clean, well maintained, and extremely fun to drive.' },
      { name: 'Mohit Verma', rating: 5, comment: 'The Mustang GT is an amazing performance car. Great highway stability and an incredible engine.' },
      { name: 'Aditi Sharma', rating: 5, comment: 'The interior was premium and the exterior looked fantastic. Everything about the rental was smooth.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Powerful, comfortable, and exciting. The Mustang was perfect for our weekend getaway.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The car was in excellent condition. Driving it was a fantastic experience from start to finish.' },
      { name: 'Varun Malhotra', rating: 5, comment: 'Very impressive performance. The Mustang felt confident and responsive during our entire journey.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Absolutely loved the styling and driving experience. It was a memorable rental.' },
      { name: 'Harsh Bansal', rating: 5, comment: 'The Mustang GT delivered an excellent combination of performance and comfort.' },
      { name: 'Komal Verma', rating: 5, comment: 'Beautiful car and very enjoyable to drive. The vehicle was clean and ready on time.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'The V8 performance was incredible. Definitely the right choice for a special road trip.' },
      { name: 'Pallavi Kapoor', rating: 5, comment: 'Premium interior, excellent performance, and an amazing exterior. Had a wonderful experience.' },
      { name: 'Kunal Jain', rating: 5, comment: 'One of the most exciting rental experiences I\'ve had. The Mustang was absolutely fantastic.' },
      { name: 'Ritu Sharma', rating: 4, comment: 'Excellent performance car with a beautiful interior. The vehicle was clean and well maintained.' },
      { name: 'Deepak Mehta', rating: 4, comment: 'Very enjoyable car for a weekend trip. The performance was impressive and the rental process was easy.' },
      { name: 'Shivani Kapoor', rating: 4, comment: 'The Mustang looked amazing and drove beautifully. Overall, a very good experience.' },
      { name: 'Sachin Verma', rating: 4, comment: 'Great performance and excellent road presence. The car was in good condition.' },
      { name: 'Preeti Sharma', rating: 4, comment: 'Really enjoyed the Mustang. It was comfortable enough for our trip and extremely fun to drive.' },
      { name: 'Rakesh Malhotra', rating: 4, comment: 'Powerful and stylish car. The highway driving experience was excellent.' },
      { name: 'Jyoti Mehta', rating: 4, comment: 'The Mustang was clean and enjoyable to drive. Overall, a very memorable experience.' },
      { name: 'Naveen Kapoor', rating: 4, comment: 'Great performance and a premium cabin. The rental process was straightforward.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Loved the styling and performance. The vehicle was ready on time and in good condition.' },
      { name: 'Manav Jain', rating: 4, comment: 'Very exciting car to drive. The Mustang was perfect for our weekend trip.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Excellent road presence and a comfortable interior. Had a great rental experience.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'Beautiful performance car. It was clean, well maintained, and enjoyable throughout the trip.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Really good experience with the Mustang. Great styling and impressive driving performance.' },
      { name: 'Vivek Bansal', rating: 3, comment: 'Overall a very good experience. The Mustang was exciting to drive and perfect for a special trip.' }
    ];

    const hyundaiI20NLineExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'Really fun car to drive. The i20 N Line felt sporty and comfortable throughout our trip.' },
      { name: 'Priya Mehta', rating: 5, comment: 'The car was clean and well maintained. Loved the sporty interior and overall driving experience.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent hatchback for city driving. Easy to handle and very enjoyable on the highway.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The i20 N Line looked fantastic and drove even better. Great choice for our weekend trip.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Very responsive and comfortable car. The sporty character made the drive much more enjoyable.' },
      { name: 'Neha Jain', rating: 5, comment: 'Loved the interior and comfortable seats. The vehicle was spotless when we picked it up.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Great balance between everyday practicality and sporty driving. Had a fantastic experience.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The car was delivered on time and in excellent condition. Very smooth rental experience.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Really enjoyed driving the i20 N Line. It felt agile and confident around city roads.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'A very stylish hatchback with a great driving feel. Perfect for our short road trip.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The sporty styling is impressive. The car was comfortable and fun to drive.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The i20 N Line was clean and easy to handle.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'Great car for someone who wants a little more excitement from a daily driver.' },
      { name: 'Isha Verma', rating: 5, comment: 'Very comfortable for our trip and the sporty interior was a nice touch.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'The car felt responsive and stable. Really enjoyed the overall driving experience.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect size for city traffic and parking. The car was also very clean.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'Excellent hatchback. Smooth driving experience and great styling.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The i20 N Line was a pleasure to drive. Everything went smoothly during the rental.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Loved the sporty feel of the car. It was comfortable enough for our longer journey.' },
      { name: 'Simran Jain', rating: 5, comment: 'Beautiful car with a very nice interior. The pickup process was quick and easy.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Great experience overall. The vehicle felt modern, responsive, and well maintained.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'Very enjoyable car for city and highway travel. The sporty styling really stands out.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'The i20 N Line was exactly what we needed for our weekend trip. Comfortable and fun.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The car was clean and ready on time. Really liked the driving experience.' },
      { name: 'Akash Singh', rating: 5, comment: 'Sporty, comfortable, and easy to drive. One of the better hatchbacks I\'ve rented.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the cabin and overall comfort. The vehicle was in excellent condition.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very responsive car with great road manners. Had a wonderful rental experience.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The i20 N Line looked great and was extremely enjoyable to drive.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Perfect car for a city weekend. Easy to park and still exciting to drive.' },
      { name: 'Aditi Verma', rating: 5, comment: 'Really impressed with the overall quality. The car was clean, comfortable, and stylish.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great hatchback with a sporty personality. The drive was smooth and enjoyable.' },
      { name: 'Komal Singh', rating: 5, comment: 'The interior was comfortable and the car felt very well maintained.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent driving experience. The i20 N Line was perfect for our short trip.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very nice car for both city and highway driving. Had no issues during the rental.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Loved the sporty design and responsive driving. Would definitely choose it again.' },
      { name: 'Ritu Sharma', rating: 4, comment: 'Very good hatchback for everyday use. Comfortable and enjoyable to drive.' },
      { name: 'Deepak Mehta', rating: 4, comment: 'Good overall experience. The vehicle was clean and handled city traffic well.' },
      { name: 'Shivani Kapoor', rating: 4, comment: 'Nice sporty hatchback with a comfortable interior. The rental process was easy.' },
      { name: 'Sachin Verma', rating: 4, comment: 'The i20 N Line was fun to drive and worked well for our weekend trip.' },
      { name: 'Preeti Sharma', rating: 4, comment: 'Good car with attractive styling and comfortable seats. Overall a pleasant experience.' },
      { name: 'Rakesh Jain', rating: 4, comment: 'Very enjoyable city car. The vehicle was clean and ready at pickup.' },
      { name: 'Jyoti Mehta', rating: 4, comment: 'Comfortable and easy to handle. The sporty design is definitely a highlight.' },
      { name: 'Naveen Kapoor', rating: 4, comment: 'Good driving experience and a well-maintained vehicle. Everything went smoothly.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'The car was comfortable and responsive. Great option for a short rental.' },
      { name: 'Manav Singh', rating: 4, comment: 'Nice hatchback with a sporty feel. The vehicle was in good condition.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really liked the overall experience. Comfortable interior and easy city driving.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good combination of practicality and sporty styling. Enjoyed the trip.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The car was clean and comfortable. Very good experience overall.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Nice vehicle for everyday driving. Easy to handle and comfortable on longer journeys.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. The car was comfortable and fun to drive.' }
    ];

    const balenoExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Baleno was clean, comfortable, and perfect for our city trip. Really enjoyed driving it.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Very comfortable hatchback with a premium-looking interior. The rental experience was excellent.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'The car was in excellent condition and handled city traffic very easily.' },
      { name: 'Ananya Singh', rating: 5, comment: 'Loved the Baleno for our weekend trip. It was comfortable, spacious, and easy to drive.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Great everyday car. The interior felt premium and the vehicle was spotless at pickup.' },
      { name: 'Neha Jain', rating: 5, comment: 'Really enjoyed the driving experience. The car was comfortable and very easy to handle.' },
      { name: 'Karan Mehta', rating: 5, comment: 'The Baleno was perfect for our family trip. Plenty of space and a smooth overall experience.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'Excellent rental experience. The car was clean, well maintained, and delivered on time.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Very practical hatchback for city driving. Parking and maneuvering were effortless.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'The interior was comfortable and the car felt modern. Great option for a weekend rental.' },
      { name: 'Aditya Jain', rating: 5, comment: 'Very pleasant car to drive. The Baleno handled both city roads and highways nicely.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Loved the comfortable cabin and smooth driving experience. Everything went perfectly.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'Excellent hatchback for daily travel. The car felt light, responsive, and easy to control.' },
      { name: 'Isha Verma', rating: 5, comment: 'The Baleno was clean and comfortable. It made our family trip very enjoyable.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Good combination of comfort, space, and easy driving. Very happy with the rental.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect size for city travel. The car was also in excellent condition.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'Very comfortable hatchback with a nice interior. Great experience overall.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was ready on time and drove smoothly throughout our trip.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Really liked the Baleno. It was comfortable enough for our long drive and easy to handle.' },
      { name: 'Simran Jain', rating: 5, comment: 'Beautiful and practical car. The entire pickup and return process was smooth.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Great city car with plenty of cabin space. The driving experience was very comfortable.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The Baleno was perfect for our weekend getaway. Clean, comfortable, and economical.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very enjoyable car for both city and highway driving. Had a great experience.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The car was spotless when we received it. Everything worked perfectly.' },
      { name: 'Akash Singh', rating: 5, comment: 'Excellent hatchback. Easy to drive, comfortable seats, and a pleasant interior.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the spacious cabin and overall comfort. Perfect for our family journey.' },
      { name: 'Varun Jain', rating: 5, comment: 'The Baleno felt modern and refined. Had a very pleasant rental experience.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'Very nice car for city travel. The vehicle was clean and well maintained.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Great hatchback for a short trip. Easy parking and comfortable driving.' },
      { name: 'Aditi Verma', rating: 5, comment: 'Really impressed with the overall experience. The car was comfortable and stylish.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'The Baleno was reliable and enjoyable throughout our trip. Excellent rental choice.' },
      { name: 'Komal Singh', rating: 5, comment: 'Very comfortable interior and plenty of space for our luggage.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience. The car was easy to drive and perfect for our city travel.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'The vehicle was in great condition and the entire rental process was hassle-free.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Loved the practicality of the Baleno. Comfortable, spacious, and easy to drive.' },
      { name: 'Ritu Sharma', rating: 4, comment: 'Very good hatchback for everyday use. Comfortable and easy to handle.' },
      { name: 'Deepak Mehta', rating: 4, comment: 'Good overall experience. The vehicle was clean and performed well during our trip.' },
      { name: 'Shivani Kapoor', rating: 4, comment: 'Nice premium hatchback with a comfortable interior. Everything went smoothly.' },
      { name: 'Sachin Verma', rating: 4, comment: 'The Baleno was enjoyable to drive and worked very well for our weekend trip.' },
      { name: 'Preeti Sharma', rating: 4, comment: 'Good car with a spacious cabin and comfortable seats. Overall a pleasant experience.' },
      { name: 'Rakesh Jain', rating: 4, comment: 'Very practical city car. Pickup was quick and the vehicle was in good condition.' },
      { name: 'Jyoti Mehta', rating: 4, comment: 'Comfortable and easy to maneuver. Good choice for city and highway travel.' },
      { name: 'Naveen Kapoor', rating: 4, comment: 'The car was well maintained and gave us a smooth rental experience.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable car for a short trip. The interior was clean and pleasant.' },
      { name: 'Manav Singh', rating: 4, comment: 'Nice hatchback with good space and easy handling. Enjoyed the rental.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really liked the overall experience. The Baleno was comfortable and practical.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good combination of comfort and practicality. The car was ready on time.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and comfortable. Very good experience overall.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Nice car for everyday driving. Easy to handle and comfortable on longer journeys.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. The Baleno was comfortable and suitable for our trip.' }
    ];

    const grandI10NiosExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Grand i10 Nios was perfect for our city trip. Comfortable, easy to drive, and very clean.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Really enjoyed the car. It was comfortable and easy to maneuver through busy city roads.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Great compact hatchback for everyday travel. The vehicle was in excellent condition.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The car was clean, comfortable, and perfect for our weekend trip.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Very smooth and easy to drive. Parking was effortless and the cabin was comfortable.' },
      { name: 'Neha Jain', rating: 5, comment: 'Loved the overall experience. The vehicle was delivered on time and was spotless.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Great car for city driving. Comfortable seats and a very pleasant driving experience.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The Grand i10 Nios was perfect for our family trip. Plenty of comfort for everyone.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Very easy to handle in traffic. The car felt responsive and comfortable.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Excellent rental experience. The vehicle was clean and well maintained.' },
      { name: 'Aditya Jain', rating: 5, comment: 'Nice hatchback with a comfortable cabin. It handled both city roads and highways well.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'The car was ready exactly when promised. Very comfortable for our short trip.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'Great everyday car. Easy steering and compact dimensions made city driving simple.' },
      { name: 'Isha Verma', rating: 5, comment: 'Really liked the interior and overall comfort. Had a smooth rental experience.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Very practical car for city travel. Comfortable and easy to drive.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect car for our weekend getaway. It was clean and performed well.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'The Grand i10 Nios was a pleasure to drive. Very easy to handle.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'Excellent vehicle for daily travel. The rental process was quick and straightforward.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Comfortable hatchback with good visibility. Really enjoyed driving it.' },
      { name: 'Simran Jain', rating: 5, comment: 'The vehicle was in great condition and perfect for our family trip.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Very convenient city car. Easy parking and comfortable seats.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'Loved the smooth driving experience. The car was clean and ready on time.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Good balance of comfort and practicality. Great rental for a weekend.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The car was spotless and very comfortable. Everything went smoothly.' },
      { name: 'Akash Singh', rating: 5, comment: 'Excellent hatchback for city and highway driving. Very easy to handle.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Comfortable interior and good space for a small hatchback. Great experience.' },
      { name: 'Varun Jain', rating: 5, comment: 'The car felt modern and well maintained. Had a very pleasant trip.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'Very nice vehicle for city travel. Comfortable and practical.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Perfect for our short trip. Easy to park and enjoyable to drive.' },
      { name: 'Aditi Verma', rating: 5, comment: 'Really happy with the rental. The vehicle was clean, comfortable, and reliable.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great compact car for everyday use. Very easy to drive.' },
      { name: 'Komal Singh', rating: 5, comment: 'The cabin was comfortable and the car handled city traffic very well.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent rental experience. The car was ready on time and in great condition.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very practical hatchback with a comfortable interior. Enjoyed our trip.' },
      { name: 'Kunal Verma', rating: 5, comment: 'The Grand i10 Nios was exactly what we needed for our city travel.' },
      { name: 'Ritu Sharma', rating: 4, comment: 'Very good hatchback for everyday driving. Comfortable and easy to handle.' },
      { name: 'Deepak Mehta', rating: 4, comment: 'Good overall experience. The vehicle was clean and performed well.' },
      { name: 'Shivani Kapoor', rating: 4, comment: 'Nice compact car with a comfortable interior. The rental process was smooth.' },
      { name: 'Sachin Verma', rating: 4, comment: 'The car was enjoyable to drive and worked perfectly for our weekend trip.' },
      { name: 'Preeti Sharma', rating: 4, comment: 'Good car with comfortable seats and easy handling. Overall a pleasant experience.' },
      { name: 'Rakesh Jain', rating: 4, comment: 'Very practical city car. Pickup was quick and the vehicle was in good condition.' },
      { name: 'Jyoti Mehta', rating: 4, comment: 'Comfortable and easy to maneuver. Good choice for city travel.' },
      { name: 'Naveen Kapoor', rating: 4, comment: 'The car was well maintained and gave us a smooth rental experience.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable for a short trip. The interior was clean and pleasant.' },
      { name: 'Manav Singh', rating: 4, comment: 'Nice hatchback with easy handling. Had a good experience overall.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really liked the compact size and comfortable cabin.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good combination of practicality and comfort. The vehicle was ready on time.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The car was clean and comfortable. Very good rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Nice car for everyday driving. Easy to handle and comfortable on longer journeys.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. The Grand i10 Nios was comfortable and suitable for our trip.' }
    ];

    const teslaPlaidExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'Absolutely incredible car. The acceleration is something I\'ve never experienced in a rental.' },
      { name: 'Priya Mehta', rating: 5, comment: 'The Model S Plaid was extremely comfortable and surprisingly easy to drive around the city.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Fantastic performance and a beautiful interior. Easily one of the most memorable cars I\'ve driven.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The acceleration is unbelievable. The car also felt very refined and comfortable.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'A perfect combination of luxury and performance. The cabin was excellent.' },
      { name: 'Neha Jain', rating: 5, comment: 'Loved the futuristic interior and incredibly smooth electric driving experience.' },
      { name: 'Karan Mehta', rating: 5, comment: 'The Plaid is ridiculously fast but still comfortable enough for everyday driving.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The car was spotless and beautifully maintained. The technology inside was impressive.' },
      { name: 'Rahul Verma', rating: 5, comment: 'One of the best driving experiences I\'ve had. Instant power and excellent stability.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Beautiful, quiet, and incredibly quick. The Model S Plaid exceeded my expectations.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The acceleration feels almost unreal. Great premium experience from pickup to return.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Very comfortable seats and a fantastic cabin. The car felt incredibly modern.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'The performance is on another level. It was also surprisingly practical for a luxury sedan.' },
      { name: 'Isha Verma', rating: 5, comment: 'Loved the smooth ride and premium interior. The touchscreen system was impressive.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Fantastic electric sedan. Powerful, quiet, comfortable, and extremely quick.' },
      { name: 'Riya Singh', rating: 5, comment: 'The Model S Plaid looks amazing in person. Driving it was an unforgettable experience.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'The instant torque makes acceleration incredibly exciting. Everything felt premium.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'Excellent rental experience. The vehicle was clean, charged, and ready on time.' },
      { name: 'Yash Mehta', rating: 5, comment: 'The combination of speed and comfort is impressive. Great car for a special trip.' },
      { name: 'Simran Jain', rating: 5, comment: 'Really enjoyed the quiet cabin and smooth electric power delivery.' },
      { name: 'Aman Sharma', rating: 5, comment: 'One of the most exciting cars I\'ve ever driven. The acceleration is phenomenal.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'Premium interior, smooth ride, and incredible performance. Fantastic experience.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'The handling felt very confident and the power was absolutely incredible.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The car was immaculate at pickup. Everything about the rental felt premium.' },
      { name: 'Akash Singh', rating: 5, comment: 'The Plaid delivers an amazing combination of technology, luxury, and performance.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Very comfortable for a long drive and extremely impressive when you want some excitement.' },
      { name: 'Varun Jain', rating: 5, comment: 'The acceleration is addictive. The car also feels planted and sophisticated.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'Loved the minimalist cabin and smooth electric driving experience.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Fantastic car for a premium weekend rental. The performance is incredible.' },
      { name: 'Aditi Verma', rating: 5, comment: 'Beautiful car with an amazing interior. The entire experience was excellent.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'The Plaid is unbelievably fast while remaining comfortable and refined.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really enjoyed the quiet cabin and responsive controls. Very impressive vehicle.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'One of the most exciting electric cars I\'ve driven. Excellent rental experience.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'The interior felt luxurious and the driving experience was incredibly smooth.' },
      { name: 'Kunal Verma', rating: 5, comment: 'The performance completely exceeded my expectations. An unforgettable rental.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'Extremely comfortable and powerful. The Plaid is a fantastic premium sedan.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Great balance between everyday comfort and extreme performance.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The car felt futuristic and luxurious. Really enjoyed the entire experience.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Amazing acceleration and very smooth handling. Definitely a memorable drive.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was comfortable and quiet, while the performance was absolutely incredible.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Excellent premium rental. The car was clean, charged, and ready when I arrived.' },
      { name: 'Jyoti Mehta', rating: 4, comment: 'Fantastic performance and a beautiful interior. Slightly more attention needed for charging planning.' },
      { name: 'Naveen Kapoor', rating: 4, comment: 'Very impressive car with incredible acceleration. The technology takes some time to get used to.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Loved the performance and comfort. Overall a fantastic experience.' },
      { name: 'Manav Singh', rating: 4, comment: 'Extremely quick and comfortable. Great choice for a special occasion.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Beautiful electric sedan with impressive technology and performance.' },
      { name: 'Aakash Verma', rating: 4, comment: 'The acceleration is incredible and the car feels very premium.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'Excellent driving experience with a quiet and comfortable cabin.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Very impressive performance and a smooth ride. Would definitely rent it again.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Amazing performance, although the extreme acceleration takes some getting used to.' }
    ];

    const kiaSeltosExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Seltos GTX+ was fantastic for our weekend trip. Comfortable, stylish, and very enjoyable to drive.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the premium interior and comfortable seats. The car was spotless when we picked it up.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Great SUV for both city driving and highways. Very comfortable and easy to handle.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The Seltos looked amazing and drove beautifully. Perfect for our family trip.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Excellent combination of comfort, technology, and performance. Had a great rental experience.' },
      { name: 'Neha Jain', rating: 5, comment: 'The cabin felt premium and spacious. The vehicle was clean and well maintained.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Really enjoyed driving the Seltos. Great visibility and a very comfortable driving position.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The car was delivered on time and in excellent condition. Everything worked perfectly.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Very smooth SUV for city traffic. The features and interior quality were impressive.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Perfect vehicle for our road trip. Comfortable seats and plenty of space for luggage.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The Seltos GTX+ felt premium throughout the trip. Really liked the overall driving experience.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience from pickup to return. The SUV was clean and comfortable.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'Great SUV with a strong road presence. Very enjoyable to drive on the highway.' },
      { name: 'Isha Verma', rating: 5, comment: 'Loved the interior design and technology. The car felt modern and well maintained.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Comfortable, stylish, and practical. The Seltos worked perfectly for our trip.' },
      { name: 'Riya Singh', rating: 5, comment: 'Very comfortable SUV for city and highway travel. The cabin had plenty of room.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'Great driving experience and excellent comfort. Would definitely rent the Seltos again.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was spotless and ready on time. Had a very smooth rental experience.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Really liked the premium feel of the cabin. Great car for a long weekend drive.' },
      { name: 'Simran Jain', rating: 5, comment: 'The Seltos was comfortable and easy to drive. Perfect for our family vacation.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent SUV with a very comfortable driving position and modern features.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'Loved the styling and interior. The car was also very clean at pickup.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'The Seltos handled both city roads and highways confidently. Great overall experience.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'Very comfortable vehicle with a premium cabin. Everything about the rental was smooth.' },
      { name: 'Akash Singh', rating: 5, comment: 'Excellent SUV for a road trip. Plenty of space and very comfortable seats.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'The Seltos GTX+ was stylish and practical. Really enjoyed our trip.' },
      { name: 'Varun Jain', rating: 5, comment: 'Great balance between comfort and performance. The SUV felt very refined.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The interior was impressive and the car was easy to drive around the city.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Fantastic rental for a weekend getaway. Comfortable and packed with useful features.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The Seltos was clean, comfortable, and looked fantastic. Very happy with the experience.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Excellent SUV for everyday use and longer trips. The driving experience was very smooth.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the spacious cabin and comfortable seats. Great vehicle overall.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'The car felt premium and well maintained. Perfect for our road trip.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable SUV with plenty of space. Pickup and return were both hassle-free.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Loved the technology and premium interior. The Seltos made our trip much more enjoyable.' },
      { name: 'Ritu Sharma', rating: 4, comment: 'Very good SUV with a comfortable cabin and attractive design. Overall a great experience.' },
      { name: 'Deepak Mehta', rating: 4, comment: 'Good overall experience. The vehicle was clean and performed well during our trip.' },
      { name: 'Shivani Kapoor', rating: 4, comment: 'Nice premium SUV with plenty of comfort. The rental process was smooth.' },
      { name: 'Sachin Verma', rating: 4, comment: 'The Seltos was enjoyable to drive and worked perfectly for our weekend trip.' },
      { name: 'Preeti Sharma', rating: 4, comment: 'Good SUV with comfortable seats and plenty of cabin space. Very pleasant experience.' },
      { name: 'Rakesh Jain', rating: 4, comment: 'Very practical SUV for city and highway driving. The vehicle was in excellent condition.' },
      { name: 'Jyoti Mehta', rating: 4, comment: 'Comfortable and easy to drive. The premium interior was definitely a highlight.' },
      { name: 'Naveen Kapoor', rating: 4, comment: 'The car was well maintained and gave us a smooth rental experience.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable for a long trip. Loved the interior and overall design.' },
      { name: 'Manav Singh', rating: 4, comment: 'Nice SUV with good road presence and comfortable handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really liked the overall experience. The Seltos was comfortable and stylish.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good combination of practicality, comfort, and premium features.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and comfortable. Very good rental experience overall.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Nice SUV for everyday travel and road trips. Easy to drive and comfortable.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. The Seltos was comfortable and suitable for our trip.' }
    ];

    const mahindraXuv700ExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The XUV700 AX7L was incredibly comfortable for our family trip. Plenty of space and a very smooth drive.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the premium cabin and comfortable seats. The SUV was clean and ready right on time.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent SUV for long-distance travel. Very comfortable and confident on the highway.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The XUV700 felt spacious and premium. Perfect choice for our family road trip.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Really impressive SUV. Great comfort, strong road presence, and lots of useful features.' },
      { name: 'Neha Jain', rating: 5, comment: 'The cabin was extremely comfortable and spacious. Everyone enjoyed the trip.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Fantastic highway vehicle. The driving position and road visibility were excellent.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was spotless and beautifully maintained. The rental process was completely hassle-free.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Very comfortable SUV with plenty of room for passengers and luggage. Great for family travel.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the premium feel of the XUV700. It made our long road trip extremely comfortable.' },
      { name: 'Aditya Jain', rating: 5, comment: 'Powerful and comfortable SUV. The highway driving experience was excellent.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'The interior was spacious and modern. Everything was clean and working perfectly.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'Great combination of performance, comfort, and technology. One of the best SUVs I\'ve rented.' },
      { name: 'Isha Verma', rating: 5, comment: 'Very comfortable for a family trip. The large cabin and premium interior were impressive.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'The XUV700 was smooth and powerful. Excellent choice for a long-distance rental.' },
      { name: 'Riya Singh', rating: 5, comment: 'Loved the comfortable seats and spacious cabin. The car was perfect for our vacation.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'Great road presence and excellent driving comfort. Had a fantastic experience.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was delivered clean and on time. Everything about the rental was smooth.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Very impressive SUV. Comfortable on highways and easy enough to handle in the city.' },
      { name: 'Simran Jain', rating: 5, comment: 'The XUV700 was perfect for our family. Plenty of luggage space and very comfortable seats.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent premium SUV. The interior and overall driving experience were fantastic.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'Really enjoyed the trip. The XUV700 felt stable, spacious, and luxurious.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'The SUV handled highways beautifully. Very comfortable even after several hours of driving.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin felt premium and spacious. Great vehicle for a family road trip.' },
      { name: 'Akash Singh', rating: 5, comment: 'Excellent combination of comfort and performance. The XUV700 exceeded my expectations.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the spacious interior and comfortable seating. Perfect for traveling with family.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined SUV with excellent highway manners. Would definitely rent it again.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The interior was beautiful and the vehicle was extremely comfortable.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Fantastic SUV for a weekend getaway. Plenty of space and excellent comfort.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The XUV700 was clean, comfortable, and impressive. Had a wonderful rental experience.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great SUV for long trips. The driving position and overall comfort were excellent.' },
      { name: 'Komal Singh', rating: 5, comment: 'Very spacious cabin with comfortable seats. The vehicle was perfect for our family.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Powerful, spacious, and comfortable. Excellent experience from pickup to return.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'The XUV700 made our road trip much more enjoyable. Plenty of room for everyone.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Loved the premium features and comfortable cabin. Fantastic rental choice.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'Very comfortable SUV with excellent highway stability. Great for longer journeys.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Good combination of power and comfort. The vehicle was in excellent condition.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'Really liked the spacious interior and premium feel. Very enjoyable trip.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Excellent SUV for family travel. Comfortable even during long drives.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was spacious and comfortable. Everything about the rental was excellent.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great road-trip vehicle. Smooth, powerful, and very comfortable.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The XUV700 felt premium and spacious. Had a very pleasant driving experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Well-maintained vehicle with excellent comfort. The highway drive was especially enjoyable.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable SUV with lots of space. Great choice for family trips.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent road presence and comfortable driving experience. Overall very impressive.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Loved the spacious cabin and premium interior. The vehicle was clean and reliable.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good balance of performance, comfort, and practicality. Perfect for a road trip.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The XUV700 was comfortable and well maintained. Very good overall experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Great SUV for everyday use and longer journeys. Plenty of room and very comfortable.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a very good rental experience. The XUV700 was spacious and comfortable.' }
    ];

    const hondaCityExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The City ZX was extremely comfortable and perfect for our weekend trip.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the premium interior and smooth driving experience. The car was spotless.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent sedan for both city driving and highways. Very comfortable.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The City looked elegant and drove beautifully. Great rental experience.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Very refined sedan with a comfortable cabin and excellent driving position.' },
      { name: 'Neha Jain', rating: 5, comment: 'The interior felt premium and the car was extremely clean at pickup.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Great highway cruiser. The City ZX felt stable and comfortable throughout the trip.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'Excellent experience from pickup to return. Everything was smooth.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Very easy to drive in the city and surprisingly comfortable on longer journeys.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the sunroof, comfortable seats, and premium cabin.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The City ZX has a very refined driving experience. Perfect for a family trip.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'The car was well maintained and delivered exactly on time.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'Excellent sedan with great comfort and a spacious interior.' },
      { name: 'Isha Verma', rating: 5, comment: 'Really liked the premium feel and smooth ride. Very enjoyable rental.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'The City ZX was comfortable, elegant, and easy to handle.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect sedan for a weekend getaway. The cabin was very comfortable.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'Great driving experience and excellent highway comfort.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was spotless and ready on time. Had a wonderful experience.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Very smooth and comfortable sedan. Great choice for long-distance travel.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the stylish exterior and premium interior.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent combination of comfort, features, and practicality.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The City ZX was perfect for our family trip. Plenty of comfort for everyone.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very stable on highways and easy to maneuver around the city.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was quiet and comfortable. Really enjoyed the trip.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic sedan for a road trip. Comfortable seats and excellent driving feel.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'The interior felt premium and spacious. Everything was in excellent condition.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined car with a smooth and comfortable ride.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'Loved the sunroof and overall premium experience.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Excellent rental for a weekend trip. Comfortable and stylish.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The City ZX looked fantastic and was very comfortable to drive.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great sedan for everyday use and longer journeys.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the comfortable seats and spacious cabin.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The car was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable sedan with a premium interior. Perfect for our trip.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, refined, and comfortable. Would definitely rent it again.' },
      { name: 'Ritu Sharma', rating: 4, comment: 'Very good sedan for everyday driving. Comfortable and easy to handle.' },
      { name: 'Deepak Mehta', rating: 4, comment: 'Good overall experience. The car was clean and performed well.' },
      { name: 'Shivani Kapoor', rating: 4, comment: 'Nice premium sedan with a comfortable cabin.' },
      { name: 'Sachin Verma', rating: 4, comment: 'The City ZX was enjoyable to drive and worked perfectly for our trip.' },
      { name: 'Preeti Sharma', rating: 4, comment: 'Good sedan with comfortable seats and a pleasant interior.' },
      { name: 'Rakesh Jain', rating: 4, comment: 'Very practical car for city and highway travel.' },
      { name: 'Jyoti Mehta', rating: 4, comment: 'Comfortable and easy to drive. The premium features were a nice bonus.' },
      { name: 'Naveen Kapoor', rating: 4, comment: 'Well-maintained vehicle with a smooth driving experience.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable for a long trip. Loved the interior.' },
      { name: 'Manav Singh', rating: 4, comment: 'Nice sedan with excellent road manners and comfortable handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really liked the overall experience. The City ZX felt premium.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good balance of comfort, style, and practicality.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and comfortable. Very good rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent car for everyday driving and road trips.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. Comfortable and suitable for our trip.' }
    ];

    const hyundaiVernaExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Verna SX(O) was incredibly comfortable and perfect for our weekend trip.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the premium interior and smooth driving experience. The car was spotless.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent sedan for highway driving. Very stable and comfortable.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The Verna looked beautiful and felt very premium inside.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Really impressed by the comfort and technology. Great rental experience.' },
      { name: 'Neha Jain', rating: 5, comment: 'The cabin was spacious and comfortable. Everything was clean at pickup.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Excellent highway cruiser with a very comfortable driving position.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was delivered on time and in excellent condition.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Very smooth sedan for both city traffic and longer journeys.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the premium dashboard and comfortable seats. Fantastic experience.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The Verna SX(O) feels refined and modern. Great car for a road trip.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Everything about the rental was smooth. The car was clean and well maintained.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'Excellent combination of comfort, technology, and stylish design.' },
      { name: 'Isha Verma', rating: 5, comment: 'The interior felt luxurious and the ride was extremely comfortable.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Very refined sedan with excellent highway manners.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect car for our family trip. Plenty of comfort for everyone.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'The driving experience was smooth and enjoyable. Would rent it again.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The car was spotless and ready exactly on time.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Very comfortable sedan with a premium cabin and great road presence.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the modern interior and smooth ride. Excellent experience.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Great combination of premium features and everyday practicality.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The Verna was perfect for our weekend getaway. Comfortable and stylish.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very stable at highway speeds and easy to handle in the city.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was quiet and comfortable. Really enjoyed the journey.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic sedan with a premium driving experience.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the spacious cabin and comfortable seats.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined and well-equipped sedan. Great rental choice.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The technology and interior design were impressive.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Excellent vehicle for a weekend road trip.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The Verna looked fantastic and was extremely comfortable.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great sedan for everyday use and longer journeys.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the comfortable seats and premium cabin.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The vehicle was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable sedan with a stylish and modern interior.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, refined, and packed with useful features.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'Very comfortable sedan with excellent highway stability.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Good balance of comfort, technology, and performance.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The premium interior made the whole trip more enjoyable.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Excellent car for family travel. Comfortable even on longer drives.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was spacious and comfortable. Everything worked perfectly.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great road-trip sedan. Smooth, comfortable, and easy to drive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The Verna felt premium and modern. Had a very pleasant experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Well-maintained vehicle with a smooth driving experience.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable sedan with a premium interior. Great for long trips.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent road presence and comfortable handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really liked the overall experience. The Verna felt sophisticated.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good balance of comfort, style, and practicality.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and comfortable. Very good rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent sedan for everyday driving and highway trips.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. The Verna was comfortable and stylish.' }
    ];

    const skodaSlaviaExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Slavia Style was incredibly comfortable and perfect for our weekend road trip.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the premium cabin and smooth driving experience. The car was spotless.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent sedan for highway driving. Very stable and comfortable.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The Slavia looked elegant and felt very premium inside.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Really impressed by the comfort and spacious interior. Great rental experience.' },
      { name: 'Neha Jain', rating: 5, comment: 'The cabin was comfortable and the vehicle was in excellent condition.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Fantastic highway cruiser. The Slavia felt planted and confident at speed.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was delivered clean and on time. Everything went smoothly.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Very enjoyable sedan for both city driving and longer journeys.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the stylish design and premium-feeling interior.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The Slavia Style feels refined and spacious. Perfect for a family trip.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience. The car was clean and well maintained.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'Great combination of comfort, performance, and elegant styling.' },
      { name: 'Isha Verma', rating: 5, comment: 'The interior felt premium and the ride was extremely comfortable.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Very refined sedan with excellent highway manners.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect car for our weekend getaway. Plenty of space for everyone.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'Great driving experience and excellent long-distance comfort.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The car was spotless and ready exactly when promised.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Very comfortable sedan with excellent road presence.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the modern cabin and smooth ride. Great experience overall.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent combination of comfort and practicality.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The Slavia was perfect for our family trip. Very comfortable.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very stable on highways and easy to handle in the city.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was spacious and comfortable. Really enjoyed the journey.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic sedan for a road trip. Great driving feel.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the spacious cabin and premium interior.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined sedan with excellent road manners.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The interior design and technology were impressive.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Excellent rental for a weekend trip. Comfortable and stylish.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The Slavia looked fantastic and was extremely comfortable.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great sedan for everyday use and longer journeys.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the comfortable seats and spacious cabin.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The car was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable sedan with a premium interior. Perfect for our trip.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, refined, and enjoyable to drive.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'Very comfortable sedan with excellent highway stability.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Good balance of comfort, performance, and practicality.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The premium interior made the whole trip more enjoyable.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Excellent car for family travel. Comfortable even on long drives.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was spacious and comfortable. Everything worked perfectly.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great road-trip sedan. Smooth, comfortable, and easy to drive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The Slavia felt premium and modern. Had a very pleasant experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Well-maintained vehicle with a smooth driving experience.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable sedan with a premium interior. Great for long trips.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent road presence and comfortable handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really liked the overall experience. The Slavia felt sophisticated.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good balance of comfort, style, and practicality.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and comfortable. Very good rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent sedan for everyday driving and highway trips.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. The Slavia was comfortable and stylish.' }
    ];

    const vwVirtusExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Virtus GT was an absolute pleasure to drive. Smooth, powerful, and incredibly comfortable.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the sporty styling and premium interior. The car was spotless at pickup.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Fantastic sedan for a highway trip. The handling felt confident and composed.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The Virtus GT looks amazing in person and feels very premium inside.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Excellent combination of performance, comfort, and stylish design.' },
      { name: 'Neha Jain', rating: 5, comment: 'Really enjoyed the comfortable cabin and smooth driving experience.' },
      { name: 'Karan Mehta', rating: 5, comment: 'The GT was fantastic on the highway. Very stable and enjoyable to drive.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The car was clean, well maintained, and ready exactly on time.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Great balance between sporty performance and everyday comfort.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the premium dashboard, sporty details, and comfortable seats.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The Virtus GT feels refined and powerful. Perfect for a weekend road trip.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience. The vehicle was in fantastic condition.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'Great steering feel and highway stability. Really enjoyed driving it.' },
      { name: 'Isha Verma', rating: 5, comment: 'The interior felt premium and the sporty design made the car even more enjoyable.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Very impressive sedan. Comfortable in the city and exciting on open roads.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect car for our weekend getaway. Comfortable and fun to drive.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'The driving experience was excellent. The GT styling is a great touch.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The car was spotless and delivered on time. Everything went smoothly.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Very stable at highway speeds and surprisingly comfortable for longer drives.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the sporty interior and smooth ride. Great overall experience.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent combination of performance, technology, and comfort.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The Virtus GT was perfect for our road trip. Plenty of comfort and great driving dynamics.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Really impressive handling. The car feels planted and confident.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was comfortable and the sporty design looked fantastic.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic sedan for enthusiasts. Smooth power delivery and excellent road manners.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the spacious cabin and premium finish.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined sedan with an enjoyable driving character.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The GT details and red accents made the interior feel really special.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Excellent rental for a weekend trip. Comfortable and exciting at the same time.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The Virtus GT looked fantastic and was extremely enjoyable to drive.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great sedan for everyday driving with plenty of performance when needed.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the comfortable seats and spacious cabin.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The car was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable sedan with a sporty and premium interior.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, powerful, and fun to drive. Definitely one of my favorite rental cars.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'Very comfortable sedan with excellent highway stability.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Great balance of performance and practicality. Perfect for a road trip.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The sporty interior and comfortable cabin made the journey much more enjoyable.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Excellent car for long-distance travel. Comfortable even after several hours.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was spacious and comfortable. The car felt very premium.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great road-trip sedan. Stable, comfortable, and fun to drive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The Virtus GT felt premium and sporty. Had a fantastic experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Well-maintained vehicle with excellent driving dynamics.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable sedan with a sporty character. Great for longer trips.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent road presence and enjoyable handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really liked the overall experience. The GT felt sophisticated and sporty.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good combination of comfort, style, and performance.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and comfortable. Very good rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent sedan for everyday driving and highway trips.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. The Virtus GT was comfortable and enjoyable to drive.' }
    ];

    const toyotaCamryExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Camry Hybrid was incredibly smooth and comfortable. Perfect for our long road trip.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the premium cabin and quiet driving experience. The car was spotless.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent sedan for highway travel. Very comfortable even after several hours.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The Camry felt luxurious and refined. It was a pleasure to drive.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Very smooth and quiet car with a comfortable interior. Excellent rental experience.' },
      { name: 'Neha Jain', rating: 5, comment: 'The cabin was spacious and premium. The vehicle was in excellent condition.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Fantastic highway cruiser. The ride quality was extremely comfortable.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The car was clean, well maintained, and ready right on time.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Very refined sedan. The hybrid system made city driving incredibly smooth.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the quiet cabin and comfortable seats. Great car for a family trip.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The Camry Hybrid feels premium without being difficult to drive. Fantastic experience.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience from pickup to return. Everything worked perfectly.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'Great combination of comfort, refinement, and smooth performance.' },
      { name: 'Isha Verma', rating: 5, comment: 'The interior felt luxurious and the ride was incredibly smooth.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'One of the most comfortable sedans I\'ve rented. Perfect for long journeys.' },
      { name: 'Riya Singh', rating: 5, comment: 'The Camry was perfect for our family vacation. Plenty of space and excellent comfort.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'Very smooth acceleration and a quiet cabin. Really enjoyable to drive.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was spotless and delivered exactly when promised.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Excellent road-trip car. The ride quality was the highlight.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the premium feel and incredibly quiet driving experience.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Great balance between luxury, comfort, and everyday usability.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The Camry Hybrid made our weekend trip extremely comfortable.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very stable and refined on highways. A fantastic long-distance cruiser.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was spacious and quiet. Really enjoyed the entire journey.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic premium sedan. Comfortable, smooth, and very relaxing to drive.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the spacious cabin and comfortable seating.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined sedan with excellent ride quality.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The interior felt premium and the driving experience was incredibly smooth.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Excellent rental for a weekend getaway. Very comfortable and elegant.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The Camry looked fantastic and was extremely comfortable.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great sedan for both everyday driving and long highway trips.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the comfortable seats and spacious interior.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The car was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable sedan with a premium cabin. Perfect for our trip.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, quiet, and incredibly relaxing to drive.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'The Camry was exceptionally comfortable on the highway.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Excellent combination of comfort, refinement, and efficiency.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The premium interior made the whole journey feel special.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Excellent car for family travel. Comfortable even after hours on the road.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was spacious and quiet. Everything worked perfectly.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great road-trip sedan. Smooth, comfortable, and easy to drive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The Camry felt luxurious and refined. Had a fantastic experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Well-maintained vehicle with an incredibly smooth driving experience.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable sedan with excellent ride quality. Great for long trips.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent comfort and very quiet driving experience.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really liked the overall experience. The Camry felt sophisticated and premium.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good combination of comfort, style, and smooth performance.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and extremely comfortable. Very good rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent sedan for everyday driving and long highway trips.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. The Camry was very comfortable and smooth.' }
    ];

    const rangeRoverSportExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Range Rover Sport was absolutely शानदार. The cabin felt luxurious and the drive was incredibly comfortable.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Beautiful SUV with a fantastic interior. Everything about the rental felt premium.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'The Range Rover Sport was incredibly comfortable and powerful. Perfect for a luxury road trip.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The interior was stunning and the driving experience was exceptionally smooth.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Fantastic combination of luxury, performance, and road presence.' },
      { name: 'Neha Jain', rating: 5, comment: 'The seats were extremely comfortable and the cabin felt beautifully designed.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Amazing SUV for highway travel. Powerful, stable, and incredibly refined.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was spotless and beautifully maintained. A truly premium experience.' },
      { name: 'Rahul Verma', rating: 5, comment: 'One of the most luxurious SUVs I\'ve driven. The ride quality was excellent.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the elegant interior and commanding driving position.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The Range Rover Sport combines luxury and performance perfectly. Fantastic experience.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience. The SUV was clean, comfortable, and ready on time.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'Incredible road presence and excellent handling. Very enjoyable to drive.' },
      { name: 'Isha Verma', rating: 5, comment: 'The cabin felt like a luxury lounge. Absolutely loved the experience.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Powerful, refined, and incredibly comfortable. Perfect luxury SUV.' },
      { name: 'Riya Singh', rating: 5, comment: 'The Range Rover Sport was perfect for our family getaway. Plenty of space and comfort.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'Excellent driving position and smooth performance. Everything felt premium.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was immaculate when we picked it up. Fantastic rental service.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Amazing highway cruiser. The ride was smooth even on a long journey.' },
      { name: 'Simran Jain', rating: 5, comment: 'Absolutely loved the luxurious cabin and comfortable seats.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent combination of power, comfort, and sophisticated design.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The SUV made our weekend trip feel like a luxury vacation.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very stable and confident on the highway. The driving experience was fantastic.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was incredibly comfortable and quiet. Loved every minute of the trip.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic luxury SUV with exceptional road presence.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'The interior was beautiful and the seats were extremely comfortable.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined SUV with excellent handling and comfort.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The technology and premium interior were impressive.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Perfect luxury SUV for a weekend getaway. Comfortable and powerful.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The Range Rover Sport looked incredible and drove even better.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Excellent SUV for long-distance travel. The comfort level was exceptional.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the spacious cabin and luxurious finish.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The SUV was perfectly maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'The Range Rover Sport was incredibly comfortable and sophisticated.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Powerful, smooth, and luxurious. One of the best rental experiences I\'ve had.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'Very comfortable SUV with excellent highway stability.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Amazing balance between luxury and performance.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The premium cabin made the entire journey feel special.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Excellent vehicle for family travel. Plenty of space and outstanding comfort.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was spacious, quiet, and incredibly luxurious.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great road-trip SUV. Powerful, comfortable, and easy to drive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The Range Rover Sport felt truly premium. Had an unforgettable experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Beautifully maintained vehicle with excellent driving dynamics.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Extremely comfortable SUV with a luxurious interior. Great for long journeys.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent road presence and very smooth handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really enjoyed the premium experience. The SUV felt sophisticated and powerful.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Great combination of comfort, style, and performance.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was immaculate and extremely comfortable. Excellent rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Fantastic luxury SUV for highway trips. Very comfortable and refined.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a great rental experience. The Range Rover Sport was powerful and comfortable.' }
    ];

    const tataAltrozExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Altroz XZ+ was perfect for our weekend trip. Comfortable, stylish, and easy to drive.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Really liked the premium interior and comfortable seats. The car was spotless at pickup.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent hatchback for city driving. Very easy to maneuver through traffic.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The Altroz felt spacious and comfortable. Great choice for our family trip.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Very comfortable car with a premium-looking cabin. Had a great rental experience.' },
      { name: 'Neha Jain', rating: 5, comment: 'The vehicle was clean, well maintained, and ready exactly on time.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Really enjoyed driving the Altroz. The cabin felt surprisingly spacious.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'Great city car with comfortable seats and a pleasant interior.' },
      { name: 'Rahul Verma', rating: 5, comment: 'The Altroz was easy to drive and handled city traffic very well.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the interior design and overall comfort. Perfect for a weekend rental.' },
      { name: 'Aditya Jain', rating: 5, comment: 'Very practical hatchback with a comfortable driving position.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience. The car was clean and everything worked perfectly.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'The Altroz felt solid and comfortable. Great for both city and highway travel.' },
      { name: 'Isha Verma', rating: 5, comment: 'Really liked the premium feel of the cabin and the comfortable seats.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Very enjoyable hatchback for everyday driving. Easy to handle and park.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect car for our family trip. Plenty of room for a hatchback.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'The driving experience was smooth and comfortable. Would rent it again.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was spotless when we picked it up. Excellent service.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Very comfortable on longer drives and easy to maneuver around the city.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the stylish exterior and comfortable interior.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Great combination of practicality, comfort, and features.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The Altroz was perfect for our weekend getaway. Very comfortable.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Nice hatchback with good road manners and a comfortable cabin.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The interior was spacious and pleasant. Really enjoyed our trip.' },
      { name: 'Akash Singh', rating: 5, comment: 'Excellent hatchback for everyday use. Very easy to drive.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the comfortable seats and premium-looking dashboard.' },
      { name: 'Varun Jain', rating: 5, comment: 'The Altroz felt refined and well built. Great rental choice.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'Very nice interior and an enjoyable driving experience.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Excellent vehicle for a weekend trip. Comfortable and practical.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The Altroz looked fantastic and was very comfortable.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great hatchback for everyday city driving and occasional highway trips.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the spacious cabin and comfortable seating.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The car was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable hatchback with a premium interior.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, practical, and enjoyable to drive. Great rental experience.' },
      { name: 'Ritu Sharma', rating: 4, comment: 'Very good hatchback for everyday use. Comfortable and easy to handle.' },
      { name: 'Deepak Mehta', rating: 4, comment: 'Good overall experience. The vehicle was clean and performed well.' },
      { name: 'Shivani Kapoor', rating: 4, comment: 'Nice hatchback with a comfortable cabin and attractive design.' },
      { name: 'Sachin Verma', rating: 4, comment: 'The Altroz worked perfectly for our weekend trip.' },
      { name: 'Preeti Sharma', rating: 4, comment: 'Good car with comfortable seats and plenty of useful features.' },
      { name: 'Rakesh Jain', rating: 4, comment: 'Very practical city car. Pickup was quick and the vehicle was in great condition.' },
      { name: 'Jyoti Mehta', rating: 4, comment: 'Comfortable and easy to drive. The interior was a highlight.' },
      { name: 'Naveen Kapoor', rating: 4, comment: 'Well-maintained vehicle with a pleasant driving experience.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable for a short trip. The interior was clean and pleasant.' },
      { name: 'Manav Singh', rating: 4, comment: 'Nice hatchback with good space and easy handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really liked the overall experience. The Altroz felt comfortable and practical.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good combination of comfort, style, and practicality.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and comfortable. Very good rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Nice car for everyday driving. Easy to handle and comfortable.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. The Altroz was comfortable and suitable for our trip.' }
    ];

    const toyotaFortunerLegenderExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Fortuner Legender was fantastic for our road trip. Powerful, spacious, and extremely comfortable.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the premium interior and commanding driving position. The SUV was spotless.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent SUV for highway travel. Very stable and comfortable.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The Legender looks incredible in person. The interior felt premium and spacious.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Amazing combination of power, comfort, and road presence.' },
      { name: 'Neha Jain', rating: 5, comment: 'The ventilated seats made our long journey much more comfortable.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Fantastic highway cruiser. The Legender felt powerful and confident.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was clean, well maintained, and ready right on time.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Very comfortable SUV with plenty of space for passengers and luggage.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the premium cabin and stylish exterior. Perfect for a family trip.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The Legender combines luxury with impressive performance. Great rental experience.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The SUV was in perfect condition.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'Great road presence and very enjoyable to drive.' },
      { name: 'Isha Verma', rating: 5, comment: 'The cabin felt luxurious and the seats were extremely comfortable.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Powerful, spacious, and refined. Perfect SUV for a long trip.' },
      { name: 'Riya Singh', rating: 5, comment: 'The Legender was perfect for our family vacation. Plenty of space.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'Excellent driving position and highway stability.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was immaculate when we picked it up. Great rental service.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Amazing highway cruiser. The ride was comfortable even after several hours.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the premium interior and stylish design.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent combination of performance, comfort, and practicality.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The Legender made our weekend trip feel much more premium.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very stable and confident on highways. Great SUV overall.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was spacious and comfortable. Really enjoyed the trip.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic SUV with excellent road presence and a powerful drive.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the comfortable seats and premium interior.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined SUV with impressive road manners.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The dual-tone interior and ambient lighting looked fantastic.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Excellent vehicle for a weekend getaway. Comfortable and powerful.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The Legender looked incredible and was extremely comfortable.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great SUV for everyday driving and long highway trips.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the spacious cabin and comfortable seating.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The SUV was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable SUV with a premium interior. Perfect for our trip.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Powerful, smooth, and enjoyable to drive. Would definitely rent it again.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'Very comfortable SUV with excellent highway stability.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Great balance of performance, comfort, and premium features.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The premium cabin made the entire journey much more enjoyable.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Excellent vehicle for family travel. Plenty of space and comfort.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was spacious and the seats were extremely comfortable.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great road-trip SUV. Powerful, comfortable, and easy to drive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The Fortuner Legender felt premium and commanding. Fantastic experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Well-maintained vehicle with excellent road presence.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable SUV with a luxurious interior. Great for long trips.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent road presence and comfortable handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really enjoyed the overall experience. The Legender felt sophisticated and powerful.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good combination of comfort, style, and performance.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and extremely comfortable. Very good rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent SUV for everyday driving and highway trips.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. The Legender was spacious, powerful, and comfortable.' }
    ];

    const toyotaRav4ExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The RAV4 Hybrid was incredibly smooth and comfortable. Perfect for our weekend road trip.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the quiet cabin and premium interior. The car was spotless at pickup.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent SUV for highway travel. Very stable and comfortable.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The RAV4 felt spacious, modern, and extremely easy to drive.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Great combination of comfort, practicality, and smooth hybrid performance.' },
      { name: 'Neha Jain', rating: 5, comment: 'The cabin was spacious and comfortable. The vehicle was in excellent condition.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Fantastic highway cruiser. The RAV4 felt stable and refined throughout the trip.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was clean, well maintained, and ready exactly on time.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Very smooth SUV for city driving. The hybrid system made the drive particularly pleasant.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the comfortable seats and quiet cabin. Great choice for a family trip.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The RAV4 Hybrid feels refined and practical. Perfect for a road trip.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience from pickup to return. Everything worked perfectly.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'Great balance between performance, comfort, and everyday practicality.' },
      { name: 'Isha Verma', rating: 5, comment: 'The interior felt modern and comfortable. Really enjoyed the smooth ride.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Very comfortable SUV with excellent road manners.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect vehicle for our family vacation. Plenty of space and excellent comfort.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'The driving experience was smooth and relaxing. Would definitely rent it again.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was spotless and delivered exactly when promised.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Excellent road-trip SUV. Comfortable even after several hours of driving.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the modern interior and incredibly quiet driving experience.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Great combination of efficiency, comfort, and SUV practicality.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The RAV4 Hybrid was perfect for our weekend getaway.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very stable on highways and easy to maneuver around the city.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was spacious and quiet. Really enjoyed the entire journey.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic SUV for a road trip. Smooth and comfortable.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the spacious cabin and comfortable seating.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined SUV with an excellent balance of comfort and practicality.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The technology and modern interior were impressive.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Excellent rental for a weekend getaway. Comfortable and easy to drive.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The RAV4 looked fantastic and was extremely comfortable.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great SUV for everyday use and longer highway trips.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the comfortable seats and spacious cabin.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The vehicle was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable SUV with a modern interior. Perfect for our trip.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, practical, and enjoyable to drive. Great rental experience.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'Very comfortable SUV with excellent highway stability.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Good balance of comfort, efficiency, and performance.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The quiet cabin made the entire journey much more relaxing.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Excellent vehicle for family travel. Plenty of space and comfort.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was spacious and comfortable. Everything worked perfectly.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great road-trip SUV. Smooth, comfortable, and easy to drive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The RAV4 Hybrid felt premium and refined. Had a fantastic experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Well-maintained vehicle with an excellent driving experience.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable SUV with a practical interior. Great for long trips.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent road presence and comfortable handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really liked the overall experience. The RAV4 felt sophisticated and practical.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good combination of comfort, style, and hybrid efficiency.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and comfortable. Very good rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent SUV for everyday driving and highway trips.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. The RAV4 was comfortable and smooth.' }
    ];

    const mercedesC200ExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The C200 was incredibly smooth and comfortable. The interior felt genuinely premium.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the luxurious cabin and ambient lighting. The car was spotless at pickup.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Fantastic sedan for highway trips. Very refined and comfortable.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The C200 looks elegant and feels even better inside. Excellent rental experience.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Beautiful combination of luxury, technology, and driving comfort.' },
      { name: 'Neha Jain', rating: 5, comment: 'The seats were extremely comfortable and the cabin felt very sophisticated.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Excellent highway cruiser. Smooth acceleration and very stable at speed.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was clean, perfectly maintained, and ready on time.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Very refined sedan. The ride quality was the highlight of the trip.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the digital displays and premium interior. Everything felt modern.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The C200 delivers a fantastic balance of performance and comfort.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience from pickup to return. The car was immaculate.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'Great steering feel and smooth automatic transmission. Very enjoyable to drive.' },
      { name: 'Isha Verma', rating: 5, comment: 'The cabin felt like a luxury lounge. Loved the overall experience.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Powerful enough for highways while remaining extremely comfortable in the city.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect luxury sedan for our weekend getaway.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'The driving experience was smooth and effortless. Would definitely rent it again.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The car was spotless and delivered exactly when promised.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Excellent long-distance cruiser. The cabin remained comfortable throughout.' },
      { name: 'Simran Jain', rating: 5, comment: 'The ambient lighting and premium interior made the journey feel special.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent combination of luxury, technology, and everyday practicality.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The C200 was perfect for our family trip. Very comfortable and elegant.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very stable on highways and surprisingly easy to maneuver in the city.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was quiet, comfortable, and beautifully designed.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic premium sedan. Smooth, refined, and enjoyable to drive.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the spacious front seats and premium dashboard.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined car with excellent road manners.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The technology and interior design were impressive.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Excellent luxury rental for a weekend getaway.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The C200 looked fantastic and was extremely comfortable.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great sedan for both everyday driving and long highway journeys.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the comfortable seats and premium cabin.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The car was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable sedan with an elegant and modern interior.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, refined, and luxurious. One of the best rental experiences I\'ve had.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'Very comfortable sedan with excellent highway stability.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Great balance between performance, luxury, and practicality.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The premium cabin made the entire journey much more enjoyable.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Excellent car for long-distance travel. Comfortable even after several hours.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was spacious and everything worked perfectly.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great road-trip sedan. Smooth, comfortable, and easy to drive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The C200 felt genuinely premium. Had a fantastic experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Well-maintained vehicle with excellent driving dynamics.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable luxury sedan. Great choice for longer trips.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent road presence and comfortable handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really enjoyed the overall experience. The C200 felt sophisticated.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good combination of comfort, style, and performance.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and extremely comfortable. Very good rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent sedan for everyday driving and highway trips.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. The C200 was comfortable and refined.' }
    ];

    const hyundaiCretaExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Creta SX(O) was extremely comfortable and perfect for our family road trip.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the premium interior and smooth driving experience. The car was spotless.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent SUV for both city driving and highways. Very comfortable.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The Creta looked fantastic and felt very premium inside.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Great combination of comfort, technology, and practicality.' },
      { name: 'Neha Jain', rating: 5, comment: 'The cabin was spacious and comfortable. Everything was clean at pickup.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Fantastic highway cruiser. The Creta felt stable and confident.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was delivered on time and in excellent condition.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Very easy to drive in the city and comfortable on longer journeys.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the panoramic sunroof and premium cabin. Great experience.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The Creta SX(O) feels refined and well equipped. Perfect for a road trip.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience from pickup to return. Everything worked perfectly.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'Great combination of comfort, features, and road presence.' },
      { name: 'Isha Verma', rating: 5, comment: 'The interior felt luxurious and the seats were extremely comfortable.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Very refined SUV with excellent highway manners.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect vehicle for our family vacation. Plenty of space.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'The driving experience was smooth and enjoyable. Would rent it again.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was spotless and ready exactly when promised.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Excellent SUV for long-distance travel. Very comfortable.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the modern dashboard and premium interior.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent balance of comfort, technology, and everyday practicality.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The Creta was perfect for our weekend getaway.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very stable on highways and easy to maneuver in the city.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was spacious and quiet. Really enjoyed the journey.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic SUV with excellent comfort and road presence.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the comfortable seats and premium-looking interior.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined SUV with plenty of useful features.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The technology and infotainment system were impressive.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Excellent rental for a weekend trip. Comfortable and stylish.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The Creta looked fantastic and was extremely comfortable.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great SUV for everyday driving and longer journeys.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the spacious cabin and comfortable seating.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The vehicle was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable SUV with a premium interior. Perfect for our trip.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, practical, and enjoyable to drive.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'Very comfortable SUV with excellent highway stability.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Great balance of comfort, features, and performance.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The premium cabin made the whole trip more enjoyable.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Excellent vehicle for family travel. Comfortable even on long drives.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was spacious and comfortable. Everything worked perfectly.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great road-trip SUV. Smooth, comfortable, and easy to drive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The Creta SX(O) felt premium and modern. Had a fantastic experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Well-maintained vehicle with an excellent driving experience.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable SUV with a premium interior. Great for long trips.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent road presence and comfortable handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really liked the overall experience. The Creta felt sophisticated and practical.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good combination of comfort, style, and technology.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and comfortable. Very good rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent SUV for everyday driving and highway trips.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. The Creta was comfortable and suitable for our trip.' }
    ];

    const bmw3SeriesGranLimousineExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The 3 Series Gran Limousine was incredibly comfortable. The extra rear-seat space made our trip much more relaxing.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the premium interior and smooth driving experience. The car was spotless.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent luxury sedan for highway travel. Very stable and comfortable.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The Gran Limousine looked elegant and felt extremely premium inside.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Fantastic combination of driving pleasure, comfort, and luxury.' },
      { name: 'Neha Jain', rating: 5, comment: 'The rear seats were surprisingly spacious and comfortable.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Excellent highway cruiser. The handling felt confident and refined.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was clean, well maintained, and ready exactly on time.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Very smooth sedan with an excellent balance between performance and comfort.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the premium cabin and ambient lighting. It felt like a proper luxury car.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The Gran Limousine is perfect for both driving and being driven in.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience from pickup to return. Everything was perfect.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'Great steering feel and impressive highway stability.' },
      { name: 'Isha Verma', rating: 5, comment: 'The cabin felt luxurious and the seats were extremely comfortable.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Powerful, refined, and comfortable. Perfect for a long-distance trip.' },
      { name: 'Riya Singh', rating: 5, comment: 'The spacious rear cabin was perfect for our family trip.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'Fantastic driving experience. The car felt extremely well balanced.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was immaculate when we picked it up. Great service.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Excellent long-distance cruiser. Very comfortable even after several hours.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the premium dashboard and luxurious interior.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent combination of performance, technology, and comfort.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The Gran Limousine made our weekend trip feel much more special.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very stable on highways and enjoyable to drive.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was quiet, spacious, and beautifully designed.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic luxury sedan. Smooth, comfortable, and fun to drive.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the spacious rear seats and premium finish.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined sedan with excellent road manners.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The technology and Harman Kardon sound system were impressive.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Excellent luxury rental for a weekend getaway.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The car looked fantastic and was incredibly comfortable.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great sedan for everyday driving and long highway journeys.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the comfortable seats and spacious cabin.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The car was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable luxury sedan with an elegant interior.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, powerful, and luxurious. One of my favorite rental experiences.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'Very comfortable sedan with excellent highway stability.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Great balance between performance, luxury, and practicality.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The premium cabin made the entire journey much more enjoyable.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Excellent car for family travel. The rear-seat comfort was outstanding.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was spacious and comfortable. Everything worked perfectly.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great road-trip sedan. Smooth, comfortable, and easy to drive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The Gran Limousine felt genuinely premium. Had a fantastic experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Well-maintained vehicle with excellent driving dynamics.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable luxury sedan with impressive rear-seat space.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent road presence and comfortable handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really enjoyed the overall experience. The Gran Limousine felt sophisticated.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good combination of comfort, style, and performance.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and extremely comfortable. Very good rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent sedan for everyday driving and highway trips.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. The Gran Limousine was comfortable and refined.' }
    ];

    const volvoXc60ExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The XC60 B5 Ultimate was incredibly comfortable and refined. Perfect for a long road trip.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the premium Scandinavian interior and comfortable seats.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent luxury SUV. Smooth on highways and very easy to drive.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The XC60 looked elegant and felt incredibly premium inside.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Fantastic combination of comfort, safety, and performance.' },
      { name: 'Neha Jain', rating: 5, comment: 'The seats were extremely comfortable, especially during our long journey.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Very stable and refined on the highway. Excellent driving experience.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was spotless and perfectly maintained at pickup.' },
      { name: 'Rahul Verma', rating: 5, comment: 'One of the most comfortable SUVs I\'ve rented. The cabin was very quiet.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the minimalist interior and premium materials.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The XC60 offers a great balance between luxury and everyday practicality.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience from pickup to return.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'The steering felt precise and the SUV was very comfortable.' },
      { name: 'Isha Verma', rating: 5, comment: 'The interior felt luxurious without being overly complicated.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Smooth, powerful, and extremely comfortable. Perfect premium SUV.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect for our family trip. Plenty of space and excellent comfort.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'The driving experience was smooth and effortless.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The car was immaculate when we picked it up. Fantastic service.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Excellent highway cruiser. Very comfortable even after several hours.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the elegant cabin and comfortable seats.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent combination of luxury, technology, and safety.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The XC60 made our weekend trip feel genuinely premium.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very composed on the highway and easy to maneuver in the city.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was quiet, spacious, and beautifully designed.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic luxury SUV with a very comfortable ride.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the spacious cabin and excellent seat comfort.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined SUV with excellent road manners.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The technology and clean dashboard design were impressive.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Excellent SUV for a weekend getaway. Comfortable and sophisticated.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The XC60 looked beautiful and was extremely comfortable.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great SUV for both city driving and long highway journeys.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the comfortable seats and spacious rear cabin.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The SUV was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable SUV with a premium Scandinavian interior.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, refined, and luxurious. Would definitely rent it again.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'Very comfortable SUV with excellent highway stability.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Great balance between performance, comfort, and practicality.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The premium cabin made the whole journey much more relaxing.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Excellent family SUV. Plenty of space and outstanding comfort.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was spacious, quiet, and extremely comfortable.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great road-trip SUV. Smooth, comfortable, and easy to drive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The XC60 felt genuinely premium. Had a fantastic experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Well-maintained vehicle with excellent driving dynamics.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable luxury SUV. Great for longer journeys.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent road presence and very smooth handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really enjoyed the overall experience. The XC60 felt sophisticated and safe.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good combination of comfort, style, and performance.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and extremely comfortable. Very good rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent SUV for everyday driving and highway trips.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. The XC60 was comfortable, refined, and easy to drive.' }
    ];

    const tataNexonEvExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Nexon EV Max was incredibly smooth and comfortable. Perfect for our city trip.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the quiet cabin and modern interior. The car was spotless at pickup.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent EV for city driving. The instant response made it really enjoyable.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The Nexon EV Max felt spacious, modern, and very easy to drive.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Great combination of comfort, technology, and electric performance.' },
      { name: 'Neha Jain', rating: 5, comment: 'The ventilated seats were a great touch, especially during our trip.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Really smooth acceleration and very easy to maneuver through traffic.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was clean, well maintained, and ready exactly on time.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Very quiet and comfortable. The EV driving experience was excellent.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the premium cabin and easy-to-use controls.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The Nexon EV Max feels refined and practical. Great rental choice.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent experience from pickup to return. Everything worked perfectly.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'The instant torque made city driving really fun.' },
      { name: 'Isha Verma', rating: 5, comment: 'The interior felt comfortable and modern. Really enjoyed the drive.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Smooth, quiet, and responsive. A great electric SUV.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect for our family trip. Plenty of space and excellent comfort.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'The driving experience was effortless and relaxing.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was immaculate when we picked it up.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Excellent urban EV. Very comfortable for daily driving.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the quiet cabin and premium-looking dashboard.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent combination of technology, comfort, and EV performance.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The Nexon EV Max was perfect for our weekend trip.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very responsive and easy to drive around the city.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was comfortable and surprisingly spacious.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic electric SUV with smooth acceleration.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the comfortable seats and modern interior.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined EV with good road manners.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The technology and digital features were impressive.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Excellent rental for a weekend getaway. Smooth and comfortable.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The Nexon EV Max looked great and was extremely easy to drive.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great EV for everyday city driving.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the spacious cabin and comfortable seating.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The car was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable EV with a premium interior.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, quiet, and enjoyable to drive. Great rental experience.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'Very comfortable and easy to handle in traffic.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Great balance of performance, comfort, and technology.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The quiet cabin made the entire journey more relaxing.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Excellent vehicle for family travel. Plenty of space and comfort.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was spacious and everything worked perfectly.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great city EV. Smooth, comfortable, and easy to drive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The Nexon EV Max felt premium and modern. Had a fantastic experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Well-maintained vehicle with an excellent driving experience.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable EV with a practical interior.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent response and very comfortable handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really enjoyed the overall experience. The Nexon EV Max felt refined.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good combination of comfort, style, and electric performance.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and comfortable. Very good rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent EV for everyday driving. Smooth and easy to handle.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. The Nexon EV Max was comfortable and responsive.' }
    ];

    const chevroletBoltEvExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Bolt EV was incredibly smooth and quiet. Perfect for city driving.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the comfortable interior and effortless electric driving experience.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent EV for daily travel. Very easy to drive and maneuver.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The Bolt was comfortable, modern, and surprisingly spacious.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Great combination of practicality, smooth performance, and efficiency.' },
      { name: 'Neha Jain', rating: 5, comment: 'The quiet cabin made the entire journey very relaxing.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Instant acceleration and easy handling made city driving really enjoyable.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The car was clean, well maintained, and ready on time.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Very smooth EV with an excellent driving experience.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the modern dashboard and comfortable seats.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The Bolt EV feels practical and refined. Great rental choice.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent experience from pickup to return. Everything worked perfectly.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'The instant electric response made the car fun to drive.' },
      { name: 'Isha Verma', rating: 5, comment: 'Very quiet and comfortable. Perfect for getting around the city.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Smooth, responsive, and easy to park.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect for our weekend trip. Comfortable and practical.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'The driving experience was effortless and relaxing.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was spotless when we picked it up.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Excellent urban EV. Very comfortable for everyday driving.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved how quiet the Bolt was compared with a conventional car.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Great combination of technology, comfort, and electric performance.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The Bolt EV was perfect for our weekend getaway.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very responsive and easy to maneuver through traffic.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was comfortable and spacious enough for our trip.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic little EV. Smooth acceleration and easy handling.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the comfortable seats and simple interior layout.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined electric car with excellent city manners.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The infotainment and digital features were easy to use.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Excellent rental for a weekend trip. Quiet and comfortable.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The Bolt was easy to drive and felt very modern.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great EV for everyday city driving.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the comfortable cabin and easy controls.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The car was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable EV with a practical interior.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, quiet, and enjoyable to drive.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'Very easy to handle in traffic and comfortable for daily use.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Great balance between performance, comfort, and practicality.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The silent electric drive made the journey much more relaxing.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Excellent vehicle for city and family travel.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was comfortable and everything worked perfectly.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great city EV. Smooth, responsive, and easy to drive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The Bolt EV felt modern and refined. Had a fantastic experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Well-maintained vehicle with an excellent driving experience.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable EV and perfect for city trips.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent response and easy handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really enjoyed the overall experience. Very smooth and quiet.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good combination of comfort, technology, and electric performance.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and comfortable. Very good rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent EV for everyday driving. Easy to handle and park.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. The Bolt EV was comfortable and responsive.' }
    ];

    const hyundaiIoniq5ExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The IONIQ 5 was incredibly smooth and quiet. The futuristic design made the whole experience special.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the spacious cabin and premium interior. The seats were extremely comfortable.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent electric SUV for both city driving and highway trips.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The IONIQ 5 looks futuristic and feels even better inside. Fantastic experience.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Very smooth acceleration and an incredibly quiet cabin.' },
      { name: 'Neha Jain', rating: 5, comment: 'The relaxation seats were perfect for our long journey.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Excellent highway cruiser. Stable, quiet, and very comfortable.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was spotless and perfectly maintained at pickup.' },
      { name: 'Rahul Verma', rating: 5, comment: 'The electric driving experience was effortless and refined.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the futuristic dashboard and spacious interior.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The IONIQ 5 combines technology, comfort, and performance beautifully.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience from pickup to return. Everything worked perfectly.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'Instant electric response made the car really enjoyable to drive.' },
      { name: 'Isha Verma', rating: 5, comment: 'The cabin felt like a modern lounge. Very relaxing.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Smooth, powerful, and extremely comfortable. Great premium EV.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect for our family trip. The interior had plenty of space.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'The driving experience was incredibly smooth and quiet.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The car was immaculate when we picked it up. Excellent service.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Fantastic road-trip EV. Very comfortable even after several hours.' },
      { name: 'Simran Jain', rating: 5, comment: 'The futuristic design and premium cabin were my favorite parts.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent combination of technology, comfort, and electric performance.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The IONIQ 5 made our weekend trip feel genuinely premium.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very stable on highways and surprisingly easy to maneuver in the city.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was incredibly spacious and quiet.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic EV with smooth acceleration and excellent comfort.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the comfortable seats and minimalist interior.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined electric SUV with excellent road manners.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The digital displays and technology were impressive.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Excellent rental for a weekend getaway. Smooth and sophisticated.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The IONIQ 5 looked incredible and was extremely comfortable.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great EV for everyday driving and long journeys.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the spacious cabin and comfortable seating.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The car was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable EV with a premium and futuristic interior.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, quiet, and enjoyable to drive. Would definitely rent it again.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'Very comfortable SUV with excellent highway stability.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Great balance between performance, comfort, and technology.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The quiet cabin made the entire journey much more relaxing.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Excellent family EV. Plenty of space and outstanding comfort.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was spacious and everything worked perfectly.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great road-trip EV. Smooth, comfortable, and easy to drive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The IONIQ 5 felt genuinely premium. Had a fantastic experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Well-maintained vehicle with an excellent driving experience.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable EV with a premium interior. Great for long trips.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent road presence and very smooth handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really enjoyed the overall experience. The IONIQ 5 felt sophisticated and futuristic.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Good combination of comfort, technology, and electric performance.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and extremely comfortable. Very good rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent EV for everyday driving and highway trips.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a good rental experience. The IONIQ 5 was comfortable, smooth, and easy to drive.' }
    ];

    const bmwM340iExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The M340i xDrive was absolutely thrilling to drive. Powerful acceleration and excellent handling.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the premium interior and sporty design. The car felt incredibly refined.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Fantastic performance sedan. The xDrive system gave it excellent confidence on the highway.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The M340i looks aggressive and feels even better behind the wheel.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Amazing combination of luxury, performance, and everyday usability.' },
      { name: 'Neha Jain', rating: 5, comment: 'The seats were comfortable and the cabin felt genuinely premium.' },
      { name: 'Karan Mehta', rating: 5, comment: 'The acceleration was incredible. Easily one of the most exciting cars I\'ve rented.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The car was spotless and perfectly maintained at pickup.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Excellent handling and a fantastic engine note. Really enjoyable to drive.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the sporty interior, digital displays, and premium materials.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The M340i delivers serious performance without sacrificing comfort.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience from pickup to return. The vehicle was immaculate.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'The steering felt precise and the car stayed planted through corners.' },
      { name: 'Isha Verma', rating: 5, comment: 'A perfect combination of a luxury sedan and a performance car.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Powerful, responsive, and incredibly smooth. Fantastic driving experience.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect for our weekend getaway. Comfortable when cruising and exciting when pushed.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'The acceleration is seriously impressive. Would definitely rent it again.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was in excellent condition and delivered right on time.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Excellent highway cruiser with impressive stability and effortless power.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the sporty cabin and premium BMW feel.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent balance of performance, technology, and comfort.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The M340i made our weekend trip incredibly memorable.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very confident through corners and extremely stable at highway speeds.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was quiet and comfortable when cruising.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic performance sedan. The acceleration is addictive.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the comfortable seats and sporty steering wheel.' },
      { name: 'Varun Jain', rating: 5, comment: 'The M Sport suspension makes the car feel incredibly composed.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The digital cockpit and infotainment system were excellent.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Perfect luxury performance car for a weekend rental.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The M340i looked incredible and drove even better.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great combination of everyday comfort and serious performance.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the premium cabin and excellent driving position.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The car was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable for normal driving but incredibly exciting in Sport mode.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, powerful, and incredibly fun to drive.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'The M340i was surprisingly comfortable for everyday driving.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Excellent balance between luxury, performance, and technology.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The premium interior and sporty atmosphere made the trip special.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Fantastic car for a road trip. Comfortable on highways and exciting on open roads.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'Everything about the car felt premium and well engineered.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Excellent performance sedan. Smooth, fast, and easy to control.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The M340i xDrive felt genuinely special. Had an unforgettable experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Excellent driving dynamics and impressive road presence.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable and powerful. Great choice for a long trip.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent handling and strong acceleration.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really enjoyed the overall experience. The M340i feels sophisticated and sporty.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Great combination of comfort, style, and performance.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean, comfortable, and incredibly enjoyable to drive.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent performance car that remains comfortable for everyday driving.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a very good rental experience. The M340i was powerful, comfortable, and fun.' }
    ];

    const audiS5SportbackExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The S5 Sportback was incredibly fast and smooth. An amazing combination of luxury and performance.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the premium interior and sporty design. The car felt special from the moment I started it.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Fantastic performance car. The quattro system gave excellent confidence on the highway.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The S5 looks stunning and feels even better behind the wheel.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Amazing combination of power, comfort, and everyday practicality.' },
      { name: 'Neha Jain', rating: 5, comment: 'The sports seats were comfortable and the cabin felt genuinely premium.' },
      { name: 'Karan Mehta', rating: 5, comment: 'The acceleration was incredible. One of the most exciting cars I\'ve rented.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was spotless and perfectly maintained at pickup.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Excellent handling and impressive power delivery. Really enjoyable to drive.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the sporty interior, digital cockpit, and premium materials.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The S5 delivers serious performance without sacrificing comfort.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience from pickup to return. Everything was perfect.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'The steering felt precise and the car stayed planted through corners.' },
      { name: 'Isha Verma', rating: 5, comment: 'A perfect mix of a luxury sedan and a performance car.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Powerful, responsive, and incredibly smooth. Fantastic driving experience.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect for our weekend getaway. Comfortable during cruising and thrilling when accelerating.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'The V6 engine is seriously impressive. Would definitely rent it again.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was immaculate and delivered right on time.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Excellent highway cruiser with effortless power and stability.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the premium cabin and sporty atmosphere.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent balance of performance, technology, and comfort.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The S5 made our weekend trip incredibly memorable.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very confident through corners and extremely stable at highway speeds.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was quiet and comfortable when cruising.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic performance sedan. Smooth acceleration and excellent handling.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the comfortable sports seats and flat-bottom steering wheel.' },
      { name: 'Varun Jain', rating: 5, comment: 'The quattro system made the car feel incredibly composed.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The digital cockpit and infotainment system were excellent.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Perfect luxury performance car for a weekend rental.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The S5 looked incredible and drove even better.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great combination of everyday comfort and serious performance.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the premium cabin and excellent driving position.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The car was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable for normal driving but incredibly exciting when pushed.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, powerful, and incredibly fun to drive.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'The S5 was surprisingly comfortable for everyday driving.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Excellent balance between luxury, performance, and technology.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The premium interior made the entire journey feel special.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Fantastic car for a road trip. Comfortable on highways and exciting on open roads.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'Everything about the car felt premium and well engineered.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Excellent performance car. Smooth, fast, and easy to control.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The S5 Sportback felt genuinely special. Had an unforgettable experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Well-maintained vehicle with an excellent driving experience.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable and powerful. Great choice for a long trip.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent handling and strong acceleration.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really enjoyed the overall experience. The S5 feels sophisticated and sporty.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Great combination of comfort, style, and performance.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean, comfortable, and incredibly enjoyable to drive.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent performance car that remains comfortable for everyday driving.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a very good rental experience. The S5 was powerful, comfortable, and fun.' }
    ];

    const jeepWranglerExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Wrangler Rubicon 4xe was an incredible experience. It feels rugged but surprisingly comfortable.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the iconic design and premium interior. The 4xe powertrain was smooth and responsive.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Fantastic SUV for an adventure trip. The Rubicon feels extremely capable.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The Wrangler looks amazing in person and was really fun to drive.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Great combination of off-road capability, technology, and everyday comfort.' },
      { name: 'Neha Jain', rating: 5, comment: 'The seats were comfortable and the cabin felt much more premium than expected.' },
      { name: 'Karan Mehta', rating: 5, comment: 'The electric assistance made acceleration smooth and surprisingly quick.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was spotless and perfectly maintained at pickup.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Excellent SUV for a road trip. The Wrangler handled rough roads confidently.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the rugged dashboard and modern technology.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The Rubicon 4xe offers an amazing balance of adventure and modern driving.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience from pickup to return. The Jeep was in perfect condition.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'The 4xe powertrain gives the Wrangler a very responsive feel.' },
      { name: 'Isha Verma', rating: 5, comment: 'Such a fun SUV. The high driving position gives you an excellent view.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Powerful, rugged, and surprisingly comfortable.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect for our weekend adventure. Plenty of space for everyone.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'The Wrangler was incredibly enjoyable on rough roads and trails.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was immaculate when we picked it up. Great service.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Excellent adventure vehicle. It handled highways and rough roads confidently.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the rugged styling and removable-roof experience.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent combination of off-road capability, technology, and performance.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The Wrangler made our weekend trip incredibly memorable.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very capable off-road and surprisingly comfortable on highways.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was comfortable and the elevated seating position was great.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic SUV for adventure lovers. The Rubicon badge is well deserved.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the comfortable seats and rugged interior design.' },
      { name: 'Varun Jain', rating: 5, comment: 'The off-road capability was the highlight of the entire rental.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The technology and infotainment features were easy to use.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Perfect adventure SUV for a weekend rental.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The Wrangler looked incredible and was extremely fun to drive.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great combination of everyday usability and serious off-road ability.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the spacious cabin and commanding driving position.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The Jeep was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable for normal driving and incredibly capable off-road.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, powerful, and adventurous. Would definitely rent it again.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'The Wrangler was comfortable enough for a long highway journey.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Great balance between adventure, performance, and modern features.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The rugged styling made every part of the trip more exciting.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Fantastic vehicle for an outdoor trip. Plenty of space and excellent capability.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was comfortable and all the controls were easy to understand.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great adventure SUV. Capable, comfortable, and extremely fun.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The Wrangler Rubicon 4xe felt genuinely special. Had an unforgettable experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Excellent off-road performance and impressive road presence.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very capable and comfortable. Great choice for an adventure trip.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent off-road ability and strong performance.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really enjoyed the overall experience. The Wrangler feels rugged and unique.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Great combination of adventure, style, and hybrid performance.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean, comfortable, and incredibly enjoyable to drive.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent SUV for road trips and outdoor adventures.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a very good rental experience. The Wrangler was fun, capable, and comfortable.' }
    ];

    const landRoverDefenderExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Defender 110 was incredibly comfortable and felt unstoppable on rough roads.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the premium interior and commanding driving position. A fantastic SUV.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent vehicle for long road trips. Comfortable, spacious, and capable.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The Defender looks amazing and feels incredibly solid on the road.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Fantastic combination of luxury, off-road ability, and everyday comfort.' },
      { name: 'Neha Jain', rating: 5, comment: 'The seats were extremely comfortable, even after several hours of driving.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Very capable SUV. It handled rough terrain with impressive confidence.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was spotless and perfectly maintained at pickup.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Excellent road-trip SUV. Plenty of space and a very comfortable ride.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the modern dashboard and premium materials throughout the cabin.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The Defender 110 offers a great balance between luxury and adventure.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience from pickup to return. The vehicle was immaculate.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'The elevated driving position gives you excellent visibility.' },
      { name: 'Isha Verma', rating: 5, comment: 'The interior felt luxurious while still retaining the Defender\'s rugged character.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Powerful, comfortable, and incredibly capable.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect for our family vacation. The cabin had plenty of room.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'The Defender was fantastic on both highways and rough roads.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was immaculate when we picked it up. Great service.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Excellent adventure vehicle. It handled every road we took confidently.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the rugged styling combined with the premium interior.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent combination of technology, comfort, and off-road capability.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The Defender made our weekend trip incredibly memorable.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very capable off-road and surprisingly comfortable on highways.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was spacious, quiet, and beautifully designed.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic SUV for adventure lovers. The road presence is incredible.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the comfortable seats and practical interior.' },
      { name: 'Varun Jain', rating: 5, comment: 'The off-road capability was the highlight of the rental.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The technology and infotainment system were easy to use.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Perfect luxury adventure SUV for a weekend rental.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The Defender looked incredible and was extremely enjoyable to drive.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great combination of everyday usability and serious off-road ability.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the spacious cabin and commanding driving position.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The SUV was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable for normal driving and incredibly capable off-road.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, powerful, and adventurous. Would definitely rent it again.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'The Defender was comfortable enough for a long highway journey.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Great balance between luxury, performance, and adventure.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The rugged styling made every part of the trip more exciting.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Fantastic vehicle for an outdoor trip. Plenty of space for everyone.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was comfortable and all the controls were easy to understand.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great adventure SUV. Capable, comfortable, and extremely impressive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The Defender 110 felt genuinely special. Had an unforgettable experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Excellent off-road performance and impressive road presence.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very capable and comfortable. Great choice for an adventure trip.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent off-road ability and strong highway performance.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really enjoyed the overall experience. The Defender feels rugged and sophisticated.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Great combination of adventure, luxury, and performance.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean, comfortable, and incredibly enjoyable to drive.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent SUV for road trips and outdoor adventures.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a very good rental experience. The Defender was comfortable, capable, and fun.' }
    ];

    const toyotaInnovaHycrossExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Innova Hycross ZX was incredibly comfortable and spacious. Perfect for our family trip.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the premium interior and comfortable captain seats. The car was spotless.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent family vehicle for long-distance travel. Plenty of space for everyone.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The Hycross felt premium, spacious, and very easy to drive.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Fantastic combination of comfort, practicality, and modern features.' },
      { name: 'Neha Jain', rating: 5, comment: 'The second-row seats were extremely comfortable during our long journey.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Very smooth and easy to drive, especially in city traffic.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was clean, well maintained, and ready exactly on time.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Excellent highway cruiser. Very comfortable even after several hours.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the premium dashboard and panoramic sunroof.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The Hycross ZX offers an excellent balance of luxury and practicality.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience from pickup to return. Everything worked perfectly.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'The high seating position and smooth driving made it perfect for our trip.' },
      { name: 'Isha Verma', rating: 5, comment: 'The cabin felt spacious and premium. Great family car.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Comfortable, refined, and surprisingly easy to maneuver.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect for our family vacation. Everyone had plenty of space.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'Very smooth on highways and comfortable for long-distance travel.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was immaculate when we picked it up. Great service.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Excellent road-trip vehicle. The cabin remained comfortable throughout.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the spacious interior and premium seating.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent combination of comfort, technology, and practicality.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The Hycross made our weekend trip incredibly relaxing.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very stable on highways and easy to drive in the city.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was quiet, spacious, and beautifully designed.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic family MPV. Extremely comfortable and practical.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the comfortable captain seats and spacious cabin.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined vehicle with excellent road manners.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The infotainment and technology features were impressive.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Perfect vehicle for a family weekend rental.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The Hycross looked great and was extremely comfortable.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great vehicle for everyday use and long highway journeys.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the spacious cabin and comfortable seating.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The car was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable family vehicle with a premium interior.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, spacious, and practical. Would definitely rent it again.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'Very comfortable vehicle with excellent highway stability.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Great balance between comfort, space, and technology.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The premium cabin made the entire journey much more enjoyable.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Excellent family vehicle. Plenty of room for passengers and luggage.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was spacious and everything worked perfectly.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great road-trip vehicle. Smooth, comfortable, and easy to drive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The Innova Hycross ZX felt genuinely premium. Had a fantastic experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Well-maintained vehicle with an excellent driving experience.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable and spacious. Great choice for a family trip.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent highway comfort and easy handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really enjoyed the overall experience. The Hycross feels sophisticated and practical.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Great combination of comfort, style, and practicality.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and extremely comfortable. Very good rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent family vehicle for everyday driving and highway trips.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a very good rental experience. The Hycross was comfortable, spacious, and easy to drive.' }
    ];

    const marutiInvictoExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Invicto Alpha+ was incredibly comfortable and spacious. Perfect for our family trip.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the premium interior and comfortable seating. The car was spotless at pickup.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent family vehicle for long-distance travel. Plenty of space for everyone.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The Invicto feels premium, refined, and very easy to drive.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Fantastic combination of comfort, practicality, and modern technology.' },
      { name: 'Neha Jain', rating: 5, comment: 'The second-row seats were extremely comfortable during our long journey.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Very smooth and quiet, especially when driving around the city.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was clean, well maintained, and ready exactly on time.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Excellent highway cruiser. Very comfortable even after several hours.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the premium dashboard and panoramic sunroof.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The Invicto Alpha+ offers an excellent balance of luxury and practicality.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience from pickup to return. Everything worked perfectly.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'The high seating position and smooth driving made it perfect for our trip.' },
      { name: 'Isha Verma', rating: 5, comment: 'The cabin felt spacious and premium. Great vehicle for families.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Comfortable, refined, and surprisingly easy to maneuver.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect for our family vacation. Everyone had plenty of space.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'Very smooth on highways and excellent for long-distance travel.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was immaculate when we picked it up. Great service.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Excellent road-trip vehicle. The cabin remained comfortable throughout.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the spacious interior and premium seating.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent combination of comfort, technology, and practicality.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The Invicto made our weekend trip incredibly relaxing.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very stable on highways and easy to drive in the city.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was quiet, spacious, and beautifully designed.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic family MPV. Extremely comfortable and practical.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the comfortable seats and spacious cabin.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined vehicle with excellent road manners.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The infotainment and technology features were impressive.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Perfect vehicle for a family weekend rental.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The Invicto looked great and was extremely comfortable.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great vehicle for everyday use and long highway journeys.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the spacious cabin and comfortable seating.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The car was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable family vehicle with a premium interior.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, spacious, and practical. Would definitely rent it again.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'Very comfortable vehicle with excellent highway stability.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Great balance between comfort, space, and technology.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The premium cabin made the entire journey much more enjoyable.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Excellent family vehicle. Plenty of room for passengers and luggage.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was spacious and everything worked perfectly.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great road-trip vehicle. Smooth, comfortable, and easy to drive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The Invicto Alpha+ felt genuinely premium. Had a fantastic experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Well-maintained vehicle with an excellent driving experience.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable and spacious. Great choice for a family trip.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent highway comfort and easy handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really enjoyed the overall experience. The Invicto feels sophisticated and practical.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Great combination of comfort, style, and practicality.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean and extremely comfortable. Very good rental experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent family vehicle for everyday driving and highway trips.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a very good rental experience. The Invicto was comfortable, spacious, and easy to drive.' }
    ];

    const lexusEs300hExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Lexus ES 300h was incredibly smooth, quiet, and refined. A true luxury hybrid experience.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the ultra-quiet cabin and Mark Levinson sound system. The car was spotless at pickup.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Fantastic luxury sedan for long-distance driving. Exceptionally smooth and comfortable.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The ES 300h looks elegant, feels incredibly plush inside, and drives like a dream.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Amazing combination of luxury, fuel efficiency, and serene cabin quietness.' },
      { name: 'Neha Jain', rating: 5, comment: 'The leather seats were extremely comfortable, even after several hours of driving.' },
      { name: 'Karan Mehta', rating: 5, comment: 'The hybrid powertrain was smooth and whisper quiet around the city.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was spotless and perfectly maintained at pickup.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Excellent luxury cruiser. Soft ride quality and excellent sound insulation.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the elegant interior, digital display, and premium materials.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The ES 300h delivers serious luxury without sacrificing fuel efficiency.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience from pickup to return. The car was immaculate.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'The smooth hybrid acceleration made the driving experience very relaxing.' },
      { name: 'Isha Verma', rating: 5, comment: 'The cabin felt like a quiet sanctuary. Exceptionally peaceful drive.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Refined, comfortable, and incredibly smooth. Fantastic luxury rental.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect for our weekend trip. The interior had plenty of space and comfort.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'The ride comfort on highways was outstanding. Would definitely rent it again.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was immaculate when we picked it up. Great service.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Excellent highway cruiser with impressive efficiency and serene comfort.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the elegant exterior design and premium Lexus interior.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent balance of luxury, technology, and hybrid performance.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The ES 300h made our weekend trip feel genuinely special.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very smooth power delivery and extremely quiet at highway speeds.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was quiet, plush, and beautifully crafted.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic luxury sedan. Ultra-smooth ride and high craftsmanship.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the supportive leather seats and quiet driving experience.' },
      { name: 'Varun Jain', rating: 5, comment: 'The suspension absorbs bumps effortlessly. Very refined car.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The Mark Levinson audio system was absolutely amazing.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Perfect luxury executive sedan for a weekend getaway.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The Lexus looked stunning and was extremely comfortable.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great combination of quiet comfort, style, and efficiency.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the spacious rear seats and peaceful cabin ambience.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The car was beautifully kept.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable executive sedan with a top-tier interior.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, silent, and luxurious. Would definitely rent it again.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'The ES 300h was incredibly relaxing on long highway drives.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Great balance between luxury, efficiency, and technology.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The premium interior made every part of our journey enjoyable.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Fantastic sedan for road trips. Quiet, comfortable, and efficient.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'Everything about the car felt high quality and refined.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great luxury sedan. Smooth hybrid drive and effortless cruising.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The Lexus ES 300h felt genuinely special. Had a fantastic experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Well-maintained vehicle with a whisper-quiet driving experience.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable and quiet luxury sedan. Great choice for long trips.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent ride comfort and smooth hybrid handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really enjoyed the overall experience. The Lexus feels elegant and serene.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Great combination of luxury, efficiency, and quiet performance.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean, quiet, and extremely comfortable. Very good experience.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent luxury car for business trips and weekend road trips.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a very good rental experience. The Lexus was comfortable, smooth, and quiet.' }
    ];

    const mahindraScorpioExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Scorpio-N Z8L was incredibly comfortable and had an excellent road presence.' },
      { name: 'Priya Mehta', rating: 5, comment: 'Loved the premium interior and commanding driving position. The SUV felt very solid.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Excellent SUV for long road trips. Spacious, comfortable, and powerful.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The Scorpio-N looks fantastic and feels even better on the road.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Great combination of performance, comfort, and rugged SUV character.' },
      { name: 'Neha Jain', rating: 5, comment: 'The seats were comfortable and the cabin felt surprisingly premium.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Excellent highway cruiser with strong acceleration and confident handling.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was spotless and perfectly maintained at pickup.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Very comfortable SUV for long journeys. The high seating position is excellent.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the premium dashboard, large displays, and overall cabin design.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The Scorpio-N Z8L offers a great balance of luxury and ruggedness.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience from pickup to return. Everything worked perfectly.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'The driving position gives excellent visibility and confidence.' },
      { name: 'Isha Verma', rating: 5, comment: 'The cabin felt spacious and comfortable. Perfect for a family trip.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Powerful, comfortable, and extremely impressive on the highway.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect for our family vacation. Plenty of space for everyone.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'The Scorpio-N handled highways and rough roads with confidence.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was immaculate when we picked it up. Great service.' },
      { name: 'Yash Mehta', rating: 5, comment: 'Excellent road-trip SUV. Very comfortable even after several hours.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the bold exterior design and premium interior.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent combination of technology, comfort, and performance.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The Scorpio-N made our weekend trip incredibly enjoyable.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very stable on highways and capable on rough roads.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was spacious, quiet, and beautifully designed.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic SUV with excellent road presence and strong performance.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'Loved the comfortable seats and commanding driving position.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very capable SUV with excellent road manners.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The technology and infotainment features were impressive.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Perfect SUV for a weekend road trip.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The Scorpio-N looked incredible and was extremely comfortable.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great combination of everyday comfort and serious SUV capability.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the spacious cabin and excellent visibility.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The SUV was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable for normal driving and capable on challenging roads.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, powerful, and enjoyable to drive. Would definitely rent it again.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'The Scorpio-N was surprisingly comfortable for a long highway journey.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Great balance between performance, comfort, and modern features.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The premium interior made the entire journey much more enjoyable.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Fantastic family SUV. Plenty of space and excellent road presence.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was spacious and everything worked perfectly.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great road-trip SUV. Powerful, comfortable, and easy to drive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The Scorpio-N Z8L felt genuinely premium. Had a fantastic experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Excellent driving dynamics and impressive road presence.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable and powerful. Great choice for a family trip.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent highway performance and confident handling.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really enjoyed the overall experience. The Scorpio-N feels rugged and sophisticated.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Great combination of comfort, style, and performance.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean, comfortable, and incredibly enjoyable to drive.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent SUV for road trips and everyday driving.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a very good rental experience. The Scorpio-N was comfortable, capable, and fun.' }
    ];

    const kiaCarnivalExplicitReviews = [
      { name: 'Aarav Sharma', rating: 5, comment: 'The Carnival Limousine felt like a luxury lounge on wheels. Extremely comfortable.' },
      { name: 'Priya Mehta', rating: 5, comment: 'The VIP seats were incredibly comfortable, especially during our long journey.' },
      { name: 'Rohan Kapoor', rating: 5, comment: 'Perfect luxury MPV for a family road trip. Spacious and refined.' },
      { name: 'Ananya Singh', rating: 5, comment: 'The interior feels genuinely premium and the sliding doors are incredibly convenient.' },
      { name: 'Vivek Sharma', rating: 5, comment: 'Fantastic combination of comfort, space, and technology.' },
      { name: 'Neha Jain', rating: 5, comment: 'The second-row seats made the entire journey extremely relaxing.' },
      { name: 'Karan Mehta', rating: 5, comment: 'Very smooth automatic transmission and an impressively quiet cabin.' },
      { name: 'Sneha Kapoor', rating: 5, comment: 'The vehicle was spotless and perfectly maintained at pickup.' },
      { name: 'Rahul Verma', rating: 5, comment: 'Excellent highway cruiser. Everyone had plenty of room.' },
      { name: 'Kavya Sharma', rating: 5, comment: 'Loved the panoramic sunroof and premium cabin.' },
      { name: 'Aditya Jain', rating: 5, comment: 'The Carnival offers an excellent balance between luxury and practicality.' },
      { name: 'Pooja Mehta', rating: 5, comment: 'Excellent rental experience from pickup to return. Everything was perfect.' },
      { name: 'Arjun Kapoor', rating: 5, comment: 'The power sliding doors were extremely convenient when traveling with family.' },
      { name: 'Isha Verma', rating: 5, comment: 'The cabin felt spacious, elegant, and incredibly comfortable.' },
      { name: 'Mohit Sharma', rating: 5, comment: 'Smooth, quiet, and very comfortable. Ideal for long journeys.' },
      { name: 'Riya Singh', rating: 5, comment: 'Perfect for our family vacation. Everyone had enough space.' },
      { name: 'Nikhil Gupta', rating: 5, comment: 'Excellent long-distance vehicle with a very comfortable ride.' },
      { name: 'Divya Kapoor', rating: 5, comment: 'The vehicle was immaculate when we picked it up. Great service.' },
      { name: 'Yash Mehta', rating: 5, comment: 'The Carnival made our road trip feel much more premium.' },
      { name: 'Simran Jain', rating: 5, comment: 'Loved the luxurious second-row seating and spacious cabin.' },
      { name: 'Aman Sharma', rating: 5, comment: 'Excellent combination of technology, comfort, and practicality.' },
      { name: 'Tanvi Kapoor', rating: 5, comment: 'The Carnival made our weekend trip incredibly relaxing.' },
      { name: 'Saurabh Verma', rating: 5, comment: 'Very stable on highways and surprisingly easy to drive.' },
      { name: 'Shreya Mehta', rating: 5, comment: 'The cabin was quiet, spacious, and beautifully designed.' },
      { name: 'Akash Singh', rating: 5, comment: 'Fantastic luxury MPV for family travel.' },
      { name: 'Nandini Sharma', rating: 5, comment: 'The VIP seats were easily my favorite feature.' },
      { name: 'Varun Jain', rating: 5, comment: 'Very refined vehicle with excellent road manners.' },
      { name: 'Muskan Mehta', rating: 5, comment: 'The infotainment system and digital displays were impressive.' },
      { name: 'Gaurav Kapoor', rating: 5, comment: 'Perfect luxury vehicle for a weekend rental.' },
      { name: 'Aditi Verma', rating: 5, comment: 'The Carnival looked elegant and was incredibly comfortable.' },
      { name: 'Harsh Sharma', rating: 5, comment: 'Great vehicle for both family trips and executive travel.' },
      { name: 'Komal Singh', rating: 5, comment: 'Really liked the spacious cabin and premium second-row seats.' },
      { name: 'Rajat Mehta', rating: 5, comment: 'Excellent experience from pickup to return. The MPV was beautifully maintained.' },
      { name: 'Pallavi Jain', rating: 5, comment: 'Very comfortable for long journeys and easy to live with.' },
      { name: 'Kunal Verma', rating: 5, comment: 'Smooth, spacious, and luxurious. Would definitely rent it again.' },
      { name: 'Ritu Sharma', rating: 5, comment: 'The Carnival was incredibly comfortable during our highway trip.' },
      { name: 'Deepak Mehta', rating: 5, comment: 'Great balance between luxury, space, and technology.' },
      { name: 'Shivani Kapoor', rating: 5, comment: 'The premium interior made the entire journey feel special.' },
      { name: 'Sachin Verma', rating: 5, comment: 'Excellent family vehicle with plenty of passenger and luggage space.' },
      { name: 'Preeti Sharma', rating: 5, comment: 'The cabin was spacious and all the controls were easy to understand.' },
      { name: 'Rakesh Jain', rating: 5, comment: 'Great luxury MPV. Comfortable, smooth, and easy to drive.' },
      { name: 'Jyoti Mehta', rating: 5, comment: 'The Carnival Limousine felt genuinely premium. Had a fantastic experience.' },
      { name: 'Naveen Kapoor', rating: 5, comment: 'Excellent highway comfort and impressive road presence.' },
      { name: 'Kriti Sharma', rating: 4, comment: 'Very comfortable and spacious. Great choice for a family trip.' },
      { name: 'Manav Singh', rating: 4, comment: 'Excellent highway performance and very comfortable seating.' },
      { name: 'Sonal Mehta', rating: 4, comment: 'Really enjoyed the overall experience. The Carnival feels sophisticated and luxurious.' },
      { name: 'Aakash Verma', rating: 4, comment: 'Great combination of comfort, style, and practicality.' },
      { name: 'Swati Kapoor', rating: 4, comment: 'The vehicle was clean, comfortable, and extremely enjoyable for our trip.' },
      { name: 'Pankaj Sharma', rating: 4, comment: 'Excellent luxury MPV for family road trips.' },
      { name: 'Vivek Mehta', rating: 3, comment: 'Overall a very good rental experience. The Carnival was spacious, comfortable, and refined.' }
    ];

    const reviewUsers = [customerUser._id, adminUser._id];
    const generatedReviews = [];
    const ratingPresets = [4.8, 4.9, 4.7, 4.6, 4.9, 4.8, 4.5, 4.9, 4.7, 4.8, 4.6, 4.9];
    const countPresets = [47, 62, 38, 54, 71, 42, 31, 68, 52, 49, 36, 59];

    for (let index = 0; index < seededCars.length; index++) {
      const carItem = seededCars[index];
      
      if (carItem.brand === 'Maruti Suzuki' && carItem.model.includes('Swift')) {
        for (let i = 0; i < swiftExplicitReviews.length; i++) {
          const rev = swiftExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.7,
          numReviews: 48
        });
      } else if (carItem.brand === 'Tata' && carItem.model.includes('Harrier')) {
        for (let i = 0; i < harrierExplicitReviews.length; i++) {
          const rev = harrierExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.7,
          numReviews: 50
        });
      } else if (carItem.brand === 'Mahindra' && carItem.model.includes('Thar')) {
        for (let i = 0; i < tharExplicitReviews.length; i++) {
          const rev = tharExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.7,
          numReviews: 50
        });
      } else if (carItem.brand === 'Audi' && carItem.model.includes('A6')) {
        for (let i = 0; i < audiA6ExplicitReviews.length; i++) {
          const rev = audiA6ExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.7,
          numReviews: 50
        });
      } else if (carItem.brand === 'Ford' && carItem.model.includes('Mustang')) {
        for (let i = 0; i < mustangExplicitReviews.length; i++) {
          const rev = mustangExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.7,
          numReviews: 50
        });
      } else if (carItem.brand === 'Hyundai' && carItem.model.includes('i20')) {
        for (let i = 0; i < hyundaiI20NLineExplicitReviews.length; i++) {
          const rev = hyundaiI20NLineExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.7,
          numReviews: 50
        });
      } else if (carItem.brand === 'Maruti Suzuki' && carItem.model.includes('Baleno')) {
        for (let i = 0; i < balenoExplicitReviews.length; i++) {
          const rev = balenoExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.7,
          numReviews: 50
        });
      } else if (carItem.brand === 'Hyundai' && carItem.model.includes('Nios')) {
        for (let i = 0; i < grandI10NiosExplicitReviews.length; i++) {
          const rev = grandI10NiosExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.7,
          numReviews: 50
        });
      } else if (carItem.brand === 'Tesla' && carItem.model.includes('Model S')) {
        for (let i = 0; i < teslaPlaidExplicitReviews.length; i++) {
          const rev = teslaPlaidExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Kia' && carItem.model.includes('Seltos')) {
        for (let i = 0; i < kiaSeltosExplicitReviews.length; i++) {
          const rev = kiaSeltosExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.7,
          numReviews: 50
        });
      } else if (carItem.brand === 'Mahindra' && carItem.model.includes('XUV700')) {
        for (let i = 0; i < mahindraXuv700ExplicitReviews.length; i++) {
          const rev = mahindraXuv700ExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Honda' && carItem.model.includes('City')) {
        for (let i = 0; i < hondaCityExplicitReviews.length; i++) {
          const rev = hondaCityExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.7,
          numReviews: 50
        });
      } else if (carItem.brand === 'Hyundai' && carItem.model.includes('Verna')) {
        for (let i = 0; i < hyundaiVernaExplicitReviews.length; i++) {
          const rev = hyundaiVernaExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Skoda' && carItem.model.includes('Slavia')) {
        for (let i = 0; i < skodaSlaviaExplicitReviews.length; i++) {
          const rev = skodaSlaviaExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Volkswagen' && carItem.model.includes('Virtus')) {
        for (let i = 0; i < vwVirtusExplicitReviews.length; i++) {
          const rev = vwVirtusExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Toyota' && carItem.model.includes('Camry')) {
        for (let i = 0; i < toyotaCamryExplicitReviews.length; i++) {
          const rev = toyotaCamryExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Land Rover' && carItem.model.includes('Range Rover')) {
        for (let i = 0; i < rangeRoverSportExplicitReviews.length; i++) {
          const rev = rangeRoverSportExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Tata' && carItem.model.includes('Altroz')) {
        for (let i = 0; i < tataAltrozExplicitReviews.length; i++) {
          const rev = tataAltrozExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.7,
          numReviews: 50
        });
      } else if (carItem.brand === 'Toyota' && carItem.model.includes('Legender')) {
        for (let i = 0; i < toyotaFortunerLegenderExplicitReviews.length; i++) {
          const rev = toyotaFortunerLegenderExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Toyota' && carItem.model.includes('RAV4')) {
        for (let i = 0; i < toyotaRav4ExplicitReviews.length; i++) {
          const rev = toyotaRav4ExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Mercedes-Benz' && carItem.model.includes('C200')) {
        for (let i = 0; i < mercedesC200ExplicitReviews.length; i++) {
          const rev = mercedesC200ExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Hyundai' && carItem.model.includes('Creta')) {
        for (let i = 0; i < hyundaiCretaExplicitReviews.length; i++) {
          const rev = hyundaiCretaExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'BMW' && carItem.model.includes('3 Series')) {
        for (let i = 0; i < bmw3SeriesGranLimousineExplicitReviews.length; i++) {
          const rev = bmw3SeriesGranLimousineExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Volvo' && carItem.model.includes('XC60')) {
        for (let i = 0; i < volvoXc60ExplicitReviews.length; i++) {
          const rev = volvoXc60ExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Tata' && carItem.model.includes('Nexon')) {
        for (let i = 0; i < tataNexonEvExplicitReviews.length; i++) {
          const rev = tataNexonEvExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Chevrolet' && carItem.model.includes('Bolt')) {
        for (let i = 0; i < chevroletBoltEvExplicitReviews.length; i++) {
          const rev = chevroletBoltEvExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Hyundai' && carItem.model.includes('IONIQ')) {
        for (let i = 0; i < hyundaiIoniq5ExplicitReviews.length; i++) {
          const rev = hyundaiIoniq5ExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'BMW' && carItem.model.includes('M340i')) {
        for (let i = 0; i < bmwM340iExplicitReviews.length; i++) {
          const rev = bmwM340iExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Audi' && carItem.model.includes('S5')) {
        for (let i = 0; i < audiS5SportbackExplicitReviews.length; i++) {
          const rev = audiS5SportbackExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Jeep' && carItem.model.includes('Wrangler')) {
        for (let i = 0; i < jeepWranglerExplicitReviews.length; i++) {
          const rev = jeepWranglerExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Land Rover' && carItem.model.includes('Defender')) {
        for (let i = 0; i < landRoverDefenderExplicitReviews.length; i++) {
          const rev = landRoverDefenderExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Toyota' && carItem.model.includes('Hycross')) {
        for (let i = 0; i < toyotaInnovaHycrossExplicitReviews.length; i++) {
          const rev = toyotaInnovaHycrossExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Maruti Suzuki' && carItem.model.includes('Invicto')) {
        for (let i = 0; i < marutiInvictoExplicitReviews.length; i++) {
          const rev = marutiInvictoExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Lexus' && carItem.model.includes('ES')) {
        for (let i = 0; i < lexusEs300hExplicitReviews.length; i++) {
          const rev = lexusEs300hExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Mahindra' && carItem.model.includes('Scorpio')) {
        for (let i = 0; i < mahindraScorpioExplicitReviews.length; i++) {
          const rev = mahindraScorpioExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else if (carItem.brand === 'Kia' && carItem.model.includes('Carnival')) {
        for (let i = 0; i < kiaCarnivalExplicitReviews.length; i++) {
          const rev = kiaCarnivalExplicitReviews[i];
          generatedReviews.push({
            user: reviewUsers[i % reviewUsers.length],
            car: carItem._id,
            booking: new mongoose.Types.ObjectId(),
            reviewerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: new Date(Date.now() - (i + 1) * 86400000 * 2)
          });
        }

        await Car.findByIdAndUpdate(carItem._id, {
          rating: 4.8,
          numReviews: 50
        });
      } else {
        // Zero out reviews for all other cars (including Thar)
        await Car.findByIdAndUpdate(carItem._id, {
          rating: 0,
          numReviews: 0
        });
      }
    }

    await Review.insertMany(generatedReviews);
    console.log(`Seeded ${generatedReviews.length} realistic reviews across all 36 fleet cars (including 48 explicit Swift ZXi+ reviews).`);

    // Seed mock initial booking
    const fakeBooking = new Booking({
      bookingId: 'TQ-920184',
      user: customerUser._id,
      car: seededCars[0]._id,
      pickupLocation: 'Udaipur Airport',
      dropoffLocation: 'Jaipur Railway Station',
      pickupDate: new Date(Date.now() + 86400000 * 2),
      returnDate: new Date(Date.now() + 86400000 * 5),
      totalDays: 3,
      dailyRate: seededCars[0].pricePerDay,
      billing: {
        subtotal: seededCars[0].pricePerDay * 3,
        securityDeposit: seededCars[0].securityDeposit,
        taxes: Math.round(seededCars[0].pricePerDay * 3 * 0.08),
        totalAmount: seededCars[0].pricePerDay * 3 + seededCars[0].securityDeposit + Math.round(seededCars[0].pricePerDay * 3 * 0.08)
      },
      customerDetails: {
        fullName: 'John Doe',
        email: 'john@gmail.com',
        phone: '987-654-3210',
        driverLicense: 'DL-RJ27A91023'
      },
      status: 'Completed',
      paymentStatus: 'Paid',
      paymentDetails: {
        transactionId: 'TXN-ABC123XYZ',
        cardholderName: 'John Doe',
        paymentMethod: 'Credit Card',
        paymentDate: new Date()
      }
    });

    const savedBooking = await fakeBooking.save();

    // Create corresponding payment record
    await Payment.create({
      booking: savedBooking._id,
      user: customerUser._id,
      transactionId: 'TXN-ABC123XYZ',
      amount: savedBooking.billing.totalAmount,
      status: 'Success',
      cardholderName: 'John Doe',
      last4Digits: '4111',
      paymentMethod: 'Credit Card'
    });

    // Create notifications for customer user
    await Notification.create([
      {
        user: customerUser._id,
        title: 'Account Created',
        message: 'Welcome to TORQUE! Your account was initialized successfully.',
        type: 'general'
      },
      {
        user: customerUser._id,
        title: 'Booking Confirmed',
        message: 'Your booking TQ-920184 for Tesla Model S Plaid has been confirmed!',
        type: 'booking_confirmed'
      }
    ]);

    console.log('Seeded user history (Bookings, Payments, Notifications) successfully.');
    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
