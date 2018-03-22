import moment from 'moment';

import {
  getDatabaseConnection,
  closeDBConnection,
  insertOne,
  insertMany,
  find,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
  findOneAndUpdate,
  findOneAndReplace,
  findOneAndDelete,
} from '../mongo';
import { winstonInfo } from '../logging';

let client;
let db;

// Open db connection before tests
beforeAll(() => getDatabaseConnection().then(({ mongoClient, clientDb }) => {
  client = mongoClient;
  db = clientDb;
}));

// Close db connection after tests
afterAll(() => closeDBConnection(client));

/**
 * Generic Functions
 */
describe('mongo Generic Components (libs/mongo)', () => {
  /**
   * Pre-tests and post-tests
   */
  const collection = 'testCollection1';

  beforeAll(() => db.createCollection(collection));
  afterAll(() => db.dropCollection(collection));

  /**
   * Insert document(s)
   */
  it('should insert one to db correctly', () => {
    const data = { a: 'test insert one', b: 1 };

    return insertOne(db, collection, data).then(dbResponse => {
      const { success, data } = dbResponse;

      expect(success).toBe(true);
      expect(data).toEqual({ n: 1 });
    }).catch(err => {
      expect(err).toEqual(undefined);
    });
  });

  it('should insert many to db correctly', () => {
    const data = [
      { a: 'test insert many', b: 1 },
      { a: 'test insert many', b: 2 },
      { a: 'test insert many', b: 3 },
      { a: 'test update many 2', b: 1 },
    ];

    return insertMany(db, collection, data).then(dbResponse => {
      const { success, data } = dbResponse;

      expect(success).toBe(true);
      expect(data).toEqual({ n: 4 });
    }).catch(err => {
      expect(err).toEqual(undefined);
    });
  });

  /**
   * Find document(s)
   */
  it('should find document(s) db correctly', () => {
    const insertOneData = { a: 'test insert one' };
    const insertManyData = { a: 'test insert many' };

    return Promise.all([
      find(db, collection, insertOneData),
      find(db, collection, insertManyData)
    ]).then((promiseResults) => {
      const { '0': resultFindOne, '1': resultFindMany } = promiseResults;

      const { success: successFindOne, data: dataFindOne } = resultFindOne;
      const { success: successFindMany, data: dataFindMany } = resultFindMany;

      expect(successFindOne).toBe(true);
      expect(dataFindOne.length).toEqual(1);

      expect(successFindMany).toBe(true);
      expect(dataFindMany.length).toEqual(3);
    }).catch(err => {
      expect(err).toEqual(undefined);
    });
  });

  /**
   * Update document(s)
   */
  it('should update a document inside the db correctly', () => {
    const query = { a: 'test insert one' };
    const update = {
      $set: {
        a: 'test update one',
      },
      $inc: {
        b: 3,
      },
    };
    const opts = undefined;

    return updateOne(db, collection, query, update, opts).then(dbResponse => {
      const { success, data } = dbResponse;

      expect(success).toBe(true);
      expect(data).toEqual({ n: 1, nModified: 1 });
    }).catch(err => {
      expect(err).toEqual(undefined);
    });
  });

  it('should update documents inside the db correctly', () => {
    const query = { a: 'test insert many' };
    const update = {
      $set: {
        a: 'test update many',
      },
      $inc: {
        b: 3,
      },
    };
    const opts = undefined;

    return updateMany(db, collection, query, update, opts).then(dbResponse => {
      const { success, data } = dbResponse;

      expect(success).toBe(true);
      expect(data).toEqual({ n: 3, nModified: 3 });
    }).catch(err => {
      expect(err).toEqual(undefined);
    });
  });

  /**
   * Delete document(s)
   */
  it('should delete a document inside the db correctly', () => {
    const query = { a: 'test update one', b: 4 };

    return deleteOne(db, collection, query).then(dbResponse => {
      const { success, data } = dbResponse;

      expect(success).toBe(true);
      expect(data).toEqual({ n: 1 });
    }).catch(err => {
      expect(err).toEqual(undefined);
    });
  });

  it('should delete documents inside the db correctly', () => {
    const query = { a: 'test update many' };

    return deleteMany(db, collection, query).then(dbResponse => {
      const { success, data } = dbResponse;

      expect(success).toBe(true);
      expect(data).toEqual({ n: 3 });
    }).catch(err => {
      expect(err).toEqual(undefined);
    });
  });

  /**
   * Find document(s) combination
   */
  it('should find and update a document inside the db correctly', () => {
    const query = { a: 'test update many 2', b: 1 };
    const update = {
      $set: {
        b: 5,
      },
    };
    const options = {
      upsert: true,
    };

    return findOneAndUpdate(db, collection, query, update, options).then(dbResponse => {
      const { success, data } = dbResponse;

      expect(success).toBe(true);
      expect(data.value.a).toBe('test update many 2');
      expect(data.value.b).toBe(1);
    }).catch(err => {
      expect(err).toEqual(undefined);
    });
  });

  it('should find and replace a document inside the db correctly', () => {
    const query = { a: 'test update many 2', b: 5 };
    const replacement = {
      a: 'test update many 2',
      b: 15,
    };

    return findOneAndReplace(db, collection, query, replacement).then(dbResponse => {
      const { success, data } = dbResponse;

      expect(success).toBe(true);
      expect(data.value.a).toBe('test update many 2');
      expect(data.value.b).toBe(5);
    }).catch(err => {
      expect(err).toEqual(undefined);
    });
  });

  it('should find and delete a document inside the db correctly', () => {
    const query = { a: 'test update many 2', b: 15 };

    return findOneAndDelete(db, collection, query).then(dbResponse => {
      const { success, data } = dbResponse;

      expect(success).toBe(true);
      expect(data.value.a).toBe('test update many 2');
      expect(data.value.b).toBe(15);
    }).catch(err => {
      expect(err).toEqual(undefined);
    });
  });
});
