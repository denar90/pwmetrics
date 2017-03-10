if [[ $RUN_RECIPES = "1" ]];
  then yarn run gulp-example;
else
  npm run build &&
  if [[ $(node -v) =~ ^v6.* ]]; then
    ./node_modules/.bin/mocha --harmony --require ./test/setup/common.js
  else
    ./node_modules/.bin/mocha --require ./test/setup/common.js
  fi
fi

