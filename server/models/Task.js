// @ts-check

import _ from 'lodash';
import { Model } from 'objection';
import TaskStatus from './TaskStatus';
import User from './User';

export default class Task extends Model {
  static get tableName() {
    return 'tasks';
  }

  $parseJson(json, opt) {
    // eslint-disable-next-line no-param-reassign
    json = super.$parseJson(json, opt);

    return {
      ...json,
      status_id: _.toNumber(json.status_id),
      creator_id: _.toNumber(json.creator_id),
      executor_id: _.toNumber(json.executor_id) || null,
    };
  }

  static get relationMappings() {
    return {
      status: {
        relation: Model.HasOneRelation,
        modelClass: TaskStatus,
        join: {
          from: 'tasks.status_id',
          to: 'task_statuses.id',
        },
      },
      creator: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.creator_id',
          to: 'users.id',
        },
      },
      executor: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.executor_id',
          to: 'users.id',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'status_id', 'creator_id'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        description: { type: 'text' },
        status_id: { type: 'integer' },
        creator_id: { type: 'integer' },
        executor_id: { type: ['integer', 'null'] },
      },
    };
  }
}
