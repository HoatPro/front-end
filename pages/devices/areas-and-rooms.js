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
  Grid,
  Pagination,
  Icon,
  Input,
  Dropdown
} from "semantic-ui-react";
import DashboardLayout from "../../src/components/Layout/DashboadLayout";
import Head from "next/head";
import { connect } from "react-redux";
import _ from "lodash";
import {
  getNetAreas,
  getNetRoomsByAreaId,
  createNetArea,
  editNetArea,
  deleteNetArea,
  createNetRoom,
  editNetRoom,
  deleteNetRoom
} from "../../src/redux/_actions/devices/areasAndRoomsA";
import { getWarehouses } from "../../src/redux/_actions/devices/warehouseA";

const actionTypes = {
  GET_WAREHOUSES: "GET_WAREHOUSES",
  CHOOSE_ROOM: 'CHOOSE_ROOM',
  DELETE_ROOM: 'DELETE_ROOM',
  DELETE_AREA: 'DELETE_AREA',
  CREATE_AREA: 'CREATE_AREA',
  EDIT_AREA: 'EDIT_AREA',
  CREATE_ROOM: 'CREATE_ROOM',
  EDIT_ROOM: 'EDIT_ROOM'
};

class Areas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areaModal: false,
      areaDeleteModal: false,
      area: null,
      nameSearch: ""
    };
    this.handleCloseAreaModal = this.handleCloseAreaModal.bind(this);
    this.handleOpenAreaModal = this.handleOpenAreaModal.bind(this);
    this.handleOpenAreaDeleteModal = this.handleOpenAreaDeleteModal.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
  }

  handleOpenAreaModal = area => {
    this.setState({
      areaModal: true,
      area
    });
  };

  handleCloseAreaModal = () => {
    this.setState({
      areaModal: false,
      areaDeleteModal: false
    });
  };

  handleOpenAreaDeleteModal = area => {
    this.setState({
      area,
      areaDeleteModal: true
    });
  };

  handleChangeInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const {
      listArea,
      handleDispatchActions
    } = this.props;
    const {
      areaModal,
      creating,
      area,
      areaDeleteModal,
      nameSearch
    } = this.state;
    return (
      <Grid.Column>
        <Segment>
          <Header>
            Areas
            <AreaDeleteModal
              area={area}
              handleCloseAreaModal={this.handleCloseAreaModal}
              areaDeleteModal={areaDeleteModal}
              handleDispatchActions={handleDispatchActions}
            />
          </Header>
          <AreaModal
            area={area}
            creating={creating}
            areaModal={areaModal}
            handleCloseAreaModal={this.handleCloseAreaModal}
            handleOpenAreaModal={this.handleOpenAreaModal}
            handleDispatchActions={handleDispatchActions}
          />
          <Form>
            <Form.Group inline>
              <Form.Button
                width={8}
                data-name='create'
                color='green'
                icon='plus'
                content='Create'
                onClick={this.handleOpenAreaModal}
              />
              <Form.Input
                width={8}
                label='Search'
                icon='search'
                onChange={this.handleChangeInput}
                name='nameSearch'
                value={this.state.nameSearch}
                placeholder='Search Area by name'
                fluid
              />
            </Form.Group>
          </Form>
          {listArea.length > 0 ? (
            <>
              <AreaTable
                listArea={listArea}
                handleOpenAreaModal={this.handleOpenAreaModal}
                handleOpenAreaDeleteModal={this.handleOpenAreaDeleteModal}
                handleDispatchActions={handleDispatchActions}
                nameSearch={nameSearch.toLowerCase().trim()}
              />
            </>
          ) : (
            <Message warning>
              <Message.Header>No item exist!</Message.Header>
            </Message>
          )}
        </Segment>
      </Grid.Column>
    );
  }
}

class AreaTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      numOfItems: 25
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   let result = !_.isEqual(nextProps.listArea, this.props.listArea);
  //   return result;
  // }

  handlePageChange = (e, data) => {
    this.setState({
      index: data.activePage - 1
    });
  };

  render() {
    const { index, numOfItems } = this.state;
    const {
      listArea,
      handleOpenAreaModal,
      handleOpenAreaDeleteModal,
      handleDispatchActions,
      nameSearch
    } = this.props;
    return (
      <>
        <Table celled structured className='tblList'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {listArea
              .filter((obj, idx) => {
                return obj.name.toLowerCase().includes(nameSearch);
              })
              .slice(index * numOfItems, (index + 1) * numOfItems)
              .map((obj, idx) => {
                return (
                  <AreaTableRow
                    key={idx + index * numOfItems}
                    obj={obj}
                    idx={idx + index * numOfItems}
                    handleOpenAreaModal={handleOpenAreaModal}
                    handleOpenAreaDeleteModal={handleOpenAreaDeleteModal}
                    handleDispatchActions={handleDispatchActions}
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
          totalPages={Math.ceil(
            listArea.filter((obj, idx) => {
              return obj.name.toLowerCase().includes(nameSearch);
            }).length / numOfItems
          )}
          onPageChange={this.handlePageChange}
        />
      </>
    );
  }
}

class AreaTableRow extends Component {
  constructor(props) {
    super(props);
    this.handleChooseRoom = this.handleChooseRoom.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const result = !_.isEqual(nextProps, this.props);
    return result;
  }

  handleChooseRoom = area => {
    const data = {
      area
    }
    this.props.handleDispatchActions(actionTypes.CHOOSE_ROOM, data)
  }

  render() {
    const {
      obj,
      idx,
      handleOpenAreaModal,
      handleOpenAreaDeleteModal
    } = this.props;
    return (
      <Table.Row key={idx}>
        <Table.Cell>{idx + 1}</Table.Cell>
        <Table.Cell>{obj.name}</Table.Cell>
        <Table.Cell>
          <Button
            color='teal'
            icon='eye'
            data-area-id={obj.id}
            data-area-name={obj.name}
            onClick={() => this.handleChooseRoom(obj)}
            size='mini'
          />
          <Button
            color='yellow'
            data-name='edit'
            onClick={() => handleOpenAreaModal(obj)}
            icon='edit'
            size='mini'
          />
          <Button
            color='red'
            onClick={() => handleOpenAreaDeleteModal(obj)}
            icon='trash'
            size='mini'
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

class AreaModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.area !== null && nextProps.area !== undefined) {
      if (nextProps.area.name !== this.state.name) {
        this.setState({
          name: nextProps.area.name,
          id: nextProps.area.id
        });
      }
    } else if (nextProps.creating) {
      this.setState({
        name: "",
        id: ""
      });
    }
  }

  handleSave = () => {
    const { id, name } = this.state;
    const data = {
      id, name
    }
    let action = actionTypes.CREATE_AREA;
    if (Boolean(id)) {
      action = actionTypes.EDIT_AREA;
    }
    this.props.handleDispatchActions(action, data);
    this.props.handleCloseAreaModal();
  };

  render() {
    const {
      areaModal,
      handleCloseAreaModal,
    } = this.props;
    return (
      <Modal size='tiny' open={areaModal} onClose={handleCloseAreaModal}>
        <Modal.Header>Create or Edit Area</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Input
                label='Name'
                name='name'
                onChange={this.handleChange}
                value={this.state.name}
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
          <Button content='Close' onClick={handleCloseAreaModal} />
        </Modal.Actions>
      </Modal>
    );
  }
}

class AreaDeleteModal extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete = () => {
    const { area, handleDispatchActions, handleCloseAreaModal } = this.props;
    const data = {
      id: area.id
    }
    handleDispatchActions(actionTypes.DELETE_AREA, data);
    handleCloseAreaModal();
  };

  render() {
    const { area, handleCloseAreaModal, areaDeleteModal } = this.props;
    return (
      <Modal onClose={handleCloseAreaModal} open={areaDeleteModal} size='tiny'>
        <Modal.Header>Delete Area</Modal.Header>
        <Modal.Content>
          Are you sure you want to delete Area{" "}
          <b>{Boolean(area) && area.name}</b>?
        </Modal.Content>
        <Modal.Actions>
          <Button
            color='red'
            content='Delete'
            icon='trash'
            onClick={this.handleDelete}
          />
          <Button content='Close' onClick={handleCloseAreaModal} />
        </Modal.Actions>
      </Modal>
    );
  }
}

class Rooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomModal: false,
      roomDeleteModal: false,
      room: null
    };
    this.handleCloseRoomModal = this.handleCloseRoomModal.bind(this);
    this.handleOpenRoomModal = this.handleOpenRoomModal.bind(this);
    this.handleOpenRoomDeleteModal = this.handleOpenRoomDeleteModal.bind(this);
  }

  handleOpenRoomModal = room => {
    this.setState({
      roomModal: true,
      room
    });
  };

  handleCloseRoomModal = () => {
    this.setState({
      roomModal: false,
      roomDeleteModal: false
    });
  };

  handleOpenRoomDeleteModal = room => {
    this.setState({
      room,
      roomDeleteModal: true
    });
  };

  render() {
    const {
      listRoom,
      listWarehouse,
      selectedArea,
      handleDispatchActions
    } = this.props;
    const { room, roomModal, roomDeleteModal } = this.state;
    return (
      <Grid.Column>
        <Segment>
          <Header>
            Rooms {selectedArea && "of " + selectedArea.name}
            <RoomDeleteModal
              room={room}
              handleCloseRoomModal={this.handleCloseRoomModal}
              roomDeleteModal={roomDeleteModal}
              handleDispatchActions={handleDispatchActions}
            />
          </Header>
          <RoomModal
            listWarehouse={listWarehouse}
            room={room}
            roomModal={roomModal}
            selectedArea={selectedArea}
            handleCloseRoomModal={this.handleCloseRoomModal}
            handleOpenRoomModal={this.handleOpenRoomModal}
            handleDispatchActions={handleDispatchActions}
          />
          {listRoom.length > 0 ? (
            <RoomTable
              listRoom={listRoom}
              handleOpenRoomModal={this.handleOpenRoomModal}
              handleOpenRoomDeleteModal={this.handleOpenRoomDeleteModal}
            />
          ) : (
            <Message warning>
              <Message.Header>
                {selectedArea
                  ? "This area has no room"
                  : "Choose one area first"}
              </Message.Header>
            </Message>
          )}
        </Segment>
      </Grid.Column>
    );
  }
}

class RoomTable extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let result = !_.isEqual(nextProps.listRoom, this.props.listRoom);
    return result;
  }

  render() {
    const {
      listRoom,
      handleOpenRoomModal,
      handleOpenRoomDeleteModal
    } = this.props;

    return (
      <Table celled structured className='tblList'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Warehouse</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {listRoom.map((obj, idx) => {
            return (
              <RoomTableRow
                key={idx}
                obj={obj}
                idx={idx}
                handleOpenRoomModal={handleOpenRoomModal}
                handleOpenRoomDeleteModal={handleOpenRoomDeleteModal}
              />
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}

class RoomTableRow extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const result = !_.isEqual(nextProps, this.props);
    return result;
  }

  render() {
    const {
      obj,
      idx,
      handleOpenRoomModal,
      handleOpenRoomDeleteModal
    } = this.props;
    return (
      <Table.Row key={idx}>
        <Table.Cell>{idx + 1}</Table.Cell>
        <Table.Cell>{obj.name}</Table.Cell>
        <Table.Cell>{obj.address}</Table.Cell>
        <Table.Cell>{obj.wName}</Table.Cell>
        <Table.Cell>
          <Button
            color='yellow'
            onClick={() => handleOpenRoomModal(obj)}
            icon='edit'
            size='mini'
          />
          <Button
            color='red'
            onClick={() => handleOpenRoomDeleteModal(obj)}
            icon='trash'
            size='mini'
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

class RoomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      address: "",
      warehouseOptions: [],
      warehouseId: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleChangeSelection = this.handleChangeSelection.bind(this);
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  componentDidMount() {
    const { listWarehouse, handleDispatchActions } = this.props;
    if (_.size(listWarehouse) === 0) {
      handleDispatchActions(actionTypes.GET_WAREHOUSES);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (Boolean(nextProps.room)) {
      if (
        nextProps.room.name !== this.state.name ||
        nextProps.room.address !== this.state.address
      ) {
        this.setState({
          name: nextProps.room.name,
          id: nextProps.room.id,
          address: nextProps.room.address,
          warehouseId: nextProps.room.warehouseId
        });
      }
    } else if (nextProps.creating) {
      this.setState({
        name: "",
        id: "",
        address: "",
        warehouseId: ""
      });
    }

    if (_.size(nextProps.listWarehouse)) {
      const warehouseOptions = [];
      nextProps.listWarehouse.map(ele => {
        warehouseOptions.push({
          key: ele.id,
          value: ele.id,
          text: ele.name
        });
      });
      this.setState({
        warehouseOptions
      });
    }
  }

  handleSave = () => {
    const { id, name, address, warehouseId } = this.state;
    const data = {
      room: {
        id, name, address, warehouseId
      }
    }
    let action = actionTypes.CREATE_ROOM;
    if (Boolean(id)) {
      action = actionTypes.EDIT_ROOM;
    }
    this.props.handleDispatchActions(action, data);
    this.props.handleCloseRoomModal();
  };

  handleChangeSelection = (e, data) => {
    this.setState({
      warehouseId: data.value
    });
  };

  render() {
    const {
      roomModal,
      handleCloseRoomModal,
      handleOpenRoomModal,
      selectedArea
    } = this.props;

    return (
      <Modal
        size='tiny'
        open={roomModal}
        trigger={
          <Button
            data-name='create'
            color='green'
            icon='plus'
            content='Create'
            onClick={handleOpenRoomModal}
            disabled={!selectedArea}
          />
        }
        onClose={handleCloseRoomModal}>
        <Modal.Header>Create or Edit Room</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Input
                label='Name'
                name='name'
                onChange={this.handleChange}
                value={this.state.name}
              />
            </Form.Field>
            <Form.Field>
              <Input
                label='Address'
                name='address'
                onChange={this.handleChange}
                value={this.state.address}
              />
            </Form.Field>
            <Form.Field>
              <Dropdown
                selection
                search
                placeholder='Select warehouse'
                options={this.state.warehouseOptions}
                defaultValue={this.state.warehouseId}
                onChange={this.handleChangeSelection}
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
          <Button content='Close' onClick={handleCloseRoomModal} />
        </Modal.Actions>
      </Modal>
    );
  }
}

class RoomDeleteModal extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete = () => {
    const { room, handleDispatchActions, handleCloseRoomModal } = this.props;
    const data = {
      id: room.id
    }
    handleDispatchActions(actionTypes.DELETE_ROOM, data);
    handleCloseRoomModal();
  };

  render() {
    const { room, handleCloseRoomModal, roomDeleteModal } = this.props;
    return (
      <Modal onClose={handleCloseRoomModal} open={roomDeleteModal} size='tiny'>
        <Modal.Header>Delete Room</Modal.Header>
        <Modal.Content>
          Are you sure you want to delete Room{" "}
          <b>{Boolean(room) && room.name}</b>?
        </Modal.Content>
        <Modal.Actions>
          <Button
            color='red'
            content='Delete'
            icon='trash'
            onClick={this.handleDelete}
          />
          <Button content='Close' onClick={handleCloseRoomModal} />
        </Modal.Actions>
      </Modal>
    );
  }
}

class AreasAndRooms extends Component {
  constructor(props) {
    super(props);
    const { listArea, listRoom, listWarehouse, selectedArea } = this.props;
    this.state = {
      timeout: null,
      listArea: listArea,
      listRoom: listRoom,
      listWarehouse: listWarehouse,
      pageLoading: true,
      selectedArea: selectedArea
    };
    this.handleDispatchActions = this.handleDispatchActions.bind(this);
  }

  componentDidMount() {
    if (_.size(this.props.listArea) === 0) {
      this.props.dispatch(getNetAreas());
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      listArea,
      listRoom,
      selectedArea,
      status,
      listWarehouse
    } = nextProps;
    this.setState({
      timeout: null,
      listArea,
      listRoom,
      listWarehouse,
      pageLoading: true,
      selectedArea
    });
    if (status) {
      this.props.dispatch(getNetAreas());
      if (selectedArea != null) {
        this.props.dispatch(getNetRoomsByAreaId(selectedArea));
      }
    }
  }

  handleDispatchActions = (type, data) => {
    const { dispatch } = this.props;
    switch (type) {
      case actionTypes.GET_WAREHOUSES:
        dispatch(getWarehouses());
        break;
      case actionTypes.CHOOSE_ROOM:
        dispatch(getNetRoomsByAreaId(data.area));
        break;
      case actionTypes.DELETE_ROOM:
        dispatch(deleteNetRoom(data.id));
        break;
      case actionTypes.DELETE_AREA:
        dispatch(deleteNetArea(data.id));
        break;
      case actionTypes.CREATE_AREA:
        dispatch(createNetArea(data.name));
        break;
      case actionTypes.EDIT_AREA:
        dispatch(editNetArea(data.id, data.name));
        break;
      case actionTypes.CREATE_ROOM:
        dispatch(createNetRoom(data.room.name, data.room.address, this.state.selectedArea.id, data.room.warehouseId));
        break;
      case actionTypes.EDIT_ROOM:
        dispatch(editNetRoom(data.room.id, data.room.name, data.room.address, data.room.warehouseId));
        break;
      default:
        break;
    }
  };

  render() {
    const { pageLoading } = this.props;
    const { listArea, listRoom, selectedArea, listWarehouse } = this.state;
    return (
      <div id='div-areas-rooms'>
        <Head>
          <title>Areas and Rooms</title>
        </Head>
        <DashboardLayout>
          <Dimmer active={pageLoading} inverted>
            <Loader size='large'>Loading</Loader>
          </Dimmer>
          <Grid divided='vertically' columns='equal'>
            <Areas
              listArea={listArea}
              handleDispatchActions={this.handleDispatchActions}
            />
            <Rooms
              selectedArea={selectedArea}
              listRoom={listRoom}
              listWarehouse={listWarehouse}
              handleDispatchActions={this.handleDispatchActions}
            />
          </Grid>
        </DashboardLayout>
      </div>
    );
  }
}
const mapStateToProps = ({ netAreasAndRooms }) => netAreasAndRooms;

export default connect(
  mapStateToProps,
  null
)(AreasAndRooms);
