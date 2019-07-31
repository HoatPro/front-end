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
import {getLogData} from '../../src/redux/_actions/devices/addNewDeviceA';
import {getNetDeviceFunctionsAndAreas} from "../../src/redux/_actions/netData/netDataA";
import _ from 'lodash';
import moment from 'moment';
import {toast} from "react-toastify";
import {getNetRoomsByAreaId} from "../../src/utils/api";
import io from "./../../src/utils/socketio";

const addDeviceSteps = {
    STARTING: 0,
    GETTING_PORTS: 1,
    DEVICE_TO_OPSVIEW: 2,
    PORTS_TO_OPSVIEW: 3,
    COMPLETED: 4
};

class AddDeviceModal extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        step: addDeviceSteps.STARTING,
        name: '',
        ip: '',
        area: '',
        room: '',
        rack: '',
        deviceFunction: '',
        ports: [],
        loadingMessage: '',
        message: '',
        description: '',
        type: 'juniper',
        netRooms: []
    };

    handleChange = (e, {name, value}) => this.setState({[name]: value});

    handleChangeArea = async (e, {name, value}) => {
        e.persist();

        try {
            const rooms = await getNetRoomsByAreaId(value);
            this.setState({
                [name]: e.target.textContent,
                netRooms: rooms
            });
        }
        catch (e) {
            console.log(e);
            toast.error('Cannot get rooms of area');
        }
    };

    handleChangeRoom = async (e, {name, value, textContent}) => {
        e.persist();

        this.setState({
            [name]: e.target.textContent,
        })
    };

    handleSubmit = () => {
        const {name, ip, area, room, rack, deviceFunction, type} = this.state;

        for (let attr of ['name', 'ip', 'area', 'room', 'rack', 'deviceFunction']) {
            if (this.state[attr].trim() === '') {
                toast.error(attr + ' is empty!');
                return;
            }
        }

        this.socket.emit('get-ports-of-devices', {
            name, ip, area, room, rack, function: deviceFunction, type
        });

        this.setState({
            step: addDeviceSteps.GETTING_PORTS,
            loading: true,
            loadingMessage: 'Getting ports'
        });
    };

    handleAddToOpsview = () => {

        const {name, ip, area, room, rack, deviceFunction, ports, description} = this.state;

        if (!Array.isArray(ports) && ports.length === 0) {
            toast.error('There is no ports to add');
            return;
        }

        this.socket.emit('add-device-to-opsview', {
            name, ip, area, room, rack, function: deviceFunction, ports, description,
        });

        this.setState({
            step: addDeviceSteps.DEVICE_TO_OPSVIEW,
            loading: true,
            loadingMessage: 'Adding device info to OPSVIEW'
        });
    };

    componentDidMount() {
        this.socket = io();

        if (_.size(this.props.netDeviceFunctions) == 0) {
            this.props.dispatch(getNetDeviceFunctionsAndAreas());
        }

        this.socket.on('get-ports-of-device-response', (data) => {
            const {name, ip} = this.state;
            if (data.status === 'success' && data.data.name == name && data.data.ip == ip) {

                //    console.log(data);

                // example response
                //           {
                //                 "status": "success",
                //                 "data":
                //                     {
                //                         "name": "abc"
                //                         "ip": "118.70.0.81",
                //                         "data":
                //                             [{
                //                                 "status": "up",
                //                                 "remoteSystem": "QNH-MP-01-02",
                //                                 "protocol": "164",
                //                                 "name": "ge-0/0/0",
                //                                 "iplc": null,
                //                                 "existInOps": true,
                //                                 "ifindex": "4252",
                //                                 "description": "L3#Equal#QNH-MP-01-02-ge-0/0/0"
                //                             }, {
                //                                 "status": "up",
                //                                 "remoteSystem": "QNH-MP-01-02",
                //                                 "protocol": "165",
                //                                 "name": "ge-0/0/1",
                //                                 "iplc": null,
                //                                 "existInOps": true,
                //                                 "ifindex": "4253",
                //                                 "description": "L3#Equal#QNH-MP-01-02-ge-0/0/1"
                //                             }]
                //                     }
                //             }

                toast.success('Get port list completed!');

                this.setState({
                    ports: data.data.data,
                    step: addDeviceSteps.DEVICE_TO_OPSVIEW,
                    description: data.data.description,
                    loading: false
                });
            }
            else {
                toast.error(data.msg ? data.msg : 'Get ports of device failure!');
                this.setState({
                    step: addDeviceSteps.STARTING,
                    loading: false
                });
            }
        });

        this.socket.on('add-device-info-to-opsview-response', (data) => {
            if (data.status === 'success') {
                toast.success('New device infor has been added to OPSVIEW!');
                this.setState({
                    step: addDeviceSteps.PORTS_TO_OPSVIEW,
                    loading: false
                });
            }
            else {
                toast.error('There is an error when adding device infor to OPSVIEW');
                this.setState({
                    loading: false
                });
            }
        });

        this.socket.on('add-port-to-opsview-response', (data) => {
            for (let item of this.state.ports) {
                if (item.name === data.data.name) {
                    item.existInOps = data.data.existInOps;
                    item.message = data.data.message;
                    item.processed = data.data.processed;
                    break;
                }
            }

            this.setState({
                ports: this.state.ports,
                message: data.data.name + ' --- ' + data.data.description + ' processed'
            });
        });

        this.socket.on('add-device-to-opsview-completed', (data) => {

            for (let port of this.state.ports) {
                for (let item of data.ports)
                    if (port.name === item.name) {
                        port.existInOps = item.existInOps;
                        break;
                    }
            }

            toast.success('Add new device to OPSVIEW completed');

            this.setState({
                ports: this.state.ports,
                step: addDeviceSteps.COMPLETED
            });
        });
    }

    handleCloseModal = () => {
        if (this.state.step === addDeviceSteps.COMPLETED) {
            this.setState({
                step: addDeviceSteps.STARTING,
                name: '',
                ip: '',
                description: '',
                area: '',
                room: '',
                rack: '',
                deviceFunction: '',
                ports: [],
                loading: false,
                loadingMessage: '',
                type: 'juniper',
                message: ''
            });
        }
        this.props.handleCloseModal();
    };

    render() {
        const {open, netDeviceFunctions, netAreas, handleCloseModal} = this.props;
        const {step, name, ip, deviceFunction, area, room, rack, ports, loading, loadingMessage, message, netRooms} = this.state;
        const functionOptions = netDeviceFunctions.map((e, index) => ({
            key: e.netDeviceFunctionId,
            text: e.netDeviceFunctionName,
            value: e.netDeviceFunctionName
        }));

        const areaOptions = netAreas.map(e => ({
            key: e.id,
            value: e.id,
            text: e.name,
        }));

        const roomOptions = netRooms.map(e => ({
            key: e.id,
            value: e.id,
            text: e.name,
        }));

        // count number of monitored port
        const monitoredCount = ports.reduce((sum, port) => (sum + (port.existInOps === true)), 0);
        const processedCount = ports.reduce((sum, port) => (sum + (port.processed === true)), 0);

        return (
            <Modal size='large' open={open} onClose={handleCloseModal}>
                <Dimmer active={loading} inverted>
                    <Loader size='big' inverted content={loadingMessage}/>
                </Dimmer>
                <Modal.Header>Add a new device to opsview</Modal.Header>
                <Modal.Content scrolling>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Input fluid label='Name' name="name" placeholder='device name' required
                                        onChange={this.handleChange} value={name}/>
                            <Form.Input fluid label='Ip' name="ip" placeholder='ip' required
                                        onChange={this.handleChange} value={ip}/>
                            <Form.Select fluid label='Function' name="deviceFunction" value={deviceFunction}
                                         options={functionOptions} onChange={this.handleChange} placeholder='function'
                                         required/>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Select fluid label='Area' name="area"
                                         options={areaOptions} onChange={this.handleChangeArea} placeholder='area'
                                         required/>
                            <Form.Select fluid label='Room' name="room"
                                         options={roomOptions} onChange={this.handleChangeRoom} placeholder='room'
                                         required/>
                            <Form.Input fluid label='Rack' name='rack' placeholder='rack' required
                                        onChange={this.handleChange} value={rack}/>
                            <Form.Select fluid label='Type' name="type"
                                         options={[{
                                             key: 'juniper',
                                             value: 'juniper',
                                             text: 'juniper',
                                         }, {
                                             key: 'cisco',
                                             value: 'cisco',
                                             text: 'cisco',
                                         }]} onChange={this.handleChange} placeholder='type'
                                         required/>
                        </Form.Group>
                    </Form>

                    <Button secondary disabled={!(step === addDeviceSteps.STARTING)} onClick={this.handleSubmit}>
                        Get port list
                    </Button>

                    <Button disabled={!(step === addDeviceSteps.DEVICE_TO_OPSVIEW)} primary
                            onClick={this.handleAddToOpsview}>Add to opsview</Button>
                    <Step.Group ordered fluid>
                        <Step completed={step > addDeviceSteps.STARTING}
                              active={step == addDeviceSteps.STARTING}>
                            <Step.Content>
                                <Step.Title>Starting</Step.Title>
                            </Step.Content>
                        </Step>
                        <Step completed={step > addDeviceSteps.GETTING_PORTS}
                              active={step == addDeviceSteps.GETTING_PORTS}>
                            <Step.Content>
                                <Step.Title>Getting ports</Step.Title>
                            </Step.Content>
                        </Step>
                        <Step completed={step > addDeviceSteps.DEVICE_TO_OPSVIEW}
                              active={step == addDeviceSteps.DEVICE_TO_OPSVIEW}>
                            <Step.Content>
                                <Step.Title>Device to OPSVIEW</Step.Title>
                            </Step.Content>
                        </Step>
                        <Step completed={step > addDeviceSteps.PORTS_TO_OPSVIEW}
                              active={step == addDeviceSteps.PORTS_TO_OPSVIEW}>
                            <Step.Content>
                                <Step.Title>Ports to OPSVIEW</Step.Title>
                            </Step.Content>
                        </Step>
                        <Step completed={step == addDeviceSteps.COMPLETED}>
                            <Step.Content>
                                <Step.Title>Completed</Step.Title>
                            </Step.Content>
                        </Step>
                    </Step.Group>
                    {
                        ports.length != 0 ?
                            <Segment>
                                <Progress percent={processedCount / ports.length * 100}
                                          active={step === addDeviceSteps.PORTS_TO_OPSVIEW}
                                          color='green' autoSuccess>
                                    {monitoredCount}/{ports.length} ports have been monitored
                                </Progress>
                                {
                                    message != '' ?
                                        <Label fuluid center>
                                            {message}
                                        </Label> :
                                        null
                                }

                                <Table celled structured>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Index</Table.HeaderCell>
                                            <Table.HeaderCell>Name</Table.HeaderCell>
                                            <Table.HeaderCell>Description</Table.HeaderCell>
                                            <Table.HeaderCell>IfIndex</Table.HeaderCell>
                                            <Table.HeaderCell>Is monitored</Table.HeaderCell>
                                            <Table.HeaderCell>Processed</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {ports.map((port, idx) => (
                                            <Table.Row key={idx}>
                                                <Table.Cell component="th" scope="row">
                                                    {idx + 1}
                                                </Table.Cell>
                                                <Table.Cell>{port.name}</Table.Cell>
                                                <Table.Cell>{port.description}</Table.Cell>
                                                <Table.Cell>{port.ifindex}</Table.Cell>
                                                <Table.Cell className="center">
                                                    {
                                                        port.existInOps ? <Icon name="check" color="green"/> :
                                                            <Icon name="close" color="red"/>
                                                    }
                                                </Table.Cell>
                                                <Table.Cell>{port.processed ? <Icon name="check" color="green"/> :
                                                    <Icon name="close" color="red"/>}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </Segment>
                            : null
                    }

                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.handleCloseModal} negative>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

const AddDeviceModalWithRedux = connect(({netData}) => (netData), null)(AddDeviceModal);

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
        ports = deviceToShowInModal.ports.sort((a, b) => (a.existInOps - b.existInOps));

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
                                        <Table.HeaderCell align="right">Task ids</Table.HeaderCell>
                                        <Table.HeaderCell align="center">Result</Table.HeaderCell>
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
                                            <Table.Cell>
                                                <Item.Group>
                                                    {
                                                        (row.requestOpsviewResult) ?
                                                            row.requestOpsviewResult.map((e, idx) => (
                                                                <Item>
                                                                    <Item.Content>
                                                                        {
                                                                            e.existed ?
                                                                                <Icon name="check" color="green"/> :
                                                                                <Icon name="close" color="red"/>
                                                                        }
                                                                        <b>{e.attributeLabel}:</b> {e.taskId}
                                                                    </Item.Content>
                                                                </Item>
                                                            )) : null
                                                    }
                                                </Item.Group>
                                            </Table.Cell>
                                            <Table.Cell className="center">
                                                {
                                                    row.existInOps ? <Icon name="check" color="green"/> :
                                                        <Icon name="close" color="red"/>
                                                }
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>) :
                            <Message warning>
                                <Message.Header>
                                    There is no existed items!
                                </Message.Header>
                            </Message>
                    }
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.handleCloseModal}>
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
        const totalSuccessPortCnt = filteredList.reduce((sum, e) => (sum + e.ports.reduce((s, port) => (s + port.existInOps), 0)), 0);
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

                                    let successPortCnt = e.ports.reduce((sum, e) => (sum + e.existInOps), 0);
                                    let successPercent = (e.ports.length!=0?(Math.round(successPortCnt / e.ports.length * 100 * 100) / 100):100);

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
                    if (!port.existInOps) {
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
                                        <Table.HeaderCell>Room</Table.HeaderCell>
                                        <Table.HeaderCell>Rack</Table.HeaderCell>
                                        <Table.HeaderCell>Name</Table.HeaderCell>
                                        <Table.HeaderCell>IfIndex</Table.HeaderCell>
                                        <Table.HeaderCell>Description</Table.HeaderCell>
                                        <Table.HeaderCell>Task Ids</Table.HeaderCell>
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
                                                <Table.Cell> {port.device.room} </Table.Cell>
                                                <Table.Cell> {port.device.rack} </Table.Cell>
                                                <Table.Cell> {port.name} </Table.Cell>
                                                <Table.Cell> {port.ifindex} </Table.Cell>
                                                <Table.Cell> {port.description} </Table.Cell>
                                                <Table.Cell>
                                                    {
                                                        (port.requestOpsviewResult) ?
                                                            port.requestOpsviewResult.map((attrLabel, idx) => (
                                                                <Item>
                                                                    <Item.Content>
                                                                        {
                                                                            attrLabel.existed ?
                                                                                <Icon name="check" color="green"/> :
                                                                                <Icon name="close" color="red"/>
                                                                        }
                                                                        <b>{attrLabel.attributeLabel}:</b> {attrLabel.taskId}
                                                                    </Item.Content>
                                                                </Item>
                                                            )) : null
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

class AddNewDevice extends Component {

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
        const {pageLoading, netDeviceFunctions, netAreas, logs, logDate} = this.props;

        // console.log(this.props);
        const {openModalAdd} = this.state;

        return (
            <div>
                <Head>
                    <title> Opsview Devices </title>
                </Head>
                <DashboardLayout>
                    <Dimmer active={pageLoading} inverted>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>
                    <Segment>
                        <Header> OPSVIEW</Header>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Field>
                                    <label>Add new device to opsview</label>
                                    <Button color="green" fluid onClick={this.handleOpenModal}>
                                        <Icon name="plus"/>
                                        Add</Button>
                                </Form.Field>
                            </Grid.Column>
                        </Grid>
                    </Segment>

                    <LogsSegment listData={logs}
                                 logDate={logDate}
                                 handleChangeLogDate={this.handleChangeLogDate}
                    />

                    <AddDeviceModalWithRedux open={openModalAdd}
                                             netDeviceFunctions={netDeviceFunctions}
                                             netAreas={netAreas}
                                             handleCloseModal={this.handleCloseModal}
                    />
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({addNewDevicePageData}) => (addNewDevicePageData);

export default connect(mapStateToProps, null)(AddNewDevice);