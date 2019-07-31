import React, {Component} from 'react';
import {
    Button,
    Table,
    Header,
    Grid,
    Segment,
    Dimmer,
    Loader,
    Form
} from 'semantic-ui-react';
import DashboardLayout from '../../src/components/Layout/DashboadLayout';
import Head from 'next/head';
import {connect} from 'react-redux';
import {groupMPListA} from '../../src/redux/_actions/groupMP/groupMPListA';
import _ from 'lodash';
import moment from 'moment';
import XLSX from "xlsx";
import * as dataAnalyzer from '../../src/helpers/data-analyzer.js';

class MainTable extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let result = (!_.isEqual(nextProps.listToDisplay, this.props.listToDisplay));
        return result;
    }

    componentDidUpdate() {
        this.props.onTableDidUpdate();
    }

    render() {
        return (<Table celled structured id="tblList">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell rowSpan={4}>Index</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={4}>Region</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={4}>Group MP</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={4}>MP</Table.HeaderCell>
                    <Table.HeaderCell colSpan={7}>Existing CCU and BW </Table.HeaderCell>
                    <Table.HeaderCell colSpan={13} rowSpan={2}>Existing links</Table.HeaderCell>
                    <Table.HeaderCell colSpan={4} rowSpan={2}>Required links (Convert 10G
                        links)</Table.HeaderCell>
                    <Table.HeaderCell colSpan={4} rowSpan={2}>Links to add (convert 10G
                        links)</Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell colSpan={3}>Max CCU</Table.HeaderCell>
                    <Table.HeaderCell colSpan={4}>Max BW (Gb)</Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell rowSpan={2}>IPv4</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>IPv6</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>NAT</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>Uplink</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>Downlink</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>Equal</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>B2B</Table.HeaderCell>
                    <Table.HeaderCell colSpan={3}>Uplink</Table.HeaderCell>
                    <Table.HeaderCell colSpan={3}>Downlink</Table.HeaderCell>
                    <Table.HeaderCell colSpan={4}>Equal</Table.HeaderCell>
                    <Table.HeaderCell colSpan={3}>B2B</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>Uplink</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>Downlink</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>Equal</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>B2B</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>Uplink</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>Downlink</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>Equal</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={2}>B2B</Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell>10G</Table.HeaderCell>
                    <Table.HeaderCell>40G</Table.HeaderCell>
                    <Table.HeaderCell>100G</Table.HeaderCell>
                    <Table.HeaderCell>10G</Table.HeaderCell>
                    <Table.HeaderCell>40G</Table.HeaderCell>
                    <Table.HeaderCell>100G</Table.HeaderCell>
                    <Table.HeaderCell>1G</Table.HeaderCell>
                    <Table.HeaderCell>10G</Table.HeaderCell>
                    <Table.HeaderCell>40G</Table.HeaderCell>
                    <Table.HeaderCell>100G</Table.HeaderCell>
                    <Table.HeaderCell>10G</Table.HeaderCell>
                    <Table.HeaderCell>40G</Table.HeaderCell>
                    <Table.HeaderCell>100G</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    this.props.listToDisplay.map((item, index, list) => {

                        let sameMpSubSubGroupList = dataAnalyzer.getSameMpSubSubGroupList(list, item, 'c', 'b');
                        let indexMpOfSubSubGroup = sameMpSubSubGroupList.idx;
                        let numberMpOfSubSubGroup = sameMpSubSubGroupList.list.length;

                        return (
                            <Table.Row key={index}>
                                <Table.Cell style={{textAlign: 'center'}} key={'idx'}>{index+1} </Table.Cell>
                                <Table.Cell style={{textAlign: 'center'}} key={'a'}>{item['a']} </Table.Cell>
                                <Table.Cell key={'b'}>{item['b']} </Table.Cell>
                                <Table.Cell key={'c'}>{item['c']} </Table.Cell>
                                {
                                    indexMpOfSubSubGroup == 0 ? (
                                        <Table.Cell rowSpan={numberMpOfSubSubGroup}
                                                    key={'sumD'}>{item['sumD']} </Table.Cell>) : null
                                }
                                {
                                    indexMpOfSubSubGroup == 0 ? (
                                        <Table.Cell rowSpan={numberMpOfSubSubGroup}
                                                    key={'sumE'}>{item['sumE']} </Table.Cell>) : null
                                }
                                {
                                    indexMpOfSubSubGroup == 0 ? (
                                        <Table.Cell rowSpan={numberMpOfSubSubGroup}
                                                    key={'sumF'}>{item['sumF']} </Table.Cell>) : null
                                }
                                {
                                    indexMpOfSubSubGroup == 0 ? (
                                        <Table.Cell rowSpan={numberMpOfSubSubGroup}
                                                    key={'sumG'}>{item['sumG']} </Table.Cell>) : null
                                }
                                {
                                    indexMpOfSubSubGroup == 0 ? (
                                        <Table.Cell rowSpan={numberMpOfSubSubGroup}
                                                    key={'sumH'}>{item['sumH']} </Table.Cell>) : null
                                }
                                <Table.Cell key={'i'}>{item['i']} </Table.Cell>
                                {
                                    indexMpOfSubSubGroup == 0 ? (
                                        <Table.Cell rowSpan={numberMpOfSubSubGroup}
                                                    key={'sumJ'}>{item['sumJ']} </Table.Cell>) : null
                                }
                                <Table.Cell key={'k'}>{item['k']} </Table.Cell>
                                <Table.Cell key={'l'}>{item['l']} </Table.Cell>
                                <Table.Cell key={'m'}>{item['m']} </Table.Cell>
                                <Table.Cell key={'n'}>{item['n']} </Table.Cell>
                                <Table.Cell key={'o'}>{item['o']} </Table.Cell>
                                <Table.Cell key={'p'}>{item['p']} </Table.Cell>
                                <Table.Cell key={'q'}>{item['q']} </Table.Cell>
                                <Table.Cell key={'r'}>{item['r']} </Table.Cell>
                                <Table.Cell key={'s'}>{item['s']} </Table.Cell>
                                <Table.Cell key={'t'}>{item['t']} </Table.Cell>
                                <Table.Cell key={'u'}>{item['u']} </Table.Cell>
                                <Table.Cell key={'v'}>{item['v']} </Table.Cell>
                                <Table.Cell key={'w'}>{item['w']} </Table.Cell>
                                <Table.Cell key={'x'}>{item['x']} </Table.Cell>
                                <Table.Cell key={'y'}>{item['y']} </Table.Cell>
                                <Table.Cell key={'z'}>{item['z']} </Table.Cell>
                                <Table.Cell key={'aa'}>{item['aa']} </Table.Cell>
                                <Table.Cell key={'ab'}>{item['ab']} </Table.Cell>
                                <Table.Cell key={'ac'}>{item['ac']} </Table.Cell>
                                <Table.Cell key={'ad'}>{item['ad']} </Table.Cell>
                                <Table.Cell key={'ae'}>{item['ae']} </Table.Cell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Body>
        </Table>);
    }
}

class GroupMPList extends Component {

    constructor(props) {
        super(props);

        const {listData} = props;

        this.state = {
            search: {searchByName: '', searchByRegion: -1},
            searchLoading: {searchByName: false, searchByRegion: false},
            pagination: {currentPage: 0, countPage: 1},
            list: listData,
            filtedList: listData,
            listToDisplay: listData,
        };
    }

    searchTimeout = {};

    componentDidMount() {
        if (_.size(this.props.listData)===0) {
            this.props.dispatch(groupMPListA.getGroupMPList({
                date: new Date()
            }));
        }
    }

    componentWillReceiveProps(nextProps) {
        const {listData} = nextProps;

        this.setState({
            search: {searchByName: '', searchByRegion: -1},
            searchLoading: {searchByName: false, searchByRegion: false},
            pagination: {currentPage: 0, countPage: 1},
            list: listData,
            filtedList: listData,
            listToDisplay: listData,
        });
    }

    filter() {

        const searchByName = this.state.search['searchByName'];
        const searchByRegion = this.state.search['searchByRegion'];

        const filteredList = this.state.list.filter(function (e) {
            return ((searchByRegion == -1 || e.a === searchByRegion) && (searchByName === '' || e.c.toString().toLowerCase().includes(searchByName.toLowerCase())));
        });

        this.setState({
            filteredList: filteredList,
            listToDisplay: filteredList,
            searchLoading: {
                searchByName: false,
                searchByRegion: false
            }
        });
    }

    handleSearch(e) {
        const {name, value} = e.target;
        //  const {groupMPList, dispatch} = this.props;
        //  let {search = {}, pagination = {}} = groupMPList;
        //  search[name] = value;
        //  dispatch(userA.handleSearch(value));

        const search = {...this.state.search};
        const searchLoading = {...this.state.searchLoading};
        search[name] = value;
        searchLoading[name] = true;

        clearTimeout(this.searchTimeout[name]);
        this.setState({search, searchLoading});

        this.searchTimeout[name] = setTimeout(() => {
            this.filter();
            //console.log(value);
            //this.getData(search, pagination);
        }, 500);
    }

    handleSearchByRegion(event, data) {
        const name = 'searchByRegion';
        const value = data.value;

        const search = {...this.state.search};
        const searchLoading = {...this.state.searchLoading};
        search[name] = value;
        searchLoading[name] = true;

        clearTimeout(this.searchTimeout[name]);
        this.setState({search, searchLoading});

        this.searchTimeout[name] = setTimeout(() => {
            this.filter();
            //console.log(value);
            //this.getData(search, pagination);
        }, 100);
    }

    exportExcel = () => {
        let wb = XLSX.utils.book_new();

        wb = XLSX.utils.table_to_book(document.getElementById('tblList'), {raw: true});

        if (!wb.Props)
            wb.Props = {};

        wb.Props.Author = 'noc-ast';

        XLSX.writeFile(wb, `Group_MP_List_${moment(new Date()).format("YYYY_MM_DD_HH_mm_ss")}.xlsx`);
    };

    render() {
        const {listData, pageLoading} = this.props;
        const {
            search,
            searchLoading,
            pagination = {currentPage: 0, countPage: 1},
            list = [],
            filtedList = [],
            listToDisplay = [],
        } = this.state;

        return (
            <div id="div-page-group-mp-list">
                <Head>
                    <title> Group MP List </title>
                </Head>
                <DashboardLayout >
                    <Dimmer active={pageLoading} inverted>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>
                    <Segment>
                        <Header> Group MP List</Header>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Input fluid label='Search by name' icon='search' placeholder="Search by name..."
                                            name='searchByName'
                                            loading={searchLoading['searchByName']}
                                            value={search['searchByName']} onChange={this.handleSearch.bind(this)}/>
                            </Grid.Column>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Select fluid label='Search by region' name='searchByRegion'
                                             options={[-1, 1, 2, 3, 4, 5, 6, 7].map(function (e) {
                                                 return {key: e, text: e == -1 ? 'all' : e, value: e}
                                             })} value={search['searchByRegion']}
                                             loading={searchLoading['searchByRegion']} placeholder='Region'
                                             onChange={this.handleSearchByRegion.bind(this)}/>
                            </Grid.Column>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Field>
                                    <label>Export</label>
                                    <Button fluid onClick={this.exportExcel}>Export to excel file</Button>
                                </Form.Field>
                            </Grid.Column>
                        </Grid>
                    </Segment>

                    <Segment className="list">
                        <MainTable onTableDidUpdate={() => {
                            this.setState({pageLoading: false})
                        }} listToDisplay={this.state.listToDisplay}/>
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({groupMPList}) => (groupMPList);

export default connect(mapStateToProps, null)(GroupMPList);