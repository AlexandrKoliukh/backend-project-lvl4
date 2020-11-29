import Crud from './Crud';

export default class UserRepository extends Crud {
  constructor(app) {
    super();
    this.model = app.objection.models.user;
  }
}
