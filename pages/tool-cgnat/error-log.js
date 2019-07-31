import React, { Component, Fragment } from "react";
import {
  Table,
  Header,
  Segment,
  Dimmer,
  Loader,
  Message,
  Form,
  Pagination,
  Icon
} from "semantic-ui-react";
import DashboardLayout from "../../src/components/Layout/DashboadLayout";
import Head from "next/head";
import { connect } from "react-redux";
import _ from "lodash";
import { getErrorLog } from "../../src/redux/_actions/tool-cgnat/errorLogA";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "react-datepicker/dist/react-datepicker.css";

class TableRow extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const result = !_.isEqual(nextProps, this.props);
    return result;
  }

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
      </Table.Row>
    );
  }
}

class MainTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      numOfItems: 20
    };
    this.handlePageChange = this.handlePageChange.bind(this);
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

  render() {
    const { listToDisplay } = this.props;
    const { index, numOfItems } = this.state;
    return (
      <>
        <Table
          style={{ marginBottom: 14 }}
          celled
          structured
          className="tblList"
        >
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
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {listToDisplay
              .slice(index * numOfItems, (index + 1) * numOfItems)
              .map((device, idx) => {
                return <TableRow device={device} idx={idx} index={index} key={idx} numOfItems={numOfItems} />;
              })}
          </Table.Body>
        </Table>
        <Pagination
          style={{ marginBottom: 14 }}
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
          totalPages={Math.ceil(listToDisplay.length / numOfItems)}
          onPageChange={this.handlePageChange}
        />
      </>
    );
  }
}

class ErrorLog extends Component {
  constructor(props) {
    super(props);
    const { list } = this.props;
    this.state = {
      timeout: null,
      listToDisplay: list,
      pageLoading: true,
      from: "",
      to: new Date()
    };
    this.handleChangeFromDate = this.handleChangeFromDate.bind(this);
    this.handleChangeToDate = this.handleChangeToDate.bind(this);
  }
  componentDidMount() {
    if (_.size(this.props.list) === 0) {
      this.props.dispatch(getErrorLog());
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

  render() {
    const { pageLoading } = this.props;
    const { listToDisplay, from, to } = this.state;

    return (
      <div id="div-error-log">
        <Head>
          <title> Error Log</title>
        </Head>
        <DashboardLayout>
          <Dimmer active={pageLoading} inverted>
            <Loader size="large">Loading</Loader>
          </Dimmer>
          <Segment>
            <Header>
              Error Log
              <Form>
                <Form.Group>
                  <Form.Field>
                    <label>From</label>
                    <DatePicker
                      name="from"
                      selected={from}
                      selectsStart
                      maxDate={new Date()}
                      startDate={from}
                      endDate={to}
                      onChange={this.handleChangeFromDate}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>To</label>
                    <DatePicker
                      name="to"
                      selected={to}
                      selectsEnd
                      startDate={from}
                      endDate={to}
                      onChange={this.handleChangeToDate}
                    />
                  </Form.Field>
                </Form.Group>
              </Form>
            </Header>
          </Segment>
          {listToDisplay.length > 0 ? (
            <Segment className="list">
              <MainTable
                listToDisplay={
                  this.state.from === ""
                    ? listToDisplay
                    : listToDisplay.filter(
                        log =>
                          new Date(log.time_stamp).getTime() >=
                            new Date(from).getTime() &&
                          new Date(log.time_stamp).getTime() <=
                            new Date(to).getTime()
                      )
                }
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
const mapStateToProps = ({ toolCgnatErrorLog }) => toolCgnatErrorLog;

export default connect(
  mapStateToProps,
  null
)(ErrorLog);
