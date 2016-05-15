var assert = require('chai').assert;
var PgBoss = require('../src/index');
var helper = require('./testHelper');

describe('initialization', function(){
    
    beforeEach(function(finished) {
        helper.getDb().executeSql(`DROP SCHEMA IF EXISTS ${helper.config.schema} CASCADE`).then(() => finished());
    });
    
    it('should fail if connecting to an uninitialized instance', function(finished) {
        var boss = new PgBoss(helper.config);

        boss.on('error', function(error) {
            assert.isNotNull(error);
            finished();
        });

        boss.connect();
    });

    it('should start with a connection string', function(finished) {
        var boss = new PgBoss(helper.connectionString);

        boss.on('ready', function() {
            assert(true);
            finished();
        });

        boss.start();
    });

    

});