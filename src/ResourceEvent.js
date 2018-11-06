import React from 'react';

// Material theming
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

// My theming
// import './index.css';
// import './ResourceEvent.css';

var _ = require('lodash');

export function ResourceEvent(props) {
    return <p>{props.process_id} {props.operation} {props.resource_id}</p>
}

export function ResourceEventList(props) {
    let resourceEventArray = [];

    if(props.events.length === 0) {
        return (
            <List className="instruction-list">
            </List>
        );
    }

    for(let event of props.events) {
        let currentEvent = (_.findIndex(props.events, event) === props.eventCounter);

        resourceEventArray.push(<ListItem className={"event-item"} selected={currentEvent}>{event.process_id} {event.operation} {event.resource_id}</ListItem>);
    }

    return (
            <List className="instruction-list">
              {resourceEventArray}
            </List>
    );
}



export default ResourceEvent;
