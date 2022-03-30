# Chad's Bookclub

## What is it?

This is a program built with node that populates a Notion database with values converted from a CSV file.

## How it works

Firstly, we import the csv file and convert it using a third party npm package called ['csv-parse'](https://www.npmjs.com/package/csv-parse). After that, we proceed to store those converted results in an array. The next step is to do some clean up work on each value within the array. This includes removing dupilacte titles and any perceeding or trailing whitespace that might be present within the string for a title. Also, if there are duplicate ratings by the same user for a particular book title, we only want to keep the last rating and we remove any earlier duplications. All of this is done by looping for each element in the newly created csv array and applying the respective logic

### How to run it

In order to run this program do the following:

1. Import the csv file into the file where it will be use and then `npm i` from the terminal to install required packages(The primary dependencies are the notionhq/client & csv-parse)

2. After installing the packages, ensure your sensitive tokens are stored in a ['.env file'](https://www.npmjs.com/package/dotenv) so they won't be directly exposed publicly

3. To run the file from the terminal, use the command `node bookClub.js`

4. Check the corresponding database on Notion to see that the tables have been filled

### Short answer section

1. Was there anything you got stuck on?

   - Initially, adding more than one field per entry was not very clear from the documentation. They way I worked around this was by consulting the `api-enpoints` types file fo figure out what data type should be sent to the database and how to format the way the property values are accoundted for.

2. Do you have any suggestions for improving the API documentation to make it clearer or easier to use?

   - If there is a section specifically geared towards entering mutiple entries into a database, make it more prominent or highlighted more in the getting started section

3. Additional notes
   - If given more time I would have liked to implement some form of type checking using typescript(specificy what datatypes functions are expected to accept as arguments, using tuples where appropriate, etc)
