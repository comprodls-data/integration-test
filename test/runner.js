'use strict';

var request = require('superagent');
var ComproDLS = require('comprodls-sdk');
var assert = require('chai').assert;
var serviceAuthUrl = 'http://dls-cup-alpha-302611962.us-west-2.elb.amazonaws.com/lb-auth';
var accountid = 'cup1';
var extuserid = 'cmpqa_' + Date.now();
var spaceCode = 'INT-ORG-ONE';
var event, comproDLS, pushX;

describe('Space API Integration test', function () {

  before(function(done) {
    comproDLS = ComproDLS.init('alpha', 'cup');
    done();
  });

  beforeEach(function(done) {
    // Create a pushX Adapter which has 2 functions: grantByAccountId and grantByOrgId
    // Below is an example of grantByAccountId
    pushX = comproDLS.PushX();
    pushX.grantByAccountId({
      accountId: 'cup1',
      refId: extuserid,
      authKey: 'my-custom-auth-key'
    })
    .then(function(data) {
      event = pushX.connect(data);
      done();
    })
  });

  afterEach(function(done) {
    // Cleanup of the pushX
    event = undefined;
    pushX.cleanup();
    done();
  });

  var reqBody = {
    ext_user_id: extuserid,
    ref_id: extuserid,
    ext_role: "teacher",
    space_code: spaceCode
  };

  it('Join Space using Space Code', function (done) {

    // Subscribe to pushx_status
    // This will trigger if we subsribe to any channel with status report(failed or passed)
    event.on({ channel: 'pushx_status' }, function(status) {
      if(status.httpcode !== 200) { done('Error in pushx'); }
      else {
        console.log('********************************************');
        request
        .post(serviceAuthUrl + '/accounts/' + accountid + '/join-institute-space')
        .send (reqBody)
        .set({'accept' : 'application/json'})
        .set({'content-type' : 'application/json'})
        .end(function (err, res) {
          if (err) { done(err); }
          else { console.log("response\n" + JSON.stringify(res.body, null, 1)); }
        });
      }
    });

    // Here, we are subscribing to a channel, which will trigger above function with statusCode
    // AIM: we will hit the API only if we receive statusCode = 200.
    event.on({ accountid: accountid, channel: 'refid.' + extuserid }, function(data) {
      // Here, we will receive all the system-events.
      if(data.events.body.category === 'USER' && data.events.body.action === 'CREATE') {
        done();
      }
      else { done('Result not as expected'); }
    });

  });

});

