'use strict';

var Q = require('q');
var request = require('superagent');
var ComproDLS = require('comprodls-sdk');
var assert = require('chai').assert;
var serviceAuthUrl = 'http://dls-cup-alpha-302611962.us-west-2.elb.amazonaws.com/lb-auth';
var accountid = 'cup1';
var extuserid = 'cmpqa_' + Date.now();
var spaceCode = 'INT-ORG-ONE';
var pushXEvent, comproDLS, pushX;

describe('Space API Integration test', function () {

  before(function(done) {
    comproDLS = ComproDLS.init('alpha', 'cup');
    done();
  });

  afterEach(function(done) {
    // Cleanup of the pushX
    pushXEvent = undefined;
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

    this.timeout(5000);

    var options = { accountId: accountid, refId: extuserid, authKey: 'my-custom-auth-key' }

    pushXGrantByAccountId(options)
    .then(function(pushXEvent) {
      /*
        At this point we have been authorized with PubNub and
        and ready to subscribe to specific channels that we're
        interested in.
      */

      /*
        Setting up a PubNub event handler for all channel events. 
        Typical this will be called whenever we subscribe to 
        channels.

        This handler ONLY indicates the a successful or failure in
        subscription. The should be perform the ACTUAL TESTCASE LOGIC 
        i.e. API calls, etc. - only after a successful subscription.

      */
     pushXEvent.on({ channel: 'pushx_status' }, function(status) {

        if(status.httpcode !== 200) { done('Error in pushx'); }
        else {
          /*
            AT this point we have a SUCCESSFUL SUBSCRIPTION. We
            can proceed to make the necessary API Calls (i.e. logic
            of the TESTCASE)
          */

          request
          .post(serviceAuthUrl + '/accounts/' + accountid + '/join-institute-space')
          .send (reqBody)
          .set({'accept' : 'application/json'})
          .set({'content-type' : 'application/json'})
          .end(function (err, res) {
            if (err) { done(err); }
            else { console.log("response\n" + JSON.stringify(res.body, null, 1)); }
          });

          /*
            At this point the API(s) has been called  

            If you API is ASYNC in nature, do not call the  -- .done() -- callback
            based on a successful response (2XX). Instead the -- .done() -- callback 
            should be invoked based on receipt of the appropriate PUSH even (below)
          */
        }
      });


      /*
        Subscribe to specific channel to recieve approrpriate system
        events.

        Channel scope: "ALL EVENTS FOR REFID" - extuserid
      */
     pushXEvent.on({ accountid: accountid, channel: 'refid.' + extuserid }, function(data) {
        /*
          At this point we have a system event for
          REFID = extuserid. We are expecting (waiting) for the event
          corresponding to the API call made in the previously block
          i.e. USER.CREATE event is expected.
        */
        if(data.events.body.category === 'USER' && data.events.body.action === 'CREATE') {
          /*
            We recieved the correct event.
          */
          done();
        }
        else { 
          /*
            We recieved a different event. this can be ignored and we should
            keep waiting.
          */
        }
      });
    })
    .catch(function(err) { done(err); })

  });

});

function pushXGrantByOrgId() {
  // Create a pushX Adapter which has 2 functions: grantByAccountId and grantByOrgId
  // Below is an example of grantByUserOrgId
  var deferred = Q.defer();
  var options = { ext_user_id: 'user-101' };
  comproDLS.authWithExtUser('myorg', options, {})
  .then(function success(response) {
    return pushX.grantByUserOrgId({ authkey: 'my-custom-auth-key' })
  })
  .then(function(data) {
    pushXEvent = pushX.connect(data);
    deferred.resolve(pushXEvent);
  })
  .catch(function(err) { deferred.reject(err); })

  return deferred.promise;
}

// options = {accountId, refId, authKey}
function pushXGrantByAccountId(options) {
  // Create a pushX Adapter which has 2 functions: grantByAccountId and grantByOrgId
  // Below is an example of grantByAccountId
  var deferred = Q.defer();
  pushX = comproDLS.PushX();
  pushX.grantByAccountId({
    accountId: options.accountId,
    refId: options.refId,
    authKey: options.authKey
  })
  .then(function(data) {
    pushXEvent = pushX.connect(data);
    deferred.resolve(pushXEvent);
  })
  .catch(function(err) { deferred.reject(err); })

  return deferred.promise;
}

