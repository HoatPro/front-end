import React, {Component, Fragment} from 'react';
import {
    Table,
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
                    <Table.HeaderCell>Ingress Device</Table.HeaderCell>
                    <Table.HeaderCell>IPLC-Interface</Table.HeaderCell>
                    <Table.HeaderCell>IP next-hop</Table.HeaderCell>
                    <Table.HeaderCell>MP/CGNAT</Table.HeaderCell>
                    <Table.HeaderCell>Detail</Table.HeaderCell>
                    <Table.HeaderCell>MP/CGNAT-Rate(G)</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    this.props.listToDisplay.map((item, index, list) => {
                        return (
                            <Table.Row key={index}>
                                <Table.Cell key={'a'}>{item.name}</Table.Cell>
                                <Table.Cell key={'b'}>{item.interfaceName}</Table.Cell>

                                <Table.Cell key={'f'}>{item.listIpV6.map((miniItem, index)=> {
                                    return <Fragment key={index} > {miniItem.ipNextHop} <br/> </Fragment>;
                                })}</Table.Cell>
                                <Table.Cell key={'f'}>{item.listIpV6.map((miniItem, index)=> {
                                    return <Fragment key={index} > {miniItem.nameNextHop} <br/> </Fragment>;
                                })}</Table.Cell>

                                <Table.Cell key={'f'}>{item.listIpV6.map((miniItem, index)=> {
                                    return <Fragment key={index} ><b>Ipv6: </b> { miniItem.ipv6} <b> - Traffic: </b> { miniItem.traffic }<br/> </Fragment>;
                                })}</Table.Cell>
                                <Table.Cell key={'e'}>{Math.round(item.trafficKentik/1024, 2)}</Table.Cell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Body>
        </Table>);
    }
}

class IplcMpopByGwIpv6 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: {searchByName: ''},
            searchLoading: {searchByName: false},
            ipv6ToMpopData: [],
            equalReportData: [],
            listToDisplay: [],
            listData: [],
            iplcMpopByGwDataIpv6: []
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
        if (_.size(this.state.iplcMpopByGwDataIpv6)===0) {
            this.props.dispatch(autoBalancingIPLC.getIplcMpopByGwDataIpv6());
        }
    }

    componentWillReceiveProps(nextProps) {

        const {iplcMpopByGwDataIpv6} = nextProps;
        let listData = iplcMpopByGwDataIpv6;
        this.setState({
            iplcMpopByGwDataIpv6:iplcMpopByGwDataIpv6,
            listData: listData,
            listToDisplay: listData
        });
    }

    filter() {

        const searchByName = this.state.search['searchByName'];
        console.log(this.state.listData);
        const filteredList = this.state.listData.filter(function (e) {
            return (e.nameNextHop && (searchByName === '' || e.nameNextHop.toString().toLowerCase().includes(searchByName.toLowerCase()))
                || e.name.toString().toLowerCase().includes(searchByName.toLowerCase()));
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
                        <Header> IPLC MPOP by GW </Header>
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

export default connect(mapStateToProps, null)(IplcMpopByGwIpv6);