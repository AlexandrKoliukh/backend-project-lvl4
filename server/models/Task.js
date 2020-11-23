// @ts-check

import _ from 'lodash';
import { Model } from 'objection';
import TaskStatus from './TaskStatus';
import User from './User';
import Label from './Label';

export default class Task extends Model {
  static get tableName() {
    return 'tasks';
  }

  $parseJson(json, opt) {
    // eslint-disable-next-line no-param-reassign
    json = super.$parseJson(json, opt);

    return {
      ...json,
      executorId: _.toNumber(json.executor_id) || null,
    };
  }

  static get relationMappings() {
    return {
      status: {
        relation: Model.HasOneRelation,
        modelClass: TaskStatus,
        join: {
          from: 'tasks.statusId',
          to: 'task_statuses.id',
        },
      },
      creator: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.creatorId',
          to: 'users.id',
        },
      },
      executor: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.executorId',
          to: 'users.id',
        },
      },
      labels: {
        relation: Model.ManyToManyRelation,
        modelClass: Label,
        join: {
          from: 'tasks.id',
          through: {
            from: 'tasks_labels.taskId',
            to: 'tasks_labels.labelId',
          },
          to: 'labels.id',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId', 'creatorId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        description: { type: 'text' },
        statusId: { type: ['integer', 'string'] },
        creatorId: { type: ['integer', 'string'] },
        executorId: { type: ['integer', 'null'] },
      },
    };
  }
}
