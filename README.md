# MirrorGate plugin for Bamboo

![MirrorGate](./media/images/logo-ae.png)


This Node application connects to Bamboo and retrieves the latest builds that have been executed in the target instance.


# Configuring

Check [config.js](./collector/config/config.json) file to check for configuration options.

# Usage

First install dependencies

```sh
  cd collector
  npm i
```

Then run `local.js` with npm

```sh
  nmp run local
```

or with npm

```sh
  npm run start
```

## Running in Amazon Lambda

First package script zip with the following gulp task

```sh
./node_modules/gulp/bin/gulp.js package
```
or with npm

```sh
npm run package
```

Create a lambda with runtime Node.js 6.10 or grater and folowing handler `lambda.handler`. Note it will execute only once, so you will have to use a timed trigger to execute it eventually.
