import React from 'react';

export class GraphSpace extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 1,
        };

        this.process_height  = 30; // px
        this.process_width   = 50; // px
        this.process_row     = 100; // px

        this.resource_height = 30; // px
        this.resource_width  = 50; // px
        this.resource_row    = 20; // px
    }

    render() {
        // Get canvas by id
        const canvas = document.getElementById("graph-space");

        let ctx = null;

        // If canvas is found, retrieve the context
        if(canvas !== null) {
            ctx = canvas.getContext("2d");
        }

        // If canvas is not found, just return immediately
        else {
            return <div></div>;
        }

        // Clear the screen
        this.clear();

        // Draw updated screen
        const numProcesses = this.props.processes.length;
        const numResources = this.props.resources.length;

        ctx.font = "16px Consolas";
        ctx.fillStyle = "black";
        ctx.textAlign="center";

        // Draw the processes
        const processWidth = parseInt(canvas.width / numProcesses);

        for(let x=0; x<numProcesses; x++) {
            const startCol = x * processWidth + (0.5 * (processWidth - this.process_width));
            const textCol  = x * processWidth + (0.5 * processWidth);
            const textRow  = this.process_row + (0.5 * this.process_height);

            // Draw process rectangle
            ctx.rect(startCol, this.process_row, this.process_width, this.process_height);
            ctx.stroke();

            ctx.fillText("p"+x, textCol, textRow);
        }

        // Draw the resources
        const resourceWidth = parseInt(canvas.width / numResources);

        for(let x=0; x<numResources; x++) {
            const startCol = x * resourceWidth + (0.5 * (resourceWidth - this.resource_width));
            const textCol  = x * resourceWidth + (0.5 * resourceWidth);
            const textRow  = this.resource_row + (0.5 * this.resource_height);

            // Draw resource rectangle
            ctx.rect(startCol, this.resource_row, this.resource_width, this.resource_height);
            ctx.stroke();

            ctx.fillText("r"+x, textCol, textRow);
        }

        return <div></div>;
    }

    clear = () => {
        // Get canvas by id
        const canvas = document.getElementById("graph-space");

        let ctx = null;

        if(canvas !== null) {
            ctx = canvas.getContext("2d");
        }
        else {
            return false;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

export default GraphSpace
