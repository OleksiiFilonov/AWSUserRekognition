'use strict';

const AWS = require('aws-sdk');
var rekognition = new AWS.Rekognition();
var s3 = new AWS.S3();

module.exports.handler = (event, context, callback) => {

  const body = JSON.parse(event.body);
  //image - Base-64 encoded
  //user name -> ExternalImageId

  var params = {
    Body: <Binary String>,
    Bucket: "user-images-bucket-jnj",
    Key: file.path,
    Tagging: "user=" + userName
  };
 s3.putObject(params, function(err, data) {
   if (err) {
     console.log(err, err.stack); // an error occurred
     callback(new Error('Can''t upload to S3 backet'))
   }
   else     console.log(data);           // successful response
   /*
   data = {
    ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
    ServerSideEncryption: "AES256",
    VersionId: "Ri.vC6qVlA4dEnjgRV4ZHsHoFIjqEMNt"
   }
   */
 });


  const params = {
    CollectionId: 'userPhotos', /* required */
    Image: { /* required */
      Bytes: new Buffer('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
      S3Object: {
        Bucket: 'user-images-bucket-jnj',
        Name: 'userName'
      }
    },
    DetectionAttributes: [
      DEFAULT | ALL,
      /* more items */
    ],
    ExternalImageId: 'userName'
  };
  rekognition.indexFaces(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });

  rekognition.createCollection(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      callback(new Error('Error during Collection creation', err));
    } else {
      console.log(data);           // successful response
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'collection created',
          data: data,
          input: event
        }),
      };
      callback(null, response);
    }
  });
};
