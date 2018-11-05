import React from 'react';
import './index.css';

export function ResourceEvent(props) {
    return <p>{props.process_id} {props.operation} {props.resource_id}</p>
}

export function ResourceEventList(props) {
    let resourceEventArray = [];

    if(props.events.length === 0) {
        return (
            <ul>
            </ul>
        );
    }

    for(let event of props.events) {
        resourceEventArray.push(<li>{event.process_id} {event.operation} {event.resource_id}</li>);
    }

    return (
            <ul>
              {resourceEventArray}
            </ul>
    );
}



export default ResourceEvent;
