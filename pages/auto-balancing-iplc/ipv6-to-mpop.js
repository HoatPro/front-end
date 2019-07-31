import React, {Component} from 'react';
import {
    Table,
    Header,
    Grid,
    Segment,
    Dimmer,
    Loader,
    Form
} from 'semantic-ui-react';
import "react-datepicker/dist/react-datepicker.css";
import DashboardLayout from '../../src/components/Layout/DashboadLayout';
import Head from 'next/head';
import {connect} from 'react-redux';
import { autoBalancingIPLC } from '../../src/redux/_actions/auto-balancing-iplc/autoBalancingIPLC';
import _ from 'lodash';
import moment from "moment/moment";

class MainTable extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (<Table celled structured id="tblList">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Number</Table.HeaderCell>
                    <Table.HeaderCell>Route IPv6Route IPv6</Table.HeaderCell>
                    <Table.HeaderCell>IP next-hop</Table.HeaderCell>
                    <Table.HeaderCell>MP/CGNAT</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    this.props.listToDisplay.map((item, index, list) => {
                        return (
                            <Table.Row key={index}>
                                <Table.Cell key={'a'}>{index+1}</Table.Cell>
                                <Table.Cell key={'b'}>{item.ipv6}</Table.Cell>
                                <Table.Cell key={'c'}>{item.ipNextHop}</Table.Cell>
                                <Table.Cell key={'d'}>{item.nameNextHop}</Table.Cell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Body>
        </Table>);
    }
}

class Ipv6ToMpop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: {searchByName: ''},
            searchLoading: {searchByName: false},
            ipv6ToMpopData: [],
            // equalReportData: [],
            listToDisplay: [],
            listData: [],
        };
        this.handleChangeLogDate = this.handleChangeLogDate.bind(this);
    }

    searchTimeout = {};

    handleChangeLogDate(value) {
        console.log(value);
        let date = moment(value).format('YYYY-MM-DD');
        // this.props.dispatch(autoBalancingTransitPeering.getAllTimeInDay(date, value));
    }

    componentDidMount() {
        // this.setClassForDatePicker();
        if (_.size(this.state.ipv6ToMpopData)===0) {
            this.props.dispatch(autoBalancingIPLC.getIpv6ToMpopData());
        }
    }

    componentWillReceiveProps(nextProps) {
        const {ipv6ToMpopData} = nextProps;
        let listData = ipv6ToMpopData;
        console.log("a");
        console.log(listData);
        this.setState({
            ipv6ToMpopData: ipv6ToMpopData,
            listData: listData,
            listToDisplay: listData
        });
    }

    filter() {

        const searchByName = this.state.search['searchByName'];
        const filteredList = this.state.listData.filter(function (e) {
            return ((searchByName === '' || e.ipv6.toString().toLowerCase().includes(searchByName.toLowerCase()))
                || e.ipNextHop.toString().toLowerCase().includes(searchByName.toLowerCase())
                || e.nameNextHop.toString().toLowerCase().includes(searchByName.toLowerCase())
            );
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



    handleChangeSelect = (e, {name, value}) => {
        e.persist();

        const search = {...this.state.search};
        const searchLoading = {...this.state.searchLoading};
        search[name] = value;
        searchLoading[name] = true;
        this.setState({search, searchLoading});
    };

    render() {
        const { pageLoading, logDate } = this.props;
        const {
            search,
            searchLoading,
        } = this.state;

        return (
            <div id="div-page-auto-balancing-iplc">
                <Head>
                    <title> Auto Balancing Data </title>
                </Head>
                <DashboardLayout >
                    <Dimmer active={pageLoading} inverted>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>
                    <Segment>
                        <Header> Ipv6 to MPOP  </Header>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Input fluid label='Search by name' icon='search' placeholder="Search by name..."
                                            name='searchByName'
                                            loading={searchLoading['searchByName']}
                                            value={search['searchByName']} onChange={this.handleSearch.bind(this)}/>
                            </Grid.Column>
                            {/*<Grid.Column computer={2} largeScreen={2} tablet={4} moblie={8}>*/}
                            {/*<Form.Field>*/}
                            {/*<label>Choose log date</label>*/}
                            {/*<DatePicker*/}
                            {/*dateFormat="dd/MM/yyyy"*/}
                            {/*selected={logDate}*/}
                            {/*maxDate={new Date()}*/}
                            {/*onChange={this.handleChangeLogDate}*/}
                            {/*locale="en"*/}
                            {/*/>*/}
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

    // setClassForDatePicker() {
    //     const datePickerWrapper = document.querySelector('.react-datepicker-wrapper ');
    //     datePickerWrapper.classList.add("fluid");
    //
    //     const datePicker = document.querySelector('.react-datepicker-wrapper .react-datepicker__input-container');
    //     datePicker.classList.add("ui");
    //     datePicker.classList.add("input");
    //
    //     const datePickerInput = document.querySelector('.react-datepicker-wrapper .react-datepicker__input-container input');
    //     datePickerInput.style.width = "100%";
    // }
}

const mapStateToProps = ({autoBalancingIPLC}) => (autoBalancingIPLC);

export default connect(mapStateToProps, null)(Ipv6ToMpop);