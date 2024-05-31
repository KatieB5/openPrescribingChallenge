# OpenPrescribing API coding challenge: Solution

## Tool overview

This is a command line tool which takes the chemical code for a medicine and uses the OpenPrescribing API to retrieve the chemical name and the Integrated Care Boards (ICB) that have prescribed the chemical most frequently each month over the past 5 years.

### Code structure

1. Chemical code check: before any API calls are made, the structure of the input is validated
2. Chemical name and spending data retrieval: calls are made to separate endpoints of the OpenPrescribingAPI to fetch the chemical name and the spending data.
3. API response and data retrieval checks: validates API call responses and ensures a valid chemical code has been input by the user
4. Spending data processing and sorting: the spending data are sorted by date (ascending) and then by number of items (descending) within each date, before being filtered to obtain the ICBs with the highest number of items for each month.
5. The final data object containing the chemical name and spending data is returned and printed.

### Design decisions

1. As node:test had already been implemented, and I haven't used it before, I decided to keep using this to test my coding solution. However if I could re-do this coding task I would use the Jest testing library as I'm familiar with it, it provides a wider range of features vs node:test, has a large supporting community and has comprehensive docs
2. Originally I had two separate functions within the tool file, for separation of concerns (retrieval of chemical name and retrieval and processing of spending data). I later refactored this to have one function to reduce some redundancy in my code, although:
   - This meant my previous tests became redudant
   - Perhaps a better way to refactor (to maintian some separation of concerns) would have been to have the data retrieval for both API calls in the getChemicalCode function, then have a separate function (called by getChemicalCode) which handles the spending data sorting and processing

## Get started

1. No dependancies are required for this project, so you can dive straight in with running tests or using the tool
2. Run the tests:
   `npm run test`
3. Use the tool:
   `$ node optool.js <valid-9-letter-bnf-code>`

## Tool output

The output from the tool will print the chemical name, followed by a list of the ICBs that have prescribed the chemical most frequently each month over the past 5 years.

Below is an example output for 0407010AD (a subset of the full results is shown, omitted parts are denoted by `...`)

```
Paracetamol and ibuprofen
....
2020-08-01 NHS SOUTH WEST LONDON INTEGRATED CARE BOARD 4
2020-09-01 NHS HUMBER AND NORTH YORKSHIRE INTEGRATED CARE BOARD 2
2020-10-01 NHS HUMBER AND NORTH YORKSHIRE INTEGRATED CARE BOARD 3
2020-11-01 NHS HUMBER AND NORTH YORKSHIRE INTEGRATED CARE BOARD 4
2020-12-01 NHS NORTH WEST LONDON INTEGRATED CARE BOARD 4
2021-01-01 NHS HUMBER AND NORTH YORKSHIRE INTEGRATED CARE BOARD 4
2021-02-01 NHS HUMBER AND NORTH YORKSHIRE INTEGRATED CARE BOARD 4
...

```
