import React, {Component, Fragment} from 'react';
import {
    Button,
    Input,
    Table,
    Header,
    Grid,
    Segment,
    Icon,
    Modal,
    Dimmer,
    Loader,
    Select,
    Form
} from 'semantic-ui-react';
import DashboardLayout from '../../src/components/Layout/DashboadLayout';
import Head from 'next/head';
import Link from 'next/link';
import {connect} from 'react-redux';
import {groupMPPartsA} from '../../src/redux/_actions/groupMP/groupMPPartsA';
import _ from 'lodash';
import moment from 'moment';
import XLSX from "xlsx";
import * as dataAnalyzer from '../../src/helpers/data-analyzer.js';

const tdStyle = {
    textAlign: 'center'
};

class MainTable extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let result = (!_.isEqual(nextProps.listToDisplay, this.props.listToDisplay));
        //  console.log(result);
        return result;
    }

    componentDidUpdate() {
        this.props.onTableDidUpdate();
    }

    isInvisibleColumn(columnIndex) {
        const {listToDisplay} = this.props;

        for (let item of listToDisplay) {
            if (item.data[columnIndex].number != 0)
                return false;
        }

        return true;
    }

    numberOfVisibleColumns(columns, invisibleColumns) {
        // console.log('result: ',columns, columns.length - columns.reduce((cnt, e) => (cnt + invisibleColumns.includes(e)), 0));
        return columns.length - columns.reduce((cnt, e) => (cnt + invisibleColumns.includes(e)), 0);
    }

    render() {

        const {listToDisplay} = this.props;
        const invisibleColumns = [];

        if (listToDisplay.length == 0) {
            return (
                <div className="ui negative message">
                    <div className="header">
                        There is no existing items!
                    </div>
                </div>
            );
        }

        for (let index = 0; index < listToDisplay[0].data.length; index++) // check  display of (Juniper MX960, Juniper MX480, Juniper MX240, Juniper MX104)
        {
            if (this.isInvisibleColumn(index))
                invisibleColumns.push(index);
        }

        // console.log('invi: ',invisibleColumns);

        return (<Table celled structured id="tblList">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell key={0} rowSpan={2}>Index</Table.HeaderCell>
                    <Table.HeaderCell key={1} rowSpan={2}>MP</Table.HeaderCell>
                    {
                        this.numberOfVisibleColumns([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], invisibleColumns) === 0 ? null :
                            <Table.HeaderCell key={2}
                                              colSpan={this.numberOfVisibleColumns([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], invisibleColumns)}>
                                &nbsp;
                            </Table.HeaderCell>
                    }
                    {
                        this.numberOfVisibleColumns([19, 20, 21, 22], invisibleColumns) === 0 ? null :
                            <Table.HeaderCell key={3}
                                              colSpan={this.numberOfVisibleColumns([19, 20, 21, 22], invisibleColumns)}>
                                MPC4 2x100
                            </Table.HeaderCell>
                    }
                    {
                        this.numberOfVisibleColumns([23, 24], invisibleColumns) === 0 ? null :
                            <Table.HeaderCell key={4} colSpan={this.numberOfVisibleColumns([23, 24], invisibleColumns)}>
                                MPC5 2xCGE
                            </Table.HeaderCell>
                    }
                    {
                        this.numberOfVisibleColumns([25], invisibleColumns) === 0 ? null :
                            <Table.HeaderCell key={5} colSpan={this.numberOfVisibleColumns([25], invisibleColumns)}>
                                MPC7E 3D 40XGE
                            </Table.HeaderCell>
                    }
                    {
                        this.numberOfVisibleColumns([26, 27, 28, 29, 30, 31], invisibleColumns) === 0 ? null :
                            <Table.HeaderCell key={6}
                                              colSpan={this.numberOfVisibleColumns([26, 27, 28, 29, 30, 31], invisibleColumns)}>
                                MPC7 Multirate
                            </Table.HeaderCell>
                    }
                </Table.Row>
                <Table.Row>
                    {
                        (() => {
                            const columns = ['Juniper MX960', 'Juniper MX480', 'Juniper MX240', 'Juniper MX104', 'Juniper MX5-T', 'MX SCB', 'Enhanced MX SCB', 'Enhanced MX SCB 2', 'RE-S-2000', 'RE-S-1800x4', 'RE-MX-104', 'MPCE Type 2 3D', 'MIC-3D-4XGE-XFP', 'MIC-3D-2XGE-XFP', 'MIC-3D-20GE-SFP', 'MIC-3D-20GE-SFP-E', 'MPCE Type 3 3D', 'MIC3-3D-10XGE-SFPP', 'MPC4E 3D 32XGE', 'MPC4E 3D 2CGE+8XGE', 'CFP-100G-SR10', 'CFP-100G-LR4', 'CFP-100G-ER', 'MPC5E 3D 2CGE+4XGE', 'CFP2-100G-SR10-D', 'MPC7E 3D 40XGE', 'MPC7E 3D MRATE-12xQSFPP-XGE-XLGE-CGE', 'QSFP-100GBASE-SR4', 'QSFP-100GBASE-LR4', 'QSFP-100GBASE-ER4', 'QSFP+-40G-SR4', 'QSFP+-40G-LR4'];
                            const result = [];

                            for (const [index, column] of columns.entries()) {
                                if (!invisibleColumns.includes(index) && column !== 'MPC7E 3D 40XGE') {
                                    // console.log(index, column);
                                    result.push(<Table.HeaderCell key={index}>{column}</Table.HeaderCell>);
                                }
                            }
                            return result;
                        })()
                    }
                    {/*{invisibleColumns.includes(0) ? null : <Table.HeaderCell>Juniper MX960</Table.HeaderCell>}*/}
                    {/*{invisibleColumns.includes(1) ? null : <Table.HeaderCell>Juniper MX480</Table.HeaderCell>}*/}
                    {/*{invisibleColumns.includes(2) ? null : <Table.HeaderCell>Juniper MX240</Table.HeaderCell>}*/}
                    {/*{invisibleColumns.includes(3) ? null : <Table.HeaderCell>Juniper MX104</Table.HeaderCell>}*/}
                    {/*{invisibleColumns.includes(4) ? null : <Table.HeaderCell>Juniper MX5-T</Table.HeaderCell>}*/}
                    {/*<Table.HeaderCell>MX SCB</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>Enhanced MX SCB</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>Enhanced MX SCB 2</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>RE-S-2000</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>RE-S-1800x4</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>RE-MX-104</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>MPCE Type 2 3D</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>MIC-3D-4XGE-XFP</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>MIC-3D-2XGE-XFP</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>MIC-3D-20GE-SFP</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>MIC-3D-20GE-SFP-E</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>MPCE Type 3 3D</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>MIC3-3D-10XGE-SFPP</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>MPC4E 3D 32XGE</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>MPC4E 3D 2CGE+8XGE</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>CFP-100G-SR10</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>CFP-100G-LR4</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>CFP-100G-ER</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>MPC5E 3D 2CGE+4XGE</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>CFP2-100G-SR10-D</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>MPC7E 3D MRATE-12xQSFPP-XGE-XLGE-CGE</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>QSFP-100GBASE-SR4</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>QSFP-100GBASE-LR4</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>QSFP-100GBASE-ER4</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>QSFP+-40G-SR4</Table.HeaderCell>*/}
                    {/*<Table.HeaderCell>QSFP+-40G-LR4</Table.HeaderCell>*/}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    listToDisplay.map(function (r, index) {

                        let deviceName = r.name;
                        if ((deviceName + '').includes('NOC-NET-')) {
                            deviceName = deviceName.replace("NOC-NET-", "");
                            deviceName = deviceName.substr(0, deviceName.lastIndexOf("-"));
                        }

                        return (<Table.Row key={r.name}>
                            <Table.Cell style={{textAlign: 'center'}} key={'idx'}>{index + 1} </Table.Cell>
                            <Table.Cell style={tdStyle} key={"b"}>{deviceName}</Table.Cell>
                            {
                                r.data.map((mini_item, index) => {
                                        return (
                                            invisibleColumns.includes(index) ? null :
                                                <Table.Cell style={tdStyle}
                                                            key={mini_item.excelLocation}
                                                >{mini_item.number}
                                                </Table.Cell>
                                        );
                                    }
                                )
                            }
                        </Table.Row>)
                    })
                }
            </Table.Body>
        </Table>);
    }
}

class Parts extends Component {

    constructor(props) {
        super(props);

        const list = this.refactorData(this.props.parts);

        this.state = {
            timeout: null,
            search: {searchByName: ''},
            searchLoading: {searchByName: false},
            list: list,
            filteredList: list,
            listToDisplay: list,
            pageLoading: true,
        };
    }

    searchTimeout = {};

    refactorData(parts) {

        function createNewDataRow() {
            let data = [
                {
                    name: "Juniper MX960",
                    excelLocation: "d",
                    number: 0
                },
                {
                    name: "Juniper MX480",
                    excelLocation: "e",
                    number: 0
                },
                {
                    name: "Juniper MX240",
                    excelLocation: "f",
                    number: 0
                },
                {
                    name: "Juniper MX104",
                    excelLocation: "g",
                    number: 0
                },
                {
                    name: "Juniper MX5-T",
                    excelLocation: "h",
                    number: 0
                },
                {
                    name: "MX SCB",
                    excelLocation: "i",
                    number: 0
                },
                {
                    name: "Enhanced MX SCB",
                    excelLocation: "j",
                    number: 0
                },
                {
                    name: "Enhanced MX SCB 2",
                    excelLocation: "k",
                    number: 0
                },
                {
                    name: "RE-S-2000",
                    excelLocation: "l",
                    number: 0
                },
                {
                    name: "RE-S-1800x4",
                    excelLocation: "m",
                    number: 0
                },
                {
                    name: "RE-MX-104",
                    excelLocation: "n",
                    number: 0
                },
                {
                    name: "MPCE Type 2 3D",
                    excelLocation: "o",
                    number: 0
                },
                {
                    name: "MIC-3D-4XGE-XFP",
                    excelLocation: "p",
                    number: 0
                },
                {
                    //name: "MIC 3D 20x 1GE(LAN) SFP",
                    name: "MIC-3D-2XGE-XFP",
                    excelLocation: "q",
                    number: 0
                },
                {
                    // name: "MIC 3D 20x 1GE(LAN)-E,SFP",
                    name: "MIC-3D-20GE-SFP",
                    excelLocation: "r",
                    number: 0
                },
                {
                    // name: "MIC-3D-20GE-SFP-E",
                    name: "MIC-3D-20GE-SFP-E",
                    excelLocation: "s",
                    number: 0
                },
                {
                    name: "MPCE Type 3 3D",
                    excelLocation: "t",
                    number: 0
                },
                {
                    name: "MIC3-3D-10XGE-SFPP",
                    excelLocation: "u",
                    number: 0
                },
                {
                    name: "MPC4E 3D 32XGE",
                    excelLocation: "v",
                    number: 0
                },
                {
                    name: "MPC4E 3D 2CGE+8XGE",
                    excelLocation: "w",
                    number: 0
                },
                {
                    name: "CFP-100G-SR10",
                    excelLocation: "x",
                    number: 0
                },
                {
                    name: "CFP-100G-LR4",
                    excelLocation: "y",
                    number: 0
                },
                {
                    name: "CFP-100G-ER",
                    excelLocation: "z",
                    number: 0
                },
                {
                    name: "MPC5E 3D 2CGE+4XGE",
                    excelLocation: "aa",
                    number: 0
                },
                {
                    name: "CFP2-100G-SR10-D",
                    excelLocation: "ab",
                    number: 0
                },
                {
                    name: "MPC7E 3D 40XGE",
                    excelLocation: "ac",
                    number: 0
                },
                {
                    name: "MPC7E 3D MRATE-12xQSFPP-XGE-XLGE-CGE",
                    excelLocation: "ad",
                    number: 0
                },
                {
                    name: "QSFP-100GBASE-SR4",
                    excelLocation: "ae",
                    number: 0
                },
                {
                    name: "QSFP-100GBASE-LR4",
                    excelLocation: "af",
                    number: 0
                },
                {
                    name: "QSFP-100GBASE-ER4",
                    excelLocation: "ag",
                    number: 0
                },
                {
                    name: "QSFP+-40G-SR4",
                    excelLocation: "ah",
                    number: 0
                },
                {
                    name: "QSFP+-40G-LR4",
                    excelLocation: "ai",
                    number: 0
                }
            ];
            return data;
        }

        let rows = [];

        if (parts && parts.length > 0) {
            let listPart = parts
            let listRow = [];
            listPart.sort(function (a, b) {
                if (a.name > b.name) {
                    return 1;
                }
                else {
                    return -1;
                }
            });


            let mpNameCheck = listPart[0].name;
            // console.log(mpNameCheck);
            let mpRow = {
                name: mpNameCheck,
                data: []
            };
            let listRowData = [];
            let listExcelData = createNewDataRow();
            //refactor data
            for (let part of listPart) {
                if (part.name != mpNameCheck) {
                    mpNameCheck = part.name;
                    mpRow.data = [...listExcelData];
                    let cloneRow = {...mpRow};
                    listRowData.push(cloneRow);
                    mpRow = {
                        name: mpNameCheck,
                        data: []
                    };
                    listExcelData = createNewDataRow();

                }

                for (let excelItem of listExcelData) {

                    if (part.description) {
                        part.description = part.description.trim();
                    }
                    if (part.manualDescription) {
                        part.manualDescription = part.manualDescription.trim();
                    }

                    if (excelItem.name == part.description || excelItem.name == part.manualDescription) {
                        excelItem.number += 1;
                        break;
                    }
                }
            }
            mpRow.data = [...listExcelData];
            listRowData.push({...mpRow});
            listExcelData = null;

            rows = listRowData;
        }

        return rows;
    }

    componentDidMount() {
        if (_.size(this.props.parts) === 0)
            this.props.dispatch(groupMPPartsA.getAllGroupMPParts());
    }

    componentWillReceiveProps(nextProps) {
        const list = this.refactorData(nextProps.parts);

        this.setState({
            timeout: null,
            search: {searchByName: ''},
            searchLoading: {searchByName: false},
            list: list,
            filteredList: list,
            listToDisplay: list,
            pageLoading: true,
        });
    }

    filter() {

        const searchByName = this.state.search['searchByName'];

        const filteredList = this.state.list.filter(function (e) {
            return (e.name.toString().toLowerCase().includes(searchByName.toLowerCase()));
        });

        this.setState({
            filteredList: filteredList,
            listToDisplay: filteredList,
            searchLoading: {
                searchByName: false,
            }
        });
    }

    handleSearch(e) {
        const {name, value} = e.target;
        const search = {...this.state.search};
        const searchLoading = {...this.state.searchLoading};

        search[name] = value;
        searchLoading[name] = true;

        clearTimeout(this.searchTimeout[name]);
        this.setState({search, searchLoading});
        this.searchTimeout[name] = setTimeout(() => {
            this.filter();
        }, 500);
    }

    exportExcel = () => {
        let wb = XLSX.utils.book_new();

        wb = XLSX.utils.table_to_book(document.getElementById('tblList'), {raw: true});

        if (!wb.Props)
            wb.Props = {};

        wb.Props.Author = 'noc-ast';

        XLSX.writeFile(wb, `Parts_Of_Group_MP${moment(new Date()).format("YYYY_MM_DD_HH_mm_ss")}.xlsx`);
    };

    render() {

        const {pageLoading} = this.props;

        const {
            search,
            searchLoading,
            list,
            filtedList,
            listToDisplay
        } = this.state;

        return (
            <div id="div-page-group-mp-parts">
                <Head>
                    <title> Parts of Group MP </title>
                </Head>
                <DashboardLayout>
                    <Dimmer active={pageLoading} inverted>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>
                    <Segment>
                        <Header> Parts of Group MP </Header>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Input fluid label='Search by name' icon='search' placeholder="Search by name..."
                                            name='searchByName'
                                            loading={searchLoading['searchByName']}
                                            value={search['searchByName']} onChange={this.handleSearch.bind(this)}/>
                            </Grid.Column>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Field>
                                    <label>Export</label>
                                    <Button fluid onClick={this.exportExcel}>Export to excel file</Button>
                                </Form.Field>
                            </Grid.Column>
                        </Grid>
                    </Segment>

                    <Segment className="list">
                        <MainTable onTableDidUpdate={() => {

                        }} listToDisplay={listToDisplay}/>
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({groupMPParts}) => (groupMPParts);

export default connect(mapStateToProps, null)(Parts);