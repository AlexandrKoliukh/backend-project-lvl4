import Crud from './Crud';

export default class TaskStatusRepository extends Crud {
  constructor(app) {
    super();
    this.model = app.objection.models.taskStatus;
  }
}
