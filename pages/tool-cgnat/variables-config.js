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
  TextArea
} from "semantic-ui-react";
import DashboardLayout from "../../src/components/Layout/DashboadLayout";
import Head from "next/head";
import { connect } from "react-redux";
import _ from "lodash";
import {
  getVariablesConfig,
  editVariablesConfig
} from "../../src/redux/_actions/tool-cgnat/variablesConfigA";
import io from "socket.io-client";

const actionTypes = {
  EDIT_VARIABLE: "EDIT_VARIABLE"
};

class VariableModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variable: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleOpenVariableModal = this.handleOpenVariableModal.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.socket = io("http://172.27.137.52:8080");
    this.socket.on("change_run_tool", data => console.log(data));
  }

  handleChange = e => {
    this.setState({
      variable: {
        ...this.state.variable,
        [e.target.name]: e.target.value
      }
    });
  };

  handleOpenVariableModal = () => {
    this.setState({
      variable: {}
    });
    this.props.onOpen();
  };

  componentWillReceiveProps(nextProps) {
    const { variable } = nextProps;
    this.setState({
      variable
    });
  }

  handleSave = () => {
    const { variable } = this.state;
    const { onClose, handleDispatchActions } = this.props;
    if (_.isEqual(variable.variables_name.trim(), "duration run tool")) {
      const data = {
        time: parseInt(variable.variables_value, 10)
      };
      this.socket.emit("change_run_tool", data);
    }
    const data = {
      variable
    };
    handleDispatchActions(actionTypes.EDIT_VARIABLE, data);
    onClose();
  };

  render() {
    const { variableModal, onClose } = this.props;
    const { variable } = this.state;
    return (
      <Modal size='tiny' open={variableModal} onClose={onClose}>
        <Modal.Header>Edit Variable config</Modal.Header>
        <Modal.Content>
          {Boolean(variable) && (
            <Form>
              <Form.Field>
                <Input
                  label='Name'
                  disabled
                  name='variables_name'
                  onChange={this.handleChange}
                  value={variable.variables_name.toUpperCase()}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  label='Value'
                  type='number'
                  min={1}
                  name='variables_value'
                  onChange={this.handleChange}
                  value={variable.variables_value}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  label='Note'
                  disabled
                  name='Note'
                  onChange={this.handleChange}
                  value={variable.Note}
                />
              </Form.Field>
              <Form.Field>
                <label>Description</label>
                <TextArea
                  name='variables_description'
                  onChange={this.handleChange}
                  value={variable.variables_description}
                />
              </Form.Field>
            </Form>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            icon='checkmark'
            content='Save'
            disabled={_.isEqual(variable, this.props.variable)}
            onClick={this.handleSave}
          />
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
    const { variable, idx, handleEditVariable } = this.props;
    return (
      <Table.Row key={idx}>
        <Table.Cell>{idx + 1}</Table.Cell>
        <Table.Cell>{variable.variables_name.toUpperCase()}</Table.Cell>
        <Table.Cell>{variable.variables_description}</Table.Cell>
        <Table.Cell>{variable.variables_value}</Table.Cell>
        <Table.Cell>{variable.Note}</Table.Cell>
        <Table.Cell>
          <Button
            size='mini'
            color='yellow'
            onClick={() => handleEditVariable(variable)}
            icon='edit'
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
    const result = !_.isEqual(
      nextProps.listToDisplay,
      this.props.listToDisplay
    );
    return result;
  }

  render() {
    const { listToDisplay, handleEditVariable } = this.props;

    return (
      <Table style={{ marginBottom: 14 }} celled structured className='tblList'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Value</Table.HeaderCell>
            <Table.HeaderCell>Note</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {listToDisplay.map((variable, idx) => {
            return (
              <TableRow
                handleEditVariable={handleEditVariable}
                key={idx}
                variable={variable}
                idx={idx}
              />
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}

class VariablesConfig extends Component {
  constructor(props) {
    super(props);
    const { list } = this.props;
    this.state = {
      timeout: null,
      listToDisplay: list,
      pageLoading: true,
      variableModal: false,
      variable: ""
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleEditVariable = this.handleEditVariable.bind(this);
    this.handleOpenVariableModal = this.handleOpenVariableModal.bind(this);
    this.handleDispatchActions = this.handleDispatchActions.bind(this);
  }
  componentDidMount() {
    if (_.size(this.props.list) === 0) {
      this.props.dispatch(getVariablesConfig());
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
      this.props.dispatch(getVariablesConfig());
    }
  }

  handleCloseModal = () => {
    this.setState({
      variableModal: false
    });
  };

  handleOpenVariableModal = () => {
    this.setState({
      variableModal: true
    });
  };

  handleEditVariable = variable => {
    this.setState({
      variable: variable,
      variableModal: true
    });
  };

  handleDispatchActions = (type, data) => {
    const { dispatch } = this.props;
    switch (type) {
      case actionTypes.EDIT_VARIABLE:
        dispatch(editVariablesConfig(data.variable));
        break;
      default:
        break;
    }
  };

  render() {
    const { pageLoading } = this.props;
    const { listToDisplay, variable } = this.state;

    return (
      <div id='div-variables-config'>
        <Head>
          <title>Variables Config</title>
        </Head>
        <DashboardLayout>
          <Dimmer active={pageLoading} inverted>
            <Loader size='large'>Loading</Loader>
          </Dimmer>
          <Segment>
            <Header>
              Variables Config
              <VariableModal
                variableModal={this.state.variableModal}
                variable={variable}
                onClose={this.handleCloseModal}
                onOpen={this.handleOpenVariableModal}
                handleDispatchActions={this.handleDispatchActions}
              />
            </Header>
          </Segment>
          {listToDisplay.length > 0 ? (
            <Segment className='list'>
              <MainTable
                listToDisplay={listToDisplay}
                handleEditVariable={this.handleEditVariable}
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
const mapStateToProps = ({ toolCgnatVariablesConfig }) =>
  toolCgnatVariablesConfig;

export default connect(
  mapStateToProps,
  null
)(VariablesConfig);
