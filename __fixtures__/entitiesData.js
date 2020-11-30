// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';

export const getUser = () => ({
  email: faker.internet.email(),
  password: faker.internet.password(5),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
});

export const getLabel = () => ({
  name: faker.lorem.word(),
});

export const getTaskStatus = () => ({
  name: faker.lorem.word(),
});

export const getTask = () => ({
  name: faker.lorem.word(),
  description: faker.lorem.paragraph(),
  statusId: 1,
  creatorId: 1,
});
