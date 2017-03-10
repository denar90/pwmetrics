if [[ $RUN_RECIPES = "1" ]];
  then yarn run gulp-example;
else
  npm run build &&
  if [[ $(node -v) =~ ^v6.* ]]; then
    node --harmony test
  else
    test
  fi
fi

test
	node_modules/.bin/mocha --require test/setup/common.js
