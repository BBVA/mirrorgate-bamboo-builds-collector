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

const BuildsService = require('./service/BuildsService');

var service = new BuildsService();

exports.handler = (event, context, callback) =>  {
  
  context.callbackWaitsForEmptyEventLoop = false;

  service
    .getBambooBuilds()
    .then( (builds) => {
      if(builds.length > 0){   
        service
          .sendBuilds(builds)
          .then( (res) => {
            console.log(res);
            callback(null, res);
          })
          .catch( (err) => {
            callback(err);
          });
      } else {
        console.log('There are not builds to send');
        callback(null, 'There are not builds to send');
      }
    })
    .catch( (err) => {
      callback(err);
    });

};
