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
    Accordion,
    Menu,
    Message,
    Loader,
    Select,
    Form, Dropdown
} from 'semantic-ui-react';
import DashboardLayout from '../../src/components/Layout/DashboadLayout';
import IplcTrafficAttrFilterDropdown from '../../src/components/Dropdown/IplcTrafficAttrFilterDropdown';
import Head from 'next/head';
import Link from 'next/link';
import {connect} from 'react-redux';
import {getIplcTrafficOnTime, getIplcTrafficTimesOnDate} from '../../src/redux/_actions/iplc/trafficStatisticsA';
import _ from 'lodash';
import moment from 'moment';
import {toast} from "react-toastify";
import PropTypes from 'prop-types';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
                    <Table.HeaderCell>Index</Table.HeaderCell>
                    <Table.HeaderCell>Service</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Cid</Table.HeaderCell>
                    <Table.HeaderCell>Provider</Table.HeaderCell>
                    <Table.HeaderCell>A_End</Table.HeaderCell>
                    <Table.HeaderCell>A_End Port</Table.HeaderCell>
                    <Table.HeaderCell>A_End Location</Table.HeaderCell>
                    <Table.HeaderCell>B_End</Table.HeaderCell>
                    <Table.HeaderCell>B_End Port</Table.HeaderCell>
                    <Table.HeaderCell>B_End Location</Table.HeaderCell>
                    <Table.HeaderCell>Traffic (Gbps)</Table.HeaderCell>
                    <Table.HeaderCell>Capacity (Gbps)</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    this.props.listToDisplay.map((item, index, list) => {
                        return (
                            <Table.Row key={index}>
                                <Table.Cell style={{textAlign: 'center'}} key={'idx'}>{index + 1} </Table.Cell>
                                <Table.Cell key={'service'}>{item.service} </Table.Cell>
                                <Table.Cell key={'type'}>{item.type} </Table.Cell>
                                <Table.Cell key={'cid'}>{item.cid} </Table.Cell>
                                <Table.Cell key={'provider'}>{item.provider} </Table.Cell>
                                <Table.Cell key={'aEnd'}>{item.localName} </Table.Cell>
                                <Table.Cell key={'aEndPort'}>{item.localInterface} </Table.Cell>
                                <Table.Cell key={'aEndLocation'}>{item.localLocation} </Table.Cell>
                                <Table.Cell key={'bEnd'}>{item.neighborName} </Table.Cell>
                                <Table.Cell key={'bEndPort'}>{item.neighborInterface} </Table.Cell>
                                <Table.Cell key={'bEndLocation'}>{item.neighborLocation} </Table.Cell>
                                <Table.Cell style={{textAlign: "right"}}
                                            key={'traffic'}>
                                    {item.trafficIn}
                                </Table.Cell>
                                <Table.Cell style={{textAlign: "right"}}
                                            key={'speed'}>
                                    {item.speed}
                                </Table.Cell>

                            </Table.Row>
                        )
                    })
                }
            </Table.Body>
        </Table>)
            ;
    }
}

class TrafficStatistics extends Component {

    constructor(props) {
        super(props);

        this.state = this.getNewStateFromProps(props);
    }

    componentDidMount() {
        if (_.size(this.props.timeList) === 0) {

            let date = new Date();

            if (date.getHours() < 20 || date.getHours() == 20 && date.getMinutes() <= 30) {
                date.setDate(date.getDate() - 1);
            }

            this.props.dispatch(getIplcTrafficTimesOnDate(date));
        }

        this.setClassForDatePicker();
    }

    componentDidUpdate() {

    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.getNewStateFromProps(nextProps));
    }

    getNewStateFromProps(props) {
        const {listData} = props;

        const services = Array.from(new Set(listData.map(e => e.service)));
        const types = Array.from(new Set(listData.map(e => e.type)));
        const providers = Array.from(new Set(listData.map(e => e.provider)));
        const locations = Array.from(new Set(listData.map(e => e.neighborLocation)));
        const localLocations = Array.from(new Set(listData.map(e => e.localLocation)));

        let filteredList = listData;

        if (this.state && this.state.filterData) {
            const filterData = this.state.filterData;
            filteredList = this.filterList(listData, filterData.service, filterData.type, filterData.provider, filterData.location, filterData.localLocation);
        }

        return {
            search: {searchByName: ''},
            searchLoading: {searchByName: false},
            list: listData,
            filteredList: filteredList,
            services,
            types,
            locations,
            providers,
            localLocations,
            selectedService: -1,
            activeIndex: 0
        }
    }

    setClassForDatePicker() {
        const datePickerWrapper = document.querySelector('.react-datepicker-wrapper ');
        datePickerWrapper.classList.add("fluid");

        const datePicker = document.querySelector('.react-datepicker-wrapper .react-datepicker__input-container');
        datePicker.classList.add("ui");
        datePicker.classList.add("input");

        const datePickerInput = document.querySelector('.react-datepicker-wrapper .react-datepicker__input-container input');
        datePickerInput.style.width = "100%";
    }

    // filter() {
    //     const searchByName = this.state.search['searchByName'];
    //
    //     const filteredList = this.state.list.filter(function (e) {
    //
    //         const lowerCaseSearchByName = searchByName.trim().toLowerCase();
    //
    //         return ((e.name + '').toLowerCase().includes(lowerCaseSearchByName));
    //     });
    //
    //     this.setState({
    //         filteredList: filteredList,
    //         listToDisplay: filteredList,
    //         searchLoading: {
    //             searchByName: false,
    //         }
    //     });
    // }

    filterList = (list, service = -1, type = -1, provider = -1, location = -1, localLocation = -1) => {

        // params can be an array or single varible
        return list.filter(e => {
            return (service == -1 || e.service == service || (Array.isArray(service) && (service.includes(-1) || service.includes(e.service))))
                && (type == -1 || e.type == type || (Array.isArray(type) && (type.includes(-1) || type.includes(e.type))))
                && (provider == -1 || e.provider == provider || (Array.isArray(provider) && (provider.includes(-1) || provider.includes(e.provider))))
                && (location == -1 || e.neighborLocation == location || (Array.isArray(location) && (location.includes(-1) || location.includes(e.neighborLocation))))
                && (localLocation == -1 || e.localLocation == localLocation || (Array.isArray(localLocation) && (localLocation.includes(-1) || localLocation.includes(e.localLocation))));
        });
    };

    handleChangeDate = (e) => {
        this.props.dispatch(getIplcTrafficTimesOnDate(e));
    };

    handleChangeTime = (e, {name, value}) => {
        this.props.dispatch(getIplcTrafficOnTime(value));
    };

    // handleSearch(e) {
    //     const {name, value} = e.target;
    //     const search = {...this.state.search};
    //     const searchLoading = {...this.state.searchLoading};
    //     search[name] = value;
    //     searchLoading[name] = true;
    //
    //     clearTimeout(this.searchTimeout[name]);
    //     this.setState({search, searchLoading});
    //
    //     this.searchTimeout[name] = setTimeout(() => {
    //         this.filter();
    //     }, 500);
    // }

    handleChangeService = (e, {name}) => {
        this.setState({
            selectedService: (name === 'All' ? -1 : name)
        });
    };

    // handleClickAccordion = (e, titleProps) => {
    //     const {index} = titleProps;
    //     const {activeIndex} = this.state;
    //     const newIndex = activeIndex === index ? -1 : index;
    //
    //     this.setState({activeIndex: newIndex})
    // };

    handleSearch = (filterData) => {
        const filteredList = this.filterList(this.state.list, filterData.service, filterData.type, filterData.provider, filterData.location, filterData.localLocation);

        toast.success(`${filteredList.length} items found`);

        this.setState({
            filteredList,
            filterData
        })
    };

    sumByAttr(list, attr) {

        // console.log(list);

        let sum = 0;
        for (const item of list) {
            sum += item[attr];
        }
        return sum;
    }

    renderPortListTable() {

        const {filteredList} = this.state;
        const trafficUsed = this.sumByAttr(filteredList, 'trafficIn');
        const capacity = this.sumByAttr(filteredList, 'speed');
        const usedPercent = capacity == 0 ? '-' : (trafficUsed / capacity * (100/0.9)).toFixed(2);

        return (
            <React.Fragment>
                <IplcTrafficAttrFilterDropdown
                    onSearch={this.handleSearch}
                />
                {
                    filteredList.length != 0 ?
                        <Fragment>
                            <Message info>
                                <Message.Header
                                    style={{textAlign: "center"}}>
                                    {trafficUsed.toFixed(2)}/{capacity.toFixed(2)}({usedPercent}%)
                                </Message.Header>
                            </Message>
                            <MainTable
                                onTableDidUpdate={() => {
                                    this.setState({pageLoading: false})
                                }}
                                listToDisplay={filteredList}
                                changeTextArea={this.changeTextArea}
                            />
                        </Fragment> :
                        <Fragment>
                            <Message warning>
                                <Message.Header
                                    style={{textAlign: "center"}}>
                                    There are no existing items
                                </Message.Header>
                            </Message>
                        </Fragment>
                }
            </React.Fragment>
        )
    }

    renderStatisticalTable() {
        const {
            services,
            locations,
            types,
            list,
            localLocations,
            selectedService,
        } = this.state;

        return (
            <Fragment>
                <Menu secondary>
                    {[-1, ...services].map(e => (
                        <Menu.Item name={e == -1 ? 'All' : e} active={e == selectedService}
                                   onClick={this.handleChangeService}/>
                    ))}
                </Menu>
                <Table celled className="statistical-table">
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>

                            </Table.Cell>
                            {
                                locations.map(location => (
                                    <Table.Cell className="header" colSpan="3">
                                        {location}
                                    </Table.Cell>
                                ))
                            }
                            <Table.Cell className="header" colSpan="3">
                                Sum
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>

                            </Table.Cell>
                            {
                                [...locations, 'Sum'].map(location => (
                                    <React.Fragment>
                                        <Table.Cell className="header">
                                            Traffic
                                        </Table.Cell>
                                        <Table.Cell className="header">
                                            Capacity
                                        </Table.Cell>
                                        <Table.Cell className="header">
                                            %
                                        </Table.Cell>
                                    </React.Fragment>

                                ))
                            }
                        </Table.Row>

                        {/*Types and proviceders statisctis*/}

                        {
                            types.map(type => {

                                const rows = [];

                                let sumTraffic = this.sumByAttr(this.filterList(list, selectedService, type, -1, -1), 'trafficIn');
                                let sumCapacity = this.sumByAttr(this.filterList(list, selectedService, type, -1, -1), 'speed');
                                let sumUsedPercent = sumTraffic / sumCapacity * (100/0.9);

                                rows.push(
                                    <Table.Row>
                                        <Table.Cell className="vertical-header">
                                            {type}
                                        </Table.Cell>
                                        {
                                            locations.map(location => {

                                                let traffic = this.sumByAttr(this.filterList(list, selectedService, type, -1, location), 'trafficIn');
                                                let capacity = this.sumByAttr(this.filterList(list, selectedService, type, -1, location), 'speed');
                                                let usedPercent = traffic / capacity * (100/0.9);

                                                return (
                                                    <React.Fragment>
                                                        <Table.Cell>
                                                            {traffic.toFixed(2)}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {capacity.toFixed(2)}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {capacity != 0 ? usedPercent.toFixed(2) + '%' : '-'}
                                                        </Table.Cell>
                                                    </React.Fragment>
                                                )
                                            })
                                        }
                                        <Table.Cell>
                                            {sumTraffic.toFixed(2)}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {sumCapacity.toFixed(2)}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {sumUsedPercent.toFixed(2)}%
                                        </Table.Cell>
                                    </Table.Row>
                                );

                                const ports = this.filterList(list, selectedService, type, -1, -1);
                                let providers = Array.from(new Set(ports.map(port => port.provider)));

                                for (let provider of providers) {

                                    let sumTraffic = this.sumByAttr(this.filterList(list, selectedService, type, provider, -1), 'trafficIn');
                                    let sumCapacity = this.sumByAttr(this.filterList(list, selectedService, type, provider, -1), 'speed');
                                    let sumUsedPercent = sumTraffic / sumCapacity * (100/0.9);

                                    rows.push(
                                        <Table.Row>
                                            <Table.Cell className="vertical-sub-header">
                                                {provider}
                                            </Table.Cell>
                                            {
                                                locations.map(location => {
                                                    let traffic = this.sumByAttr(this.filterList(list, selectedService, type, provider, location), 'trafficIn');
                                                    let capacity = this.sumByAttr(this.filterList(list, selectedService, type, provider, location), 'speed');
                                                    let usedPercent = traffic / capacity * (100/0.9);

                                                    return (
                                                        <React.Fragment>
                                                            <Table.Cell>
                                                                {traffic.toFixed(2)}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {capacity.toFixed(2)}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {capacity != 0 ? usedPercent.toFixed(2) + '%' : '-'}
                                                            </Table.Cell>
                                                        </React.Fragment>
                                                    )
                                                })
                                            }
                                            <Table.Cell>
                                                {sumTraffic.toFixed(2)}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {sumCapacity.toFixed(2)}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {sumUsedPercent.toFixed(2)}%
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                }

                                return rows;
                            })
                        }

                        {/*Start location statisctis*/}

                        {
                            localLocations.map(localLocation => {
                                let sumTraffic = this.sumByAttr(this.filterList(list, selectedService, -1, -1, -1, localLocation), 'trafficIn');
                                let sumCapacity = this.sumByAttr(this.filterList(list, selectedService, -1, -1, -1, localLocation), 'speed');
                                let sumUsedPercent = sumTraffic / sumCapacity * (100/0.9);

                                return (
                                    <Table.Row>
                                        <Table.Cell className="vertical-header">
                                            {localLocation}
                                        </Table.Cell>
                                        {
                                            locations.map(location => {

                                                let traffic = this.sumByAttr(this.filterList(list, selectedService, -1, -1, location, localLocation), 'trafficIn');
                                                let capacity = this.sumByAttr(this.filterList(list, selectedService, -1, -1, location, localLocation), 'speed');
                                                let usedPercent = traffic / capacity * (100/0.9);

                                                return (
                                                    <React.Fragment>
                                                        <Table.Cell>
                                                            {traffic.toFixed(2)}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {capacity.toFixed(2)}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {capacity != 0 ? usedPercent.toFixed(2) + '%' : '-'}
                                                        </Table.Cell>
                                                    </React.Fragment>
                                                )
                                            })
                                        }
                                        <Table.Cell>
                                            {sumTraffic.toFixed(2)}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {sumCapacity.toFixed(2)}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {sumUsedPercent.toFixed(2)}%
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })
                        }

                        {/*Sum statisctis*/}

                        {
                            (() => {
                                {
                                    let sumTraffic = this.sumByAttr(this.filterList(list, selectedService, -1, -1, -1, -1), 'trafficIn');
                                    let sumCapacity = this.sumByAttr(this.filterList(list, selectedService, -1, -1, -1, -1), 'speed');
                                    let sumUsedPercent = sumTraffic / sumCapacity * (100/0.9);

                                    return (
                                        <Table.Row className="sum-row">
                                            <Table.Cell className="sum-row-header">
                                                Sum
                                            </Table.Cell>
                                            {
                                                locations.map(location => {

                                                    let traffic = this.sumByAttr(this.filterList(list, selectedService, -1, -1, location, -1), 'trafficIn');
                                                    let capacity = this.sumByAttr(this.filterList(list, selectedService, -1, -1, location, -1), 'speed');
                                                    let usedPercent = traffic / capacity * (100/0.9);

                                                    return (
                                                        <React.Fragment>
                                                            <Table.Cell>
                                                                {traffic.toFixed(2)}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {capacity.toFixed(2)}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {capacity != 0 ? usedPercent.toFixed(2) + '%' : '-'}
                                                            </Table.Cell>
                                                        </React.Fragment>
                                                    )
                                                })
                                            }
                                            <Table.Cell>
                                                {sumTraffic.toFixed(2)}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {sumCapacity.toFixed(2)}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {sumUsedPercent.toFixed(2)}%
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                }
                            })()
                        }
                    </Table.Body>
                </Table>
            </Fragment>
        )
    }

    render() {
        const {listData, pageLoading, date, timeList, selectedTime, maxTrafficTime} = this.props;

        // console.log(this.filterList(list, 'General', -1, -1, -1));

        const {
            search,
            searchLoading,
            list = [],
            filtedList = [],
            listToDisplay = [],
            services,
            locations,
            types,
            localLocations,
            selectedService,
            activeIndex,
        } = this.state;

        return (
            <div id="div-page-iplc-traffic-statistics">
                <Head>
                    <title> IPLC Traffic </title>
                </Head>
                <DashboardLayout>
                    <Dimmer active={pageLoading} inverted>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>
                    <Segment>
                        <Header> IPLC Traffic</Header>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={2} largeScreen={2} tablet={5} moblie={8}>
                                <Form.Field>
                                    <label>Choose date</label>
                                    <DatePicker
                                        dateFormat="dd/MM/yyyy"
                                        selected={date}
                                        locale="en"
                                        maxDate={new Date()}
                                        onChange={this.handleChangeDate}
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Field>
                                    <label>Choose time</label>
                                    <Dropdown
                                        placeholder="Choose time"
                                        fluid
                                        search
                                        selection
                                        name="selectedTime"
                                        value={selectedTime}
                                        options={timeList.map(e => ({
                                            key: e,
                                            value: e,
                                            text: moment(e).format("YYYY-MM-DD HH:mm:ss") + (e == maxTrafficTime ? '(max)' : '')
                                        }))}
                                        onChange={this.handleChangeTime}
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid>
                        {
                            (Array.isArray(listData) && listData.length != 0) ?
                                <Accordion defaultActiveIndex={[0]} panels={[
                                    {key: 'panel-0', title: 'Overview', content: [this.renderStatisticalTable()]},
                                    {key: 'panel-1', title: 'Port list', content: [this.renderPortListTable()]},
                                ]}
                                           exclusive={false} fluid
                                />
                                : <Message warning>
                                    <Message.Header>
                                        There is no existed items!
                                    </Message.Header>
                                </Message>
                        }


                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({iplcTrafficStatistics}) => (iplcTrafficStatistics);

export default connect(mapStateToProps, null)(TrafficStatistics);