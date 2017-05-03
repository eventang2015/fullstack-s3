# fullstack-s3
Simple Mongoose-Express-Angular-Node "contact book" application, with Karma/Jasmine unit tests, and
optional AWS S3 image store.

NOTE: this doesn't use nice things like express-generator, yeoman, grunt, and so on, more "bare bones".

# PREREQUISITES:

## 1. Install Mongo and Node

## 2. Setup and start Mongo in one command window:
```
    md \data\db
    c:\path\to\mongod.exe
```

# PACKAGES and CODE (NON-GIT APPROACH):

## 1. In another command window, create project and install node packages:
```
    mkdir fullstack (or any project name <app> you choose)
    cd <app>
    npm init (all defaults except specify server.js instead of index.js for main server)
    npm install --save express
    npm install --save ejs
    npm install --save angular
    npm install --save mongoose (mongodb client)
    npm install --save aws-sdk (for s3 image storage)
    npm install --save-dev nodemon
```

## 2. Develop the application:
```
    create <app>/views/index.ejs and <app>/app/app.js with the angular page html and code
    create <app>/models/Contact.js with the Contact model
    create <app>/routes/contacts.js with the /contacts route code
    create <app>/server.js with the express app code
    add <app>/package.json script "dev" "nodemon index.js"
```

# PACKAGES and CODE (GIT APPROACH):

## 1. If you started with cloning the Git repository, then:
```
    npm install
```

# RUNNING

## 1. Run the development server:
```
    npm run dev
```

NOTE: In order to use the AWS S3 image store, you must set some environment variables first:
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION
MY_S3_BUCKET
```

## 2. Open your browser to localhost:3000 and use the application:

### A. Enter a first name into the "New" field and click "Create"

### B. Click on the first name which now appears in the table

### C. Add a last name, address, and/or company, and click "Save"

The last saved data is now displayed on the right side of the screen.

### D. Upload an image file, etc.

# UNIT TESTING

## 1. If you did not clone from the Git repository:

### A. install the unit testing libraries:
```
    npm install --save-dev karma karma-jasmine jasmine-core karma-chrome-launcher
    npm install --save-dev angular-mocks angular-resource angular-route
    karma init (all defaults)
    npm install -g karma-cli
```

### B. In karma.conf.js:
```
    // list of files / patterns to load in the browser
    files: [
    './node_modules/angular/angular.js',
    './node_modules/angular-resource/angular-resource.js',
    './node_modules/angular-route/angular-route.js',
    './node_modules/angular-mocks/angular-mocks.js',
    './app/app.js',
    './spec/*Spec.js'
    ]
```

### C. In package.json, add script "test" -> "karma start"

## 2. Run the tests:
```
    npm run test
```
