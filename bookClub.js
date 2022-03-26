const { Client } = require("@notionhq/client")

// Initializing a client
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})
const inputFile = './ratings.csv';
const { parse } = require('csv-parse');
const fs = require('fs');

const csvData = [];
fs.createReadStream(inputFile)
    .pipe(parse())
    .on('data', function (csvrow) {
        //do something with csvrow
        csvData.push(csvrow);
    })
    .on('end', function () {
        //do something with csvData
        console.log(csvData);
    });