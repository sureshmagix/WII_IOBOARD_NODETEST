/* eslint-disable no-console, spaced-comment, func-call-spacing, no-spaced-func */

//==============================================================
// This is an example of polling (reading) Holding Registers
// on a regular scan interval with timeouts enabled.
// For robust behaviour, the next action is not activated
// until the previous action is completed (callback served).
//==============================================================

"use strict";

//==============================================================
// create an empty modbus client
const ModbusRTU   = require ("modbus-serial");
const client      = new ModbusRTU();

let mbsStatus   = "Initializing...";    // holds a status of Modbus

// Modbus 'state' constants
const MBS_STATE_INIT          = "State init";
const MBS_STATE_IDLE          = "State idle";
const MBS_STATE_NEXT          = "State next";
const MBS_STATE_GOOD_READ     = "State good (read)";
const MBS_STATE_FAIL_READ     = "State fail (read)";
const MBS_STATE_GOOD_CONNECT  = "State good (port)";
const MBS_STATE_FAIL_CONNECT  = "State fail (port)";

// Modbus configuration values
const mbsId       = 1;
const mbsScan     = 3000;
const mbsTimeout  = 1000;
let mbsState    = MBS_STATE_INIT;

// Upon SerialPort error
client.on("error", function(error) {
    console.log("SerialPort Error: ", error);
});


//==============================================================
const connectClient = function()
{
    // set requests parameters
    client.setID      (mbsId);
    client.setTimeout (mbsTimeout);

    // try to connect
    client.connectRTUBuffered ("/dev/cu.usbserial-AB0LZ5OM", { baudRate: 115200, parity: "none", dataBits: 8, stopBits: 1 })
    //client.connectRTUBuffered ("/dev/tty.usbserial-AB0LZ5OM", { baudRate: 115200, parity: "none", dataBits: 8, stopBits: 1 })
   // client.connectRTUBuffered ("/dev/cu.usbserial-1410", { baudRate: 9600, parity: "none", dataBits: 8, stopBits: 1 })
        .then(function()
        {
            mbsState  = MBS_STATE_GOOD_CONNECT;
            mbsStatus = "Connected, wait for reading...";
            console.log(mbsStatus);
        })
        .catch(function(e)
        {
            mbsState  = MBS_STATE_FAIL_CONNECT;
            mbsStatus = e.message;
            console.log(e);
        });
};


//==============================================================
const readModbusData = function()
{
    // try to read data
    client.readInputRegisters(1, 9)
        .then(function(data)
        {
            mbsState   = MBS_STATE_GOOD_READ;
            mbsStatus  = "success";
            console.log(data.buffer);
            const temp1=data.buffer.readUInt8(1);
            const temp2=data.buffer.readUInt8(2);
            const temp3=data.buffer.readUInt8(3);
	        const temp4=data.buffer.readUInt8(4);
            const temp5=data.buffer.readUInt8(5);
            const temp6=data.buffer.readUInt8(6);
            const temp7=data.buffer.readUInt8(7);
            const temp8=data.buffer.readUInt8(8);
            const temp9=data.buffer.readUInt8(9);
            //const temp2=data.buffer.readInt16BE(1);
           // const floatA=data.buffer.swap32().swap16().readFloatBE(0);
        //    console.log(temp1);
        //    console.log(temp2);
        //    console.log(temp3);
        //    console.log(temp4);
	  console.log(`Slaveid:[ ${mbsId}]` );
           console.log(`INPUT_1:${temp1}`);
           console.log(`INPUT_2  :${temp2}`);
           console.log(`INPUT_3:${temp3}`);
           console.log(`INPUT_4:${temp4}`);
           console.log(`INPUT_5:${temp5}`); 
           console.log(`ADC_INPUT_6:${temp6}`);
           console.log(`ADC_INPUT_7:${temp7}`);
           console.log(`ADC_INPUT_8:${temp8}`);
           console.log(`ADC_INPUT_9:${temp9}`);  
        })
        .catch(function(e)
        {
            mbsState  = MBS_STATE_FAIL_READ;
            mbsStatus = e.message;
            console.log(e);
        });
};




//==============================================================
const runModbus = function()
{
    let nextAction;

    switch (mbsState)
    {
        case MBS_STATE_INIT:
            nextAction = connectClient;
            break;

        case MBS_STATE_NEXT:
            nextAction = readModbusData;
            break;

        case MBS_STATE_GOOD_CONNECT:
            nextAction = readModbusData;
            break;

        case MBS_STATE_FAIL_CONNECT:
            nextAction = connectClient;
            break;

        case MBS_STATE_GOOD_READ:
            nextAction = readModbusData;
            break;
        

        case MBS_STATE_FAIL_READ:
            if (client.isOpen)  { mbsState = MBS_STATE_NEXT;  }
            else                { nextAction = connectClient; }
            break;

        default:
            // nothing to do, keep scanning until actionable case
    }

    console.log();
    console.log(nextAction);

    // execute "next action" function if defined
    if (nextAction !== undefined)
    {
        nextAction();
        mbsState = MBS_STATE_IDLE;
    }

    // set for next run
    setTimeout (runModbus, mbsScan);
};

//==============================================================
runModbus();
