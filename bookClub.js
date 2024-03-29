import dotenv from 'dotenv';
import { Client } from "@notionhq/client";
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';

dotenv.config()
const inputFile = './ratings.csv';


// Initializing the client 
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})

const databaseId = process.env.NOTION_ID

// Put all initial entries into this new array
const dataFromCSV = [];

let bookHashData = {}

createReadStream(inputFile)
    .pipe(parse())
    .on('data', function (csvrow) {
        // put the  current csv row into the array

        dataFromCSV.push(csvrow);
    })
    .on('end', function () {
        dataFromCSV.forEach((bookItemEntry) => {
            const temporaryWord = bookItemEntry[0].trim().toLowerCase().split(" ")

            for (let i = 0; i < temporaryWord.length; i++) {
                temporaryWord[i] = temporaryWord[i][0].toUpperCase() + temporaryWord[i].substr(1);
            }
            // Clean up the format of both the title & reviewer strings
            const sanitizedReviewerEntry = bookItemEntry[1].trim()
            const sanitizedTitle = temporaryWord.join(' ')
            const rating = bookItemEntry[2]

            // If the same reviewer rated a book, keep that most recent occurence 
            if (!bookHashData[sanitizedTitle]) bookHashData[sanitizedTitle] = {}
            bookHashData[sanitizedTitle][sanitizedReviewerEntry] = rating
        })

        const bookList = Object.entries(bookHashData).map((book => {
            // A var that keeps track of the number of five star reviews for a book
            let faves = 0

            const title = book[0]
            const temp = Object.values(book[1])
            // convert book ratings from string to number values
            const convertedVals = temp.map(value => {

                const n = Number(value)
                if (n >= 5) { faves++ }

                return n
            })

            const bookRatingAverage = convertedVals.reduce((valA, valB) => Math.round(valA + valB / temp.length))

            return [title, Number(bookRatingAverage.toFixed(1)), faves]
        }));

        async function addNewItem(entry) {
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
        bookList.forEach(item => addNewItem(item))
    });
// Counting Sort
// function countingSort(arr) {
//  
//     let updatedArray = Array(100).fill(0)
//     arr.forEach(element => element < 100 ? updatedArray[element] += 1 : null)
//     return updatedArray
// }