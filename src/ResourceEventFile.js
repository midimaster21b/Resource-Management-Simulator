import React from 'react';

export class ResourceEventFile extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = props.fileChangeHandler.bind(this);
        this.fileInput = React.createRef();
    }

    render() {
        return (
                <form onChange={this.handleSubmit}>
                  <input type="file" ref={this.fileInput} />
                </form>
        );
    }
}

export default ResourceEventFile;
