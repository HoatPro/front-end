import React, { Component, Fragment } from "react";
import {
  Table,
  Header,
  Segment,
  Dimmer,
  Loader,
  Message,
  Icon
} from "semantic-ui-react";
import DashboardLayout from "../../src/components/Layout/DashboadLayout";
import Head from "next/head";
import { connect } from "react-redux";
import _ from "lodash";
import { getHistory } from "../../src/redux/_actions/tool-cgnat/historyA";
import moment from "moment";

const successMessage = ["success", "ok"];
const errorMessage = ["fail", "error"];

function IconRow(props) {
  const message = props.data.toLowerCase();
  let include = false;
  let success = false;
  successMessage.forEach((item) => {
    if (message.includes(item)) {
      include = true;
      success = true;
    }
  })
  errorMessage.forEach((item) => {
    if (message.includes(item)) {
      include = true;
    }
  })
  return (
    <Table.Cell>
      {include && (
        <Icon
          name={success ? "checkmark" : "times"}
          color={success ? "green" : "red"}
        />
      )}
      {message}
    </Table.Cell>
  );
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
    const { device, idx } = this.props;
    return (
      <Table.Row key={idx}>
        <Table.Cell>{idx + 1}</Table.Cell>
        <Table.Cell>{device.device_name}</Table.Cell>
        <Table.Cell>{device.device_ip}</Table.Cell>
        <Table.Cell>{device.fpc_slot}</Table.Cell>
        <Table.Cell>{device.pic_slot}</Table.Cell>
        <Table.Cell>{device.card}</Table.Cell>
        <Table.Cell>{device.status}</Table.Cell>
        <Table.Cell>{device.msg_aopt}</Table.Cell>
        <Table.Cell>{device.reason}</Table.Cell>
        <Table.Cell>
          {moment(device.time_stamp).format("YYYY/MM/DD HH:mm:ss")}
        </Table.Cell>
        <IconRow data={device.uptime_result} />
        <IconRow data={device.pre_jsnap_result} />
        <IconRow data={device.action_result} />
        <IconRow data={device.post_jsnap_result} />
        <IconRow data={device.compare_jsnap_result} />
        <IconRow data={device.pic_state} />
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
    //  console.log(result);
    return result;
  }

  render() {
    const { listToDisplay } = this.props;
    return (
      <Table style={{ marginBottom: 14 }} celled structured className='tblList'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Ip</Table.HeaderCell>
            <Table.HeaderCell>FPC Slot</Table.HeaderCell>
            <Table.HeaderCell>Pic Slot</Table.HeaderCell>
            <Table.HeaderCell>Card</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Message AOPT</Table.HeaderCell>
            <Table.HeaderCell>Reason</Table.HeaderCell>
            <Table.HeaderCell>Timestamp</Table.HeaderCell>
            <Table.HeaderCell>Uptime Result</Table.HeaderCell>
            <Table.HeaderCell>Pre Jsnap Result</Table.HeaderCell>
            <Table.HeaderCell>Action Result</Table.HeaderCell>
            <Table.HeaderCell>Post Jsnap Result</Table.HeaderCell>
            <Table.HeaderCell>Compare Jsnap Result</Table.HeaderCell>
            <Table.HeaderCell>Pic State</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {listToDisplay.map((device, idx) => {
            return <TableRow key={idx} device={device} idx={idx} />;
          })}
        </Table.Body>
      </Table>
    );
  }
}

class History extends Component {
  constructor(props) {
    super(props);
    const { list } = this.props;
    this.state = {
      timeout: null,
      listToDisplay: list,
      pageLoading: true
    };
  }
  componentDidMount() {
    if (_.size(this.props.list) === 0) {
      this.props.dispatch(getHistory());
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

  render() {
    const { pageLoading } = this.props;
    const { listToDisplay } = this.state;

    return (
      <div id='div-history'>
        <Head>
          <title>History</title>
        </Head>
        <DashboardLayout>
          <Dimmer active={pageLoading} inverted>
            <Loader size='large'>Loading</Loader>
          </Dimmer>
          <Segment>
            <Header>History</Header>
          </Segment>
          {listToDisplay.length > 0 ? (
            <Segment className='list'>
              <MainTable listToDisplay={listToDisplay} />
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
const mapStateToProps = ({ toolCgnatHistory }) => toolCgnatHistory;

export default connect(
  mapStateToProps,
  null
)(History);
