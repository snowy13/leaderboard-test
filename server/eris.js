// requires
import fs from 'fs';
import prompt from 'prompt';
import erisC from 'eris-contracts';
//var fs = require('fs');
//var prompt = require('prompt');
//var erisC = require('eris-contracts');

// NOTE. On Windows/OSX do not use localhost. find the
// url of your chain with:
// docker-machine ls
// and find the docker machine name you are using (usually default or eris).
// for example, if the URL returned by docker-machine is tcp://192.168.99.100:2376
// then your erisdbURL should be http://192.168.99.100:1337/rpc
var erisdbURL = "http://192.168.99.101:1337/rpc";

// get the abi and deployed data squared away
var saflokKeyFactoryContractData = require('./epm.json');
var saflokKeyFactoryContractAddress = saflokKeyFactoryContractData["deployStorageK"];
var saflokKeyFactoryAbi = JSON.parse(fs.readFileSync("./abi/" + saflokKeyFactoryContractAddress));

// properly instantiate the contract objects manager using the erisdb URL
// and the account data (which is a temporary hack)
var accountData = require('./accounts.json');
var contractsManager = erisC.newContractManagerDev(erisdbURL, accountData.access2_full_000);

// properly instantiate the contract objects using the abi and address
var saflokKeyFactoryContract = contractsManager.newContractFactory(saflokKeyFactoryAbi).at(saflokKeyFactoryContractAddress);

// display the current value of idi's contract by calling
// the `get` function of idi's contract

function getValue(callback) {
  saflokKeyFactoryContract.get(function(error, result){
    if (error) { throw error }
    console.log("The key in hex is:\t\t\t" + result);
    callback();
  });
}

// prompt the user to change the value of idi's contract
function changeValue() {
  prompt.message = "What name shoud we register?";
  prompt.delimiter = "\t";
  prompt.start();
  prompt.get(['value'], function (error, result) {
    if (error) { throw error }
    setValue(result.value)
  });
}

// using eris-contracts call the `set` function of idi's
// contract using the value which was recieved from the
// changeValue prompt
function setValue(value) {
  saflokKeyFactoryContract.set(value, function(error, result){
    if (error) { throw error }
    getValue(function(){});
  });
}

// run
getValue(changeValue);
