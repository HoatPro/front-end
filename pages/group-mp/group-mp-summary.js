import React, {Component, Fragment} from 'react';
import {toast} from "react-toastify";
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

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import DashboardLayout from '../../src/components/Layout/DashboadLayout';
import CustomTable from '../../src/components/Table/Table';
import Head from 'next/head';
import Link from 'next/link';
import {connect} from 'react-redux';
import {groupMPSummaryA} from '../../src/redux/_actions/groupMP/groupMPSummaryA';
import _ from 'lodash';
import moment from 'moment';
import XLSX from "xlsx";
import * as dataAnalyzer from '../../src/helpers/data-analyzer.js';
import analyzerConstants from '../../src/constants/analyzer';
import appConstants from '../../src/constants/app';

class MyTableRow extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        let result = (!_.isEqual(nextProps, this.props));
        return result;
    }

    render() {
        let item = this.props.dataToRender;
        let classes = this.props.classes;
        let onChangeText = this.props.onChangeText;

        let backgroundColor = '#88ff82';
        let originalBackgroundColor  = '#88ff82';

        if (item.warningStatus == analyzerConstants.WARNING_STATUS.WARNING) {
            backgroundColor = '#f49e42';
        }
        else if (item.warningStatus == analyzerConstants.WARNING_STATUS.CRITICAL) {
            backgroundColor = '#f47373';
        }

        if (item.originalWarningStatus == analyzerConstants.WARNING_STATUS.WARNING) {
            originalBackgroundColor = '#f49e42';
        }
        else if (item.originalWarningStatus == analyzerConstants.WARNING_STATUS.CRITICAL) {
            originalBackgroundColor = '#f47373';
        }

        return (
            <Table.Row>
                <Table.Cell style={{backgroundColor: backgroundColor}}
                            key={'a'}>{item['a']} </Table.Cell>
                <Table.Cell style={{backgroundColor: backgroundColor}}
                            key={'b'}>{item['b']} </Table.Cell>
                <Table.Cell style={{backgroundColor: originalBackgroundColor}}
                            key={'c'}>{item['c']} </Table.Cell>
                {
                    item.indexMpOfSubSubGroup == 0 ? (
                        <Table.Cell rowSpan={item.numberMpOfSubSubGroup}
                                    key={'sumD'}>{item['sumD']} </Table.Cell>) : null
                }
                {
                    item.indexMpOfSubSubGroup == 0 ? (
                        <Table.Cell rowSpan={item.numberMpOfSubSubGroup}
                                    key={'sumE'}>{item['sumE']} </Table.Cell>) : null
                }
                {
                    item.indexMpOfSubSubGroup == 0 ? (
                        <Table.Cell rowSpan={item.numberMpOfSubSubGroup}
                                    key={'sumF'}>{item['sumF']} </Table.Cell>) : null
                }
                {
                    item.indexMpOfSubSubGroup == 0 ? (
                        <Table.Cell rowSpan={item.numberMpOfSubSubGroup}
                                    key={'sumG'}>{item['sumG']} </Table.Cell>) : null
                }
                {
                    item.indexMpOfSubSubGroup == 0 ? (
                        <Table.Cell rowSpan={item.numberMpOfSubSubGroup}
                                    key={'sumH'}>{item['sumH']} </Table.Cell>) : null
                }
                <Table.Cell key={'i'}>{item['i']} </Table.Cell>
                {
                    item.indexMpOfSubSubGroup == 0 ? (
                        <Table.Cell rowSpan={item.numberMpOfSubSubGroup}
                                    key={'sumJ'}>{item['sumJ']} </Table.Cell>) : null
                }
                <Table.Cell key={'ab'}>{item['ab']} </Table.Cell>
                <Table.Cell key={'ac'}>{item['ac']} </Table.Cell>
                <Table.Cell key={'ad'}>{item['ad']} </Table.Cell>
                <Table.Cell key={'ae'}>{item['ae']} </Table.Cell>
                {
                    item.indexMpOfSubSubGroup == 0 ?
                        (<Table.Cell key={'action'} rowSpan={item.numberMpOfSubSubGroup}>
                            <textarea rows={3}
                                      type="text"
                                      className={"plan-content"}
                                      data-mpname={item['c']}
                                      onChange={onChangeText}
                                      value={item['action']}
                                      data-plancontenttype={'action'}>
                            </textarea>
                        </Table.Cell>) : null
                }
                {
                    item.indexMpOfSubSubGroup == 0 ?
                        (<Table.Cell key={'deadline'} rowSpan={item.numberMpOfSubSubGroup}>
                           <textarea rows={3} type="text" className={"plan-content"}
                                     data-mpname={item['c']}
                                     onChange={onChangeText}
                                     value={item['deadline']}
                                     data-plancontenttype={'deadline'}>
                           </textarea>
                        </Table.Cell>) : null
                }
                {
                    item.indexMpOfSubSubGroup == 0 ?
                        (<Table.Cell key={'assignment'} rowSpan={item.numberMpOfSubSubGroup}>
                            <textarea rows={3} type="text" className={"plan-content"}
                                      data-mpname={item['c']}
                                      onChange={onChangeText}
                                      value={item['assignment']}
                                      data-plancontenttype={'assignment'}>
                            </textarea>
                        </Table.Cell>) : null
                }
                <Table.Cell
                    key={'next2MonthsPlanUplink'}>{item['next2MonthsPlanUplink']} </Table.Cell>
                <Table.Cell
                    key={'next2MonthsPlanDownlink'}>{item['next2MonthsPlanDownlink']} </Table.Cell>
                <Table.Cell
                    key={'next2MonthsPlanEqual'}>{item['next2MonthsPlanEqual']} </Table.Cell>
                <Table.Cell
                    key={'next2MonthsPlanB2B'}>{item['next2MonthsPlanB2B']} </Table.Cell>
            </Table.Row>);
    }
}

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

        const {listToDisplay} = this.props;

        return (<Table celled structured id="tblList">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell rowSpan={3}>Vùng</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={3}>Group MP</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={3}>MP</Table.HeaderCell>
                    <Table.HeaderCell colSpan={7}>Existing CCU and BW </Table.HeaderCell>
                    <Table.HeaderCell colSpan={4} rowSpan={2}>Links to add (convert 10G links)</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={3}>Action</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={3}>Deadline</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={3}>Assignment</Table.HeaderCell>
                    <Table.HeaderCell colSpan={4} rowSpan={2}>Next 2 months</Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell colSpan={3}>Max CCU</Table.HeaderCell>
                    <Table.HeaderCell colSpan={4}>Max BW (Gb)</Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell rowSpan={1}>IPv4</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={1}>IPv6</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={1}>NAT</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={1}>Uplink</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={1}>Downlink</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={1}>Equal</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={1}>B2B</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={1}>Uplink</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={1}>Downlink</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={1}>Equal</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={1}>B2B</Table.HeaderCell>
                    {/*------next three months-----------*/}
                    <Table.HeaderCell rowSpan={1}>Uplink</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={1}>Downlink</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={1}>Equal</Table.HeaderCell>
                    <Table.HeaderCell rowSpan={1}>B2B</Table.HeaderCell>
                </Table.Row>

            </Table.Header>
            <Table.Body>
                {
                    listToDisplay.map((item, index, list) => {
                        let sameMpSubSubGroupList = dataAnalyzer.getSameMpSubSubGroupList(list, item, 'c', 'b');
                        let indexMpOfSubSubGroup = sameMpSubSubGroupList.idx;
                        let numberMpOfSubSubGroup = sameMpSubSubGroupList.list.length;

                        return (
                            <MyTableRow onChangeText={this.props.changeTextArea}
                                        dataToRender={{indexMpOfSubSubGroup, numberMpOfSubSubGroup, ...item}}
                                        key={index}>
                            </MyTableRow>
                        )
                    })
                }
            </Table.Body>
        </Table>);
    }
}

class GroupMPSummary extends Component {

    searchTimeout = {};

    constructor(props) {
        super(props);

        this.state = {
            search: {searchByName: '', searchByRegion: -1},
            searchLoading: {searchByName: false, searchByRegion: false},
        };

        const state = this.getStateFromProps(props);
        this.state = state;

        this.handleChangIncreasingPercent = this.handleChangIncreasingPercent.bind(this);
    }

    componentDidMount() {
        if (_.size(this.props.allGroupMpDetail) === 0) {
            this.props.dispatch(groupMPSummaryA.getGroupMPSummaryContent(new Date(), this.props.increasingPercent));
        }

        this.setClassForDatePicker();
    }

    componentDidUpdate() {
        this.setClassForDatePicker();
    }

    componentWillReceiveProps(nextProps) {

        const state = this.getStateFromProps(nextProps);
        this.setState(state);
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

    getStateFromProps(props) {
        const {planContent, allGroupMpDetail} = props;
        let listRow = allGroupMpDetail;

        // listRow = listRow.filter(function (e) { //filter unwanted items
        //     return (e.ab > 0 || e.ad > 0 || e.ae > 0);
        // });

        for (let item of listRow) {
            let mpName = item.c;

            let action = '', deadline = '', assignment = '';

            try {
                action = planContent.list[mpName]['action'];
                deadline = planContent.list[mpName]['deadline'];
                assignment = planContent.list[mpName]['assignment'];
            }
            catch (e) {
            }

            item.action = action;
            item.deadline = deadline;
            item.assignment = assignment;
        }

        listRow.sort(function (a, b) {
            if (dataAnalyzer.isGreaterWaringStatus(a.warningStatus, b.warningStatus) || (a.warningStatus == b.warningStatus && a.c < b.c))
                return -1;
            return 1;
        });

        const searchByName = this.state.search['searchByName'];
        const searchByRegion = this.state.search['searchByRegion'];
        const list = listRow;

        const filteredList = this.filter(list, searchByName, searchByRegion);

        return {
            ...this.state,
            list: listRow,
            filteredList: filteredList,
            listToDisplay: filteredList,
        };
    };

    filter(list, searchByName, searchByRegion) {

        const filteredList = list.filter(function (e) {
            return ((searchByRegion == -1 || e.a === searchByRegion) && (searchByName === '' || e.c.toString().toLowerCase().includes(searchByName.toLowerCase())));
        });

        return filteredList;
    }

    changeTextArea = event => {
        let newListToDisplay = _.cloneDeep(this.state.listToDisplay);
        let newFilteredList = _.cloneDeep(this.state.filteredList);
        let newList = _.cloneDeep(this.state.list);
        let el = event.target;
        let mpName = el.dataset['mpname'];
        let contentType = el.dataset['plancontenttype'];
        let text = el.value;

        function updateText(list) {
            for (let item of list) {
                if (item.c == mpName) {
                    const sameGroup = dataAnalyzer.getSameMpSubSubGroupList(list, item, 'c', 'b').list;

                    for (let e of sameGroup) {
                        if (contentType == 'action')
                            e.action = text;
                        else if (contentType == 'deadline')
                            e.deadline = text;
                        else if (contentType == 'assignment')
                            e.assignment = text;
                    }
                    break;
                }
            }
        }

        try {
            updateText(newList);
            updateText(newFilteredList);
            updateText(newListToDisplay);
        }
        catch (e) {
            console.log(e);
        }

        this.setState({
            list: newList,
            filteredList: newFilteredList,
            listToDisplay: newListToDisplay
        });

    };

    handleChangePlanContent = (event) => {
        let list = {};

        for (let item of this.state.list) {
            list[item.c] = {
                action: item.action,
                deadline: item.deadline,
                assignment: item.assignment
            };
        }

        this.props.dispatch(groupMPSummaryA.savePlan(this.props.date, list));
    };

    handleSearch(e) {
        const {name, value} = e.target;
        const search = {...this.state.search};
        const searchLoading = {...this.state.searchLoading};
        search[name] = value;
        searchLoading[name] = true;

        clearTimeout(this.searchTimeout[name]);
        this.setState({search, searchLoading});

        this.searchTimeout[name] = setTimeout(() => {
            const searchByName = this.state.search['searchByName'];
            const searchByRegion = this.state.search['searchByRegion'];
            const list = this.state.list;
            const filteredList = this.filter(list, searchByName, searchByRegion);
            this.setState({
                filteredList: filteredList,
                listToDisplay: filteredList,
                searchLoading: {
                    searchByName: false,
                    searchByRegion: false
                }
            });
        }, 500);
    }

    handleChangeDate(e) {
        this.props.dispatch(groupMPSummaryA.getGroupMPSummaryContent(e, this.props.increasingPercent));
    }

    handleChangIncreasingPercent(event, target) {
        const increasingPercent = target.value;
        if (!increasingPercent || isNaN(increasingPercent)) {
            toast.error('Invalid value');
        }
        else {
            this.props.dispatch(groupMPSummaryA.getGroupMPSummaryContent(this.props.date, increasingPercent));
        }
    }

    handleSearchByRegion(event, target) {
        const name = 'searchByRegion';
        const value = target.value;

        const search = {...this.state.search};
        const searchLoading = {...this.state.searchLoading};
        search[name] = value;
        searchLoading[name] = true;

        clearTimeout(this.searchTimeout[name]);
        this.setState({search, searchLoading});

        this.searchTimeout[name] = setTimeout(() => {
            const searchByName = this.state.search['searchByName'];
            const searchByRegion = this.state.search['searchByRegion'];
            const list = this.state.list;
            const filteredList = this.filter(list, searchByName, searchByRegion);
            this.setState({
                filteredList: filteredList,
                listToDisplay: filteredList,
                searchLoading: {
                    searchByName: false,
                    searchByRegion: false
                }
            });
        }, 100);
    }

    exportExcel = () => {
        let wb = XLSX.utils.book_new();

        wb = XLSX.utils.table_to_book(document.getElementById('tblList'), {raw: true});

        if (!wb.Props)
            wb.Props = {};

        wb.Props.Author = 'noc-ast';

        XLSX.writeFile(wb, `Summary_${moment(this.props.date).format("YYYY_MM_DD")}.xlsx`);
    };

    render() {
        const {listData, pageLoading, date, increasingPercent} = this.props;
        const {
            search,
            searchLoading,
            pagination = {currentPage: 0, countPage: 1},
            list = [],
            filteredList = [],
            listToDisplay = [],
        } = this.state;

        return (
            <div id="div-page-group-mp-summary">
                <Head>
                    <title> Group MP Summary </title>
                </Head>
                <DashboardLayout>
                    <Dimmer active={pageLoading} inverted>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>
                    <Segment>
                        <Header> Group MP Summary</Header>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={2} largeScreen={2} tablet={5} moblie={8}>
                                <Form.Field>
                                    <label>Choose date</label>
                                    <DatePicker
                                        dateFormat="dd/MM/yyyy"
                                        selected={date}
                                        maxDate={new Date()}
                                        onChange={this.handleChangeDate.bind(this)}
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column computer={2} largeScreen={2} tablet={4} moblie={8}>
                                <Form.Input fluid label='Increasing percent' placeholder="" type="number"
                                            value={increasingPercent}
                                            onChange={this.handleChangIncreasingPercent}>
                                </Form.Input>
                            </Grid.Column>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Input fluid label='Search by name' icon='search' placeholder="Search by name..."
                                            name='searchByName'
                                            loading={searchLoading['searchByName']}
                                            value={search['searchByName']} onChange={this.handleSearch.bind(this)}/>
                            </Grid.Column>
                            <Grid.Column computer={2} largeScreen={2} tablet={4} moblie={8}>
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
                                    <Button fluid onClick={this.exportExcel.bind(this)}>Export to excel file</Button>
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Form.Field>
                                    <label>Save</label>
                                    <Button fluid onClick={this.handleChangePlanContent.bind(this)}>Save plan</Button>
                                </Form.Field>
                            </Grid.Column>
                        </Grid>
                    </Segment>

                    <Segment className="list">
                        <MainTable onTableDidUpdate={() => {
                            this.setState({pageLoading: false})
                        }} listToDisplay={this.state.listToDisplay}
                                   changeTextArea={this.changeTextArea}
                        />
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({groupMPSummary}) => (groupMPSummary);

export default connect(mapStateToProps, null)(GroupMPSummary);