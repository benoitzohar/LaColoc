La coloc
========

A NodeJS app for your flat or your weekend holidays.

To get started, copy `config.example.json` to `config.development.json`, make sure it is correct and :    

`npm install`  
`npm start`

If you have nodemon installed (`npm i -g nodemon`), you can run `npm run dev`


Production
----------

The configuration json file is loaded using the NODE_ENV variable, such as `config.{NODE_ENV}.json`.
