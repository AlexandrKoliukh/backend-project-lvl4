// @ts-check

import welcome from './welcome';
import users from './users';
import session from './session';
import taskStatuses from './taskStatuses';
import tasks from './tasks';

const controllers = [welcome, users, session, taskStatuses, tasks];

export default (app) => controllers.forEach((f) => f(app));
