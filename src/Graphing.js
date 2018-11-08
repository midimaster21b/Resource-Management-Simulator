import React from 'react';

export class GraphSpace extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 1,
        };

        // Canvas dimensions
        this.canvas_height = 405;
        this.canvas_width = 800;

        // Title dimensions
        this.title = "Resource Management Graph";
        this.title_row = 40;
        this.title_col = this.canvas_width / 2;

        // All text
        this.text_padding_top = 8;

        // Process dimensions
        this.process_height  = 30; // px
        this.process_width   = 50; // px
        this.process_row     = 300; // px

        // Resource dimensions
        this.resource_height = 30; // px
        this.resource_width  = 50; // px
        this.resource_row    = 100; // px
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

        // Set the height of the canvas
        // NOTE: THESE TWO LINES ARE IMPORTANT!!!
        // Without these two lines, double drawing (or failure to clear?)
        // of lines occasionally occurs which does not get redrawn for the
        // remainder of the lifetime of the application...
        canvas.width = this.canvas_width;
        canvas.height = this.canvas_height;

        // Clear the screen
        this.clear();

        // Draw updated screen
        const numProcesses = this.props.processes.length;
        const numResources = this.props.resources.length;

        // Print Title
        ctx.font = "30px Consolas";
        ctx.fillStyle = "black";
        ctx.textAlign="center";
        ctx.strokeStyle="black";

        ctx.fillText(this.title, this.title_col, this.title_row);


        ctx.font = "16px Consolas";

        // Draw the processes
        const processWidth = parseInt(canvas.width / numProcesses);

        for(let x=0; x<numProcesses; x++) {
            const startCol = x * processWidth + (0.5 * (processWidth - this.process_width));
            const textCol  = x * processWidth + (0.5 * processWidth);
            const textRow  = this.process_row + (0.5 * this.process_height) + this.text_padding_top;

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
            const textRow  = this.resource_row + (0.5 * this.resource_height) + this.text_padding_top;

            // Draw resource rectangle
            ctx.rect(startCol, this.resource_row, this.resource_width, this.resource_height);
            ctx.stroke();

            ctx.fillText("r"+x, textCol, textRow);
        }

        // Draw the resource requests and waiting relationships
        const startProcessCol  = 0.5 * processWidth;
        const startResourceCol = 0.5 * resourceWidth;

        for(let x=0; x<numResources; x++) {

            const owner = this.props.resources[x].owner;
            const waiting = this.props.resources[x].waiting;

            if(owner === null) {
                continue;
            }

            // Draw owner relationship
            ctx.beginPath();
            ctx.strokeStyle="green";
            ctx.moveTo(owner * processWidth + startProcessCol, this.process_row);
            ctx.lineTo(x * resourceWidth + startResourceCol, this.resource_row + this.resource_height);
            ctx.stroke(); // Draw it

            // Draw any waiting processes
            if(waiting.length > 0) {
                // Print waiting lines
                for(let i of waiting) {
                    ctx.beginPath();
                    ctx.strokeStyle="orange";
                    ctx.moveTo(i * processWidth + startProcessCol, this.process_row);
                    ctx.lineTo(x * resourceWidth + startResourceCol, this.resource_row + this.resource_height);
                    ctx.stroke(); // Draw it
                }
            }
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
