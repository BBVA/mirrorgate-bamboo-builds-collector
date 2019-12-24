/*
 * Copyright 2017 Banco Bilbao Vizcaya Argentaria, S.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* Run as Lambda fucntion */
/* Run as Lambda fucntion */
const AWS = require('aws-sdk');
const config = require('nconf');

config
  .argv()
  .env()
  .file('config/config.json');

const MGCaller = require('./src/caller/MirrorgateCaller');
const BambooCaller = require('./src/caller/BambooCaller');

exports.handler = (event, context) =>  {

  context.callbackWaitsForEmptyEventLoop = false;

  if(config.get('S3_BUCKET_NAME') && config.get('S3_BUCKET_KEY')) {
    let s3 = new AWS.S3();
    s3.getObject({
      Bucket: config.get('S3_BUCKET_NAME'),
      Key: config.get('S3_BUCKET_KEY')
    }).promise()
      .then((data) => {
        data = JSON.parse(data.Body);
        config.set('MIRRORGATE_USERNAME', data.MIRRORGATE_USERNAME);
        config.set('MIRRORGATE_PASSWORD', data.MIRRORGATE_PASSWORD);
        config.set('BAMBOO_USERNAME', data.BAMBOO_USERNAME);
        config.set('BAMBOO_PASSWORD', data.BAMBOO_PASSWORD);
        getBuilds();
      })
      .catch( err => console.error(`Error: ${JSON.stringify(err)}`));
  } else {
    getBuilds();
  }
};

function getBuilds(isMasterBranch) {
  return MGCaller.getCollectorLatestDate().then((lastTS) =>  {
    return BambooCaller
    .getBuilds(isMasterBranch)
    .then( (builds) => {
      builds = builds.filter((b) => b.timestamp > lastTS);
      if(builds.length > 0){
        MGCaller
          .sendBuilds(builds)
          .then( res => {
            console.log(`${res} builds successfully sent to MirrorGate`);
            let lastTS = builds.reduce((a,b) => Math.max(a, b.timestamp), 0);
            return MGCaller.updateCollectorLatestDate(new Date(lastTS));
          })
          .catch( err => console.error(`Error: ${JSON.stringify(err)}`));
      } else {
        console.log('There are not builds to send');
      }
    })
    .catch( err => console.error(err));
  });

}