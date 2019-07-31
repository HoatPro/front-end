import React, { Component, Fragment } from "react";
import {
  Table,
  Header,
  Segment,
  Dimmer,
  Loader,
  Message,
  Button,
  Pagination,
  Icon,
  Input,
  Modal
} from "semantic-ui-react";
import DashboardLayout from "../../src/components/Layout/DashboadLayout";
import Head from "next/head";
import { connect } from "react-redux";
import _ from "lodash";
import { getRecommendDevices } from "../../src/redux/_actions/tool-cgnat/recommendDevicesA";
import moment from "moment";
import io from "socket.io-client";

class ConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  componentDidMount() {
    this.socket = io("http://172.27.137.52:8080");
    this.socket.on("run_command", data => {
      console.log(data);
    });
  }

  handleConfirm = () => {
    this.socket.emit("run_command", data);
    this.props.handleCloseModal();
  }

  render() {
    const { confirmModal, handleCloseModal, device } = this.props;
    return (
      <Modal open={confirmModal} onClose={handleCloseModal} size="tiny" >
        <Modal.Header>Run command</Modal.Header>
        <Modal.Content>
          Are you sure you want to run command on {Boolean(device) && device.device_name}?
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" onClick={this.handleConfirm}>Confirm</Button>
          <Button onClick={handleCloseModal}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

class TableRow extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const result = !_.isEqual(nextProps, this.props);
    return result;
  }

  handleClick = (e, device) => {
    this.props.handleOpenModal(device)
  };

  render() {
    const { device, idx, index, numOfItems } = this.props;
    return (
      <Table.Row key={idx}>
        <Table.Cell>{idx + index * numOfItems + 1}</Table.Cell>
        <Table.Cell>{device.device_name}</Table.Cell>
        <Table.Cell>{device.device_ip}</Table.Cell>
        <Table.Cell>{device.fpc_slot}</Table.Cell>
        <Table.Cell>{device.pic_slot}</Table.Cell>
        <Table.Cell>{device.card}</Table.Cell>
        <Table.Cell>{device.log_message}</Table.Cell>
        <Table.Cell>
          {moment(device.time_stamp).format("YYYY/MM/DD HH:mm:ss")}
        </Table.Cell>
        <Table.Cell>{device.times_scan}</Table.Cell>
        <Table.Cell>
          <Button
            size='small'
            disabled={Date.now() - new Date(device.stored_date) > 30 * 60 * 1000}
            onClick={e => this.handleClick(e, device)}
            color={device.command === "reboot" ? "orange" : "red"}>
            {device.action_handler === "system" ? "Disabled by system" : device.command === "reboot" ? "Reboot" : "Shutdown"}
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  }
}

class MainTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      numOfItems: 10
    };
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleChangeNumOfItems = this.handleChangeNumOfItems.bind(this);
  }

  handlePageChange = (e, data) => {
    this.setState({
      index: data.activePage - 1
    });
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //   let result = !_.isEqual(nextProps.listToDisplay, this.props.listToDisplay);
  //   //  console.log(result);
  //   return result;
  // }

  handleChangeNumOfItems = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { listToDisplay, handleOpenModal } = this.props;
    const { index, numOfItems } = this.state;
    return (
      <>
        <Input
          name='numOfItems'
          type='number'
          min={1}
          value={this.state.numOfItems}
          label='Number of items per page'
          onChange={this.handleChangeNumOfItems}
        />
        <Table celled structured className='tblList'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Ip</Table.HeaderCell>
              <Table.HeaderCell>FPC Slot</Table.HeaderCell>
              <Table.HeaderCell>Pic Slot</Table.HeaderCell>
              <Table.HeaderCell>Card</Table.HeaderCell>
              <Table.HeaderCell>Log Message</Table.HeaderCell>
              <Table.HeaderCell>Timestamp</Table.HeaderCell>
              <Table.HeaderCell>Times scan</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {listToDisplay
              .slice(index * numOfItems, (index + 1) * numOfItems)
              .map((device, idx) => {
                return (
                  <TableRow
                    device={device}
                    idx={idx}
                    index={index}
                    numOfItems={numOfItems}
                    key={idx}
                    handleOpenModal={handleOpenModal}
                  />
                );
              })}
          </Table.Body>
        </Table>
        <Pagination
          style={{ marginBottom: 14 }}
          ellipsisItem={{
            content: <Icon name='ellipsis horizontal' />,
            icon: true
          }}
          firstItem={{
            content: <Icon name='angle double left' />,
            icon: true
          }}
          lastItem={{
            content: <Icon name='angle double right' />,
            icon: true
          }}
          prevItem={{ content: <Icon name='angle left' />, icon: true }}
          nextItem={{ content: <Icon name='angle right' />, icon: true }}
          defaultActivePage={index + 1}
          totalPages={Math.ceil(listToDisplay.length / numOfItems)}
          onPageChange={this.handlePageChange}
        />
      </>
    );
  }
}

class RecommendDevices extends Component {
  constructor(props) {
    super(props);
    const { list } = this.props;
    this.state = {
      timeout: null,
      listToDisplay: list,
      pageLoading: true,
      confirmModal: false,
      device: '',
      currentButton: ''
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
  }
  componentDidMount() {
    if (_.size(this.props.list) === 0) {
      this.props.dispatch(getRecommendDevices());
    }
  }

  componentWillReceiveProps(nextProps) {
    const { list } = nextProps;
    this.setState({
      timeout: null,
      listToDisplay: list,
      pageLoading: true
    });
  }

  handleOpenModal = (device) => {
    this.setState({
      confirmModal: true,
      device: device
    })
  }

  handleCloseModal = () => {
    this.setState({
      confirmModal: false
    })
  }

  render() {
    const { pageLoading } = this.props;
    const { listToDisplay, confirmModal, device, currentButton } = this.state;
    return (
      <div id='div-recommend-devices'>
        <Head>
          <title> Recommend Devices</title>
        </Head>
        <DashboardLayout>
          <Dimmer active={pageLoading} inverted>
            <Loader size='large'>Loading</Loader>
          </Dimmer>
          <Segment>
            <Header>Recommend Devices</Header>
            <ConfirmModal confirmModal={confirmModal} handleCloseModal={this.handleCloseModal} device={device} currentButton={currentButton} />
          </Segment>
          {listToDisplay.length > 0 ? (
            <Segment className='list'>
              <MainTable listToDisplay={listToDisplay} handleOpenModal={this.handleOpenModal} />
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
const mapStateToProps = ({ toolCgnatRecommendDevices }) =>
  toolCgnatRecommendDevices;

export default connect(
  mapStateToProps,
  null
)(RecommendDevices);
