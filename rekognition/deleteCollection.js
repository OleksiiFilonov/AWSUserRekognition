'use strict';

const AWS = require('aws-sdk');
var rekognition = new AWS.Rekognition();

module.exports.handler = (event, context, callback) => {

  const params = {
   CollectionId: "userPhotos"
  };
  rekognition.deleteCollection(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      callback(new Error('Error during removing Collection', err));
    } else {
      console.log(data);           // successful response
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'collection removed',
          data: data,
          input: event
        }),
      };
      callback(null, response);
    }
  });





  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
