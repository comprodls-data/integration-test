'use strict';

var request = require('superagent');
var assert = require('chai').assert;
var statusPageUrl = 'https://api.statuspage.io/v1/';
var page_id = 'tzx1szydvwcf';
var component_id = '0a62712f-2a1a-4c66-970e-9f75e86ffe02';
var api_key = 'c3cb0449-e3b7-4618-a938-bcae06256d82'

describe('Status Page', function () {
  
  var reqBody = {
"component": {
"status": "under_maintenance",
"name": "Teacher Registration"
}
  
  it('Update Teacher Registration', function (done) {
      request
        .put(statusPageUrl + '/pages/' + page_id + '/components/'  + component_id)
        .send (reqBody)
        .set({'accept' : 'application/json'})
        .set({'content-type' : 'application/json'})
        .set({'Authorization' : token})
        .end(function (err, res) {
          if (err) { done(err); }
          else {
            console.log("response\n" + JSON.stringify(res.body, null, 1));
            done();
          }
        });
  });
});

