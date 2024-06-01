/* eslint-disable no-console, spaced-comment, func-call-spacing, no-spaced-func */

//==============================================================
// This is an example of polling (reading) Holding Registers
// on a regular scan interval with timeouts enabled.
// For robust behaviour, the next action is not activated
// until the previous action is completed (callback served).
//==============================================================

"use strict";

// create an empty modbus client
const ModbusRTU   = require ("modbus-serial");
const client      = new ModbusRTU();

client.connectRTUBuffered ("/dev/ttySC1", { baudRate: 115200, parity: "none", dataBits: 8, stopBits: 1 })
.then(setClient)
    .then(function() {
        console.log("Connected"); })
    .catch(function(e) {
        console.log(e.message); });

function setClient() {
    // set the client's unit id
    // set a timout for requests default is null (no timeout)
    client.setID(1);
    client.setTimeout(1000);

    // run program
    run();
}

function run() {
    // write to coil
    client.writeRegister(40,1)
        .then(function(d) {
            console.log("relay1 Led Off ", d); })
        .catch(function(e) {
            console.log(e.message); })
        .then(relay1_led_on);
}

const relay1_led_on = function()
{
    client.writeRegister(40,2)
        .then(function(d) {
            console.log("Write true to coil 5", d); })
        .catch(function(e) {
            console.log(e.message); })
        .then(relay1_led_off);

};

const relay1_led_off = function()
{
    client.writeRegister(40,3)
        .then(function(d) {
            console.log("Write true to coil 5", d); })
        .catch(function(e) {
            console.log(e.message); })
        .then(red_led_on);

};



const relay2_led_on = function()
{
    client.writeRegister(40,4)
        .then(function(d) {
            console.log("Write true to coil 5", d); })
        .catch(function(e) {
            console.log(e.message); })
        .then(relay2_led_off);

};

const relay2_led_off = function()
{
    client.writeRegister(40,5)
        .then(function(d) {
            console.log("Write true to coil 5", d); })
        .catch(function(e) {
            console.log(e.message); })
        .then(relay3_led_on);

};

const relay3_led_on = function()
{
    client.writeRegister(40,6)
        .then(function(d) {
            console.log("Write true to coil 5", d); })
        .catch(function(e) {
            console.log(e.message); })
        .then(relay3_led_off);

};

const relay3_led_off = function()
{
    client.writeRegister(40,7)
        .then(function(d) {
            console.log("Write true to coil 5", d); })
        .catch(function(e) {
            console.log(e.message); })
        .then(relay1_led_on);

};





function close() {
    client.close();
}

