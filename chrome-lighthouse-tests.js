// Copyright 2016 Google Inc. All Rights Reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE
'use strict';

const util = require('util');
const fs = require('fs');

const median = require('median');
const lighthouse = require('lighthouse');
const ChromeLauncher = require('lighthouse/lighthouse-cli/chrome-launcher');
const perfConfig = require('lighthouse/lighthouse-core/config/perf.json');

const { getMessage, getMessageWithPrefix } = require('./lib/utils/messages');

const MAX_LIGHTHOUSE_TRIES = 2;
const _SIGINT = 'SIGINT';
const _SIGINT_EXIT_CODE = 130;

class PWMetrics {

  constructor(url, opts) {
    this.url = url;
    this.flags = opts.flags || {};
    this.flags.disableCpuThrottling = this.flags.disableCpuThrottling || false;
    this.runs = this.flags.runs || 1;
    this.sheets = opts.sheets;
    this.expectations = opts.expectations || false;
    this.tryLighthouseCounter = 0;

    if (this.flags.expectations) {
      if (this.expectations) {
        expectations.validateMetrics(this.expectations);
        expectations.normalizeMetrics(this.expectations);
      } else throw new Error(getMessageWithPrefix('ERROR', 'NO_EXPECTATIONS_FOUND'));
    }
  }

  start() {
    return this.run();
  }

  run() {
    return this.launchChrome()
      .then(() => {
        return lighthouse(this.url, this.flags, perfConfig).then(_ => {
          return new Promise(resolve => {
            console.log('waiting...');
            setTimeout(_ => {
              return resolve();
            }, 1000);
          });
        });
      })
      .then(data => {
        console.log('closing chrome');
        return this.launcher.kill().then(_ => data);
      });
  }

  launchChrome() {
    this.launcher = new (ChromeLauncher.ChromeLauncher || ChromeLauncher)();
    return this.launcher.isDebuggerReady()
      .catch(() => {
        console.log(getMessage('LAUNCHING_CHROME'));
        return this.launcher.run();
      });
  }
}

module.exports = PWMetrics;
