import React from 'react';

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
        return "Request";
    }
}

export function textToJsxList(text) {
        const textArray = text.split("\n");

        let jsxArray = [];

        for(let line of textArray) {
            jsxArray.push(<li>{line}</li>);
        }

        return (
                <ul>
                  {jsxArray}
                </ul>
        );
    }

