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

var config = {
  mirrorgate_builds_url: process.env.MIRRORGATE_BUILDS_URL || 'http://localhost:8080/mirrorgate',
  bamboo_builds_url: process.env.BAMBOO_BUILDS_URL || 'https://localhost:8080/bamboo',
  bamboo_user: process.env.BAMBOO_USER || '',
  bamboo_password: process.env.BAMBOO_PASSWORD || ''
};

module.exports = config;  