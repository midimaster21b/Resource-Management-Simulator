import React from 'react';

// Material table theming
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// My components
import {Resource} from './Resource';
import {Process, ProcessCell} from './ProcessResource';

export function ResourceManagementTable(props) {
    const processes = props.processes;
    const resources = props.resources;
    const processOnClick = props.processOnClick;

    // Blank cell for first space in table
    const tableHeaderRow = resources.map((resource) =>
                                         <TableCell key={resource.props.id}><Resource id={resource.props.id} name={resource.props.name} /></TableCell>
                                        );

    // Fill in the table data for the processes
    const tableBody = processes.map((process) =>
                                    {
                                        let rowData = [];

                                        rowData.push(<TableCell><Process id={process.props.id} name={process.props.name} /></TableCell>);

                                        for(let resource of resources) {
                                            rowData.push(<ProcessCell process={process} resource={resource} onClick={processOnClick} />);
                                        }

                                        return <TableRow key={process.props.id}>{rowData}</TableRow>;
                                    });

    return (
            <Table>
              <TableHead>
                <TableRow><TableCell></TableCell>{tableHeaderRow}</TableRow>
              </TableHead>
              <TableBody>
                {tableBody}
              </TableBody>
            </Table>
    );
}

export default ResourceManagementTable
