import React, {Component, Fragment} from 'react';
import {Step} from 'semantic-ui-react'
import {Progress} from 'semantic-ui-react'
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
    Label,
    Form,
    Item,
    Message,
    Tab
} from 'semantic-ui-react';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import DashboardLayout from '../../src/components/Layout/DashboadLayout';
import Head from 'next/head';
import {connect} from 'react-redux';
import {getLogData} from '../../src/redux/_actions/devices/removePortsA';
import _ from 'lodash';
import moment from 'moment';
import {toast} from "react-toastify";

class LogsSegment extends Component {

    constructor(props) {
        super(props);

        const {listData} = this.props;

        this.handleSearch = this.handleSearch.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleViewPorts = this.handleViewPorts.bind(this);

        this.state = {
            search: {searchByName: '', searchByTime: -1},
            searchLoading: {searchByName: false, searchByTime: false},
            timeList: this.getTimeList(listData),
            list: listData,
            filteredList: listData,
            showModal: false,
        };
    }

    searchTimeout = {};

    getTimeList(listData) {
        const set = new Set();

        for (let item of listData) {
            set.add(item.time);
        }

        return [...set];
    }

    handleCloseModal() {
        this.setState({showModal: false});
    }

    setClassForDatePicker() {
        const datePickerWrapper = document.querySelector('.react-datepicker-wrapper ');
        datePickerWrapper.classList.add("fluid");

        const datePicker = document.querySelector('.react-datepicker-wrapper .react-datepicker__input-container');
        datePicker.classList.add("ui");
        datePicker.classList.add("input");

        const datePickerInput = document.querySelector('.react-datepicker-wrapper .react-datepicker__input-container input');
        datePickerInput.style.width = "100%";
    }

    componentDidUpdate() {
        this.setClassForDatePicker();
    }

    componentDidMount() {
        this.setClassForDatePicker();
    }

    componentWillReceiveProps(nextProps) {
        const {listData} = nextProps;

        this.setState({
            search: {searchByName: '', searchByTime: -1},
            searchLoading: {searchByName: false, searchByTime: false},
            timeList: this.getTimeList(listData),
            list: listData,
            filteredList: listData,
            showModal: false
        });
    }

    renderModal = () => {
        const {deviceToShowInModal, showModal} = this.state;
        let ports;

        if (!deviceToShowInModal)
            return null;

        // ports = deviceToShowInModal.data.filter((e) => (e.status === 'up')); //filter
        // ports = deviceToShowInModal.ports.sort((a, b) => (a.existInOps - b.existInOps));

        ports = deviceToShowInModal.ports

        return (
            <Modal size="large" open={showModal} onClose={this.handleCloseModal}>
                <Modal.Header>Ports of device {deviceToShowInModal.name} | {deviceToShowInModal.ip}</Modal.Header>
                <Modal.Content scrolling>
                    {
                        (ports.length != 0) ?
                            (<Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Index</Table.HeaderCell>
                                        <Table.HeaderCell align="right">Name</Table.HeaderCell>
                                        <Table.HeaderCell align="right">IfIndex</Table.HeaderCell>
                                        <Table.HeaderCell align="right">Description</Table.HeaderCell>
                                        <Table.HeaderCell align="right">Remove type</Table.HeaderCell>
                                        <Table.HeaderCell align="right">Monitored attrs</Table.HeaderCell>
                                        <Table.HeaderCell align="right">Task id</Table.HeaderCell>
                                        <Table.HeaderCell align="center">Result </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {ports.map((row, idx) => (
                                        <Table.Row key={idx}>
                                            <Table.Cell component="th" scope="row">
                                                {idx + 1}
                                            </Table.Cell>
                                            <Table.Cell>{row.name}</Table.Cell>
                                            <Table.Cell>{row.ifindex}</Table.Cell>
                                            <Table.Cell>{row.description}</Table.Cell>
                                            <Table.Cell>{row.removeType}</Table.Cell>
                                            <Table.Cell>
                                                {
                                                    row.monitoredAttrs ?
                                                        row.monitoredAttrs.sort().map(attr => (
                                                            <Label>
                                                                {attr}
                                                            </Label>
                                                        ))
                                                        : null
                                                }
                                            </Table.Cell>
                                            <Table.Cell>
                                                {
                                                    row.requestOpsviewResult ? row.requestOpsviewResult.taskId : 'request not found'
                                                }
                                            </Table.Cell>
                                            <Table.Cell className="center">
                                                {
                                                    row.requestOpsviewResult ?
                                                        (
                                                            row.requestOpsviewResult.success ?
                                                                <Icon name="check" color="green"/> :
                                                                <Icon name="close" color="red"/>
                                                        ) : 'request not found'
                                                }
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>) : (<Danger>There is no ports in this device!</Danger>)
                    }
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.handleCloseModal} negative>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    };

    filter() {

        const searchByName = this.state.search['searchByName'];
        const searchByTime = this.state.search['searchByTime'];

        const filteredList = this.state.list.filter(function (e) {

            const searchByNameLowerCase = searchByName.trim().toLowerCase();

            return ((searchByTime == -1 || e.time === searchByTime) && (searchByName === '' || (e.name + '').toLowerCase().includes(searchByNameLowerCase) || (e.ip + '').toLowerCase().includes(searchByNameLowerCase) || (e['function'] + '').toLowerCase().includes(searchByNameLowerCase)));
        });

        toast.success(`There are ${filteredList.length} existed items!`);

        this.setState({
            filteredList: filteredList,
            searchLoading: {
                searchByName: false,
                searchByTime: false
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

    handleViewPorts(device) {
        this.setState({
            deviceToShowInModal: device,
            showModal: true
        });
    }

    handleChangeSelect(e, {name, value}) {
        e.persist();

        const search = {...this.state.search};
        const searchLoading = {...this.state.searchLoading};
        search[name] = value;
        searchLoading[name] = true;

        clearTimeout(this.searchTimeout[name]);
        this.setState({search, searchLoading});

        this.searchTimeout[name] = setTimeout(() => {
            this.filter();
        }, 500);
    };

    render() {
        const {filteredList, list, timeList, searchLoading, search} = this.state;
        const {logDate, handleChangeLogDate} = this.props;

        // console.log(this.props);

        const totalPortCnt = filteredList.reduce((sum, e) => (sum + e.ports.length), 0);
        const totalSuccessPortCnt = filteredList.reduce((sum, e) => (sum + e.ports.reduce((s, port) => {
            if (port.requestOpsviewResult != null && port.requestOpsviewResult.success) {
                return s + 1;
            }
            return s;
        }, 0)), 0);
        const totalSuccessPortPercent = Math.round(totalSuccessPortCnt / totalPortCnt * 100 * 100) / 100;

        const renderOverviewTab = () => {
            return (
                <Tab.Pane>

                    <Message info>
                        <Message.Header
                            style={{textAlign: "center"}}>{totalSuccessPortCnt}/{totalPortCnt} ({totalSuccessPortPercent}%)
                        </Message.Header>
                    </Message>

                    <Table celled structured id="tblList">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Index</Table.HeaderCell>
                                <Table.HeaderCell>Time</Table.HeaderCell>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Ip</Table.HeaderCell>
                                <Table.HeaderCell>Function</Table.HeaderCell>
                                <Table.HeaderCell>Method</Table.HeaderCell>
                                <Table.HeaderCell>Stat</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                filteredList.map((e, idx) => {

                                    let successPortCnt = e.ports.reduce((s, e) => {
                                        if (e.requestOpsviewResult != null && e.requestOpsviewResult.success) {
                                            return s + 1;
                                        }
                                        return s;
                                    }, 0);
                                    let successPercent = Math.round(successPortCnt / e.ports.length * 100 * 100) / 100;

                                    return (
                                        <Table.Row key={idx}>
                                            <Table.Cell
                                                style={{
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {idx + 1}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {moment(e.time).format("YYYY-MM-DD HH:mm:ss")}
                                            </Table.Cell>
                                            <Table.Cell> {e.name} </Table.Cell>
                                            <Table.Cell> {e.ip} </Table.Cell>
                                            <Table.Cell> {e.function} </Table.Cell>
                                            <Table.Cell> {e.method} </Table.Cell>
                                            <Table.Cell style={{
                                                textAlign: 'right',
                                                color: successPercent == 100 ? 'green' : 'red'
                                            }}> {successPortCnt + '/' + e.ports.length + ' (' + successPercent + '%)'} </Table.Cell>
                                            <Table.Cell className="center">
                                                <Button size="mini" icon color="teal"
                                                        onClick={() => this.handleViewPorts(e)}
                                                >
                                                    <Icon name="eye"/>
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                })
                            }
                        </Table.Body>
                    </Table>
                    {
                        this.renderModal()
                    }
                </Tab.Pane>
            )
        };

        const renderFailPortsTab = () => {

            const portList = [];

            for (let device of filteredList) {
                for (let port of device.ports) {
                    if (!port.requestOpsviewResult || !port.requestOpsviewResult.success) {
                        portList.push({...port, device: device});
                    }
                }
            }

            return (
                <Tab.Pane>
                    {
                        portList.length != 0 ?
                            <Table celled structured id="tblList">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Index</Table.HeaderCell>
                                        <Table.HeaderCell>Time</Table.HeaderCell>
                                        <Table.HeaderCell>Device</Table.HeaderCell>
                                        <Table.HeaderCell>Ip</Table.HeaderCell>
                                        <Table.HeaderCell>Function</Table.HeaderCell>
                                        <Table.HeaderCell>Area</Table.HeaderCell>
                                        <Table.HeaderCell>Method</Table.HeaderCell>
                                        <Table.HeaderCell>Name</Table.HeaderCell>
                                        <Table.HeaderCell>IfIndex</Table.HeaderCell>
                                        <Table.HeaderCell>Description</Table.HeaderCell>
                                        <Table.HeaderCell>Task Id</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {
                                        portList.map((port, idx) => (
                                            <Table.Row>
                                                <Table.Cell
                                                    style={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {idx + 1}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {moment(port.device.time).format("YYYY-MM-DD HH:mm:ss")}
                                                </Table.Cell>
                                                <Table.Cell> {port.device.name} </Table.Cell>
                                                <Table.Cell> {port.device.ip} </Table.Cell>
                                                <Table.Cell> {port.device.function} </Table.Cell>
                                                <Table.Cell> {port.device.area} </Table.Cell>
                                                <Table.Cell> {port.device.method} </Table.Cell>
                                                <Table.Cell> {port.name} </Table.Cell>
                                                <Table.Cell> {port.ifindex} </Table.Cell>
                                                <Table.Cell> {port.description} </Table.Cell>
                                                <Table.Cell>
                                                    {
                                                        port.requestOpsviewResult ? port.requestOpsviewResult.taskId : null
                                                    }
                                                </Table.Cell>
                                            </Table.Row>
                                        ))
                                    }
                                </Table.Body>
                            </Table> :
                            <Message warning>
                                <Message.Header>
                                    There is no existed items!
                                </Message.Header>
                            </Message>
                    }
                </Tab.Pane>
            )
        };

        return (
            <Segment>
                <Header> Logs </Header>
                <Grid className='grid-toolbar' doubling stackable>
                    <Grid.Column computer={2} largeScreen={2} tablet={4} moblie={8}>
                        <Form.Field>
                            <label>Choose log date</label>
                            <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={logDate}
                                maxDate={new Date()}
                                onChange={handleChangeLogDate}
                                locale="en"
                            />
                        </Form.Field>
                    </Grid.Column>
                    <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                        <Form.Input fluid label='Search by name' icon='search' placeholder="Search by name..."
                                    name='searchByName'
                                    loading={searchLoading['searchByName']}
                                    value={search['searchByName']} onChange={this.handleSearch}/>
                    </Grid.Column>
                    <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                        <Form.Select fluid label='Search by time' name='searchByTime'
                                     options={
                                         [-1, ...timeList].map(
                                             (e) => (
                                                 {
                                                     key: e,
                                                     text: e == -1 ? 'all' : moment(e).format("YYYY-MM-DD HH:mm:ss"),
                                                     value: e
                                                 }
                                             ))
                                     }
                                     value={search['searchByTime']}
                                     placeholder='Time'
                                     onChange={this.handleChangeSelect}
                        />
                    </Grid.Column>
                </Grid>

                {filteredList.length != 0 ?
                    <Tab style={{marginTop: "14px"}}
                         panes={
                             [
                                 {
                                     menuItem: 'Overview',
                                     render: renderOverviewTab
                                 },
                                 {
                                     menuItem: 'Fail list',
                                     render: renderFailPortsTab
                                 }
                             ]
                         }
                    /> :
                    <Message warning>
                        <Message.Header>
                            There is no existed items!
                        </Message.Header>
                    </Message>
                }
            </Segment>
        );
    }
}

class RemovePortsPage extends Component {

    constructor(props) {
        super(props);

        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleChangeLogDate = this.handleChangeLogDate.bind(this);

        this.state = {
            openModalAdd: false
        };
    }

    componentDidMount() {
        if (_.size(this.props.logs) === 0) {
            this.props.dispatch(getLogData(new Date()));
        }
    }

    componentWillReceiveProps(nextProps) {
        // const {listData} = nextProps;
        //
        // this.setState({
        //     search: {searchByName: ''},
        //     searchLoading: {searchByName: false},
        //     pagination: {currentPage: 0, countPage: 1},
        //     list: listData,
        //     filtedList: listData,
        //     listToDisplay: listData,
        // });
    }

    handleCloseModal() {
        this.setState({openModalAdd: false});
        this.props.dispatch(getLogData(new Date()));
    }

    handleOpenModal() {
        this.setState({openModalAdd: true});
    }

    handleChangeLogDate(date) {
        this.props.dispatch(getLogData(date));
    }

    render() {
        const {pageLoading, logs, logDate} = this.props;

        // console.log(this.props);
        const {openModalAdd} = this.state;

        return (
            <div>
                <Head>
                    <title> Remove ports from opsview log</title>
                </Head>
                <DashboardLayout>
                    <Dimmer active={pageLoading} inverted>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>

                    <LogsSegment listData={logs}
                                 logDate={logDate}
                                 handleChangeLogDate={this.handleChangeLogDate}
                    />
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({removePortsPageData}) => (removePortsPageData);

export default connect(mapStateToProps, null)(RemovePortsPage);