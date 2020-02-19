const assert = require('chai').assert
const helper = require('./testHelper')
const Promise = require('bluebird')
const PgBoss = require('../')
const Contractor = require('../src/contractor')
const currentSchemaVersion = require('../version.json').schema

describe('multi-master', function () {
  this.timeout(10000)

  it('should only allow 1 master to start at a time', async function () {
    await helper.init()

    const instances = 20
    const config = helper.getConfig({ noSupervisor: true })

    try {
      await Promise.map(new Array(instances), () => new PgBoss(config).start())
    } catch (err) {
      console.log(err.message)
      assert(false)
    }
  })

  it('should only allow 1 master to migrate to latest at a time', async function () {
    await helper.init()
    const db = await helper.getDb()
    const config = helper.getConfig({ noSupervisor: true })
    const contractor = new Contractor(db, helper.getConfig())

    await contractor.create()

    await contractor.rollback(currentSchemaVersion)
    const oldVersion = await contractor.version()

    assert.notEqual(oldVersion, currentSchemaVersion)

    const instances = 10

    try {
      await Promise.map(new Array(instances), () => new PgBoss(config).start())
    } catch (err) {
      console.log(err.message)
      assert(false)
    }
  })
})