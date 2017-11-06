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

const BuildDTO = require('../dto/BuildDTO');

module.exports = {

  getBuilds: () => {
    return new Promise( (resolve, reject) => {

      var auth = Buffer.from(`${config.get('BAMBOO_USERNAME')}:${config.get('BAMBOO_PASSWORD')}`).toString('base64');

      request({
        url: `${config.get('BAMBOO_ENDPOINT')}/rest/api/latest/result?os_authType=basic&expand=results[0:100].result`,
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json'
        }
      }, (err, res, body) => {

        if(err) {
          return reject(err);
        }

        if(res.statusCode >= 400) {
          return reject({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage
          });
        }

        var builds = [];

        body = JSON.parse(body);

        if(body.results) {

          body.results.result.forEach((data) => {
            var build = new BuildDTO();
            build.setBuildUrl(_formatBuildUrl(data.link.href));
            build.setBuildStatus(data.buildState);
            build.setStartTime(new Date(data.buildStartedTime).getTime());
            build.setEndTime(new Date(data.buildCompletedTime).getTime());
            build.setDuration(data.buildDuration);
            // build.setCulprits();
            build.setProjectName(data.projectName);
            // build.setRepoName();
            build.setNumber(data.buildNumber);
            builds.push(build);
          });
        }

        resolve(builds);
      });
    });
  }

};

/**
 * This is needed to use a unique URL Id format for a build. For example:
 * "http://localhost:8080/mirrorgate/rest/api/latest/result/MG-TEST-10" needs
 * to be turned into "http://localhost:8080/mirrorgate/browse/MG-TEST/latest"
 * @param  {String} url API rest URL for a build
 * @return {String}     Unique URL Id
 */
function _formatBuildUrl(url) {
  let key_plan = url.replace(/.*\//,'').replace(/-\d+$/,'');
  return `${config.get('BAMBOO_ENDPOINT')}/browse/${key_plan}/latest`;
}