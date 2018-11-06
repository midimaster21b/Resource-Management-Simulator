import React from 'react';
import './index.css';
import './ResourceEvent.css';

var _ = require('lodash');

export function ResourceEvent(props) {
    return <p>{props.process_id} {props.operation} {props.resource_id}</p>
}

export function ResourceEventList(props) {
    let resourceEventArray = [];

    if(props.events.length === 0) {
        return (
            <ul className="instruction-list">
            </ul>
        );
    }

    for(let event of props.events) {
        let currentEvent = (_.findIndex(props.events, event) === props.eventCounter);

        resourceEventArray.push(<li className={"event-item " + (currentEvent ? "current-event" : "")}>{event.process_id} {event.operation} {event.resource_id}</li>);
    }

    return (
            <ul className="instruction-list">
              {resourceEventArray}
            </ul>
    );
}



export default ResourceEvent;
