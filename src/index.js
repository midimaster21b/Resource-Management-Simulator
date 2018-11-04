import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

class Resource extends React.Component {
    render() {
        return <div>Resource {this.props.name}</div>;
    }
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

class Process extends React.Component {
    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return <div>Process {this.props.name}</div>;
    }
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

function ProcessTableRow(props) {

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

                                        for(let i=0; i<resources.length; i++) {
                                            rowData.push(<td>1</td>);
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
            processes: [
                    <Process id="1" name="init" />,
                    <Process id="2" name="networking" />,
                    <Process id="3" name="filesystem" />,
            ],
            resources: [
                    <Resource id="1" name="Disk" />,
                    <Resource id="2" name="RAM" />,
                    <Resource id="3" name="NIC" />,
            ],
            resource_event: [],
        };
    }

    render() {
        return (
                <div>
                  <h1>Resource Manager</h1>
                  <div>
                    <h2>Processes</h2>
                    <ProcessList processes={this.state.processes} />
                  </div>
                  <div>
                    <h2>Resources</h2>
                    <ResourceList resources={this.state.resources} />
                  </div>
                  <div>
                    <ResourceManagementTable resources={this.state.resources} processes={this.state.processes} />
                  </div>
                </div>
        );
    }
}

ReactDOM.render(<ResourceManager />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
