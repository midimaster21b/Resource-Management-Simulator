import React from 'react';
import './index.css';

// Material component
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// My helper functions
import {getRelationshipText} from './helper.js';

export function Process(props) {
    return <div>Process {props.name}</div>;
}

export function ProcessCell(props) {

    const relationship = getRelationshipText(props.resource, props.process);

    let color = "default";

    if(relationship.toLowerCase() === "owner") {
        color = "primary";
    }

    else if(relationship.toLowerCase() === "waiting") {
        color = "secondary";
    }

    return (
        <td>
            <Button variant="outlined" color={color} className="resource-acquire-button" onClick={(e) => props.onClick(props.process.props.id, props.resource.props.id, e)}>
              {relationship}
            </Button>
        </td>
    );
}

export function ProcessList(props) {
    const processes = props.processes;

    const processListItems = processes.map((process) =>
                                           <li key={process.props.id}>{process} - {process.props.blocked ? "Blocked" : "Running"}</li>
                                          );
    return (
            <ul>{processListItems}</ul>
    );
}

export default Process;

