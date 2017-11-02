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
const config = require('../config/config');

function MirrorgateCaller() {

  this.sendBuildsToBackend = function(builds){

    return new Promise((resolve, reject) => {

      let pending = builds.length;
      builds.forEach((build) => {
        request({
          url: `${config.mirrorgate_builds_url}/api/builds`,
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(build)
        }, (err, res, body) => {
          if(err) {
            console.log(err);
          }

          pending--;
          if(pending <= 0) {
            resolve(builds);
          }
        });
      });
    });
  };
}


module.exports = MirrorgateCaller;