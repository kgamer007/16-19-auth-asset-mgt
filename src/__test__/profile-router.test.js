import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import { createAccountMockPromise } from './lib/account-mock';
import { removeAllResources, createProfileMockPromise } from './lib/profile-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api`;

describe('TESTING ROUTER PROFILE', () => {
  let mockData;
  let token; // eslint-disable-line
  let account; // eslint-disable-line

  beforeAll(() => {
    startServer();
  });

  afterAll(() => {
    stopServer();
  });

  beforeEach(async () => {
    await removeAllResources();

    try {
      mockData = await createAccountMockPromise();
      account = mockData.account; // eslint-disable-line
      token = mockData.token; // eslint-disable-line
    } catch (err) {
      return console.log(err); // eslint-disable-line
    }
    return undefined;
  });

  describe('POST PROFILE ROUTES TESTING', async () => {
    test('POST 200 to /api/profiles for successful profile creation', async () => {
      const mockProfile = {
        bio: faker.lorem.words(20),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      try {
        const response = await superagent.post(`${apiUrl}/profiles`)
          .set('Authorization', `Bearer ${token}`)
          .send(mockProfile);

        expect(response.status).toEqual(200);
        expect(response.body.accountId).toEqual(account._id.toString());
        expect(response.body.firstName).toEqual(mockProfile.firstName.toString());
        expect(response.body.lastName).toEqual(mockProfile.lastName.toString());
        expect(response.body.bio).toEqual(mockProfile.bio.toString());
      } catch (err) {
        expect(err).toEqual('foo');
      }
    });
  });

  test('POST 401 for trying to post a profile with a bad token', async () => {
    try {
      const response = await superagent.post(`${apiUrl}/profiles`)
        .set('Authorization', 'Bearer BADTOKEN');
      expect(response).toEqual('foo');
    } catch (err) {
      expect(err.status).toEqual(401);
    }
  });
  describe('GET to /api/profiles', () => {
    test('GET 200 to /api/profiles for successfully created profile', async () => {
      try {
        const savedProfile = await createProfileMockPromise();
        const getProfile = await superagent.get(`${apiUrl}/profiles/${savedProfile.profile._id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(getProfile.status).toEqual(200);
      } catch (err) {
        expect(err.status).toEqual('foo');
      }
    });

    test('404 for for bad token', async () => {
      try {
        const response = await superagent.get(`${apiUrl}/profiles/badID`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual('foo');
      } catch (err) {
        expect(err.status).toEqual(404);
      }
    });
  });
});
