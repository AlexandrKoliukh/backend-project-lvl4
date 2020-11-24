import Crud from './Crud';

export default class UserService extends Crud {
  constructor(app) {
    super();
    this.model = app.objection.models.user;
  }
}
