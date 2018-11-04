import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

class Resource extends React.Component {
    render() {
        return <p>Resource {this.props.name}</p>;
    }
}

class Process extends React.Component {

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return <p>Process {this.props.name}</p>;
    }
}

class GraphSpace extends React.Component {
    render() {
        return <canvas id="graph-space" />;
    }
}

class ResourceManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            processes: [],
            resources: [],
            resource_event: [],
        };
    }

    render() {
        return (
                <div>
                  <h1>Resource Manager</h1>
                  <div>
                  </div>
                </div>
        );
    }
}

ReactDOM.render(<ResourceManager />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
