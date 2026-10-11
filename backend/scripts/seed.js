const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('../src/models/Employee');

const path = require('path');

// Load environment variables from backend/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const sampleEmployees = [
  {
    employeeId: 'EMP101',
    fullName: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '+1 (555) 234-5678',
    department: 'Engineering',
    position: 'Software Engineer',
    salary: 85000,
    joiningDate: new Date('2022-03-15'),
    status: 'Active',
  },
  {
    employeeId: 'EMP102',
    fullName: 'Robert Martinez',
    email: 'robert.martinez@example.com',
    phone: '+1 (555) 345-6789',
    department: 'Human Resources',
    position: 'HR Manager',
    salary: 72000,
    joiningDate: new Date('2021-06-01'),
    status: 'Active',
  },
  {
    employeeId: 'EMP103',
    fullName: 'Sarah Connor',
    email: 'sarah.connor@example.com',
    phone: '+1 (555) 456-7890',
    department: 'Operations',
    position: 'Project Manager',
    salary: 92000,
    joiningDate: new Date('2020-09-10'),
    status: 'Active',
  },
  {
    employeeId: 'EMP104',
    fullName: 'David Chen',
    email: 'david.chen@example.com',
    phone: '+1 (555) 567-8901',
    department: 'Engineering',
    position: 'Blockchain Developer',
    salary: 98000,
    joiningDate: new Date('2023-01-20'),
    status: 'Active',
  },
  {
    employeeId: 'EMP105',
    fullName: 'Emily Taylor',
    email: 'emily.taylor@example.com',
    phone: '+1 (555) 678-9012',
    department: 'Design',
    position: 'UI/UX Designer',
    salary: 78000,
    joiningDate: new Date('2023-08-01'),
    status: 'Inactive',
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error('ERROR: MONGO_URI is missing from environment variables.');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas.');

    console.log('Clearing existing employee records (if any)...');
    await Employee.deleteMany({});

    console.log('Inserting 5 sample employees...');
    const createdEmployees = await Employee.insertMany(sampleEmployees);
    console.log(`Successfully seeded ${createdEmployees.length} employees:`);
    createdEmployees.forEach((emp) => {
      console.log(` - [${emp.employeeId}] ${emp.fullName} | ${emp.position} (${emp.status})`);
    });

    console.log('\nSeed process finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
