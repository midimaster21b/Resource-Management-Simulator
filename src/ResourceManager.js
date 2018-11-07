import React from 'react';

// Material theming
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

// Material button theming
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

// My components
import {Resource, ResourceList} from './Resource';
import {ResourceEvent, ResourceEventList} from './ResourceEvent';
import {Process, ProcessCell, ProcessList} from './ProcessResource';
import {GraphSpace} from './Graphing.js';
import {ResourceManagementTable} from './ResourceManagementTable.js';
import {ResourceEventFile} from './ResourceEventFile.js';

// My helper functions
import {getRelationshipText, textToJsxList} from './helper.js';

// My theming
import './MainGui.css';

// If deep clone is needed...
// https://stackoverflow.com/questions/29537299/react-how-do-i-update-state-item1-on-setstate-with-jsfiddle/46865234#46865234
// import {cloneDeep} from 'lodash';
var _ = require('lodash');

export class ResourceManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            processes: [],
            resources: [],
            resource_events: [],
            resource_event_counter: -1,
        };
    }

    render() {
        let resourceList = [];
        let processList = []

        // Create resource JSX
        for(let resource of this.state.resources) {
            resourceList.push(<Resource id={resource.id} name={resource.name} owner={resource.owner} waiting={resource.waiting} />);
        }

        // Create process JSX
        for(let process of this.state.processes) {
            processList.push(<Process id={process.id} name={process.name} owner={process.owner} waiting={process.waiting} clickHandler={this.requestResource} />);
        }

        return (
                <Grid className="main-panel" container spacing={12}>
                  <Grid item xs={3} xm={3} xl={3}>
                    <Paper>
                      <div className="instruction-panel">
                        <div className="instruction-file-section">
                          <ResourceEventFile fileChangeHandler={this.fileChangeHandler}/>
                        </div>
                        <Divider />
                        <div className="instruction-section">
                          <ResourceEventList events={this.state.resource_events} eventCounter={this.state.resource_event_counter}/>
                        </div>

                        <Divider />
                        <Grid container xs={12} spacing={12}>
                          <Grid xs={6}>
                            <Button variant="outlined" className="instruction-nav-button" onClick={this.prevEvent}>
                              Previous
                            </Button>
                          </Grid>

                          <Grid xs={6}>
                            <Button variant="outlined" className="instruction-nav-button" onClick={this.nextEvent}>
                              {this.state.resource_event_counter === -1 ? "Start" : "Next"}
                            </Button>
                          </Grid>
                        </Grid>
                      </div>
                    </Paper>
                  </Grid>

                  <Grid item xs={9} xm={9} xl={9}>
                    <Paper>
                      <canvas id="graph-space" />
                      <GraphSpace resources={this.state.resources} processes={this.state.processes} />
                    </Paper>
                  </Grid>

                  <Grid item xs={3}>
                    <Paper>
                      <div>
                        <h2>Processes</h2>
                        <ProcessList processes={processList} />
                      </div>
                      <div>
                        <h2>Resources</h2>
                        <ResourceList resources={resourceList} />
                      </div>
                    </Paper>
                  </Grid>

                  <Grid item xs={9}>
                    <Paper>
                      <ResourceManagementTable resources={resourceList} processes={processList} processOnClick={this.handleRequestClick}/>
                    </Paper>
                  </Grid>
                </Grid>
        );
    }

    nextEvent = (event) => {
        // Prevent the default browser behavior
        event.preventDefault();

        // Get the current event counter
        const count = this.state.resource_event_counter;

        // Bound the value of count to less than or equal to length - 1
        if(count >= this.state.resource_events.length - 1) {
            return false;
        }

        const resourceEvent = this.state.resource_events[count+1];

        if(resourceEvent.operation === "requests") {
            this.requestResource(resourceEvent.process_id, resourceEvent.resource_id);
        }
        else if(resourceEvent.operation === "releases") {
            this.releaseResource(resourceEvent.process_id, resourceEvent.resource_id);
        }
        else {
            console.log("ERROR: Unknown resource operation found.");
            return false;
        }

        // Store new count
        this.setState(state => ({
            "resource_event_counter": count + 1,
        }));
    }

    prevEvent = () => {
        // Get the current event counter
        const count = this.state.resource_event_counter;

        // Bound the value of count to greater than or equal to zero
        if(count - 1 < 0) {
            return;
        }

        // Store new count
        this.setState(state => ({
            "resource_event_counter": count - 1,
        }));
    }

    fileChangeHandler = (event) => {
        // Prevent the default browser behavior
        event.preventDefault();

        const files  = event.target.files;
        const file   = files[0];
        let reader   = new FileReader();

        // After file has been read, execute this
        reader.onload = (event) => {
            console.log(event.target.result);

            // Get retrieved text
            const text = event.target.result;

            // Split the retrieved text into lines
            const lines = text.split("\n");

            for(let line of lines) {
                // Check which type of command it is
                if(line.includes("processes")) {
                    // Get the matching number of processes group
                    const numProcesses = line.match(/(\d+) processes/)[1];
                    console.log("Found " + numProcesses + " processes.");

                    let processArray = [];

                    for(let x = 0; x < numProcesses; x++) {
                        processArray.push(
                            {
                                id: x,
                                name: "p" + x,
                            }
                        );
                    }

                    this.setState(state => ({
                        "processes": processArray,
                    }));
                }
                else if(line.includes("resources")) {
                    // Get matching number of resources group
                    const numResources = line.match(/(\d+) resources/)[1];
                    console.log("Found " + numResources + " resources.");

                    // Create the appropriate resources
                    let resourceArray = [];

                    for(let x = 0; x < numResources; x++) {
                        resourceArray.push(
                            {
                                id: x,
                                name: "r" + x,
                                owner: null,
                                waiting: [],
                            }
                        );
                    }

                    this.setState(state => ({
                        "resources": resourceArray,
                    }));
                }
                else if(line.includes("requests")) {
                    const regexResult = line.match(/p(\d+) requests r(\d+)/);
                    const regexProcess = parseInt(regexResult[1]);
                    const regexResource = parseInt(regexResult[2]);

                    console.log("Found resource request line: p" + regexProcess + " => r" + regexResource);

                    const event_list = _.cloneDeep(this.state.resource_events);
                    const resourceEvent = {
                        "process_id": regexProcess,
                        "resource_id": regexResource,
                        "operation": "requests",
                    };

                    event_list.push(resourceEvent);

                    this.setState(state => ({
                        "resource_events": event_list,
                    }));
                }
                else if(line.includes("releases")) {
                    const regexResult = line.match(/p(\d+) releases r(\d+)/);
                    const regexProcess = parseInt(regexResult[1]);
                    const regexResource = parseInt(regexResult[2]);

                    console.log("Found resource release line: p" + regexProcess + " => r" + regexResource);

                    const event_list = _.cloneDeep(this.state.resource_events);
                    const resourceEvent = {
                        "process_id": regexProcess,
                        "resource_id": regexResource,
                        "operation": "releases",
                    };

                    event_list.push(resourceEvent);

                    this.setState(state => ({
                        "resource_events": event_list,
                    }));
                }
                else {
                    console.log("ERROR: Found line which doesn't match standard.");
                }
            }
        }

        // Begin reading file as a text file
        const content = reader.readAsText(file);
    }

    getNextProcessId = (processes) => {
        if(processes.length === 0) {
            return 0;
        }

        let process_id_retval = 0;

        for(let process of processes) {
            if(process.id >= process_id_retval) {
                process_id_retval = process.id + 1;
            }
        }

        return process_id_retval;
    }

    addProcess = (process_id, process_name) => {
        const processes = _.cloneDeep(this.state.processes);

        // If process_id not specified, set one
        if(process_id === null) {
            process_id = this.getNextProcessId(processes);
        }

        // If process_name not specified, set one
        if(process_name === null) {
            process_name = "unspecified";
        }

        const process = {"id": process_id, "name": process_name};

        processes.push(process);

        // Update state of resources
        this.setState(state => ({
            resources: processes,
        }));
    }

    removeProcess = (process_id) => {
        // If process_id not specified, set one
        if(process_id === null) {
            return false;
        }

        // Remove the process from the processes
        const processes = _.cloneDeep(this.state.processes);
        const process = {"id": process_id};
        _.remove(processes, process);

        // Update state of resources
        this.setState(state => ({
            processes: processes,
        }));
    }

    /*
     * Get a resource object using it's resource identifier.
     *
     * Returns the resource matching the resource identifier if present
     * or returns null on failure.
     */
    getResourceById = (resources, resource_id) => {
        for(let resource of resources) {
            if(resource.id === resource_id) {
                return resource;
            }
        }

        return null;
    }

    /*
     * Click handler for requesting and releasing resources.
     *
     * Determines if the click should be a request or release and calls the appropriate function.
     */
    handleRequestClick = (process_id, resource_id, event_handle) => {
        const resources = this.state.resources;
        const resource = this.getResourceById(resources, resource_id);

        if(resource === null || resource === -1) {
            console.log("ERROR: Resource [" + resource_id + "] requested by process [" + process_id + "], but not present.");
            return false;
        }

        // If currently following resource, release it
        if(resource.waiting.includes(process_id) || resource.owner === process_id) {
            this.releaseResource(process_id, resource_id);
        }
        else {
            this.requestResource(process_id, resource_id);
        }
    }

    /*
     * Requests a resource from a process.
     *
     * Requests a resource specified by resource_id from the process specified by
     * process_id and returns true upon success or false upon duplicate request or
     * upon being put on the waiting queue.
     */
    requestResource = (process_id, resource_id) => {
        const resources = _.cloneDeep(this.state.resources);
        const resource = this.getResourceById(resources, resource_id);
        const resource_index = _.findIndex(this.state.resources, resource);

        if(resource === null || resource_index === -1) {
            console.log("ERROR: Resource [" + resource_id + "] requested, but not present.");
            return false;
        }

        const owner = resource.owner;
        const waiting = resource.waiting;

        console.log("Process " + process_id + " is requesting Resource " + resource_id);

        if(owner === null) {
            // Change local version of resources
            resources[resource_index].owner = process_id;

            console.log("Resource is free!");

            // Update state of resources
            this.setState(state => ({
                resources: resources,
            }));

            // Return true indicating successful acquisition
            return true;
        }
        else if(owner === process_id) {
            console.log("Process " + process_id + " requesting resource it already owns! (" + resource_id + ")");
        }
        else {
            // If the waiting list doesn't contain the process id
            if(!waiting.includes(process_id)) {
                // Change local version of resources
                resources[resource_index].waiting.push(process_id);

                console.log("Process joining the wait queue...");

                // Add the process id to the waiting list
                this.setState(state => ({
                    resources: resources,
                }));

                return false;
            }

            console.log("ERROR: Process duplicate resource request.");

            // Return false indicating failure to acquire
            return false;
        }
    }

    /*
     * Releases a resource for a process.
     *
     * Releases the resource specified by resource_id from the process specified by
     * process_id and returns true upon success or false upon releasing a resource
     * the process doesn't own.
     */
    releaseResource = (process_id, resource_id) => {
        const resources = _.cloneDeep(this.state.resources);
        const resource = this.getResourceById(resources, resource_id);
        const resource_index = _.findIndex(this.state.resources, resource);

        if(resource === null || resource_index === -1) {
            console.log("ERROR: Resource [" + resource_id + "] requested, but not present.");
            return false;
        }

        const owner = resource.owner;
        const waiting = resource.waiting;

        // If the correct process_id was supplied
        if(owner === process_id) {

            // Shift off first element in waiting array and store int nextOwner
            // Note: mutates the waiting array
            const nextOwner = waiting.shift();

            // Check if no-one was one array(used as queue)
            if(nextOwner === undefined) {
                resources[resource_index].owner = null;
            } else {
                resources[resource_index].owner = nextOwner;
            }

            // Change local version of resources
            resources[resource_index].waiting = waiting;

            // Update state of resources
            this.setState(state => ({
                resources: resources,
            }));

            // Return true indicating successful acquisition
            return true;
        }

        else {
            // TODO: This is an error if this occurs!
            // YOU SHOULD NEVER RELEASE A RESOURCE YOU DON'T OWN
            // SOMETHING HAS CAUSE THE PROGRAM TO FALL OUT OF SYNC
            console.log("ERROR: Process(" + process_id + ") tried to release a resource(" + resource.id + ") without ownership.");
            return false;
        }
    }
}

export default ResourceManager;
