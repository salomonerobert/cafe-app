import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';
import mongoose from 'mongoose';
import { Employee } from './models/Employee.js';
import { Cafe } from './models/Cafe.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PW = process.env.MONGO_PW;

// Connect to MongoDB
mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PW}@cafeapp.i42jdqh.mongodb.net/?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

const CafeFactory = new Factory()
.attr('name', () => faker.company.name())
.attr('description', () => faker.company.catchPhrase())
.attr('logo', () => faker.image.avatarGitHub())
.attr('location', () => faker.helpers.arrayElement(['North-East', 'East', 'North', 'West', 'South', 'Central', 'East Coast']))

const EmployeeFactory = new Factory()
  .sequence('employee_id', (i) => `UI${i.toString().padStart(7, '0')}`)
  .attr('name', () => faker.person.fullName())
  .attr('email_address', ['name'], (fullName) => {
    const [firstName, lastName] = fullName.split(' ');
    return faker.internet.email({firstName: firstName, lastName: lastName})
  })
  .attr('phone_number', () => {
    return Math.round(Math.random()) === 0
    ? faker.phone.number('9#######')
    : faker.phone.number('8#######')
  })
  .attr('gender', () => faker.helpers.arrayElement(['Male', 'Female']))
  .attr('start_date', () => faker.date.past())
  .attr('cafe', () => faker.helpers.arrayElement(cafeIds))

const cafeIds = [];

async function createAndInsertCafes() {
    try {
        for (let j = 0; j < 15; j++) {
            const cafe = CafeFactory.build();
            const insertedCafe = await Cafe.create(cafe);
            cafeIds.push(insertedCafe._id);
            console.log(`Inserted cafe ${j}: ` + cafe.name)
        }
    } catch (err) {
        console.log('Error while inserting cafes: ' + err)
    }
}

async function createAndInsertEmployees() {
    try {
        for (let i = 1; i <= 100; i++) {
            const employee = EmployeeFactory.build();
            Employee.create(employee);
            console.log(`Inserted employee ${i}: ` + employee.name)
        }
    } catch (err) {
        console.log('Error while inserting employees: ' + err)
    }
}

await createAndInsertCafes();
await createAndInsertEmployees();

console.log('Seed data generated and inserted.');

// Close the MongoDB connection after a delay
setTimeout(() => {
  mongoose.connection.close();
  console.log('Database connection closed.');
}, 10000);
