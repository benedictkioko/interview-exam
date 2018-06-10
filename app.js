const csv       = require('csvtojson');
const _         = require('lodash');
const moment    = require('moment');

const FIRST_TEST_CASE = './test/transaction_data_1.csv';
const SECOND_TEST_CASE = './test/transaction_data_2.csv';
const THIRD_TEST_CASE = './test/transaction_data_3.csv';

const _fetchBestClients = async ( transactions_csv_file_path = FIRST_TEST_CASE, n = 1 ) => {
    try {
        //transform data to json array
        let data = await csv().fromFile(transactions_csv_file_path);

        //sort by transaction date
        data = _.sortBy(data, ['transaction_date']);

        //format transaction_date to only month, day year
        data = data.map((transaction) => {
            return {
                ...transaction,
                transaction_date: moment(transaction.transaction_date).format('MMMM Do YYYY')
            };
        });

        //get all unique transaction days
        const transactionDays = _.uniq(data.map( transaction => transaction.transaction_date ));

        //get a list of all unique clients
        const clients = _.uniqBy(data.map( transaction => ({ customerId: transaction.customer_id, longestRun: 0, currentRun: 0 })), 'customerId');

        //create a client object with customerId as the key
        let clientObject = _.keyBy(clients, 'customerId');

        //loop through each unique day transaction
        transactionDays.forEach((day) => {

            //get all transactions for that day
            const transactionsForTheDay = data.filter( transaction => transaction.transaction_date === day );

            //loop through all unique clients
            clients.forEach((client) => {

                //get all client transactions for that day
                clientTransaction = transactionsForTheDay.filter( transaction => transaction.customer_id === client.customerId );
                //if we have a client transaction clientTransaction.length will be > 0
                if(clientTransaction && clientTransaction.length) {
                    // add a +1 to the currentRun
                    clientObject[client.customerId].currentRun = ++clientObject[client.customerId].currentRun;
                } else {
                    // check if the current run is greater than the longestRun consecutive run. if so current run becoms the longest run
                    if(clientObject[client.customerId].longestRun < clientObject[client.customerId].currentRun) {
                        clientObject[client.customerId].longestRun = clientObject[client.customerId].currentRun;
                    }
                    // reset current run to 0
                    clientObject[client.customerId].currentRun = 0;
                }
            });

        });
        //transform clientObject back to an array
        let clientArray = _.values(clientObject);
        //sort the array alphabetically using the customerId
        clientArray = _.sortBy(clientArray, ['customerId']);
        //sort the array from the highest to lowest longestRun
        //console.log(clientArray);
        clientArray.sort((a,b) => b.longestRun-a.longestRun);
        //map over client array to remove un needed data
        clientArray = clientArray.map( client => client.customerId );
        //return sliced data
        return clientArray.slice(0, n);
    } catch (error) {
        throw new Error('Uh-oh, something went wrong. Check your csv format');
    }
}

module.exports = _fetchBestClients;
