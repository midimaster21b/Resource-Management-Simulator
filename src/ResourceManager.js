import React from 'react';
import './index.css';
import {Resource, ResourceList} from './Resource';
import {Process, ProcessCell, ProcessList} from './ProcessResource';

// If deep clone is needed...
// https://stackoverflow.com/questions/29537299/react-how-do-i-update-state-item1-on-setstate-with-jsfiddle/46865234#46865234
// import {cloneDeep} from 'lodash';
var _ = require('lodash');

export class ResourceManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            processes: [
                {id: 1, name: "init"},
                {id: 2, name: "networking"},
                {id: 3, name:"filesystem"},
            ],

            resources: [
                {id: 1, name:"Disk", owner: 1, waiting: [2, 3]},
                {id: 2, name:"RAM", owner: null, waiting: []},
                {id: 3, name:"NIC", owner: null, waiting: []},
            ],
            resource_event: [],

            debug_area: "Testing 1,2,3",
        };
    }

    render() {
        let resourceList = [];
        let processList = []

        for(let resource of this.state.resources) {
            resourceList.push(<Resource id={resource.id} name={resource.name} owner={resource.owner} waiting={resource.waiting} />);
        }

        for(let process of this.state.processes) {
            processList.push(<Process id={process.id} name={process.name} owner={process.owner} waiting={process.waiting} clickHandler={this.requestResource} />);
        }

        return (
                <div>
                  <h1>Resource Manager</h1>
                  <div>
                    <ResourceEventFile fileChangeHandler={this.fileChangeHandler}/>
                  </div>
                  <div>
                    <p>{this.state.debug_area}</p>
                  </div>
                  <div>
                    <h2>Processes</h2>
                    <ProcessList processes={processList} />
                  </div>
                  <div>
                    <h2>Resources</h2>
                    <ResourceList resources={resourceList} />
                  </div>
                  <div>
                    <ResourceManagementTable resources={resourceList} processes={processList} processOnClick={this.handleRequestClick}/>
                  </div>
                </div>
        );
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

            const text = event.target.result;

            this.setState(state => ({
                "debug_area": textToJsxList(text),
            }));
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
        const processes = _.deepCopy(this.state.processes);

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
        const processes = _.deepCopy(this.state.processes);
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

        if(owner === null) {
            // Change local version of resources
            resources[resource_index].owner = process_id;

            // Update state of resources
            this.setState(state => ({
                resources: resources,
            }));

            // Return true indicating successful acquisition
            return true;
        }
        else {
            // If the waiting list doesn't contain the process id
            if(!waiting.includes(process_id)) {
                // Change local version of resources
                resources[resource_index].waiting.push(process_id);

                // Add the process id to the waiting list
                this.setState(state => ({
                    resources: resources,
                }));
            }

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

export function ResourceManagementTable(props) {
    const processes = props.processes;
    const resources = props.resources;
    const processOnClick = props.processOnClick;

    // Blank cell for first space in table
    const tableHeaderRow = resources.map((resource) =>
                                         <th key={resource.props.id}><Resource id={resource.props.id} name={resource.props.name} /></th>
                                        );

    // Fill in the table data for the processes
    const tableBody = processes.map((process) =>
                                    {
                                        let rowData = [];

                                        rowData.push(<td><Process id={process.props.id} name={process.props.name} /></td>);

                                        for(let resource of resources) {
                                            rowData.push(<ProcessCell process={process} resource={resource} onClick={processOnClick} />);
                                        }

                                        return <tr key={process.props.id}>{rowData}</tr>;
                                    });

    return (
            <table className="resource-manager-table">
              <tbody>
                <tr><th></th>{tableHeaderRow}</tr>
                {tableBody}
              </tbody>
            </table>
    );
}

export class ResourceEventFile extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = props.fileChangeHandler.bind(this);
        this.fileInput = React.createRef();
    }

    render() {
        return (
                <form onChange={this.handleSubmit}>
                  <input type="file" ref={this.fileInput} />
                </form>
        );
    }
}

export function getRelationshipText(res, proc) {
    const owner = res.props.owner;
    const waiting = res.props.waiting;

    if(proc.props.id === owner) {
        return "Owner";
    }

    else if(waiting.includes(proc.props.id)) {
        return "Waiting";
    }

    else {
        return "";
    }
}

export function textToJsxList(text) {
        const textArray = text.split("\n");

        let jsxArray = [];

        for(let line of textArray) {
            jsxArray.push(<li>{line}</li>);
        }

        return (
                <ul>
                  {jsxArray}
                </ul>
        );
    }

export default ResourceManager;
