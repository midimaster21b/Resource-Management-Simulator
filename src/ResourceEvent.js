import React from 'react';

// Material theming
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

// Include lodash library
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
        const eventIndex = _.findIndex(props.events, event);
        let currentEvent = (eventIndex === props.eventCounter);

        resourceEventArray.push(
                <ListItem button
                 className={"event-item"}
                 onClick={(e) => props.clickHandler(eventIndex)}
                 selected={currentEvent}>
                  {eventIndex}) {event.process_id} {event.operation} {event.resource_id}
               </ListItem>);
    }

    return (
            <List className="instruction-list">
              {resourceEventArray}
            </List>
    );
}



export default ResourceEvent;
