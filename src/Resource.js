import React from 'react';
import './index.css';

export function Resource(props) {
    return <div>Resource {props.name}</div>;
}

export function ResourceList(props) {
    const resources = props.resources;

    const resourceListItems = resources.map((resource) =>
                                            <li key={resource.props.id}>{resource}</li>
                                           );
    return (
            <ul>{resourceListItems}</ul>
    );
}

export default Resource;
