'use strict';

var request = require('superagent');
var assert = require('chai').assert;
var statusPageUrl = 'https://api.statuspage.io/v1';
var page_id = 'tzx1szydvwcf';
var component_id = 'vq1z6f84vf4w';
var metric_id = 'b8k2xjt3b0kv';
var api_key = 'c3cb0449-e3b7-4618-a938-bcae06256d82'

describe('Status Page', function () {
  
  var reqBody = {
				"component": {
							"status": "operational",
							"name": "Teacher Registration"
							}
				};

  var reqBody1 = { 
  "metric": {
    "name": 'Student Registration1'
  }
};
  
  it('Update Teacher Registration', function (done) {
      request
        .put(statusPageUrl + '/pages/' + page_id + '/components/'  + component_id)
        .send (reqBody)
		.set({'content-type' : 'application/json'})
        .set({'Authorization' : 'c3cb0449-e3b7-4618-a938-bcae06256d82'})
        .end(function (err, res) {
          if (err) { done(err); }
          else {
            console.log("response\n" + JSON.stringify(res.body, null, 1));
            done();
          }
        });
  });
    it('Update Student Login Metrics', function (done) {
      request
        .patch(statusPageUrl + '/pages/' + page_id + '/metrics/'  + metric_id)
        .send (reqBody1)
		.set({'content-type' : 'application/json'})
        .set({'Authorization' : 'c3cb0449-e3b7-4618-a938-bcae06256d82'})
        .end(function (err, res) {
          if (err) { done(err); }
          else {
            console.log("response\n" + JSON.stringify(res.body, null, 1));
            done();
          }
        });
  });
});

