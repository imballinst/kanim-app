const MongoClient = Promise.promisifyAll(require('mongodb').MongoClient);

const {
  NODE_ENV, MONGO_URL, MONGO_DATABASE, MONGO_TEST_DATABASE,
} = require('../config/env');
const { winstonInfo } = require('./logging');
const { destructureObj } = require('./objectUtil');

// Database URL
const mongoDatabase = NODE_ENV !== 'test' ? MONGO_DATABASE : MONGO_TEST_DATABASE;

/**
 * Database Connection
 */
const getDatabaseConnection = () => MongoClient.connect(MONGO_URL).then((client) => {
  winstonInfo('Connected to MongoDB server successfully!');

  return { mongoClient: client, clientDb: client.db(mongoDatabase) };
});
const closeDBConnection = client => client.close();

/**
 * Generic CRUD Operations
 * Create, Read, Update, Delete, all transformed to generic response
 */
const insertOne = (db, collection, doc) => db
  .collection(collection)
  .insertOne(doc)
  .then((queryResult) => {
    const jsonResult = queryResult.toJSON();
    const { ok, rest: restProps } = destructureObj(jsonResult, ['ok']);

    return { success: ok === 1, data: restProps };
  });

const insertMany = (db, collection, doc) => db
  .collection(collection)
  .insertMany(doc)
  .then((queryResult) => {
    const jsonResult = queryResult.result;
    const { ok, rest: restProps } = destructureObj(jsonResult, ['ok']);

    return { success: ok === 1, data: restProps };
  });

const find = (db, collection, queryParams, sortParams, limitParams) => {
  const queryObject = queryParams || {};
  const sortObject = sortParams || {};
  const limit = limitParams || 0;

  return db.collection(collection).find(queryObject).sort(sortObject).limit(limit)
    .toArray()
    .then(queryResult => ({ success: true, data: queryResult }));
};

const updateOne = (db, collection, queryParams, update, options) => db
  .collection(collection).updateOne(
    queryParams,
    update,
    options
  ).then((queryResult) => {
    const jsonResult = queryResult.toJSON();
    const { ok, rest: restProps } = destructureObj(jsonResult, ['ok']);

    return { success: ok === 1, data: restProps };
  });

const updateMany = (db, collection, queryParams, update, options) => db
  .collection(collection).updateMany(
    queryParams,
    update,
    options
  ).then((queryResult) => {
    const jsonResult = queryResult.toJSON();
    const { ok, rest: restProps } = destructureObj(jsonResult, ['ok']);

    return { success: ok === 1, data: restProps };
  });

const deleteOne = (db, collection, queryParams) => db
  .collection(collection).deleteOne(queryParams).then((queryResult) => {
    const jsonResult = queryResult.toJSON();
    const { ok, rest: restProps } = destructureObj(jsonResult, ['ok']);

    return { success: ok === 1, data: restProps };
  });

const deleteMany = (db, collection, queryParams) => db
  .collection(collection).deleteMany(queryParams).then((queryResult) => {
    const jsonResult = queryResult.toJSON();
    const { ok, rest: restProps } = destructureObj(jsonResult, ['ok']);

    return { success: ok === 1, data: restProps };
  });

const findOneAndUpdate = (db, collection, queryParams, update, options) => db
  .collection(collection).findOneAndUpdate(
    queryParams,
    update,
    options
  ).then((queryResult) => {
    const { ok, rest: restProps } = destructureObj(queryResult, ['ok']);

    return { success: ok === 1, data: restProps };
  });

const findOneAndReplace = (db, collection, queryParams, replacement, options) => db
  .collection(collection).findOneAndReplace(
    queryParams,
    replacement,
    options
  ).then((queryResult) => {
    const { ok, rest: restProps } = destructureObj(queryResult, ['ok']);

    return { success: ok === 1, data: restProps };
  });

const findOneAndDelete = (db, collection, queryParams, options) => db
  .collection(collection).findOneAndDelete(
    queryParams,
    options
  ).then((queryResult) => {
    const { ok, rest: restProps } = destructureObj(queryResult, ['ok']);

    return { success: ok === 1, data: restProps };
  });

module.exports = {
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
};
