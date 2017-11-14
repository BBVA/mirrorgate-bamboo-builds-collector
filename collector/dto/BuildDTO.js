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
function BuildDTO() {

  this.setBuildUrl = function(buildUril) {
    this.buildUrl = buildUril;
  };
  
  this.setBuildStatus = function(buildStatus) {
    this.buildStatus = buildStatus;
  };
  
  this.setStartTime = function(startTime) {
    this.startTime = startTime;
  };
  
  this.setEndTime = function(endTime) {
    this.endTime = endTime;
  };
  
  this.setDuration = function(duration) {
    this.duration = duration;
  };
  
  this.setCulprits = function(culprits) {
    this.culprits = culprits;
  };
  
  this.setProjectName = function(projectName) {
    this.projectName = projectName;
  };
  
  this.setRepoName = function(repoName) {
    this.repoName = repoName;
  };
  
  this.setBranch = function(branch) {
    this.branch = branch;
  };
  
  this.setNumber = function(number) {
    this.number = number;
  };
  
  this.setTimestamp = function(timestamp) {
    this.timestamp = timestamp;
  };

}

module.exports = BuildDTO;
