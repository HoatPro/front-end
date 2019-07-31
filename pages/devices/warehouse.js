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
  getWarehouses,
  createWarehouse,
  editWarehouse,
  deleteWarehouse
} from "../../src/redux/_actions/devices/warehouseA";

const actionTypes = {
  DELETE_WAREHOUSE: 'DELETE_WAREHOUSE',
  CREATE_WAREHOUSE: 'CREATE_WAREHOUSE',
  EDIT_WAREHOUSE: 'EDIT_WAREHOUSE'
}

class DeleteWarehouseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: ""
    };
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { warehouse } = nextProps;
    if (!_.isEqual(warehouse.id, this.state.id)) {
      this.setState({
        id: warehouse.id
      });
    }
  }

  handleConfirmDelete = () => {
    const data = {
      id: this.state.id
    }
    this.props.handleDispatchActions(actionTypes.DELETE_WAREHOUSE, data);
    this.props.handleCloseModal();
  };

  render() {
    const { delWarehouseModal, handleCloseModal } = this.props;
    return (
      <Modal open={delWarehouseModal} onClose={handleCloseModal} size='tiny'>
        <Modal.Header>Delete Warehouse</Modal.Header>
        <Modal.Content>
          Are you sure you want to delete this Warehouse?
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

class WarehouseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      warehouse: ""
    };
    this.onChange = this.onChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { warehouse } = nextProps;
    if (!_.isEqual(warehouse, this.state.warehouse)) {
      this.setState({
        warehouse
      });
    }
  }

  onChange = e => {
    this.setState({
      warehouse: {
        ...this.state.warehouse,
        [e.target.name]: e.target.value
      }
    });
  };

  handleSave = () => {
    const { warehouse } = this.state;
    let action = actionTypes.CREATE_WAREHOUSE;
    if (Boolean(warehouse.id)) {
      action = actionTypes.EDIT_WAREHOUSE;
    }
    const data = {
      warehouse
    }
    this.props.handleDispatchActions(action, data);
    this.props.handleCloseModal();
  };

  render() {
    const { warehouseModal, handleCloseModal } = this.props;
    return (
      <Modal open={warehouseModal} onClose={handleCloseModal} size='tiny'>
        <Modal.Header>Create or Edit Warehouse</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Input
                label='Code'
                name='code'
                value={this.state.warehouse.code}
                onChange={this.onChange}
              />
            </Form.Field>
            <Form.Field>
              <Input
                label='Name'
                name='name'
                value={this.state.warehouse.name}
                onChange={this.onChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color='green'
            icon='checkmark'
            content='Save'
            onClick={this.handleSave}
          />
          <Button content='Close' onClick={handleCloseModal} />
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
      warehouse,
      idx,
      handleOpenWarehouseModal,
      handleOpenDelWarehouseModal
    } = this.props;
    return (
      <Table.Row key={idx}>
        <Table.Cell>{idx + 1}</Table.Cell>
        <Table.Cell>{warehouse.code}</Table.Cell>
        <Table.Cell>{warehouse.name}</Table.Cell>
        <Table.Cell>
          <Button
            color='yellow'
            icon='edit'
            size='mini'
            onClick={() => handleOpenWarehouseModal(warehouse)}
          />
          <Button
            color='red'
            icon='trash'
            size='mini'
            onClick={() => handleOpenDelWarehouseModal(warehouse)}
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
      handleOpenWarehouseModal,
      handleOpenDelWarehouseModal
    } = this.props;
    const { index, numOfItems } = this.state;
    return (
      <>
        <Table celled structured className='tblList'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell>Code</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {listToDisplay
              .slice(index * numOfItems, (index + 1) * numOfItems)
              .map((warehouse, idx) => {
                return (
                  <TableRow
                    warehouse={warehouse}
                    key={idx + index * numOfItems}
                    idx={idx + index * numOfItems}
                    handleOpenWarehouseModal={handleOpenWarehouseModal}
                    handleOpenDelWarehouseModal={handleOpenDelWarehouseModal}
                  />
                );
              })}
          </Table.Body>
        </Table>
        <Pagination
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

class Warehouse extends Component {
  constructor(props) {
    super(props);
    const { list } = this.props;
    this.state = {
      timeout: null,
      listToDisplay: list,
      pageLoading: true,
      warehouseModal: false,
      delWarehouseModal: false,
      warehouse: ""
    };
    this.handleCloseModals = this.handleCloseModals.bind(this);
    this.handleOpenWarehouseModal = this.handleOpenWarehouseModal.bind(this);
    this.handleEditFunc = this.handleEditFunc.bind(this);
    this.handleOpenDelWarehouseModal = this.handleOpenDelWarehouseModal.bind(this);
    this.handleDispatchActions = this.handleDispatchActions.bind(this);
  }
  componentDidMount() {
    if (_.size(this.props.list) === 0) {
      this.props.dispatch(getWarehouses());
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
      this.props.dispatch(getWarehouses());
    }
  }

  handleOpenWarehouseModal = () => {
    this.setState({
      warehouse: "",
      warehouseModal: true
    });
  };

  handleCloseModals = () => {
    this.setState({
      warehouseModal: false,
      delWarehouseModal: false
    });
  };

  handleEditFunc = warehouse => {
    this.setState({
      warehouse,
      warehouseModal: true
    });
  };

  handleOpenDelWarehouseModal = warehouse => {
    this.setState({
      warehouse,
      delWarehouseModal: true
    });
  };

  handleDispatchActions = (type, data) => {
    const {dispatch} = this.props;
    switch(type) {
      case actionTypes.DELETE_WAREHOUSE:
        dispatch(deleteWarehouse(data.id));
        break;
      case actionTypes.CREATE_WAREHOUSE:
        dispatch(createWarehouse(data.warehouse.code, data.warehouse.name));
        break;
      case actionTypes.EDIT_WAREHOUSE: 
        dispatch(editWarehouse(data.warehouse.id, data.warehouse.code, data.warehouse.name))
        break;
      default:
        break;
    }
  }

  render() {
    const { pageLoading } = this.props;
    const {
      listToDisplay,
      warehouseModal,
      warehouse,
      delWarehouseModal
    } = this.state;

    return (
      <div id='div-warehouse'>
        <Head>
          <title>Warehouse</title>
        </Head>
        <DashboardLayout>
          <Dimmer active={pageLoading} inverted>
            <Loader size='large'>Loading</Loader>
          </Dimmer>
          <Segment>
            <Header>
              Warehouse
              <WarehouseModal
                warehouse={warehouse}
                warehouseModal={warehouseModal}
                handleCloseModal={this.handleCloseModals}
                handleDispatchActions={this.handleDispatchActions}
                />
              <DeleteWarehouseModal
                warehouse={warehouse}
                handleCloseModal={this.handleCloseModals}
                delWarehouseModal={delWarehouseModal}
                handleDispatchActions={this.handleDispatchActions}
              />
              <Form>
                <Form.Group inline>
                  <Form.Button
                    width={14}
                    onClick={this.handleOpenModal}
                    color='green'
                    icon='plus'
                    content='Create'
                    floated='right'
                    onClick={this.handleOpenWarehouseModal}
                  />
                </Form.Group>
              </Form>
            </Header>
            {listToDisplay.length > 0 ? (
              <MainTable
                listToDisplay={listToDisplay}
                handleOpenWarehouseModal={this.handleEditFunc}
                handleOpenDelWarehouseModal={this.handleOpenDelWarehouseModal}
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
const mapStateToProps = ({ warehouse }) => warehouse;

export default connect(
  mapStateToProps,
  null
)(Warehouse);
