import models from '../models';
import Label from '../models/Label';

const relations = '[status, creator, executor, labels]';

export default class TasksService {
  constructor() {
    this.model = models.Task;
  }

  async getAll() {
    const data = await this.model.query().withGraphJoined(relations);
    return data;
  }

  async getById(id) {
    const data = await this.model
      .query()
      .findById(id)
      .withGraphJoined(relations);
    return data;
  }

  async upsert(labelsIds, task) {
    const returnValue = await this.model.transaction(async (trx) => {
      const labels = await Label.query(trx).findByIds(labelsIds);
      return this.model
        .query(trx)
        .upsertGraphAndFetch(
          { ...task, labels },
          { relate: true, unrelate: true, noUpdate: ['labels'] }
        );
    });
    return returnValue;
  }

  async insert(newData) {
    const { labels: labelsIds, ...task } = newData;

    return this.upsert(labelsIds, task);
  }

  async update(id, newData) {
    const { labels: labelsIds, ...taskData } = newData;
    const task = { ...taskData, id };

    return this.upsert(labelsIds, task);
  }

  async delete(id) {
    const returnValue = await this.model.transaction(async (trx) => {
      const task = await this.model.query(trx).findById(id);
      await task.$relatedQuery('labels', trx).unrelate().where({ taskId: id });
      await task.$query(trx).delete();
      return id;
    });
    return returnValue;
  }
}
