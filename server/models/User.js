// @ts-check

import objectionUnique from 'objection-unique';

import encrypt from '../lib/secure.js';
import BaseModel from './BaseModel';

const unique = objectionUnique({ fields: ['email'] });

export default class User extends unique(BaseModel) {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        id: { type: 'integer' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 3 },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
      },
    };
  }

  set password(value) {
    this.passwordDigest = encrypt(value);
  }
}
