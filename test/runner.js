'use strict';

var request = require('superagent');
var assert = require('chai').assert;
var statusPageUrl = 'https://api.statuspage.io/v1';
var page_id = 'tzx1szydvwcf';
var component_id = 'vq1z6f84vf4w';
var metric_id = 'b8k2xjt3b0kv';
var teacher_registraction_metric_id = '1hbc9r4pn96w'
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
    "name": 'Student Registration2'
  }
};

  var reqBody2 = {
"data": {
    "timestamp": 1547211087,
     "value": 120
}};


  
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
  
      it('Update teacher registraction Metrics', function (done) {
      request
        .post(statusPageUrl + '/pages/' + page_id + '/metrics/' + teacher_registraction_metric_id + '/data.json')
        .send (reqBody2)
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

