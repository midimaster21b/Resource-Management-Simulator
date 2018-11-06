import React from 'react';

export class GraphSpace extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 1,
        };
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
        ctx.rect(0,0,150,75);
        ctx.stroke();

        ctx.font = "16px Consolas";
        ctx.fillStyle = "black";
        // ctx.fillStyle = "white";
        ctx.fillText(this.state.count, 10, 50);

        // ctx.fillStyle = color;
        // ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);

        // return <canvas id="graph-space" />;
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
