// Copyright 2016 Google Inc. All Rights Reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE
'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect');
const PWMetrics = require('../../lib/');
const port = 8080;

const connectServer = function() {
  return connect.server({
    root: '../public',
    port: port
  });
};

function handleError(err) {
  console.log(err.toString());
  process.exit(1);
}

gulp.task('pwmetrics', function() {
  connectServer();

  const url = `http://localhost:${port}/index.html`;
  const pwMetrics = new PWMetrics(url, {
    flags: {
      expectations: true
    },
    expectations: {
        ttfcp: {
          warn: '>=300',
          error: '>=500'
        },
        ttfmp: {
          warn: '>=300',
          error: '>=50'
        },
        psi: {
          warn: '>=150',
          error: '>=320'
      }
    }
  });
  return pwMetrics.start()
    .then(_ => {
      connect.serverClose();
      process.exit(0);
    })
    .catch(_ => handleError);
});

gulp.task('default', ['pwmetrics']);
