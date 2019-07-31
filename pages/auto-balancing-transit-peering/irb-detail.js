import React, {Component} from 'react';
import {
    Button,
    Table,
    Input,
    Select,
    Header,
    Grid,
    Segment,
    Dimmer,
    Loader,
    Form
} from 'semantic-ui-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DashboardLayout from '../../src/components/Layout/DashboadLayout';
import Head from 'next/head';
import {connect} from 'react-redux';
import { autoBalancingTransitPeering } from '../../src/redux/_actions/auto-balancing-transit-peering/autoBalancingTransitPeering';
import _ from 'lodash';
import moment from "moment/moment";

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
                    <Table.HeaderCell>Irb</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Gateway</Table.HeaderCell>
                    <Table.HeaderCell>BGP v4</Table.HeaderCell>
                    <Table.HeaderCell>BGP v6</Table.HeaderCell>
                    <Table.HeaderCell>Traffic in</Table.HeaderCell>
                    <Table.HeaderCell>Traffic out</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    this.props.listToDisplay.map((item, index, list) => {
                        return (
                            <Table.Row key={index} >
                                <Table.Cell key={'a'}>{item.irbName} </Table.Cell>
                                <Table.Cell key={'b'}>{item.irbDetail} </Table.Cell>
                                <Table.Cell key={'c'}>{item.bgpV4.hostName} </Table.Cell>
                                <Table.Cell key={'d'}>{item.bgpV4.export.replace("-Export", "")} </Table.Cell>
                                <Table.Cell key={'e'}>{item.bgpV6.export.replace("-Export", "")} </Table.Cell>
                                <Table.Cell key={'f'}>{item.totalTrafficIn} Mb ({item.percentTrafficIn.toFixed(2)}%) </Table.Cell>
                                <Table.Cell key={'g'}>{item.totalTrafficOut} Mb ({item.percentTrafficOut.toFixed(2)}%) </Table.Cell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Body>
        </Table>);
    }
}

class irbDetail extends Component {
    constructor(props) {
        super(props);
        const {autoBalancingTransitPeering} = props;
        this.state = {
            search: {searchByName: ''},
            searchLoading: {searchByName: false},
            // pagination: {currentPage: 0, countPage: 1},
            allTimeInDay: [],
            detailInfoIrbData: [],
            listToDisplay: [],
            listData: [],
        };
        this.handleChangeLogDate = this.handleChangeLogDate.bind(this);
    }

    searchTimeout = {};

    handleChangeLogDate(value) {
        let date = moment(value).format('YYYY-MM-DD');
        this.props.dispatch(autoBalancingTransitPeering.getAllTimeInDay(date, value));
    }

    componentDidMount() {
        this.setClassForDatePicker();
        if (_.size(this.state.allTimeInDay)===0) {
            let today = new Date();
            let date = moment(today).format('YYYY-MM-DD');
            this.props.dispatch(autoBalancingTransitPeering.getAllTimeInDay(date, today));
        }
    }

    componentWillReceiveProps(nextProps) {
        const {allTimeInDay, detailInfoIrbData} = nextProps;
        let listData = [];
        if(detailInfoIrbData.length > 0){
            listData = detailInfoIrbData[0].data
        }
        listData = listData.filter(function(a){return a.bgpV4 != null && a.bgpV6 != null});
        this.setState({
            allTimeInDay: allTimeInDay,
            detailInfoIrbData: detailInfoIrbData,
            listData: listData,
            listToDisplay: listData
        });
    }

    filter() {

        const searchByName = this.state.search['searchByName'];


        const filteredList = this.state.listData.filter(function (e) {
            return ((searchByName === '' || e.irbName.toString().toLowerCase().includes(searchByName.toLowerCase())));
        });


        this.setState({
            listToDisplay: filteredList,
            searchLoading: {
                searchByName: false,
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
        // let wb = XLSX.utils.book_new();
        //
        // wb = XLSX.utils.table_to_book(document.getElementById('tblList'), {raw: true});
        //
        // if (!wb.Props)
        //     wb.Props = {};
        //
        // wb.Props.Author = 'noc-ast';
        //
        // XLSX.writeFile(wb, `Group_MP_List_${moment(new Date()).format("YYYY_MM_DD_HH_mm_ss")}.xlsx`);
    };

    handleChangeSelect = (e, {name, value}) => {
        e.persist();

        const search = {...this.state.search};
        const searchLoading = {...this.state.searchLoading};
        search[name] = value;
        searchLoading[name] = true;
        this.setState({search, searchLoading});
        this.props.dispatch(autoBalancingTransitPeering.getDetailInfoIrbData({
            time: value
        }));
    };

    render() {
        const { pageLoading, handleChangeLogDate, logDate } = this.props;
        const {
            search,
            searchLoading,
            // pagination = {currentPage: 0, countPage: 1},
            // list = [],
            // filtedList = [],
            detailInfoIrbData,
            allTimeInDay,
            listToDisplay,
            filteredList
        } = this.state;

        return (
            <div id="div-page-auto-balancing">
                <Head>
                    <title> Auto Balancing Data </title>
                </Head>
                <DashboardLayout >
                    <Dimmer active={pageLoading} inverted>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>
                    <Segment>
                        <Header> IRB </Header>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Input fluid label='Search by name' icon='search' placeholder="Search by name..."
                                            name='searchByName'
                                            loading={searchLoading['searchByName']}
                                            value={search['searchByName']} onChange={this.handleSearch.bind(this)}/>
                            </Grid.Column>
                            <Grid.Column computer={2} largeScreen={2} tablet={4} moblie={8}>
                                <Form.Field>
                                    <label>Choose log date</label>
                                    <DatePicker
                                        dateFormat="dd/MM/yyyy"
                                        selected={logDate}
                                        maxDate={new Date()}
                                        onChange={this.handleChangeLogDate}
                                        locale="en"
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Select fluid label='Search by time' name='searchByTime'
                                             options={
                                                 [-1, ...allTimeInDay].map(
                                                     (e) => (
                                                         {
                                                             key: e,
                                                             text: e == -1 ? 'all' : moment(e).utcOffset("+00:00").format("YYYY-MM-DD HH:mm:ss"),
                                                             value: e
                                                         }
                                                     ))
                                             }
                                             value={search['searchByTime']}
                                             placeholder='Time'
                                             onChange={this.handleChangeSelect}
                                />
                            </Grid.Column>
                            {/*<Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>*/}
                                {/*<Form.Field>*/}
                                    {/*<label>Export</label>*/}
                                    {/*<Button fluid onClick={this.exportExcel}>Export to excel file</Button>*/}
                                {/*</Form.Field>*/}
                            {/*</Grid.Column>*/}
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
    };

    setClassForDatePicker() {
        const datePickerWrapper = document.querySelector('.react-datepicker-wrapper ');
        datePickerWrapper.classList.add("fluid");

        const datePicker = document.querySelector('.react-datepicker-wrapper .react-datepicker__input-container');
        datePicker.classList.add("ui");
        datePicker.classList.add("input");

        const datePickerInput = document.querySelector('.react-datepicker-wrapper .react-datepicker__input-container input');
        datePickerInput.style.width = "100%";
    }
}

const mapStateToProps = ({autoBalancingTransitPeering}) => (autoBalancingTransitPeering);

export default connect(mapStateToProps, null)(irbDetail);