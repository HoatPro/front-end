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
import {cgnatPreferA} from '../../src/redux/_actions/cgnat/cgnatPreferA';
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
                    <Table.HeaderCell >Index</Table.HeaderCell>
                    <Table.HeaderCell >Region</Table.HeaderCell>
                    <Table.HeaderCell >Group MP</Table.HeaderCell>
                    <Table.HeaderCell >MP</Table.HeaderCell>
                    <Table.HeaderCell >MP Ip</Table.HeaderCell>
                    <Table.HeaderCell >CGNAT</Table.HeaderCell>
                    <Table.HeaderCell >CGNAT Ip</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    this.props.listToDisplay.map((item, index, list) => {
                        return (
                            <Table.Row key={index}>
                                <Table.Cell style={{textAlign: 'center'}} key={'idx'}>{index + 1} </Table.Cell>
                                <Table.Cell style={{textAlign: 'center'}} key={'mpRegion'}>{item['mpRegion']} </Table.Cell>
                                <Table.Cell key={'mpGroup'}>{item['mpGroup']} </Table.Cell>
                                <Table.Cell key={'name'}>{item['name']} </Table.Cell>
                                <Table.Cell key={'ip'}>{item['ip']} </Table.Cell>
                                <Table.Cell key={'cgnat'}>{(item.cgnat?item.cgnat:'').replace(/-RE0/g, '').replace(/-RE1/g, '')} </Table.Cell>
                                <Table.Cell key={'cgnat_ip'}>{item['cgnat_ip']} </Table.Cell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Body>
        </Table>);
    }
}

class CgnatPrefer extends Component {

    constructor(props) {
        super(props);

        const {listData} = props;

        this.state = {
            search: {searchByName: ''},
            searchLoading: {searchByName: false},
            list: listData,
            filtedList: listData,
            listToDisplay: listData,
        };
    }

    searchTimeout = {};

    componentDidMount() {
        if (_.size(this.props.listData) === 0) {
            this.props.dispatch(cgnatPreferA.getCgnatPreferData({
                date: new Date()
            }));
        }
    }

    componentWillReceiveProps(nextProps) {
        const {listData} = nextProps;

        this.setState({
            search: {searchByName: ''},
            searchLoading: {searchByName: false},
            pagination: {currentPage: 0, countPage: 1},
            list: listData,
            filtedList: listData,
            listToDisplay: listData,
        });
    }

    filter() {
        const searchByName = this.state.search['searchByName'];

        const filteredList = this.state.list.filter(function (e) {

            const lowerCaseSearchByName = searchByName.trim().toLowerCase();

            return (searchByName === '' || (e.name+'').toLowerCase().includes(lowerCaseSearchByName) || (e.cgnat+'').toLowerCase().includes(lowerCaseSearchByName) || (e.ip+'').toLowerCase().includes(lowerCaseSearchByName) || (e.cgnat_ip+'').toLowerCase().includes(lowerCaseSearchByName));
        });

        this.setState({
            filteredList: filteredList,
            listToDisplay: filteredList,
            searchLoading: {
                searchByName: false,
            }
        });
    }

    handleSearch(e) {
        const {name, value} = e.target;
        const search = {...this.state.search};
        const searchLoading = {...this.state.searchLoading};
        search[name] = value;
        searchLoading[name] = true;

        clearTimeout(this.searchTimeout[name]);
        this.setState({search, searchLoading});

        this.searchTimeout[name] = setTimeout(() => {
            this.filter();
        }, 500);
    }

    exportExcel = () => {
        let wb = XLSX.utils.book_new();

        wb = XLSX.utils.table_to_book(document.getElementById('tblList'), {raw: true});

        if (!wb.Props)
            wb.Props = {};

        wb.Props.Author = 'noc-ast';

        XLSX.writeFile(wb, `CGNAT_Prefer_${moment(new Date()).format("YYYY_MM_DD_HH_mm_ss")}.xlsx`);
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
            <div id="div-page-cgnat-prefer">
                <Head>
                    <title> CGNAT Prefer </title>
                </Head>
                <DashboardLayout>
                    <Dimmer active={pageLoading} inverted>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>
                    <Segment>
                        <Header> CGNAT Prefer</Header>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Input fluid label='Search by name' icon='search' placeholder="Search by name..."
                                            name='searchByName'
                                            loading={searchLoading['searchByName']}
                                            value={search['searchByName']} onChange={this.handleSearch.bind(this)}/>
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

const mapStateToProps = ({cgnatPrefer}) => (cgnatPrefer);

export default connect(mapStateToProps, null)(CgnatPrefer);