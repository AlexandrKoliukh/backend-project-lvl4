import Crud from './Crud';

export default class LabelService extends Crud {
  constructor(app) {
    super();
    this.model = app.objection.models.user;
  }
}
