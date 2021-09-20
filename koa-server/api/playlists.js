import _ from 'lodash';
import { PlaylistModel } from './services/model';

export default {
  /**
   * List of methods that will be called only if `authenticator` method success
   * @type {Array}
   */
  protectored: ['create', 'update', 'del'],
  /**
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async list(ctx) {
    const model = new PlaylistModel();
    const { user } = ctx.session;

    const items = await ctx.redis.lrange('playlist:all', 0, 100);
    const playlists = await Promise.all(_.map(items, async (item) => {
      const values = await ctx.redis.hmget(item, model.keys);

      const { playlist } = new PlaylistModel(_.zipObject(model.keys, values));

      return playlist;
    }));

    const visible = _.filter(playlists, { visibility: true });

    switch (_.get(user, 'role')) {
      case 'admin':
        ctx.body = playlists;
        break;
      case 'user':
        ctx.body = [
          ...visible, ..._.filter(playlists, ({ permissions }) => permissions.includes(user.id)),
        ];
        break;
      default:
        ctx.body = visible;
        break;
    }
  },
  /**
   * Creating a new playlist by PlaylistModel and save it to DB
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async create(ctx) {
    const { body } = ctx.request;

    const { playlist } = new PlaylistModel(body);

    await ctx.redis.multi()
      .hset(`playlist:${playlist.id}`, playlist)
      .rpush('playlist:all', `playlist:${playlist.id}`)
      .exec();

    ctx.status = 201;
    ctx.body = playlist;
  },
  /**
   * Updating a playlist by playlist id and save it to DB
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async update(ctx) {
    const { id } = ctx.params;
    const { body } = ctx.request;

    const item = await ctx.redis.hgetall(`playlist:${id}`);
    if (_.isNull(item)) ctx.throw(404);
    if (_.isEmpty(body)) ctx.throw(400, 'Error! An empty payload was passed to the request');

    const model = new PlaylistModel(item);
    const payload = model.difference(body);
    if (_.isEmpty(payload)) ctx.throw(400, 'Error! Nothing to change');

    await ctx.redis.hset(`playlist:${id}`, payload);
    ctx.body = { ...item, ...payload };
  },
  /**
   * Removing a playlist from DB by playlist id and return empty body with 204;
   * returns 404 if not found
   * @param  {Object}  ctx  the default koa context whose encapsulates
   *                          node's request and response objects into a single object
   */
  async del(ctx) {
    const { id } = ctx.params;
    const key = `playlist:${id}`;
    const playlist = await ctx.redis.hgetall(key);
    if (_.isEmpty(playlist)) ctx.throw(404);

    await Promise.all([
      ctx.redis.del(key),
      ctx.redis.lrem('playlist:all', 0, key),
    ]);

    ctx.status = 204;
  },
};
