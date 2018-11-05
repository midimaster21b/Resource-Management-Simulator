import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// If deep clone is needed...
// https://stackoverflow.com/questions/29537299/react-how-do-i-update-state-item1-on-setstate-with-jsfiddle/46865234#46865234
// import {cloneDeep} from 'lodash';
var _ = require('lodash');

function Resource(props) {
    return <div>Resource {props.name}</div>;
}

function ResourceList(props) {
    const resources = props.resources;

    const resourceListItems = resources.map((resource) =>
                                            <li key={resource.props.id}><Resource id={resource.props.id} name={resource.props.name} /></li>
                                          );
    return (
            <ul>{resourceListItems}</ul>
    );
}

function Process(props) {
    return <div>Process {props.name}</div>;
}

function ProcessCell(props) {
    return (
        <td>
            <button className="resource-acquire-button" onClick={(e) => props.onClick(props.process.props.id, props.resource.props.id, e)}>
              {getRelationshipText(props.resource, props.process)}
            </button>
        </td>
    );
}

function ProcessList(props) {
    const processes = props.processes;
    const processListItems = processes.map((process) =>
                                           <li key={process.props.id}><Process id={process.props.id} name={process.props.name} /></li>
                                          );
    return (
            <ul>{processListItems}</ul>
    );
}

function ResourceManagementTable(props) {
    const processes = props.processes;
    const resources = props.resources;

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
                                            rowData.push(<td>{getRelationshipText(resource, process)}</td>);
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

class GraphSpace extends React.Component {
    render() {
        return <canvas id="graph-space" />;
    }
}

class ResourceManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // processes: [
            //         <Process id="1" name="init" />,
            //         <Process id="2" name="networking" />,
            //         <Process id="3" name="filesystem" />,
            // ],
            // resources: [
            //         <Resource id="1" name="Disk" />,
            //         <Resource id="2" name="RAM" />,
            //         <Resource id="3" name="NIC" />,
            // ],

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
            processList.push(<Process id={process.id} name={process.name} owner={process.owner} waiting={process.waiting} />);
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
                    <ResourceManagementTable resources={resourceList} processes={processList} />
                  </div>
                </div>
        );
    }

    acquire = (process_id) => {
        const owner = this.state.owner;
        const waiting = this.state.waiting;

        if(owner === null) {
            this.setState(state => ({
                owner: process_id
            }));
            return true;
        }
        else {
            // If the waiting list doesn't contain the process id
            if(!waiting.includes(process_id)) {

                // Add the process id to the waiting list
                this.setState(state => ({
                    waiting: this.state.waiting.push(process_id)
                }));
            }

            // Return false indicating failure to acquire
            return false;
        }
    }

    release = (process_id) => {
        const owner = this.state.owner;
        const waiting = this.state.waiting;

        // If the correct process_id was supplied
        if(owner === process_id) {
            let nextWaiting = waiting;
            let nextOwner =  nextWaiting.shift();

            if(nextOwner === undefined) {
                nextOwner = null;
            }

            // Add the process id to the waiting list
            this.setState(state => ({
                owner: nextOwner,
                waiting: nextWaiting,
            }));

            return true;
        }

        else {
            // TODO: This is an error if this occurs!
            // YOU SHOULD NEVER RELEASE A RESOURCE YOU DON'T OWN
            // SOMETHING HAS CAUSE THE PROGRAM TO FALL OUT OF SYNC
            console.log("ERROR: A process(" + process_id + ") tried to release a resource() without ownership.");
            return false;
        }
    }
}

ReactDOM.render(<ResourceManager />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

function getRelationshipText(res, proc) {
    const owner = res.props.owner;
    const waiting = res.props.waiting;

    if(proc.props.id == owner) {
        return "Owner";
    }

    else if(waiting.includes(proc.props.id)) {
        return "Waiting";
    }

    else {
        return "";
    }
}
