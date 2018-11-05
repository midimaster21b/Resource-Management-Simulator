import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Resource, ResourceList} from './Resource';
import {getRelationshipText} from './ResourceManager';

export function Process(props) {
    return <div>Process {props.name}</div>;
}

export function ProcessCell(props) {
    return (
        <td>
            <button className="resource-acquire-button" onClick={(e) => props.onClick(props.process.props.id, props.resource.props.id, e)}>
              {getRelationshipText(props.resource, props.process)}
            </button>
        </td>
    );
}

export function ProcessList(props) {
    const processes = props.processes;

    const processListItems = processes.map((process) =>
                                           <li key={process.props.id}>{process}</li>
                                          );
    return (
            <ul>{processListItems}</ul>
    );
}

export default Process;

