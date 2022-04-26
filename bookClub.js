import dotenv from 'dotenv';
import { Client } from "@notionhq/client";
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';

dotenv.config()
const inputFile = './ratings.csv';


// Initializing a client.
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})
const databaseId = process.env.NOTION_ID

//put all initial entries in an array
const dataFromCsv = [];

let bookHashData = {}

createReadStream(inputFile)
    .pipe(parse())
    .on('data', function (csvrow) {
        // put current csv row in the csvData array.
        dataFromCsv.push(csvrow);
    })
    .on('end', function () {
        dataFromCsv.forEach((itemEntry) => {
            const tempWord = itemEntry[0].trim().toLowerCase().split(" ")

            for (let i = 0; i < tempWord.length; i++) {
                tempWord[i] = tempWord[i][0].toUpperCase() + tempWord[i].substr(1);
            }
            // Clean up the format of the title & reviewer strings
            const sanitizedTitle = tempWord.join(' ')
            const sanitizedReviewer = itemEntry[1].trim()
            const rating = itemEntry[2]

            // If the same reviewer rated a book, keep the most recent occurence
            if (!bookHashData[sanitizedTitle]) bookHashData[sanitizedTitle] = {}
            bookHashData[sanitizedTitle][sanitizedReviewer] = rating
        })

        const bookList = Object.entries(bookHashData).map((book => {
            // a var that keeps track of the number of five star reviews for a book
            let faves = 0

            const title = book[0]
            const temp = Object.values(book[1])
            // convert ratings from string to number values
            const convertedVals = temp.map(value => {

                const n = Number(value)
                if (n >= 5) { faves++ }

                return n
            })

            const bookRatingAverage = convertedVals.reduce((valA, valB) => Math.round(valA + valB / temp.length))

            return [title, Number(bookRatingAverage.toFixed(1)), faves]
        }));

        async function addItem(entry) {
            try {
                const response = await notion.pages.create({
                    parent: { database_id: databaseId },
                    properties: {
                        'Book Title': {
                            'title': [
                                {
                                    "text": {
                                        "content": entry[0]
                                    }
                                },
                            ]
                        },
                        'Average Rating': {
                            number: entry[1]
                        },
                        'Favorites': {
                            number: entry[2]
                        }
                    },
                })
                console.log(response)

            } catch (error) {
                console.log(error)
            }
        }
        bookList.forEach(item => addItem(item))
    });
