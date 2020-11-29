import Crud from './Crud';

export default class LabelRepository extends Crud {
  constructor(app) {
    super();
    this.model = app.objection.models.label;
  }

  async delete(id) {
    const returnValue = await this.model.transaction(async (trx) => {
      const label = await this.model.query(trx).findById(id);
      await label
        .$relatedQuery('labels', trx)
        .unrelate()
        .where({ labelId: id });
      await label.$query(trx).delete();
      return id;
    });
    return returnValue;
  }
}
