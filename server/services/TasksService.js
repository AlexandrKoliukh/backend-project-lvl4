import models from '../models';

const relations = '[status, creator, executor]';

export default class TasksService {
  constructor() {
    this.model = models.Task;
  }

  async getAll() {
    const data = await this.model.query().withGraphJoined(relations);
    return data;
  }

  async getByExecutorId(id) {
    const data = await this.model
      .query()
      .where('executor_id', id)
      .withGraphJoined(relations);
    return data;
  }

  async getByCreatorId(id) {
    const data = await this.model
      .query()
      .where('creator_id', id)
      .withGraphJoined(relations);
    return data;
  }

  async getById(id) {
    const data = await this.model
      .query()
      .findById(id)
      .withGraphJoined(relations);
    return data;
  }

  async insert(newData) {
    const data = await this.model
      .query()
      .insert(newData)
      .withGraphJoined(relations);
    return data;
  }

  async update(id, newData) {
    const oldTask = await this.getById(id);
    const updated = await oldTask
      .$query()
      .patchAndFetch(newData)
      .withGraphJoined(relations);
    return updated;
  }

  async delete(id) {
    await this.model.query().deleteById(id);
    return id;
  }
}
