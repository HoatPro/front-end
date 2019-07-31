import React, { Component, Fragment } from "react";
import {
  Table,
  Header,
  Segment,
  Dimmer,
  Loader,
  Message,
  Checkbox,
  Modal,
  Button,
  Form,
  Input,
  Icon,
  Grid
} from "semantic-ui-react";
import DashboardLayout from "../../src/components/Layout/DashboadLayout";
import Head from "next/head";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import {
  getDevices,
  createDevice,
  editDevice,
  changeStatus,
  changeStatusSchedule,
  deleteDevice
} from "../../src/redux/_actions/tool-cgnat/devicesA";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "react-datepicker/dist/react-datepicker.css";

const actionTypes = {
  CREATE_DEVICE: "CREATE_DEVICE",
  EDIT_DEVICE: "EDIT_DEVICE",
  DELETE_DEVICE: "DELTE_DEVICE",
  CHANGE_STATUS: "CHANGE_STATUS",
  CHANGE_STATUS_SCHEDULE: "CHANGE_STATUS_SCHEDULE"
};

class DeviceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      ip: "",
      status: 0
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
  }

  handleSave = () => {
    const { handleCloseModal, handleDispatchActions } = this.props;
    const { id, name, ip, status } = this.state;
    const data = {
      id,
      name,
      ip,
      status
    };
    let action = actionTypes.CREATE_DEVICE;
    if (id) {
      action = actionTypes.EDIT_DEVICE;
    }
    handleDispatchActions(action, data);
    handleCloseModal();
  };

  componentWillReceiveProps(nextProps) {
    const { device } = nextProps;
    if (
      !_.isEqual(device.device_name, this.state.name) ||
      !_.isEqual(device.device_ip, this.state.ip)
    ) {
      this.setState({
        id: device.id,
        name: device.device_name,
        ip: device.device_ip
      });
    }
  }

  handleActivate = (e, data) => {
    let status = 0;
    if (data.checked) {
      status = 1;
    }
    this.setState({
      status: status
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { deviceModal, handleOpenDeviceModal, handleCloseModal } = this.props;
    const { id } = this.state;
    return (
      <Modal
        size='tiny'
        open={deviceModal}
        trigger={
          <Button
            icon='plus'
            content='Create device'
            onClick={handleOpenDeviceModal}
            positive
            floated='right'
          />
        }
        onClose={handleCloseModal}>
        <Modal.Header>Create or edit Device</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Input
                label='Device name'
                name='name'
                value={this.state.name}
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Input
                label='Device IP'
                name='ip'
                value={this.state.ip}
                onChange={this.handleChange}
              />
            </Form.Field>
            {!id && (
              <Form.Field>
                <Checkbox
                  onChange={this.handleActivate}
                  label='Activate device'
                />
              </Form.Field>
            )}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            icon='checkmark'
            content='Save'
            onClick={this.handleSave}
          />
          <Button onClick={handleCloseModal}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

class ChangeStatusModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device: {},
      from: new Date(),
      to: new Date(),
      active: false
    };
    this.handleChangeFromDate = this.handleChangeFromDate.bind(this);
    this.handleChangeToDate = this.handleChangeToDate.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { device } = nextProps;
    if (Boolean(device)) {
      this.setState({
        device: device,
        from: new Date(),
        to: new Date(),
        active: false
      });
    }
  }

  handleChangeFromDate = date => {
    this.setState({
      from: date
    });
  };

  handleChangeToDate = date => {
    this.setState({
      to: date
    });
  };

  handleChangeStatus = (e, data) => {
    this.setState({
      active: data.checked
    });
  };

  handleSetSchedule = () => {
    const { from, to, active, device } = this.state;
    const data = {
      from,
      to,
      active,
      id: device.id
    };
    this.props.handleDispatchActions(actionTypes.CHANGE_STATUS_SCHEDULE, data);
    this.props.handleCloseModal();
  };

  render() {
    const { changeStatusModal, handleCloseModal } = this.props;
    const { device, from, to, active } = this.state;
    return (
      <Modal size='tiny' open={changeStatusModal} onClose={handleCloseModal}>
        <Modal.Header>Deactive schedule</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Name</label>
              <Input
                disabled
                name='name'
                value={Boolean(device) && device.device_name}
              />
            </Form.Field>
            <Form.Field>
              <label>IP</label>
              <Input
                disabled
                name='ip'
                value={Boolean(device) && device.device_ip}
              />
            </Form.Field>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>From</label>
                <DatePicker
                  selected={from}
                  showTimeSelect
                  startDate={from}
                  selectsStart
                  disabled
                  timeFormat='HH:mm'
                  dateFormat='MMMM d, yyyy h:mm aa'
                  timeCaption='From'
                />
              </Form.Field>
              <Form.Field>
                <label>To</label>
                <DatePicker
                  selected={to}
                  onChange={this.handleChangeToDate}
                  showTimeSelect
                  startDate={from}
                  endDate={to}
                  selectsEnd
                  minDate={from}
                  timeFormat='HH:mm'
                  timeIntervals={1}
                  dateFormat='MMMM d, yyyy h:mm aa'
                  timeCaption='To'
                />
              </Form.Field>
            </Form.Group>
            {/* <Form.Field>
              <Checkbox label="Activate device" value={active} onChange={this.handleChangeStatus} />
            </Form.Field> */}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' icon onClick={this.handleSetSchedule}>
            <Icon name='checkmark' />
            Save
          </Button>
          <Button onClick={handleCloseModal}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

class DeleteModal extends Component {
  constructor(props) {
    super(props);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
  }

  handleConfirmDelete = () => {
    const { device, handleDispatchActions, handleCloseModal } = this.props;
    const id = Boolean(device) ? device.id : "";
    const data = {
      id
    };
    handleDispatchActions(actionTypes.DELETE_DEVICE, data);
    handleCloseModal();
  };

  render() {
    const { deleteModal, device, handleCloseModal } = this.props;
    return (
      <Modal open={deleteModal} onClose={handleCloseModal}>
        <Modal.Header>Delete device</Modal.Header>
        <Modal.Content>
          Are you sure you want to delete device{" "}
          {Boolean(device) && device.device_name}?
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' icon='trash' onClick={this.handleConfirmDelete}>
            Delete
          </Button>
          <Button onClick={handleCloseModal}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

class TableRow extends Component {
  constructor(props) {
    super(props);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const result = !_.isEqual(nextProps, this.props);
    return result;
  }

  handleChangeStatus = (e, checkbox) => {
    const data = {
      currentStatus: checkbox["data-status"],
      id: checkbox["data-id"]
    };
    this.props.handleDispatchActions(actionTypes.CHANGE_STATUS, data);
  };

  render() {
    const {
      device,
      idx,
      handleEditDevice,
      handleOpenChangeStatusModal,
      handleDeleteDevice
    } = this.props;
    return (
      <Table.Row key={idx}>
        <Table.Cell>{idx + 1}</Table.Cell>
        <Table.Cell>{device.device_name}</Table.Cell>
        <Table.Cell>{device.device_ip}</Table.Cell>
        <Table.Cell>
          <Checkbox
            data-id={device.id}
            data-status={device.status.toString()}
            toggle
            label={device.status ? "Active" : "Deactive"}
            checked={device.status ? true : false}
            onChange={this.handleChangeStatus}
          />
        </Table.Cell>
        <Table.Cell>
          {Boolean(device.deactive_time) &&
            moment(device.deactive_time).format("YYYY/MM/DD HH:mm:ss")}
        </Table.Cell>
        <Table.Cell>
          <Button
            size='mini'
            color='yellow'
            icon='edit'
            onClick={() => handleEditDevice(device)}
          />
          <Button
            size='mini'
            color='teal'
            icon='clock'
            onClick={() => handleOpenChangeStatusModal(device)}
          />
          <Button
            size='mini'
            color='red'
            icon='trash'
            onClick={() => handleDeleteDevice(device)}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

class MainTable extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let result = !_.isEqual(nextProps.listToDisplay, this.props.listToDisplay);
    return result;
  }

  render() {
    const {
      listToDisplay,
      handleEditDevice,
      handleOpenChangeStatusModal,
      handleDeleteDevice,
      handleDispatchActions
    } = this.props;

    return (
      <Table style={{ marginBottom: 14 }} celled structured className='tblList'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Ip</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Deactive time</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {listToDisplay.map((device, idx) => {
            return (
              <TableRow
                key={idx}
                device={device}
                idx={idx}
                handleEditDevice={handleEditDevice}
                handleOpenChangeStatusModal={handleOpenChangeStatusModal}
                handleDeleteDevice={handleDeleteDevice}
                handleDispatchActions={handleDispatchActions}
              />
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}

class Devices extends Component {
  constructor(props) {
    super(props);
    const { list } = this.props;
    this.state = {
      timeout: null,
      listToDisplay: list,
      pageLoading: true,
      deviceModal: false,
      changeStatusModal: false,
      deleteModal: false,
      device: ""
    };
    this.handleOpenDeviceModal = this.handleOpenDeviceModal.bind(this);
    this.handleOpenChangeStatusModal = this.handleOpenChangeStatusModal.bind(
      this
    );
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleEditDevice = this.handleEditDevice.bind(this);
    this.handleDeleteDevice = this.handleDeleteDevice.bind(this);
    this.handleDispatchActions = this.handleDispatchActions.bind(this);
  }
  componentDidMount() {
    if (_.size(this.props.list) === 0) {
      this.props.dispatch(getDevices());
    }
  }

  componentWillReceiveProps(nextProps) {
    const { list, status } = nextProps;
    this.setState({
      timeout: null,
      listToDisplay: list,
      pageLoading: true
    });
    if (status) {
      this.props.dispatch(getDevices());
    }
  }

  handleOpenDeviceModal = () => {
    this.setState({
      device: "",
      deviceModal: true
    });
  };

  handleOpenChangeStatusModal = device => {
    this.setState({
      changeStatusModal: true,
      device: device
    });
  };

  handleCloseModal = () => {
    this.setState({
      deviceModal: false,
      changeStatusModal: false,
      deleteModal: false
    });
  };

  handleEditDevice = device => {
    this.setState({
      device: device,
      deviceModal: true
    });
  };

  handleDeleteDevice = device => {
    this.setState({
      device: device,
      deleteModal: true
    });
  };

  handleDispatchActions = (type, data) => {
    const { dispatch } = this.props;
    switch (type) {
      case actionTypes.CREATE_DEVICE:
        dispatch(createDevice(data.name, data.ip, data.status));
        break;
      case actionTypes.EDIT_DEVICE:
        dispatch(editDevice(data.id, data.name, data.ip));
        break;
      case actionTypes.DELETE_DEVICE:
        dispatch(deleteDevice(data.id));
        break;
      case actionTypes.CHANGE_STATUS:
        dispatch(changeStatus(data.currentStatus, data.id));
        break;
      case actionTypes.CHANGE_STATUS_SCHEDULE:
        dispatch(
          changeStatusSchedule(data.from, data.to, data.active, data.id)
        );
        break;
      default:
        break;
    }
  };

  render() {
    const { pageLoading } = this.props;
    const {
      listToDisplay,
      device,
      deviceModal,
      changeStatusModal,
      deleteModal
    } = this.state;

    return (
      <div id='div-devices'>
        <Head>
          <title> All devices</title>
        </Head>
        <DashboardLayout>
          <Dimmer active={pageLoading} inverted>
            <Loader size='large'>Loading</Loader>
          </Dimmer>
          <Segment>
            <Header>
              All devices
              <DeviceModal
                deviceModal={deviceModal}
                handleOpenDeviceModal={this.handleOpenDeviceModal}
                handleCloseModal={this.handleCloseModal}
                device={device}
                handleDispatchActions={this.handleDispatchActions}
              />
              <ChangeStatusModal
                device={device}
                changeStatusModal={changeStatusModal}
                handleCloseModal={this.handleCloseModal}
                handleDispatchActions={this.handleDispatchActions}
              />
              <DeleteModal
                device={device}
                deleteModal={deleteModal}
                handleDeleteDevice={this.handleDeleteDevice}
                handleCloseModal={this.handleCloseModal}
                handleDispatchActions={this.handleDispatchActions}
              />
            </Header>
          </Segment>
          {listToDisplay.length > 0 ? (
            <Segment className='list'>
              <MainTable
                listToDisplay={listToDisplay}
                handleEditDevice={this.handleEditDevice}
                handleOpenChangeStatusModal={this.handleOpenChangeStatusModal}
                handleDeleteDevice={this.handleDeleteDevice}
                handleDispatchActions={this.handleDispatchActions}
              />
            </Segment>
          ) : (
            <Message warning>
              <Message.Header>No item exist!</Message.Header>
            </Message>
          )}
        </DashboardLayout>
      </div>
    );
  }
}
const mapStateToProps = ({ toolCgnatDevices }) => toolCgnatDevices;

export default connect(
  mapStateToProps,
  null
)(Devices);
