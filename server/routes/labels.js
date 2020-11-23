// @ts-check

import i18next from 'i18next';
import _ from 'lodash';

const resource = '/labels';

export default (app) => {
  app
    .get(
      resource,
      { name: 'labels', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const labels = await app.objection.models.label.query();
        reply.render('labels/index', { labels });
      }
    )
    .get(
      `${resource}/:id`,
      { name: 'labels/edit', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const labelId = _.toNumber(req.params.id);
        const label = await app.objection.models.label
          .query()
          .findById(labelId);

        reply.render('labels/edit', { label });
      }
    )
    .get(
      `${resource}/new`,
      { name: 'labels/new', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const label = new app.objection.models.label();
        reply.render('labels/new', { label });
      }
    )
    .post(
      resource,
      { preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const label = await app.objection.models.label.fromJson(req.body.label);
        try {
          await app.objection.models.label.query().insert(label);
          req.flash('info', i18next.t('flash.label.new.success'));
          reply.redirect(app.reverse('labels'));
        } catch ({ data }) {
          req.flash('error', i18next.t('flash.errors.common'));
          reply.render('labels', { label, errors: data });
        }
      }
    )
    .patch(
      `${resource}/:id`,
      { preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const labelId = _.toNumber(req.params.id);

        try {
          const { label } = req.body;
          const oldTaskStatus = await app.objection.models.label
            .query()
            .findById(labelId);
          await oldTaskStatus.$query().patchAndFetch(label);
          req.flash('info', i18next.t('flash.label.edit.success'));
        } catch (e) {
          req.flash('error', i18next.t('flash.errors.common'));
        }

        reply.redirect(app.reverse('labels'));
      }
    )
    .delete(
      `${resource}/:id`,
      { preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const labelId = _.toNumber(req.params.id);
        await app.objection.models.label.query().deleteById(labelId);
        req.flash('info', i18next.t('flash.label.delete.success'));

        reply.redirect(app.reverse('labels'));
      }
    );
};
