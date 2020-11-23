export default class Crud {
  async getAll() {
    const data = await this.model.query();
    return data;
  }

  async getById(id) {
    const data = await this.model.query().findById(id);
    return data;
  }

  async insert(newData) {
    const entity = await this.model.fromJson(newData);
    return entity.$query().insertAndFetch();
  }

  async update(id, newData) {
    const oldEntity = await this.model.query().findById(id);
    return oldEntity.$query().patchAndFetch(newData);
  }

  async delete(id) {
    await this.model.query().deleteById(id);
    return id;
  }
}
