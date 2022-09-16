const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const SimpleDb = require('../lib/simple-db');

const { CI, HOME } = process.env;
const BASE_DIR = CI ? HOME : __dirname;
const TEST_DIR = path.join(BASE_DIR, 'test-dir');

describe('simple database', () => {

  beforeEach(async () => {
    await fs.rm(TEST_DIR, { force: true, recursive: true });
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  it('GET:ID returns object by ID', async () => {
    const cat = {
      name: 'Leo',
      age: 5
    };
    const id = crypto.randomBytes(8).toString('hex');
    await fs.writeFile(`${TEST_DIR}/${id}.json`, JSON.stringify(cat));
    const db = new SimpleDb(TEST_DIR);
    const result = await db.get(id);
    expect(result).toEqual(cat);
  });

  it('SAVE should save an object', async () => {
    const savedObj = {
      name: 'TK',
      age: 3
    };
  
    const db = new SimpleDb(TEST_DIR);
    const actual = { ...savedObj, id : expect.any(String) };
    return db.save(savedObj)
      .then(newFile => { expect(newFile).toEqual(actual); 
      });
  });

  it('getAll should return all objects', async () => {
    const allObjects = [
      {
        name: 'Phoebe',
        age: 1
      },
      {
        name: 'Philly',
        age: 2
      },
      {
        name: 'Copper',
        age: 3
      },
    ];

    const db = new SimpleDb(TEST_DIR);

    allObjects.forEach(async object => {
      await db.save(object);
    });

    expect(await db.getAll()).toEqual([
      {
        name: expect.any(String),
        age: expect.any(Number),
        id: expect.any(String)
      },
      {
        name: expect.any(String),
        age: expect.any(Number),
        id: expect.any(String)
      },
      {
        name: expect.any(String),
        age: expect.any(Number),
        id: expect.any(String)
      },
    ]);
  });

});
