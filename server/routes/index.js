// @ts-check

import welcome from './welcome';
import users from './users';
import session from './session';
import taskStatuses from './taskStatuses';

const controllers = [welcome, users, session, taskStatuses];

export default (app) => controllers.forEach((f) => f(app));
