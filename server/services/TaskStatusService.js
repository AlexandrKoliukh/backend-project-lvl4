import Crud from './Crud';

export default class TaskStatusService extends Crud {
  constructor(app) {
    super();
    this.model = app.objection.models.taskStatus;
  }
}
