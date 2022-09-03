//Import dependencies using ES modules 
import promptSync from "prompt-sync";
const prompt = promptSync({
    sigint: false
});
import fetch from "node-fetch";
import fs, { writeFile } from "fs";
import * as path from "path";
import {generate, parse, transform, stringify} from 'csv';
import { assert, time } from "console";
import { type } from "os";
import { join } from "path";
import { setInterval } from "timers/promises";

/** Before we start!
 * The node-modules have been removed from the submission because of Grade Scope constantly showing "Server responded with 0 code"
 * Please dont mind all the long winded comments I wrote
 * I know comments are too long (about 1/5 of the lines) and maybe annoying
 * But it is just to show that I understand the codes I wrote
 * As part of the brief
 * Thanks for reading!
 */

//Main app logic 
function main(){
    //Declare Global Messages
    //displays welcome text art, generated on https://fsymbols.com/generators/carty/ Seeked permission from Mr Matt
    const welcomeMsg = (`
    ╭╮╭╮╭╮╱╱╭╮╱╱╱╱╱╱╱╱╱╱╱╱╱╱╭╮╱╱╱╱╱╭╮╭╮╱╱╱╱╱╭╮╱╭┳━━━╮╭╮╱╱╱╱╱╭╮╱╱╱╱╱╱╱╱╱╱╱╭╮╱╱╱╭╮╱╱╱╱╱╱╱╱╭╮╱╱╱╱╱╱╱╱╱╭╮╱╱╱╱╱╱╱╱╭╮╱╱╱╱╱╱╭╮
    ┃┃┃┃┃┃╱╱┃┃╱╱╱╱╱╱╱╱╱╱╱╱╱╭╯╰╮╱╱╱╭╯╰┫┃╱╱╱╱╱┃┃╱┃┃╭━╮┃┃┃╱╱╱╱╱┃┃╱╱╱╱╱╱╱╱╱╱╭╯╰╮╱╭╯╰╮╱╱╱╱╱╱╱┃┃╱╱╱╱╱╱╱╱╭╯╰╮╱╱╱╱╱╱╱┃┃╱╱╱╱╱╱┃┃
    ┃┃┃┃┃┣━━┫┃╭━━┳━━┳╮╭┳━━╮╰╮╭╋━━╮╰╮╭┫╰━┳━━╮┃┃╱┃┃┃╱┃┃┃┃╱╱╭━━┫┃╭┳━━┳━━╮╭━┻╮╭╋━┻╮╭╋┳━━┳━╮╱┃╰━┳╮╭┳━━╮╰╮╭╋━┳━━┳━━┫┃╭┳━━┳━┫┃
    ┃╰╯╰╯┃┃━┫┃┃╭━┫╭╮┃╰╯┃┃━┫╱┃┃┃╭╮┃╱┃┃┃╭╮┃┃━┫┃┃╱┃┃┃╱┃┃┃┃╱╭┫╭╮┃╰╯┫┃━┫━━┫┃━━┫┃┃╭╮┃┃┣┫╭╮┃╭╮╮┃╭╮┃┃┃┃━━┫╱┃┃┃╭┫╭╮┃╭━┫╰╯┫┃━┫╭┻╯
    ╰╮╭╮╭┫┃━┫╰┫╰━┫╰╯┃┃┃┃┃━┫╱┃╰┫╰╯┃╱┃╰┫┃┃┃┃━┫┃╰━╯┃╰━╯┃┃╰━╯┃╭╮┃╭╮┫┃━╋━━┃┣━━┃╰┫╭╮┃╰┫┃╰╯┃┃┃┃┃╰╯┃╰╯┣━━┃╱┃╰┫┃┃╭╮┃╰━┫╭╮┫┃━┫┃╭╮
    ╱╰╯╰╯╰━━┻━┻━━┻━━┻┻┻┻━━╯╱╰━┻━━╯╱╰━┻╯╰┻━━╯╰━━━┻━━╮┃╰━━━┻╯╰┻╯╰┻━━┻━━╯╰━━┻━┻╯╰┻━┻┻━━┻╯╰╯╰━━┻━━┻━━╯╱╰━┻╯╰╯╰┻━━┻╯╰┻━━┻╯╰╯
    ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╰╯`);
    const messageExiting = (
        `
        ░██████╗███████╗███████╗  ██╗░░░██╗░█████╗░██╗░░░██╗██╗
        ██╔════╝██╔════╝██╔════╝  ╚██╗░██╔╝██╔══██╗██║░░░██║██║
        ╚█████╗░█████╗░░█████╗░░  ░╚████╔╝░██║░░██║██║░░░██║██║
        ░╚═══██╗██╔══╝░░██╔══╝░░  ░░╚██╔╝░░██║░░██║██║░░░██║╚═╝
        ██████╔╝███████╗███████╗  ░░░██║░░░╚█████╔╝╚██████╔╝██╗
        ╚═════╝░╚══════╝╚══════╝  ░░░╚═╝░░░░╚════╝░░╚═════╝░╚═╝`
    )
    // ANSI Console colour code: \x1b[31m Red (Looks more like pink),32m: green, 33m: Yellow ,94m: blue, 35m: magenta 36m:cyan,  37m:while, 0m : Restore to default
    const PromptDate = `What date will you depart UQ Lakes Station by bus? \x1b[31m(YYYY-MM-DD)]\x1b[0m :`;
    const PromptTime = `What time will you depart UQ Lakes station by bus? \x1b[31m(HH:mm)]\x1b[0m :`;
    const searchAgain = `Would you like to search again? \x1b[31m(y/n)]\x1b[0m :`;
    const byeMsg = `Thanks for using the UQ Lakes station bus tracker!`;
    const nullMsg = `No Leaving Blank Please!`;
    const ErrorMsg = `Please input in a correct format!`;
    const DisplayingRoute = `Displaying the short&long names for the routes`;
    const CachedMsg = (filename) => `Saving cache file as ${cachedFile(filename)}.`;
    let messageShowRoute = (id,name) => `Route Short Name: \x1b[31m${id}\x1b[0m, Route long name: \x1b[33m${name}\x1b[0m.`;
    let messageShowService = (name,id) => `Service ID for bus \x1b[31m${name}\x1b[0m: \x1b[94m${id}\x1b[0m .`;
    let messageShowSchedule = (name,time) => `The scheduled arrival time for route \x1b[31m${name}\x1b[0m is \x1b[36m${time}\x1b[0m.`;
    let messageShowRealArrival = (name,time) => `The actual arrival time for route \x1b[31m${name}\x1b[0m is \x1b[36m${time}\x1b[0m.`;
    let messageShowSign = (name,sign) => `The destination sign for trip \x1b[31m${name}\x1b[0m is \x1b[35m${sign}\x1b[0m.`;
    let messageShowLocation = (name,latitude,longtitude) => `The geographic location for bus \x1b[31m${name}\x1b[0m is at \x1b[32m${latitude},${longtitude}\x1b[0m`;

    //Declare Global Variables
    let departDate= null;
    let departTime = null;
    /** Regex formula for date formula yyyy-mm-dd 
     * Fixed year format： 20 + 0 to 9 + 0 to 9, highest year allowed 2099
     * Fixed month format: Either 0 + 1 to 9, OR 1+ 1 to 2 allowed, highest month allowed 12
     * Fixed day format: 0 to 2 + 0 to 9 OR 3 + 0 to 1, highest allowed 31
     * This Regex cannot identify if the month has 29 or 30 or 31 days
     */
    const datePattern = /^20[0-9][0-9]-[0][1-9]|[1][0-2]-[0-2][0-9]|3[0-1]$/;  
    /** Regex formula for time formula HH:mm
     * Fixed hour format: 0 to 1 + 0 to 9 OR 2 + 0 to 3, highest hour allowed 23
     * Fixed minutes format: 0 to 5 + 0 - 9, highest minute allowed 59
     */
    const timePattern = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/; 
    const cachedFile = (filename) => `${filename}.json`;

    //All the URLs, need to use Localhost
    const calendar_url = "./static-data/SEQ_GTFS/calendar.txt";
    const calendar_date_url = "./static-data/SEQ_GTFS/calendar_dates.txt";
    const routes_url = "./static-data/SEQ_GTFS/routes.txt";
    const shapes_url = "./static-data/SEQ_GTFS/shapes.txt";
    const stop_times_url = "./static-data/SEQ_GTFS/stop_times.txt";
    const stops_url = "./static-data/SEQ_GTFS/stops.txt";
    const trips_url = "./static-data/SEQ_GTFS/trips.txt";
    const trip_updates_url = "http://127.0.0.1:5343/gtfs/seq/trip_updates.json";
    const vehicle_position_url = "http://127.0.0.1:5343/gtfs/seq/vehicle_positions.json";
    const alerts_url = "http://127.0.0.1:5343/gtfs/seq/alerts.json";
    
    
    /**
    * This function below takes the user input of date and check if it is in format YYYY-MM-DD,
    * If the format is wrong, the user shall be asked to input again.
    * @param {string} DateInput - the date user input from the promopt
    * @param {boolean} either true or false, depending on the input.
    */
    const validDate = (DateInput) =>{
        if (DateInput.match(datePattern)){
            return true;
        }else if(DateInput === ""){
            console.log(nullMsg);
            return false;
        }else{
            console.log(ErrorMsg);
            return false;
        }
    };

    /**
    * This function below shall takes the user input of time and check if it is in format HH:mm,
    * If the format is wrong, the user will be asked to input again,
    * @param {string} TimeInput - the time user keyed in from the prompt
    * @param {boolean} either true or false, depending on the input.
    **/
    const validTime = (TimeInput) =>{
        if (TimeInput.match(timePattern)){
            return true;
        }else if(TimeInput === ""){
            console.log(nullMsg);
            return false;
        }else{
            console.log(ErrorMsg);
            return false;
        }
    };

    /** 
    * A function to keep asking user to input the date and time
    * until they have the format correct,
    * @param {string} departDate - The date when the user departs
    * @param {boolean} either true or false depending on the user.
    **/
    const userInput = () =>{
        while (true){
            //Prompt user date inputs
            departDate = prompt(PromptDate);
            while (validDate(departDate)!= true){
                departDate = prompt(PromptDate);
            }
            //Prompt user time inputs
            departTime = prompt(PromptTime);
            while (validTime(departTime)!= true){
                departTime = prompt(PromptTime);
            }
            break;
        }
    };

    /**
    * A simple function to convert epoch time
    * @param {*} epoch The epoch time to convert
    * @returns The readdable date time in local timezone
    */
    const Epochtotime = (epoch) => {
        let convertTime =  Date(epoch);
        return convertTime;
    };

    /**
    * A simple function to convert date/time to epoch
    * @param {*} departDate The Departure date by user
    * @param {*} departTime The departure time by user
    * @returns The date/time in epoch format
    */
    const timetoEpoch =(departDate,departTime) => {
        let time = departDate+ " "+departTime;
        let convertTime = new Date(time);
        let convertedTime = convertTime.getTime() /1000
        return convertedTime;
    };


    /**
    * To fetch JSON data asynchronously based on the url provided 
    * @param {string} url to fetch data from 
    * @returns {string} the JSON response
    */
    async function getJSON(url){
        const response = await fetch(url);
        const responseJSON = await response.json();
        return responseJSON;
    };

    /**
    * To read&sync the CSV file route that contains the String "UQ Lakes"
    * Remove the line if it it is not equals to route_id
    * Logs the results to the user
    * Cant believe that it actually worked! Stuck here for four entire days!
    * @returns {string} the JSON response
    */
    async function getRouteName(routes_id){
        (() => {
            const RoutePath = path.resolve(routes_url);
            const headers = ['route_id','route_short_name','route_long_name','route_desc','route_type','route_url','route_color','route_text_color'];
            const fileContent = fs.readFileSync(RoutePath);
            parse(fileContent, {
            delimiter: ',',
            fromLine: 2,
            columns: headers,
            //To search whether the line includes the route_id
                on_record: (line) => {
                if (line.route_id !== routes_id) {
                    return;
                }
                console.log(messageShowRoute(line.route_short_name,line.route_long_name));
                return line.route_long_name;
                },
            //In case of an error
            }, (error, result) => {
            if (error) {
                console.error(error);
            }
            });
        })();
    };
    /**
     * A function to get the head sign of the buses
     * @param {route_id} takes in the route_id of the trip
     * @param {trips_id} takes in the trips_id
     * And then checks through the csv file, filter through
     * the data which has a different tripid, and then log the trip_headsign
     */
    async function getHeadSign(route_id,trips_id){
        (() => {
            const HeadPath = path.resolve(trips_url);
            const headers = ['route_id','service_id','trip_id','trip_headsign','direction_id','block_id','shape_id'];
            const fileContent = fs.readFileSync(HeadPath);
            parse(fileContent, {
            delimiter: ',',
            fromLine: 2,
            columns: headers,
            //To search whether the line includes the route_id
                on_record: (line) => {
                if (line.trip_id !==trips_id) {
                    return;
                }
                console.log(messageShowSign(route_id,line.trip_headsign));
                return line;
                },
            //In case of an error
            }, (error, result) => {
            if (error) {
                console.error(error);
            }
            });
        })();
    };

    /**A small function to log the service ID
    * With a setTimeOut to make sure it comes after displaying Route 
    * @param {*} trip_id The service_id acquired from trip_update.JSON
    */
    async function getService(trip_name,trip_id){
        setTimeout(() => {
            console.log(messageShowService(trip_name,trip_id));
        }, 100); 
    };
        
    /**
     * A function that parse& filters the trip_updates.json
     * @param {filteredTrip}filters through each data 
     * If the trip is CANCELLED, it will return an undefined which will be removed from the dataset
     * Then, the function will check if the @param {stopId} is 1882 AKA UQ Lakes Station
     * and see if the difference in the inputted time and data time is >600 and >0 (EPOCH timing)
     * Then it shall log out the data collected .
     */
    async function checkTripUpdate(){
        const value = await getJSON(trip_updates_url);
        let bus = Object.values(value.entity);
        let filteredTrip = bus.forEach((element) =>{
            if(element.tripUpdate.stopTimeUpdate!== undefined){
                try{
                    let timeupdate = Object.values((element.tripUpdate.stopTimeUpdate));
                    let filteringTrip = timeupdate.forEach((trips)=> {
                        if(trips.stopId == '1882' && trips.arrival.time - timetoEpoch(departDate,departTime) <= 600 && 
                        trips.arrival.time - timetoEpoch(departDate,departTime) >= 0){
                            let routes = getRouteName(element.tripUpdate.trip.routeId)
                            let service_id = element.tripUpdate.trip.tripId.split('-');
                            service_id.shift();
                            let services = getService(element.tripUpdate.trip.routeId.split('-').shift(),service_id);
                            let trips_id = element.tripUpdate.trip.tripId;
                            let headsign = getHeadSign(element.tripUpdate.trip.routeId.split('-').shift(),trips_id);
                            console.log(messageShowSchedule(element.tripUpdate.trip.routeId.split('-').shift(),Epochtotime(trips.arrival.time)));       
                        }
                    })

                }catch(error){
                    //console.log(element.tripUpdate);
                    console.log(error)
                }
                }

            })
    };
    
    /**
     * This function fetch &reads the data from vehicle_positions.json and to see if 
     * @param {element} contains a vehicle.stopId equalling to 1882 AKA UQ Lakes Station
     * If it returns true, thenit will check @param {vehicle.currentStatus}
     * To see if it is "STOPPED AT" or "IN_TRANSIT", and logs the results.
     * If there is no bus on the way, it will log a message in the terminal
     */
    async function checkArrivingBus(){
        const value = await getJSON(vehicle_position_url);
        const buses = Object.values(value.entity);
        let checkBus = 0;
            let filteredBus = buses.forEach((element) => {
                if(element.vehicle.stopId === '1882'){
                    checkBus+=1;
                    let route_name = (element.vehicle.trip.routeId.split('-').shift())
                    let arrivingtime = Epochtotime(element.vehicle.timestamp);
                    if (element.vehicle.currentStatus === "STOPPED_AT"){
                        console.log(`The actual arrival time for route \x1b[31m${route_name}\x1b[0m is \x1b[36m${arrivingtime}\x1b[0m.`);
                    }else if (element.vehicle.currentStatus === "IN_TRANSIT_TO"){
                        console.log(`Bus ${route_name} is still on its way!`);
                    }
                    console.log(messageShowLocation(element.vehicle.trip.routeId.split('-').shift(),
                    element.vehicle.position.latitude,element.vehicle.position.longitude));
                }else{
                    return null;
                }
            })
            if(checkBus===0){
                console.log("No bus is currently on its way to UQ Lakes Station.")
            }
    }

    /**
    * Creates a cachedfile of the data when called.
    * @param {file} filename - The name of the file
    * @param {log} log - the supposed dataset its going to use
    */
    async function cacheFile(file,log){
        await fs.writeFile('./cached-data/'+cachedFile(file),JSON.stringify(log),()=>{
            if(true){
                console.log(CachedMsg(file));
            }
        })
    };

    /**
     * A function to cache all the data as local files
     */
    async function autoCacheData(){
        const vehicle = await getJSON(vehicle_position_url);
        const trip= await getJSON(trip_updates_url);
        cacheFile("trip_updates",trip);
        cacheFile("vehicle_positions",vehicle);   
    };

    /**
    * Reads the saved cache file when called 
    * @param {string} filename - the name of the file to be read
    * @returns {string} log - the JSON from the cached file
    */
    async function loadFile(filename){
        try{
            const log = await fs.readFile(cacheFile(filename));
            return data;
        }catch(error){
            console.log(error);
        }
    };

    //Ask if user wants to search again
    const askLeave = () =>{
        let user = prompt(searchAgain);
        if (user === 'n'){
            console.log(messageExiting);
            console.log(byeMsg);
            return;  
        }
        else if (user === 'y'){
            main();
        }else{
            console.log(ErrorMsg);
            askLeave();
        }
    };


    //Call the functions
    async function linkstart(){
        console.log(welcomeMsg);
        //Refresh the data everytime the program runs for the first time
        await autoCacheData();
        //Cache the JSON files every 5 mins
        setInterval(() => {
            autoCacheData();
        }, 5*60000);
        userInput();
        await checkTripUpdate();
        await checkArrivingBus();
        //Asks the user if he wants to leave only after a certain time
        setTimeout(() => {
            askLeave();
        }, 10*1000);
    }
    
    
    linkstart();


}
    
//Call the main function
main();

