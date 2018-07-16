import { Router } from 'express';
import HttpError from 'http-errors';
import Profile from '../model/profile';
import bearerAuthMiddle from '../lib/middleware/bearer-auth-middleware';
import logger from '../lib/logger';

const profileRouter = new Router();

profileRouter.post('/api/profiles', bearerAuthMiddle, (req, res, next) => {
  if (!req.account) return new HttpError(500, 'error');

  Profile.init()
    .then(() => {
      return new Profile({
        ...req.body,
        accountId: req.account._id,
      }).save();
    })
    .then((profile) => {
      logger.log(logger.INFO, 'POST profile-router: profile created');
      return res.json(profile);
    })
    .catch(next);
  return undefined;
});

profileRouter.get('/api/profiles/:id?', bearerAuthMiddle, (request, response, next) => {
  if (!request.account) return next(new HttpError(400, 'GET PROFILE ROUTER-AUTH: invalid request'));
  if (!request.params.id) {
    Profile.find({})
      .then((profiles) => {
        return response.json(profiles);
      })
      .catch(next);
    return undefined;
  }
  Profile.findOne({ _id: request.params.id })
    .then((profile) => {
      if (!profile) return next(new HttpError(400, 'profile not found'));
      logger.log(logger.INFO, `PROFILE ROUTER GET: found profile: ${JSON.stringify(profile, null, 2)}`);
      return response.json(profile);
    })
    .catch(next);
  return undefined;
});

export default profileRouter;
