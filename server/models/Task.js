// @ts-check

import _ from 'lodash';
import BaseModel from './BaseModel';

export default class Task extends BaseModel {
  static get tableName() {
    return 'tasks';
  }

  $parseJson(json, opt) {
    // eslint-disable-next-line no-param-reassign
    json = super.$parseJson(json, opt);

    return {
      ...json,
      executorId: _.toNumber(json.executorId) || null,
    };
  }

  static get modifiers() {
    return {
      filterExecutor(query, id) {
        query.skipUndefined().where('executorId', id);
      },

      filterCreator(query, id) {
        query.skipUndefined().where('creatorId', id);
      },

      filterLabel(query, id) {
        if (!id) return query;
        return query.skipUndefined().whereIn('tasks.id', function () {
          this.select('taskId').from('tasks_labels').where('labelId', id);
        });
      },

      filterStatus(query, id) {
        query.skipUndefined().where('statusId', id);
      },
    };
  }

  static get relationMappings() {
    return {
      status: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'TaskStatus',
        join: {
          from: 'tasks.statusId',
          to: 'task_statuses.id',
        },
      },
      creator: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User',
        join: {
          from: 'tasks.creatorId',
          to: 'users.id',
        },
      },
      executor: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User',
        join: {
          from: 'tasks.executorId',
          to: 'users.id',
        },
      },
      labels: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: 'Label',
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
