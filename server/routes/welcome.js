// @ts-check

export default (app) => {
  app.get('/', { name: 'root' }, (_req, reply) => {
    console.log(reply.request.session);
    reply.render('welcome/index');
  });
};
