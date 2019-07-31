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
    Form
} from 'semantic-ui-react';
import DashboardLayout from '../../src/components/Layout/DashboadLayout';
import CustomTable from '../../src/components/Table/Table';
import Head from 'next/head';
import Link from 'next/link';
import {connect} from 'react-redux';
import {groupMPToposA} from '../../src/redux/_actions/groupMP/groupMPToposA';
import _ from 'lodash';
import {Graph} from 'react-d3-graph';
import moment from 'moment';
import * as dataAnalyzer from "../../src/helpers/data-analyzer";

class SelectGroupMPName extends Component {
    static defaultProps = {
        list: [],
        search: null,
        selected: null,
        loading: true,
    };

    constructor(props) {
        super(props);

        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        if (this.props.list.length === 0)
            this.props.dispatch(groupMPToposA.getAllGroupMPNames());
    }

    handleSelect(event, {value}) {
        this.props.dispatch(groupMPToposA.getDetailGroupMP(value));
    }

    render() {
        return (
            <Segment>
                <Dimmer active={this.props.loading} inverted>
                    <Loader size='medium'>Loading</Loader>
                </Dimmer>
                <Grid className='grid-toolbar' doubling stackable>
                    <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                        <Form.Select fluid search label='Search by name' name='searchByName' placeholder='name'
                                     options={this.props.list.map(function (e) {
                                         return {key: e, text: `${e}-MP-*`, value: e}
                                     })} value={this.props.selected} loading={this.props.searchLoading}
                                     onChange={this.handleSelect}
                        />
                    </Grid.Column>
                </Grid>
            </Segment>
        )
    }
}

const SelectGroupMPNameWithRedux = connect(function (state) {
    return {...state.groupMPTopos.groupMpNames};
}, null)(SelectGroupMPName);

class SegmentGroupMPDetail extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    renderTopo() {
        const {list} = this.props;

        const width = document.getElementsByClassName('content-layout')[0].clientWidth-28;

     //   alert(width);

        if (list && list.length > 0) {
            let listNodes = [];
            let listLinks = [];
            let groupName = list[0].groupName;
            for (let item of list) {
                let node = {
                    id: item.name,
                };
                if (listNodes.indexOf(node) == -1) {
                    listNodes.push(node);
                }
                for (let miniItem of item.list_smc_neighbor) {

                    let neighborSmcNode = {
                        id: miniItem,
                        color: 'red'
                    };
                    if (listNodes.indexOf(neighborSmcNode) == -1) {
                        listNodes.push(neighborSmcNode);
                    }
                    listLinks.push({
                        source: item.name,
                        target: miniItem
                    });
                }
                for (let miniItem of item.list_mp_neighbor) {
                    //check if neighbor in group or not
                    if (miniItem.indexOf(groupName) == -1) {
                        continue;
                    }
                    let neighborMpNode = {
                        id: miniItem
                    };
                    if (listNodes.indexOf(neighborMpNode) == -1) {
                        listNodes.push(neighborMpNode);
                    }
                    listLinks.push({
                        source: item.name,
                        target: miniItem
                    });
                }
            }
            const data = {
                nodes: listNodes,
                links: listLinks
            };

            const myConfig = {
                width: width,
                height: 500,
                nodeHighlightBehavior: true,
                node: {
                    color: 'lightgreen',
                    size: 120,
                    highlightStrokeColor: 'orange'
                },
                link: {
                    highlightColor: 'lightblue'
                }
            };

            // const onClickNode = function (nodeId) {
            //     window.alert('Clicked node ${nodeId}');
            // };
            //
            // const onMouseOverNode = function (nodeId) {
            //     window.alert(`Mouse over node ${nodeId}`);
            // };
            //
            // const onMouseOutNode = function (nodeId) {
            //     window.alert(`Mouse out node ${nodeId}`);
            // };
            //
            // const onClickLink = function (source, target) {
            //     window.alert(`Clicked link between ${source} and ${target}`);
            // };
            //
            // const onMouseOverLink = function (source, target) {
            //     window.alert(`Mouse over in link between ${source} and ${target}`);
            // };
            //
            // const onMouseOutLink = function (source, target) {
            //     window.alert(`Mouse out link between ${source} and ${target}`);
            // };

            return (
                <Graph
                    id='graph-id'
                    data={data}
                    config={myConfig}
                    // onClickNode={onClickNode}
                    // onClickLink={onClickLink}
                />
            )
        }
    }

    renderTable() {
        let time;
        const {list} = this.props;

        if (list && list.length > 0) {
            time = list[0].time;
            time = time.replace("T", " ");
            time = time.replace("Z", " ").split(" ")[1];
        }

        return (<Table celled fluid>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell style={{padding: "11px"}} >Name</Table.HeaderCell>
                    <Table.HeaderCell>Ip</Table.HeaderCell>
                    <Table.HeaderCell>Check at</Table.HeaderCell>
                    <Table.HeaderCell>Uplink</Table.HeaderCell>
                    <Table.HeaderCell>Downlink</Table.HeaderCell>
                    <Table.HeaderCell>Equal</Table.HeaderCell>
                    <Table.HeaderCell>B2B</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    list.map((item, index, list) => {
                        return (
                            <Table.Row key={index}>
                                <Table.Cell key={index}>{item.name} </Table.Cell>
                                <Table.Cell key={index}>{item.ip} </Table.Cell>
                                <Table.Cell key={index}>{time} </Table.Cell>
                                <Table.Cell
                                    numeric>{(item.uplink / 1024).toFixed(2)} Gbps</Table.Cell>
                                <Table.Cell
                                    numeric>{(item.downlink / 1024).toFixed(2)} Gbps</Table.Cell>
                                <Table.Cell
                                    numeric>{(item.equal / 1024).toFixed(2)} Gbps</Table.Cell>
                                <Table.Cell numeric>{(item.bb / 1024).toFixed(2)} Gbps</Table.Cell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Body>
        </Table>);
    }

    render() {
        const {display} = this.props;
        return (
            display ? (
                <Segment>
                    <Grid.Column computer={16} largeScreen={16} tablet={16} moblie={16}>
                        {this.renderTopo()}
                    </Grid.Column>
                    <Grid.Column computer={16} largeScreen={16} tablet={16} moblie={16}>
                        {this.renderTable()}
                    </Grid.Column>

                </Segment>) : null
        )
    }
}

const SegmentGroupMPDetailWithRedux = connect(function (state) {
    return {...state.groupMPTopos.groupMPDetail};
}, null)(SegmentGroupMPDetail);

class GroupMPTopos extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Head>
                    <title> Group MP Topos </title>
                </Head>
                <DashboardLayout id="div-page-group-mp-topos">
                    <Dimmer active={false} inverted>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>

                    <SelectGroupMPNameWithRedux/>

                    <SegmentGroupMPDetailWithRedux/>

                </DashboardLayout>
            </div>
        );
    }
}

export default GroupMPTopos;