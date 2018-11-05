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
        };
    }

    render() {
        let resourceList = [];
        let processList = []

        for(let resource of this.state.resources) {
            resourceList.push(<Resource id={resource.id} name={resource.name} owner={resource.owner} waiting={resource.waiting} />);
        }

        for(let process of this.state.processes) {
            processList.push(<Process id={process.id} name={process.name} owner={process.owner} waiting={process.waiting} acquire={this.acquireResource} />);
        }

        return (
                <div>
                  <h1>Resource Manager</h1>
                  <div>
                    <h2>Processes</h2>
                    <ProcessList processes={processList} />
                  </div>
                  <div>
                    <h2>Resources</h2>
                    <ResourceList resources={resourceList} />
                  </div>
                  <div>
                    <ResourceManagementTable resources={resourceList} processes={processList} processOnClick={this.handleAcquireClick}/>
                  </div>
                </div>
        );
    }

                    // <ResourceManagementTable resources={resourceList} processes={processList} processOnClick={this.acquireResource}/>

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

    handleAcquireClick = (process_id, resource_id, event_handle) => {
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
            this.acquireResource(process_id, resource_id);
        }
    }

    acquireResource = (process_id, resource_id) => {
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

export default ResourceManager;
