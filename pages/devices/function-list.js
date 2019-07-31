import React, { Component, Fragment } from "react";
import {
  Table,
  Header,
  Segment,
  Dimmer,
  Loader,
  Message,
  Button,
  Modal,
  Form,
  Input,
  Pagination,
  Icon
} from "semantic-ui-react";
import DashboardLayout from "../../src/components/Layout/DashboadLayout";
import Head from "next/head";
import { connect } from "react-redux";
import _ from "lodash";
import {
  getNetDeviceFunctions,
  createNetDeviceFunction,
  editNetDeviceFunction,
  deleteNetDeviceFunction
} from "../../src/redux/_actions/devices/functionListA";

const actionTypes = {
  DELETE_FUNCTION: 'DELETE_FUNCTION',
  CREATE_FUNCTION: 'CREATE_FUNCTION',
  EDIT_FUNCTION: 'EDIT_FUNCTION'
}

class DeleteFuncModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: ""
    };
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { func } = nextProps;
    if (!_.isEqual(func.netDeviceFunctionId, this.state.id)) {
      this.setState({
        id: func.netDeviceFunctionId
      });
    }
  }

  handleConfirmDelete = () => {
    const data = {
      id: this.state.id
    }
    this.props.handleDispatchActions(actionTypes.DELETE_FUNCTION, data);
    this.props.handleCloseModal();
  };

  render() {
    const { delFuncModal, handleCloseModal } = this.props;
    return (
      <Modal open={delFuncModal} onClose={handleCloseModal} size="tiny">
        <Modal.Header>Delete Function</Modal.Header>
        <Modal.Content>
          Are you sure you want to delete this Function?
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleConfirmDelete} negative>
            Confirm
          </Button>
          <Button onClick={handleCloseModal}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

class FunctionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      func: ""
    };
    this.onChange = this.onChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { func } = nextProps;
    if (!_.isEqual(func, this.state.func)) {
      this.setState({
        func
      });
    }
  }

  onChange = e => {
    this.setState({
      func: {
        ...this.state.func,
        [e.target.name]: e.target.value
      }
    });
  };

  handleSave = () => {
    const { func } = this.state;
    const data = {
      func
    }
    let action = actionTypes.CREATE_FUNCTION;
    if (Boolean(func.netDeviceFunctionId)) {
      action = actionTypes.EDIT_FUNCTION;
    }
    this.props.handleDispatchActions(action, data);
    this.props.handleCloseModal();
  };

  render() {
    const { funcModal, handleCloseModal } = this.props;
    return (
      <Modal open={funcModal} onClose={handleCloseModal} size="tiny">
        <Modal.Header>Create or Edit NET device Function</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Input
                label="Function Name"
                name="netDeviceFunctionName"
                value={this.state.func.netDeviceFunctionName}
                onChange={this.onChange}
              />
            </Form.Field>
            <Form.Field>
              <Input
                label="Note"
                name="note"
                value={this.state.func.note}
                onChange={this.onChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="green"
            icon="checkmark"
            content="Save"
            onClick={this.handleSave}
          />
          <Button content="Close" onClick={handleCloseModal} />
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
    const {
      func,
      idx,
      handleOpenFuncModal,
      handleOpenDelFuncModal
    } = this.props;
    return (
      <Table.Row key={idx}>
        <Table.Cell>{idx + 1}</Table.Cell>
        <Table.Cell>{func.netDeviceFunctionName}</Table.Cell>
        <Table.Cell>{func.note}</Table.Cell>
        <Table.Cell>
          <Button
            color="yellow"
            icon="edit"
            size="mini"
            onClick={() => handleOpenFuncModal(func)}
          />
          <Button
            color="red"
            icon="trash"
            size="mini"
            onClick={() => handleOpenDelFuncModal(func)}
          />
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
      numOfItems: 50
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange = (e, data) => {
    this.setState({
      index: data.activePage - 1
    });
  };

  render() {
    const {
      listToDisplay,
      handleOpenFuncModal,
      handleOpenDelFuncModal,
      nameSearch
    } = this.props;
    const { index, numOfItems } = this.state;
    return (
      <>
        <Table celled structured className="tblList">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Note</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {listToDisplay
              .filter(func => {
                return func.netDeviceFunctionName
                  .toLowerCase()
                  .includes(nameSearch);
              })
              .slice(index * numOfItems, (index + 1) * numOfItems)
              .map((func, idx) => {
                return (
                  <TableRow
                    func={func}
                    key={idx + index * numOfItems}
                    idx={idx + index * numOfItems}
                    handleOpenFuncModal={handleOpenFuncModal}
                    handleOpenDelFuncModal={handleOpenDelFuncModal}
                  />
                );
              })}
          </Table.Body>
        </Table>
        <Pagination
          ellipsisItem={{
            content: <Icon name="ellipsis horizontal" />,
            icon: true
          }}
          firstItem={{
            content: <Icon name="angle double left" />,
            icon: true
          }}
          lastItem={{
            content: <Icon name="angle double right" />,
            icon: true
          }}
          prevItem={{ content: <Icon name="angle left" />, icon: true }}
          nextItem={{ content: <Icon name="angle right" />, icon: true }}
          defaultActivePage={index + 1}
          totalPages={Math.ceil(
            listToDisplay.filter(func => {
              return func.netDeviceFunctionName
                .toLowerCase()
                .includes(nameSearch);
            }).length / numOfItems
          )}
          onPageChange={this.handlePageChange}
        />
      </>
    );
  }
}

class FunctionList extends Component {
  constructor(props) {
    super(props);
    const { list } = this.props;
    this.state = {
      timeout: null,
      listToDisplay: list,
      pageLoading: true,
      funcModal: false,
      delFuncModal: false,
      func: "",
      nameSearch: ""
    };
    this.handleCloseModals = this.handleCloseModals.bind(this);
    this.handleOpenFuncModal = this.handleOpenFuncModal.bind(this);
    this.handleEditFunc = this.handleEditFunc.bind(this);
    this.handleOpenDelFuncModal = this.handleOpenDelFuncModal.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleDispatchActions = this.handleDispatchActions.bind(this);
  }
  componentDidMount() {
    if (_.size(this.props.list) === 0) {
      this.props.dispatch(getNetDeviceFunctions());
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
      this.props.dispatch(getNetDeviceFunctions());
    }
  }

  handleOpenFuncModal = () => {
    this.setState({
      func: "",
      funcModal: true
    });
  };

  handleCloseModals = () => {
    this.setState({
      funcModal: false,
      delFuncModal: false
    });
  };

  handleEditFunc = func => {
    this.setState({
      func,
      funcModal: true
    });
  };

  handleOpenDelFuncModal = func => {
    this.setState({
      func,
      delFuncModal: true
    });
  };

  handleChangeInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleDispatchActions = (type, data) => {
    const { dispatch } = this.props;
    switch (type) {
      case actionTypes.DELETE_FUNCTION:
        dispatch(deleteNetDeviceFunction(data.id));
        break;
      case actionTypes.CREATE_FUNCTION:
        dispatch(createNetDeviceFunction(data.func.netDeviceFunctionName, data.func.note));
        break;
      case actionTypes.EDIT_FUNCTION:
        dispatch(editNetDeviceFunction(data.func.netDeviceFunctionId, data.func.netDeviceFunctionName, data.func.note));
        break;
      default:
        break;
    }
  }

  render() {
    const { pageLoading } = this.props;
    const {
      listToDisplay,
      funcModal,
      func,
      delFuncModal,
      nameSearch
    } = this.state;

    return (
      <div id="div-function-list">
        <Head>
          <title>Function List</title>
        </Head>
        <DashboardLayout>
          <Dimmer active={pageLoading} inverted>
            <Loader size="large">Loading</Loader>
          </Dimmer>
          <Segment>
            <Header>
              Function List
              <FunctionModal
                func={func}
                funcModal={funcModal}
                handleCloseModal={this.handleCloseModals}
                handleDispatchActions={this.handleDispatchActions}
              />
              <DeleteFuncModal
                func={func}
                handleCloseModal={this.handleCloseModals}
                delFuncModal={delFuncModal}
                handleDispatchActions={this.handleDispatchActions}
              />
              <Form>
                <Form.Group inline>
                  <Form.Button
                    width={14}
                    onClick={this.handleOpenModal}
                    color="green"
                    icon="plus"
                    content="Create"
                    floated="right"
                    onClick={this.handleOpenFuncModal}
                  />
                  <Form.Input
                    width={4}
                    label="Search"
                    icon="search"
                    value={this.state.nameSearch}
                    name="nameSearch"
                    onChange={this.handleChangeInput}
                    placeholder="Search Function by name"
                  />
                </Form.Group>
              </Form>
            </Header>
            {listToDisplay.length > 0 ? (
              <MainTable
                listToDisplay={listToDisplay}
                handleOpenFuncModal={this.handleEditFunc}
                handleOpenDelFuncModal={this.handleOpenDelFuncModal}
                nameSearch={nameSearch.toLowerCase().trim()}
              />
            ) : (
              <Message warning>
                <Message.Header>No item exist!</Message.Header>
              </Message>
            )}
          </Segment>
        </DashboardLayout>
      </div>
    );
  }
}
const mapStateToProps = ({ netDeviceFunctions }) => netDeviceFunctions;

export default connect(
  mapStateToProps,
  null
)(FunctionList);
