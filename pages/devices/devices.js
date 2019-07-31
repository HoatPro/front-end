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
    Message,
    Form,
    Progress,
    Label,
    Dropdown
} from 'semantic-ui-react';
import DashboardLayout from '../../src/components/Layout/DashboadLayout';
import Head from 'next/head';
import Link from 'next/link';
import {connect} from 'react-redux';
import {getOnlineNetDevices, editNetDevice, deleteNetDevice} from '../../src/redux/_actions/devices/devicesA';
import _ from 'lodash';
import moment from 'moment';
import {groupMPListA} from "../../src/redux/_actions/groupMP/groupMPListA";
import {addNewDevicePageData} from "../../src/redux/_reducers/devices/addNewDeviceR";
import {netDevices} from "../../src/redux/_reducers/devices/devicesR";
import {Tab} from "semantic-ui-react/dist/commonjs/modules/Tab/Tab";
import {Step} from "semantic-ui-react/dist/commonjs/elements/Step/Step";
import io from "../../src/utils/socketio";
import {toast} from "react-toastify";
import NetDeviceFunctionDropdownWithRedux from './../../src/components/Dropdown/NetDeviceFunctionDropdownWithRedux';
import NetAreaDropdownWithRedux from './../../src/components/Dropdown/NetAreaDropdownWithRedux';
import NetRoomDropdown from './../../src/components/Dropdown/NetRoomDropdown';

const tdStyle = {
    textAlign: 'center'
};

class CheckConnectionModal extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let result = (!_.isEqual(nextProps, this.props));
        return result;
    }

    render() {

        const {device, handleCloseModal, open} = this.props;

        // console.log(this.props);

        return (
            device ?
                <Modal size='large' open={open} onClose={handleCloseModal}>
                    <Dimmer active={device.ports ? false : true} inverted>
                        <Loader size='big' inverted content="connecting"/>
                    </Dimmer>
                    <Modal.Header>Check connection to device: {device.name}</Modal.Header>
                    <Modal.Content scrolling>
                        <Header> {device.ports ? <span style={{color: 'green'}}>CONNECTED</span> :
                            <span>CONNECTING</span>}, port list to monitor: </Header>
                        {
                            (device.ports && device.ports.length != 0) ?
                                <Table celled structured>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Index</Table.HeaderCell>
                                            <Table.HeaderCell>Name</Table.HeaderCell>
                                            <Table.HeaderCell>Description</Table.HeaderCell>
                                            <Table.HeaderCell>IfIndex</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>

                                        {device.ports.map((port, idx) => (
                                            <Table.Row key={idx}>
                                                <Table.Cell component="th" scope="row">
                                                    {idx + 1}
                                                </Table.Cell>
                                                <Table.Cell>{port.name}</Table.Cell>
                                                <Table.Cell>{port.description}</Table.Cell>
                                                <Table.Cell>{port.ifindex}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                                : 'No existed items'
                        }
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={handleCloseModal} negative>
                            Close
                        </Button>
                    </Modal.Actions>
                </Modal> : null
        )
    }
}

class EditDeviceModal extends Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    shouldComponentUpdate(nextProps, nextState) {
        let result = (!_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state));
        return result;
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        const device = nextProps.device;

        if (!device)
            return;

        this.setState({
            name: device.name,
            ip: device.ip,
            functionId: device.functionId,
            areaId: device.areaId,
            roomId: device.roomId,
            deviceId: device.deviceId,
            rack: device.rack
        });
    }

    handleSave = () => {
        this.props.onSave(_.pick(this.state, ['functionId', 'areaId', 'roomId', 'rack', 'deviceId']));
    };

    handleChange = (e, data) => {
        this.setState({
            [data.name]: data.value
        })
    };

    render() {

        const {device, onClose, onSave, open} = this.props;
        const {functionId, areaId, roomId, rack} = this.state;

        return (
            device ?
                <Modal open={open} onClose={onClose}>
                    <Modal.Header>Edit device {device.name} | {device.ip}</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <label>Function</label>
                                    <NetDeviceFunctionDropdownWithRedux
                                        placeholder='Select Function'
                                        value={functionId}
                                        name="functionId"
                                        onChange={this.handleChange}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Area</label>
                                    <NetAreaDropdownWithRedux
                                        placeholder='Select Area'
                                        name="areaId"
                                        value={areaId}
                                        onChange={this.handleChange}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <label>Room</label>
                                    <NetRoomDropdown
                                        placeholder='Select Room'
                                        value={roomId}
                                        name="roomId"
                                        areaId={areaId}
                                        onChange={this.handleChange}
                                    />
                                </Form.Field>
                                <Form.Input
                                    value={rack ? rack : ''}
                                    label='Rack'
                                    type='text'
                                    name="rack"
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.handleSave} positive>
                            Save
                        </Button>
                        <Button onClick={onClose} negative>
                            Close
                        </Button>
                    </Modal.Actions>
                </Modal> :
                null
        )
    }
}

class DeleteDeviceModal extends Component {

    constructor(props) {
        super(props);

        this.state = {confirmIp: ''}
    }

    shouldComponentUpdate(nextProps, nextState) {
        let result = (!_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state));
        return result;
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        const device = nextProps.device;

        if (!device)
            return;

        this.setState({
            name: device.name,
            ip: device.ip,
            confirmIp: '',
            functionId: device.functionId,
            areaId: device.areaId,
            roomId: device.roomId,
            deviceId: device.deviceId,
            rack: device.rack
        });
    }

    handleConfirm = () => {
        // if (this.state.ip.trim() != this.state.confirmIp.trim())
        // {
        //     toast.error('Ip does not match');
        //     return;
        // }
        // else {
        //     this.props.onConfirm(this.props.device);
        // }
        this.props.onConfirm(this.props.device);

    };

    handleChange = (e, data) => {
        this.setState({
            [data.name]: data.value
        })
    };

    render() {

        const {device, onClose, onConfirm, open} = this.props;
        const {functionId, areaId, roomId, rack, confirmIp} = this.state;

        return (
            device ?
                <Modal open={open} onClose={onClose}>
                    <Modal.Header>Delete device {device.name} | {device.ip} </Modal.Header>
                    <Modal.Content>
                        <h3> Area sure want to delete this device??? </h3>
                        {/*<Form>*/}
                            {/*<Form.Group widths='equal'>*/}
                                {/*<Form.Field>*/}
                                    {/*/!*<label>Retype your device ip to confirm</label>*!/*/}
                                    {/*<Form.Input*/}
                                        {/*value={confirmIp}*/}
                                        {/*label='Retype your device ip to confirm'*/}
                                        {/*type='text'*/}
                                        {/*name="confirmIp"*/}
                                        {/*onChange={this.handleChange}*/}
                                    {/*/>*/}
                                {/*</Form.Field>*/}
                            {/*</Form.Group>*/}
                        {/*</Form>*/}
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.handleConfirm} positive>
                            Comfirm
                        </Button>
                        <Button onClick={onClose} negative>
                            Cancel
                        </Button>
                    </Modal.Actions>
                </Modal> :
                null
        )
    }
}

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

    render() {

        const {listToDisplay, onViewRow, onCheckConnection, onEditDeviceClick, onDeleteDeviceClick} = this.props;

        return (

            listToDisplay.length != 0 ?
                <Table celled structured className="tblList">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Index</Table.HeaderCell>
                            <Table.HeaderCell>Checking Time</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Ip</Table.HeaderCell>
                            <Table.HeaderCell>Function</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Type</Table.HeaderCell>
                            <Table.HeaderCell>Area</Table.HeaderCell>
                            <Table.HeaderCell>Room</Table.HeaderCell>
                            <Table.HeaderCell>Rack</Table.HeaderCell>
                            <Table.HeaderCell>Standard Stat</Table.HeaderCell>
                            <Table.HeaderCell>Monitored Stat</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            listToDisplay.map((row, idx) => {

                                let deviceName = row.name;
                                if ((deviceName + '').includes('NOC-NET-')) {
                                    deviceName = deviceName.replace("NOC-NET-", "");
                                    deviceName = deviceName.substr(0, deviceName.lastIndexOf("-"));
                                }

                                return (
                                    <Table.Row key={idx}>
                                        <Table.Cell
                                            style={{
                                                textAlign: 'center',
                                            }}
                                        >
                                            {idx + 1}
                                        </Table.Cell>
                                        <Table.Cell
                                            style={{
                                                color: row.time_check ? 'black' : 'red'
                                            }}
                                        >
                                            {row.time_check ? moment(row.time_check).format("YYYY-MM-DD HH:mm:ss") : 'N/A'}
                                        </Table.Cell>
                                        <Table.Cell>{deviceName}</Table.Cell>
                                        <Table.Cell>{row.ip}</Table.Cell>
                                        <Table.Cell>{row.function}</Table.Cell>
                                        <Table.Cell>{row.description}</Table.Cell>
                                        <Table.Cell>{row.manufacturer}</Table.Cell>
                                        <Table.Cell>{row.area}</Table.Cell>
                                        <Table.Cell>{row.room}</Table.Cell>
                                        <Table.Cell>{row.rack}</Table.Cell>
                                        <Table.Cell
                                            style={{
                                                textAlign: 'right',
                                                color: row.standardPortPercent == 100 ? 'green' : 'red'
                                            }}
                                        >
                                            {
                                                Array.isArray(row.ports) ? `${row.standardPortCnt}/${row.normalPortCnt}(${row.standardPortPercent}%)` : 'connection error'
                                            }

                                        </Table.Cell>
                                        <Table.Cell
                                            style={{
                                                textAlign: 'right',
                                                color: row.monitoredPortPercent == 100 ? 'green' : 'red'
                                            }}
                                        >
                                            {
                                                Array.isArray(row.ports) ? `${row.monitoredPortCnt}/${row.portToAddCnt}(${row.monitoredPortPercent}%)` : 'connection error'
                                            }

                                        </Table.Cell>
                                        <Table.Cell className="center">
                                            <Button size="mini"
                                                    icon
                                                    color="teal"
                                                    onClick={() => {
                                                        onViewRow(row)
                                                    }}
                                            >
                                                <Icon name="eye"></Icon>
                                            </Button>
                                            <Button size="mini"
                                                    icon
                                                    color="green"
                                                    onClick={() => {
                                                        onCheckConnection(row)
                                                    }}
                                            >
                                                <Icon name="plug"></Icon>
                                            </Button>

                                            <Button size="mini"
                                                    icon
                                                    color="yellow"
                                                    onClick={() => {
                                                        onEditDeviceClick(row)
                                                    }}
                                            >
                                                <Icon name="pencil alternate"></Icon>
                                            </Button>
                                            <Button
                                                color="red"
                                                icon="trash"
                                                size="mini"
                                                onClick={() => {
                                                    onDeleteDeviceClick(row)
                                                }}
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })
                        }
                    </Table.Body>
                </Table> :
                <Message warning>
                    <Message.Header>
                        There is no existed items!
                    </Message.Header>
                </Message>
        );
    }
}

class Devices extends Component {

    constructor(props) {
        super(props);

        const {list} = this.props;

        this.state = {
            timeout: null,
            search: {searchByName: ''},
            searchLoading: {searchByName: false},
            list: list,
            filteredList: list,
            listToDisplay: list,
            pageLoading: true,
            showModal: false, //modal port list
            showCheckConnectionModal: false,
            showEditDeviceModal: false,
            showDeleteDeviceModal: false
        };

        this.handleViewPorts = this.handleViewPorts.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleViewPorts = this.handleViewPorts.bind(this);
    }

    searchTimeout = {};

    componentDidMount() {

        this.socket = io();

        this.socket.on('get-ports-of-device-response', (data) => {
            const {name, ip} = this.state.deviceToCheckConnection;
            if (data.status === 'success' && data.data.name == name && data.data.ip == ip) {

                toast.success('Get port list completed!');

                this.setState({
                    deviceToCheckConnection: {
                        ...this.state.deviceToCheckConnection,
                        ports: data.data.data
                    }
                });
            }
            else {
                toast.error(data.msg ? data.msg : 'Get ports of device failure!');
                this.setState({
                    showCheckConnectionModal: false
                });
            }
        });

        if (_.size(this.props.list) === 0) {
            this.props.dispatch(getOnlineNetDevices());
        }
    }

    componentWillReceiveProps(nextProps) {

        const {list} = nextProps;

        list.forEach(row => {
                if (!Array.isArray(row.ports)) {
                    return;
                }

                const normalPortCnt = row.ports.reduce((sum, port) => (sum + (port.description ? 1 : 0)), 0); //port has description
                let standardPortCnt = 0; // port has L1#,L2#,... and bypass ##
                let portToAddCnt = 0; // port had L1#,L2#,...
                let monitoredPortCnt = 0; // port has existInOps

                for (const port of row.ports) {
                    if (port.description && (port.description.startsWith('L1#') || port.description.startsWith('L2#') || port.description.startsWith('L2.5#') || port.description.startsWith('L3#'))) {
                        portToAddCnt++;
                        standardPortCnt++;
                        if (port.existInOps) {
                            monitoredPortCnt++;
                        }
                    } else if (port.description && port.description.startsWith('##')) {
                        standardPortCnt++;
                    }
                }

                const standardPortPercent = (normalPortCnt == 0 ? 100 : Math.round(standardPortCnt / normalPortCnt * 100 * 100) / 100);
                const monitoredPortPercent = (portToAddCnt == 0 ? 100 : Math.round(monitoredPortCnt / portToAddCnt * 100 * 100) / 100);

                row.normalPortCnt = normalPortCnt;
                row.standardPortCnt = standardPortCnt;
                row.monitoredPortCnt = monitoredPortCnt;
                row.portToAddCnt = portToAddCnt;
                row.standardPortPercent = standardPortPercent;
                row.monitoredPortPercent = monitoredPortPercent;
            }
        )
        ;

        this
            .setState({
                timeout: null,
                search: {searchByName: ''},
                searchLoading: {searchByName: false},
                list: list,
                filteredList: list,
                listToDisplay: list,
                pageLoading: true,
                showModal: false,
                showCheckConnectionModal: false,
                showEditDeviceModal: false,
                showDeleteDeviceModal: false
            });
    }

    filter() {

        const searchByName = this.state.search['searchByName'];

        const filteredList = this.state.list.filter(function (e) {
            return (e.name.toString().toLowerCase().includes(searchByName.toLowerCase()) || e.ip.toString().toLowerCase().includes(searchByName.toLowerCase()));
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

    handleViewPorts = (device) => {
        this.setState({
            showModal: true,
            deviceToShowInModal: device
        });
    };

    handleCloseModal() {
        this.setState({showModal: false});
    }

    handleCheckConnection = (device) => {

        const deviceInfo = {
            name: device.name,
            ip: device.ip,
            type: device.manufacturer
        };

        if (!confirm(`Are you sure to check connection to ${deviceInfo.name}?`)) {
            return;
        }

        this.socket.emit('get-ports-of-devices', deviceInfo);

        this.setState({
            showCheckConnectionModal: true,
            deviceToCheckConnection: deviceInfo
        });
    };

    handleOpenEditDeviceModal = (device) => {
        this.setState({
            deviceToEdit: device,
            showEditDeviceModal: true
        });
    };

    handleOpenDeleteDeviceModal = (device) => {
        this.setState({
            deviceToDelete: device,
            showDeleteDeviceModal: true
        });
    };

    handleCloseCheckConnectionModal = () => {
        this.setState({showCheckConnectionModal: false});
    };

    handleCloseEditDeviceModal = () => {
        this.setState({showEditDeviceModal: false});
    };

    handleCloseDeleteDeviceModal = () => {
        this.setState({showDeleteDeviceModal: false});
    };

    handleEditDevice = (device) => {
        this.props.dispatch(editNetDevice(device));
    };

    handleDeleteDevice = (device)=> {

        const data = _.pick(device, ['deviceId', 'name', 'ip', 'area', 'room', 'rack', 'description', 'function']);

        this.props.dispatch(deleteNetDevice(data));
    };

    renderModal = () => {
        const {deviceToShowInModal, showModal} = this.state;
        let ports = [];

        if (!deviceToShowInModal)
            return null;

        // ports = deviceToShowInModal.ports.filter((e) => (e.status === 'up')); //filter
        if (Array.isArray(deviceToShowInModal.ports)) {
            ports = deviceToShowInModal.ports.sort((a, b) => (a.existInOps - b.existInOps));
        }

        return (
            <Modal open={showModal} onClose={this.handleCloseModal}>
                <Modal.Header>Ports of device {deviceToShowInModal.name} | {deviceToShowInModal.ip}</Modal.Header>
                <Modal.Content scrolling>
                    {
                        ports.length != 0 ?
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Index</Table.HeaderCell>
                                        <Table.HeaderCell>Name</Table.HeaderCell>
                                        <Table.HeaderCell>IfIndex</Table.HeaderCell>
                                        <Table.HeaderCell>Description</Table.HeaderCell>
                                        <Table.HeaderCell>Monitored labels</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {ports.map((row, idx) => (
                                        <Table.Row key={idx}>
                                            <Table.Cell>
                                                {idx + 1}
                                            </Table.Cell>
                                            <Table.Cell>{row.name}</Table.Cell>
                                            <Table.Cell>{row.ifindex}</Table.Cell>
                                            <Table.Cell>{row.description}</Table.Cell>
                                            <Table.Cell>
                                                {
                                                    row.monitoredAttrs ?
                                                        row.monitoredAttrs.sort().map(attr=>(
                                                            <Label>
                                                                {attr}
                                                            </Label>
                                                        ))
                                                        : null
                                                }
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table> :
                            <Message warning>
                                <Message.Header>
                                    There is no existed items!
                                </Message.Header>
                            </Message>
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

    render() {

        const {pageLoading} = this.props;

        const {
            search,
            searchLoading,
            list,
            filtedList,
            listToDisplay,
            deviceToCheckConnection,
            deviceToEdit,
            deviceToDelete,
            showCheckConnectionModal,
            showEditDeviceModal,
            showDeleteDeviceModal
        } = this.state;


        const crawledCnt = list.reduce((sum, e) => (sum + Array.isArray(e.ports)), 0);
        const standardCnt = list.reduce((sum, e) => (sum + (e.standardPortPercent == 100)), 0);

        return (
            <div id="div-page-group-mp-monitored-ports">
                <Head>
                    <title> All devices</title>
                </Head>
                <DashboardLayout>
                    <Dimmer active={pageLoading} inverted>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>
                    <Segment>
                        <Header>All devices </Header>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Input fluid label='Search by name' icon='search' placeholder="Search by name..."
                                            name='searchByName'
                                            loading={searchLoading['searchByName']}
                                            value={search['searchByName']} onChange={this.handleSearch}/>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                    {
                        listToDisplay.length > 0 ?
                            <Segment className="list">
                                <Message info>
                                    <Message.Header
                                        style={{textAlign: "center"}}>{crawledCnt} crawled, {standardCnt} had full
                                        standard ports, {list.length} total devices
                                    </Message.Header>
                                </Message>
                                <MainTable onTableDidUpdate={() => {
                                }}
                                           listToDisplay={listToDisplay}
                                           onViewRow={this.handleViewPorts}
                                           onCheckConnection={this.handleCheckConnection}
                                           onEditDeviceClick={this.handleOpenEditDeviceModal}
                                           onDeleteDeviceClick={this.handleOpenDeleteDeviceModal}
                                />
                            </Segment> :
                            <Header> No item exists </Header>
                    }
                    {
                        this.renderModal()
                    }

                    <CheckConnectionModal open={showCheckConnectionModal}
                                          handleCloseModal={this.handleCloseCheckConnectionModal}
                                          device={deviceToCheckConnection}/>
                    <EditDeviceModal open={showEditDeviceModal}
                                     onClose={this.handleCloseEditDeviceModal}
                                     onSave={this.handleEditDevice}
                                     device={deviceToEdit}
                    />
                    <DeleteDeviceModal open={showDeleteDeviceModal}
                                       onClose={this.handleCloseDeleteDeviceModal}
                                       onConfirm={this.handleDeleteDevice}
                                       device={deviceToDelete}
                    />
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({netDevices}) => (netDevices);

export default connect(mapStateToProps, null)(Devices);