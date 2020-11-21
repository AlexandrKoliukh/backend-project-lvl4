import faker from 'faker';

export const testUser = {
  email: faker.internet.email(),
  password: faker.internet.password(5),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
};
