import { Client } from "@notionhq/client";
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';

// Initializing a client
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})
const inputFile = './ratings.csv';


const csvData = [];
createReadStream(inputFile)
    .pipe(parse())
    .on('data', function (csvrow) {
        //do something with csvrow
        csvData.push(csvrow);
    })
    .on('end', function () {
        //do something with csvData
        console.log(csvData);
    });

