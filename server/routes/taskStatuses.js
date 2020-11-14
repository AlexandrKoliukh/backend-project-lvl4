// @ts-check

import i18next from 'i18next';
import _ from 'lodash';

const resource = '/task-statuses';

export default (app) => {
  app
    .get(
      resource,
      { name: 'taskStatuses', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskStatuses = await app.objection.models.taskStatus.query();
        reply.render('taskStatus/index', { taskStatuses });
        return reply;
      }
    )
    .post(resource, async (req, reply) => {
      const taskStatus = await app.objection.models.taskStatus.fromJson(
        req.body.taskStatus
      );
      try {
        await app.objection.models.taskStatus.query().insert(taskStatus);
        reply.redirect(app.reverse('taskStatuses'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.errors.common'));
        reply.render('taskStatuses', { taskStatus, errors: data });
        return reply;
      }
    })
    .patch(`${resource}/:id`, async (req, reply) => {
      const taskStatusId = _.toNumber(req.params.id);

      try {
        const { taskStatus } = req.body;
        await app.objection.models.taskStatus
          .query()
          .findById(taskStatusId)
          .patchAndFetch(taskStatus);
      } catch (e) {
        req.flash('error', i18next.t('flash.errors.common'));
      }

      const taskStatuses = await app.objection.models.taskStatus.query();
      return reply.redirect(app.reverse('taskStatuses', { taskStatuses }));
    })
    .delete(`${resource}/:id`, (req, reply) => {
      req.session.set('userId', null);
      req.flash('info', i18next.t('flash.session.delete.success'));
      reply.redirect(app.reverse('root'));
    });
};
