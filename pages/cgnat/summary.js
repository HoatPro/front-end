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
    Label,
    Dimmer,
    Loader,
    Select,
    Form
} from 'semantic-ui-react';
import DashboardLayout from '../../src/components/Layout/DashboadLayout';
import CustomTable from '../../src/components/Table/Table';
import Head from 'next/head';
import Link from 'next/link';
import {connect} from 'react-redux';
import {cgnatSummaryA} from '../../src/redux/_actions/cgnat/cgnatSummaryA';
import _ from 'lodash';
import moment from 'moment';
import XLSX from "xlsx";
import * as dataAnalyzer from '../../src/helpers/data-analyzer.js';
import {toast} from "react-toastify";
import {groupMPSummaryA} from "../../src/redux/_actions/groupMP/groupMPSummaryA";
import appConstants from '../../src/constants/app';

class MainTable extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let result = (!_.isEqual(nextProps.listToDisplay, this.props.listToDisplay));
        return result;
    }

    componentDidUpdate() {
        this.props.onTableDidUpdate();
    }

    render() {
        return (<Table celled structured id="tblList">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell rowSpan={2}>Index</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>CGNAT</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>MPOP Prefer</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>Subs</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>NAT checking time</Table.HeaderCell>
                    <Table.HeaderCell colSpan={4}>NAT ratio</Table.HeaderCell>
                    <Table.HeaderCell colSpan={2}>BW</Table.HeaderCell>
                    <Table.HeaderCell colSpan={2}>Existing Link(10G links)</Table.HeaderCell>
                    <Table.HeaderCell colSpan={2}>Links to add (10G links)</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>Action</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>Deadline</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>Assignment</Table.HeaderCell>
                    <Table.HeaderCell colSpan={2}>Next 2 months</Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell>MegaYou</Table.HeaderCell>
                    <Table.HeaderCell>MegaYou1</Table.HeaderCell>
                    <Table.HeaderCell>SAVECUS</Table.HeaderCell>
                    <Table.HeaderCell>SAVECUS1</Table.HeaderCell>
                    <Table.HeaderCell>Uplink</Table.HeaderCell>
                    <Table.HeaderCell>Mams</Table.HeaderCell>
                    <Table.HeaderCell>Uplink</Table.HeaderCell>
                    <Table.HeaderCell>Mams</Table.HeaderCell>
                    <Table.HeaderCell>Uplink</Table.HeaderCell>
                    <Table.HeaderCell>Mams</Table.HeaderCell>
                    <Table.HeaderCell>Uplink</Table.HeaderCell>
                    <Table.HeaderCell>Mams</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    this.props.listToDisplay.map((item, index, list) => {
                        return (
                            <Table.Row key={index}>
                                <Table.Cell style={{textAlign: 'center'}} key={'idx'}>{index + 1} </Table.Cell>
                                <Table.Cell
                                    key={'name'}>{(item.name + '').replace(/-RE0/g, '').replace(/-RE1/g, '')} </Table.Cell>
                                <Table.Cell className="mpop-prefer"
                                            key={'mpopPrefer'}>
                                    {item.mpopPrefer.length}
                                </Table.Cell>
                                <Table.Cell key={'subs'}>
                                    {item.subs}

                                </Table.Cell>
                                <Table.Cell key={'natRatio_time'}>
                                    {
                                        item.natRatio ? moment(item.natRatio.startedAt).format('DD/MM HH:mm:ss') +' -> ' + moment(item.natRatio.finishedAt).format('HH:mm:ss') : ''
                                    }
                                </Table.Cell>
                                <Table.Cell key={'natRatio_MegaYou'}>
                                    {
                                        item.natRatio ? Math.round(item.natRatio.data['MegaYou'].numberOfActiveUsers / item.natRatio.data['MegaYou'].numberOfPoolIps) : ''
                                    }
                                </Table.Cell>
                                <Table.Cell key={'natRatio_MegaYou1'}>
                                    {
                                        item.natRatio ? Math.round(item.natRatio.data['MegaYou1'].numberOfActiveUsers / item.natRatio.data['MegaYou'].numberOfPoolIps) : ''
                                    }
                                </Table.Cell>
                                <Table.Cell key={'natRatio_SAVECUS'}>
                                    {
                                        item.natRatio ? Math.round(item.natRatio.data['SAVECUS'].numberOfActiveUsers / item.natRatio.data['SAVECUS'].numberOfPoolIps) : ''
                                    }
                                </Table.Cell>
                                <Table.Cell key={'natRatio_SAVECUS1'}>
                                    {
                                        item.natRatio ? Math.round(item.natRatio.data['SAVECUS1'].numberOfActiveUsers / item.natRatio.data['SAVECUS1'].numberOfPoolIps) : ''
                                    }
                                </Table.Cell>
                                <Table.Cell key={'trafficUplink'}>{item.trafficUplink} </Table.Cell>
                                <Table.Cell key={'trafficMams'}>{item.trafficMams} </Table.Cell>
                                <Table.Cell key={'uplink'}>{item.uplink} </Table.Cell>
                                <Table.Cell key={'mams'}>{item.mams} </Table.Cell>
                                <Table.Cell key={'linksToAddUplink'}>{item.linksToAddUplink} </Table.Cell>
                                <Table.Cell key={'linksToAddMams'}>{item.linksToAddMams} </Table.Cell>
                                <Table.Cell key={'action'}>
                                    <textarea rows={3}
                                              type="text"
                                              className={"plan-content"}
                                              data-cgnat={item['name']}
                                              value={item['action']}
                                              onChange={this.props.changeTextArea}
                                              data-plancontenttype={'action'}>
                                    </textarea>
                                </Table.Cell>
                                <Table.Cell key={'deadline'}>
                                   <textarea rows={3} type="text" className={"plan-content"}
                                             data-cgnat={item['name']}
                                             value={item['deadline']}
                                             onChange={this.props.changeTextArea}
                                             data-plancontenttype={'deadline'}>
                                   </textarea>
                                </Table.Cell>
                                <Table.Cell key={'assignment'}>
                                    <textarea rows={3} type="text" className={"plan-content"}
                                              data-cgnat={item['name']}
                                              value={item['assignment']}
                                              onChange={this.props.changeTextArea}
                                              data-plancontenttype={'assignment'}>
                                    </textarea>
                                </Table.Cell>
                                <Table.Cell key={'next2MonthsUplink'}>{item.next2MonthsUplink} </Table.Cell>
                                <Table.Cell key={'next2MonthsMams'}>{item.next2MonthsMams} </Table.Cell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Body>
        </Table>);
    }
}

class Summary extends Component {

    constructor(props) {
        super(props);

        const {listData} = props;

        this.handleChangePlanContent = this.handleChangePlanContent.bind(this);
        this.handleChangIncreasingPercent = this.handleChangIncreasingPercent.bind(this);

        this.state = {
            search: {searchByName: ''},
            searchLoading: {searchByName: false},
            list: listData,
            filtedList: listData,
            listToDisplay: listData,
        };
    }

    searchTimeout = {};

    componentDidMount() {
        if (_.size(this.props.listData) === 0) {
            this.props.dispatch(cgnatSummaryA.getCgnatSummaryData(new Date(), appConstants.defaultCgnatIncreasingPercent));
        }
    }

    componentWillReceiveProps(nextProps) {
        const {listData} = nextProps;

        if (Array.isArray(listData)) {
            for (let item of listData) {
                item.subs = '';
                if (item.natRatio) {
                    let subs = 0;
                    for (let poolName in item.natRatio.data) {
                        subs += item.natRatio.data[poolName].numberOfActiveUsers;
                    }
                    item.subs = subs;
                }
            }
        }

        this.setState({
            search: {searchByName: ''},
            searchLoading: {searchByName: false},
            pagination: {currentPage: 0, countPage: 1},
            list: listData,
            filtedList: listData,
            listToDisplay: listData,
        });
    }

    filter() {
        const searchByName = this.state.search['searchByName'];

        const filteredList = this.state.list.filter(function (e) {

            const lowerCaseSearchByName = searchByName.trim().toLowerCase();

            return ((e.name + '').toLowerCase().includes(lowerCaseSearchByName));
        });

        this.setState({
            filteredList: filteredList,
            listToDisplay: filteredList,
            searchLoading: {
                searchByName: false,
            }
        });
    }

    handleChangIncreasingPercent(event, target) {
        const increasingPercent = target.value;
        if (!increasingPercent || isNaN(increasingPercent)) {
            toast.error('Invalid value');
        }
        else {
            this.props.dispatch(cgnatSummaryA.getCgnatSummaryData(this.props.date, parseInt(increasingPercent)));
        }
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

        XLSX.writeFile(wb, `CGNAT_Summary_${moment(new Date()).format("YYYY_MM_DD_HH_mm_ss")}.xlsx`);
    };

    changeTextArea = event => {
        let newListToDisplay = _.cloneDeep(this.state.listToDisplay);
        let newFilteredList = _.cloneDeep(this.state.filtedList);
        let newList = _.cloneDeep(this.state.list);
        let el = event.target;
        let cgnat = el.dataset['cgnat'];
        let contentType = el.dataset['plancontenttype'];
        let text = el.value;

        // console.log(cgnat);

        function updateText(list) {
            for (let item of list) {
                if (item.name == cgnat) {
                    if (contentType == 'action')
                        item.action = text;
                    else if (contentType == 'deadline')
                        item.deadline = text;
                    else if (contentType == 'assignment')
                        item.assignment = text;
                    break;
                }
            }
        }

        try {
            updateText(newList);
            updateText(newFilteredList);
            updateText(newListToDisplay);
        }
        catch (e) {
            console.log(e);
        }

        this.setState({
            list: newList,
            filteredList: newFilteredList,
            listToDisplay: newListToDisplay
        });

    };

    handleChangePlanContent(event) {
        this.props.dispatch(cgnatSummaryA.savePlan(this.props.date, this.state.list));
    };

    render() {
        const {listData, pageLoading, increasingPercent} = this.props;
        console.log(this.props);
        const {
            search,
            searchLoading,
            pagination = {currentPage: 0, countPage: 1},
            list = [],
            filtedList = [],
            listToDisplay = [],
        } = this.state;

        return (
            <div id="div-page-cgnat-summary">
                <Head>
                    <title> CGNAT Summary </title>
                </Head>
                <DashboardLayout>
                    <Dimmer active={pageLoading} inverted>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>
                    <Segment>
                        <Header> CGNAT Summary</Header>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Input fluid label='Search by name' icon='search' placeholder="Search by name..."
                                            name='searchByName'
                                            loading={searchLoading['searchByName']}
                                            value={search['searchByName']} onChange={this.handleSearch.bind(this)}/>
                            </Grid.Column>
                            <Grid.Column computer={2} largeScreen={2} tablet={4} moblie={8}>
                                <Form.Input fluid label='Increasing percent' placeholder="" type="number"
                                            value={increasingPercent}
                                            onChange={this.handleChangIncreasingPercent.bind(this)}>
                                </Form.Input>
                            </Grid.Column>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Field>
                                    <label>Export</label>
                                    <Button fluid onClick={this.exportExcel}>Export to excel file</Button>
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Field>
                                    <label>Save</label>
                                    <Button fluid onClick={this.handleChangePlanContent.bind(this)}>Save plan</Button>
                                </Form.Field>
                            </Grid.Column>
                        </Grid>
                    </Segment>

                    <Segment className="list">
                        <Label>
                            {
                                listToDisplay.length ? moment(listToDisplay[0].time).utcOffset(0).format('YYYY-MM-DD HH:mm:ss') : ''
                            }
                        </Label>
                        <MainTable
                            onTableDidUpdate={() => {
                                this.setState({pageLoading: false})
                            }}
                            listToDisplay={listToDisplay}
                            changeTextArea={this.changeTextArea}
                        />
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({cgnatSummary}) => (cgnatSummary);

export default connect(mapStateToProps, null)(Summary);