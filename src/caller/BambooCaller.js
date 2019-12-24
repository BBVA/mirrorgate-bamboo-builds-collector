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
        url: `${config.get('BAMBOO_ENDPOINT')}/rest/api/latest/result.json?os_authType=basic&expand=results.result,results.result.plan.branches.branch.latestResult`,
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

        body = JSON.parse(body);

        resolve(getBuilds(body.results.result));
      });
    });
  }
};

function stateMapper(source) {
  return {
    Successful: 'Success',
    Failed: 'Failure',
  }[source] || source;
}

function getBuilds(results) {
  var builds = [];
  results.filter((d) => d.enabled || (d.plan && d.plan.enabled)).forEach((data) => {
    if(data.buildState || data.latestResult) {
      var build = new BuildDTO();
      build.setBuildUrl(_formatBuildUrl(data.link.href));
      build.setBuildStatus(stateMapper(data.buildState || data.latestResult.buildState));
      if(data.buildStartedTime || data.latestResult.buildStartedTime) {
        build.setStartTime(new Date(data.buildStartedTime || data.latestResult.buildStartedTime).getTime());
        build.setTimestamp(new Date(data.buildStartedTime || data.latestResult.buildStartedTime).getTime());
      }
      if(data.buildCompletedTime || data.latestResult.buildCompletedTime) {
        build.setEndTime(new Date(data.buildCompletedTime || data.latestResult.buildCompletedTime).getTime());
        build.setTimestamp(new Date(data.buildCompletedTime || data.latestResult.buildCompletedTime).getTime());
      }
      build.setDuration(data.buildDuration || data.latestResult.buildDuration || null);
      // build.setCulprits();
      build.setProjectName(data.projectName || data.latestResult.projectName || null);
      build.setRepoName(data.planName || data.latestResult.plan.master.shortName || null);
      build.setNumber(data.buildNumber || data.latestResult.buildNumber || null);
      build.setBranch(data.shortName || 'master');
      builds.push(build);
    } else {
      console.log('Not execution for build ' + data.link.href);
    }
    if(data.plan && data.plan.branches) {
      builds.push.apply(builds, getBuilds(data.plan.branches.branch));
    }
  });
  return builds;
}

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
