// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';

// eslint-disable-next-line import/prefer-default-export
export const testUser = {
  email: faker.internet.email(),
  password: faker.internet.password(5),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
};
