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

const request = require('request');
const fs = require('fs');
const config = require('nconf');

config
  .argv()
  .env()
  .file('config/config.json');

const auth = new Buffer(config.get('MIRRORGATE_USERNAME') + ':' + config.get('MIRRORGATE_PASSWORD')).toString('base64');

module.exports = {

  getCollectorLatestDate: () => {
    return new Promise((resolve, reject) => {
      request({
        url: `${config.get('MIRRORGATE_ENDPOINT')}/api/collectors/${config.get("COLLECTOR_ID")}`,
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Authorization' : `Basic ${auth}`
        }
      }, (err, res, body) => {

        if(err) {
          console.error(err);
        }
        console.log('Last update ' + (body || 'never'));
        resolve(body);
      });
    });
    {id}
  },
  updateCollectorLatestDate: (date) => {
    return new Promise((resolve) => {
      request({
        url: `${config.get('MIRRORGATE_ENDPOINT')}/api/collectors/${config.get("COLLECTOR_ID")}`,
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          'Authorization' : `Basic ${auth}`
        },
        body: JSON.stringify(date)
      }, (err, res, body) => {
        if(err) {
          console.error(err);
        }

        resolve();
      });  
    });
  },

  sendBuilds: (builds) => {
    return new Promise((resolve, reject) => {

      let buildsSuccessfullySent = 0;
      let pending = builds.length;
      builds.forEach((build) => {
        request({
          url: `${config.get('MIRRORGATE_ENDPOINT')}/api/builds`,
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'Authorization' : `Basic ${auth}`
          },
          body: JSON.stringify(build)
        }, (err, res, body) => {
          pending--;

          if(err) {
            console.error(err);
          }

          if(res.statusCode >= 400) {
            console.error({
              statusCode: res.statusCode,
              statusMessage: res.statusMessage
            });
          } else {
            buildsSuccessfullySent++;
          }

          if(pending <= 0) {
            resolve(buildsSuccessfullySent);
          }
        });
      });
    });
  }
}