import React, { Component, Fragment } from "react";
import {
  Table,
  Header,
  Segment,
  Dimmer,
  Loader,
  Message,
  Modal,
  Button,
  Form,
  Input,
  Dropdown
} from "semantic-ui-react";
import DashboardLayout from "../../src/components/Layout/DashboadLayout";
import Head from "next/head";
import { connect } from "react-redux";
import _ from "lodash";
import {
  getLogConfig,
  createLogConfig,
  editLogConfig,
  deleteLogConfig
} from "../../src/redux/_actions/tool-cgnat/logConfigA";

const actionTypes = {
  CREATE_LOG: 'CREATE_LOG',
  EDIT_LOG: 'EDIT_LOG',
  DELETE_LOG: 'DELETE_LOG'
}

class LogModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      log: "",
      creating: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleOpenLogModal = this.handleOpenLogModal.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleChange = e => {
    this.setState({
      log: {
        ...this.state.log,
        [e.target.name]: e.target.value
      }
    });
  };

  handleChangeSelection = (e, data) => {
    this.setState({
      log: {
        ...this.state.log,
        type: data.value
      }
    });
  };

  handleOpenLogModal = () => {
    this.setState({
      log: ""
    });
    this.props.onOpen();
  };

  componentWillReceiveProps(nextProps) {
    const { log } = nextProps;
    if (!_.isEqual(log, this.state.log)) {
      this.setState({
        log
      });
    }
  }

  handleSave = () => {
    const { log } = this.state;
    const { handleDispatchActions, onClose } = this.props;
    const data = {
      log
    }
    if (Boolean(data.log.id)) {
      handleDispatchActions(actionTypes.EDIT_LOG, data);
    } else {
      handleDispatchActions(actionTypes.CREATE_LOG, data);
    }
    onClose();
  };

  render() {
    const { logModal, onClose } = this.props;
    const { log } = this.state;
    const typeOptions = [
      {
        key: "ki",
        value: "kibana",
        text: "Kibana"
      },
      {
        key: "ops",
        value: "opsview",
        text: "Opsview"
      }
    ];
    return (
      <Modal
        size="tiny"
        trigger={
          <Button
            icon="plus"
            content="Create log"
            positive
            floated="right"
            onClick={this.handleOpenLogModal}
          />
        }
        open={logModal}
        onClose={onClose}
      >
        <Modal.Header>Create or Edit Log config</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Input
                label="Message"
                name="log_message"
                onChange={this.handleChange}
                value={log.log_message}
              />
            </Form.Field>
            <Form.Field>
              <Input
                label="Times scan"
                name="times_scan"
                type="number"
                min={1}
                onChange={this.handleChange}
                value={log.times_scan}
              />
            </Form.Field>
            <Form.Field inline>
              <b>Type: </b>
              <Dropdown
                selection
                defaultValue={log.type || "kibana"}
                onChange={this.handleChangeSelection}
                placeholder="---Type---"
                options={typeOptions}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            icon="checkmark"
            content="Save"
            disabled={_.isEqual(log, this.props.log)}
            onClick={this.handleSave}
          />
          <Button onClick={onClose}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

class DeleteModal extends Component {
  constructor(props) {
    super(props);
    this.handleDeleteLog = this.handleDeleteLog.bind(this);
  }

  handleDeleteLog = () => {
    const { handleDispatchActions, onClose, log } = this.props;
    const data = {
      log
    }
    handleDispatchActions(actionTypes.DELETE_LOG, data);
    onClose();
  };

  render() {
    const { deleteModal, onClose, log } = this.props;
    return (
      <Modal size="tiny" open={deleteModal} onClose={onClose}>
        <Modal.Header>Delete Log config</Modal.Header>
        <Modal.Content>Are you sure you want to delete this log?</Modal.Content>
        <Modal.Actions>
          <Button negative onClick={this.handleDeleteLog}>
            Confirm
          </Button>
          <Button onClick={onClose}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

class TableRow extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const result = !_.isEqual(nextProps, this.props);
    return result;
  }

  render() {
    const { log, idx, handleEditLog, onDelete } = this.props;
    return (
      <Table.Row key={idx}>
        <Table.Cell>{idx + 1}</Table.Cell>
        <Table.Cell>{log.log_message}</Table.Cell>
        <Table.Cell>{log.times_scan}</Table.Cell>
        <Table.Cell>
          <Button
            size="mini"
            color="yellow"
            onClick={() => handleEditLog(log)}
            icon="edit"
          />
          <Button
            size="mini"
            negative
            onClick={() => onDelete(log)}
            icon="trash"
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
    const { listToDisplay, handleEditLog, onDelete } = this.props;

    return (
      <Table style={{ marginBottom: 14 }} celled structured className="tblList">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Log Message</Table.HeaderCell>
            <Table.HeaderCell>Times Scan</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {listToDisplay.map((log, idx) => {
            return (
              <TableRow
                handleEditLog={handleEditLog}
                onDelete={onDelete}
                key={idx}
                log={log}
                idx={idx}
              />
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}

class LogConfig extends Component {
  constructor(props) {
    super(props);
    const { list } = this.props;
    this.state = {
      timeout: null,
      listToDisplay: list,
      pageLoading: true,
      logModal: false,
      deleteModal: false,
      log: ""
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleEditLog = this.handleEditLog.bind(this);
    this.handleOpenLogModal = this.handleOpenLogModal.bind(this);
    this.handleOpenDeleteModal = this.handleOpenDeleteModal.bind(this);
    this.handleDispatchActions = this.handleDispatchActions.bind(this);
  }
  componentDidMount() {
    if (_.size(this.props.list) === 0) {
      this.props.dispatch(getLogConfig());
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
      this.props.dispatch(getLogConfig());
    }
  }

  handleCloseModal = () => {
    this.setState({
      logModal: false,
      deleteModal: false
    });
  };

  handleOpenLogModal = () => {
    this.setState({
      logModal: true
    });
  };

  handleOpenDeleteModal = log => {
    this.setState({
      log: log,
      deleteModal: true
    });
  };

  handleEditLog = log => {
    this.setState({
      log: log,
      logModal: true
    });
  };

  handleDispatchActions = (type, data) => {
    const { dispatch } = this.props;
    switch(type) {
      case actionTypes.CREATE_LOG:
        dispatch(createLogConfig(data.log.log_message, data.log.type, data.log.times_scan));
        break;
      case actionTypes.EDIT_LOG:
        dispatch(editLogConfig(data.log.log_message, data.log.type, data.log.times_scan, data.log.id));
        break;
      case actionTypes.DELETE_LOG:
        dispatch(deleteLogConfig(data.log.id));
        break;
      default: break;
    }
  }

  render() {
    const { pageLoading } = this.props;
    const { listToDisplay, log } = this.state;

    return (
      <div id="div-log-config">
        <Head>
          <title>Log Config</title>
        </Head>
        <DashboardLayout>
          <Dimmer active={pageLoading} inverted>
            <Loader size="large">Loading</Loader>
          </Dimmer>
          <Segment>
            <Header>
              Log Config
              <LogModal
                logModal={this.state.logModal}
                log={log}
                onClose={this.handleCloseModal}
                onOpen={this.handleOpenLogModal}
                handleDispatchActions={this.handleDispatchActions}
              />
              <DeleteModal
                deleteModal={this.state.deleteModal}
                log={log}
                onClose={this.handleCloseModal}
                handleDispatchActions={this.handleDispatchActions}
              />
            </Header>
          </Segment>
          {listToDisplay.length > 0 ? (
            <Segment className="list">
              <MainTable
                listToDisplay={listToDisplay}
                handleEditLog={this.handleEditLog}
                onDelete={this.handleOpenDeleteModal}
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
const mapStateToProps = ({ toolCgnatLogConfig }) => toolCgnatLogConfig;

export default connect(
  mapStateToProps,
  null
)(LogConfig);
