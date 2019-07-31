import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Button,
    Icon,
    Label,
    Table,
    Input,
    Select,
    Tab,
    Header,
    Grid,
    Segment,
    Dimmer,
    Loader,
    Form,
    Dropdown
} from 'semantic-ui-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DashboardLayout from '../../src/components/Layout/DashboadLayout';
import Head from 'next/head';
import {connect} from 'react-redux';
import {autoBalancingTransitPeering} from '../../src/redux/_actions/auto-balancing-transit-peering/autoBalancingTransitPeering';
import _ from 'lodash';
import moment from "moment/moment";
import {getAllIrbName, getDataForGraph} from '../../src/helpers/autoBalancing-analyzer';
import {toast} from "react-toastify";

class GraphSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graphOption: {
                legend: {},
                tooltip: {
                    trigger: 'axis',
                    showContent: false
                },
                dataset: {
                    source: []
                },
                xAxis: {type: 'category'},
                yAxis: {gridIndex: 0},
                grid: {top: '55%'},
                series: []
            }
        };
    }

    componentDidMount() {
        const listDateWrapper = document.getElementsByClassName('react-datepicker-wrapper');
        for (let item of listDateWrapper) {
            item.classList.add("fluid");
        }

        const listDatePicker = document.getElementsByClassName('react-datepicker__input-container');
        for (let item of listDatePicker) {
            item.classList.add("ui");
            item.classList.add("input");
        }

        const listDatePickerInput = document.querySelectorAll('.react-datepicker-wrapper .react-datepicker__input-container input');
        for (let item of listDatePickerInput) {
            item.style.width = "100%";
        }
    }

    getOption(dataSummaryGraph) {
        let source = [];

        let listTime = ["Time"];
        let listRed = ["Critical"];
        let listOrange = ["Warning"];
        let listGreen = ["OK"];

        let timeCheck = moment(dataSummaryGraph[0].time).format("YYYY-MM-DD");
        let countInDay = 0;

        let objRed = 0;
        let objGreen = 0;
        let objOrange = 0;

        for (let i = 0; i < dataSummaryGraph.length; i++) {
            let item = dataSummaryGraph[i];
            let time = moment(item.time).format("YYYY-MM-DD");
            //check same day
            if (moment(time).isSame(timeCheck)) {
                countInDay += 1;
                objRed += item.percentRedIn;
                objOrange += item.percentOrangeIn;
                objGreen += item.percentGreenIn;
            }
            else {
                listTime.push(timeCheck);
                listRed.push(objRed / countInDay);
                listOrange.push(objOrange / countInDay);
                listGreen.push(objGreen / countInDay);

                timeCheck = moment(item.time).format("YYYY-MM-DD");
                countInDay = 1;

                objRed = 0;
                objGreen = 0;
                objOrange = 0;

                objRed += item.percentRedIn;
                objOrange += item.percentOrangeIn;
                objGreen += item.percentGreenIn;
            }
        }
        //need push last day to array
        listTime.push(timeCheck);
        listRed.push(objRed / countInDay);
        listOrange.push(objOrange / countInDay);
        listGreen.push(objGreen / countInDay);

        source = [listTime, listGreen, listOrange, listRed];
        let option = {
            legend: {},
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            title: {
                text: this.props.type,

            },
            dataset: {
                source: source
            },
            color: ['green', 'orange', 'red', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
            xAxis: {type: 'category'},
            yAxis: {gridIndex: 0},
            grid: {top: '55%'},
            series: [
                {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                {
                    type: 'pie',
                    id: 'pie',
                    radius: '30%',
                    center: ['50%', '25%'],
                    label: {
                        formatter: '{b}: {@' + listTime[1] + '} ({d}%)'
                    },
                    encode: {
                        itemName: 'Time',
                        value: listTime[1],
                        tooltip: listTime[1]
                    }
                }
            ]
        };
        return option;
    }

    updateAxisPointer(event, chart) {
        let xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
            let dimension = xAxisInfo.value + 1;
            let option = {
                series: {
                    id: 'pie',
                    label: {
                        formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                    },
                    encode: {
                        value: dimension,
                        tooltip: dimension
                    }
                }
            };
            chart.setOption(option);
        }
    }

    onChartReadyCallback() {
        const divGraph = document.querySelectorAll('.echarts-for-react');
        for (let item of divGraph) {
            item.style.height = "700px";
        }
    }


    render() {
        let onEvents = {
            'updateAxisPointer': this.updateAxisPointer
        };
        if (this.props.dataSummaryGraph.length === 0) {
            return null;
        }
        else {
            return (<Grid.Column width={8}>
                <ReactEcharts fluid
                              option={this.getOption(this.props.dataSummaryGraph)}
                              notMerge={true}
                              lazyUpdate={true}
                    // theme={"dark"}
                              onChartReady={this.onChartReadyCallback}
                              onEvents={onEvents}/>
            </Grid.Column>);
        }

    }

}

class GraphDetail extends Component {
    constructor(props) {
        super(props);


    }

    getOption(dataDetailGraph, irbDetail, direction) {
        let dataGraph = dataDetailGraph.data.filter(function (a) {
            return a.irbDetail === irbDetail
        });
        let listDate = dataDetailGraph.date;
        let seriesData = [];
        let legendData = [];
        for (let item of dataGraph) {
            legendData.push(item.irbName);
            let _data = [];
            if (direction === "in") {
                _data = item.listPercentTrafficIn
            }
            else {
                _data = item.listPercentTrafficOut
            }
            seriesData.push({
                name: item.irbName,
                type: 'line',
                data: _data,
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                }
            })
        }
        let option = {
            backgroundColor: '#21202D',
            legend: {
                data: legendData,
                inactiveColor: '#777',
                textStyle: {
                    color: '#fff'
                }
            },
            title: {
                text: this.props.irbDetail + " - " + this.props.direction.toUpperCase() + "PUT",
                left: 10,
                textStyle: {
                    color: 'white'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: false,
                    type: 'cross',
                    lineStyle: {
                        color: '#376df4',
                        width: 2,
                        opacity: 1
                    }
                }
            },
            xAxis: {
                type: 'category',
                data: listDate,
                axisLine: {lineStyle: {color: '#8392A5'}}
            },
            yAxis: {
                scale: true,
                axisLine: {lineStyle: {color: '#8392A5'}},
                splitLine: {show: false}
            },
            grid: {
                bottom: 80
            },
            dataZoom: [{
                textStyle: {
                    color: '#8392A5'
                },
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                dataBackground: {
                    areaStyle: {
                        color: '#8392A5'
                    },
                    lineStyle: {
                        opacity: 0.8,
                        color: '#8392A5'
                    }
                },
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }, {
                type: 'inside'
            }],
            animation: false,
            series: seriesData

        };

        return option;
    }

    onChartReadyCallback() {
        const divGraph = document.querySelectorAll('.echarts-for-react');
        for (let item of divGraph) {
            item.style.height = "700px";
        }
    }

    componentDidMount() {
        const listDateWrapper = document.getElementsByClassName('react-datepicker-wrapper');
        for (let item of listDateWrapper) {
            item.classList.add("fluid");
        }

        const listDatePicker = document.getElementsByClassName('react-datepicker__input-container');
        for (let item of listDatePicker) {
            item.classList.add("ui");
            item.classList.add("input");
        }

        const listDatePickerInput = document.querySelectorAll('.react-datepicker-wrapper .react-datepicker__input-container input');
        for (let item of listDatePickerInput) {
            item.style.width = "100%";
        }
    }

    render() {

        if (this.props.dataDetailGraph.length === 0) {
            return null;
        }
        else {
            let dataDetailGraph = this.props.dataDetailGraph;
            let irbName = this.props.irbName;
            let direction = this.props.direction;
            return (<Grid.Column width={8}>
                <ReactEcharts fluid
                              option={this.getOption(dataDetailGraph, irbName, direction)}
                              notMerge={true}
                              lazyUpdate={true}
                              onChartReady={this.onChartReadyCallback}
                    // onEvents={onEvents}
                />
            </Grid.Column>);
        }

    }

}

class graphFlowHistory extends Component {
    constructor(props) {
        super(props);
        const {logDateGraphFrom, logDateGraphTo} = props;
        this.state = {
            search: {searchByName: ''},
            searchLoading: {searchByName: false},
            listNameIrb: [],
            logDateGraphFrom: logDateGraphFrom,
            logDateGraphTo: logDateGraphTo,
            dataSummaryGraph: [],
            dataDetailGraph: [],
            pageLoading: false,
            valueDropDownType: "",
            valueDropDownName: "",
            direction: "in",
            dataIrbGraph: [],
            okSize: 75,
            criticalSize: 90
        };
        this.handleChangeLogDateFrom = this.handleChangeLogDateFrom.bind(this);
        this.handleChangeLogDateTo = this.handleChangeLogDateTo.bind(this);

    }

    searchTimeout = {};

    handleChangeLogDateFrom(value) {
        let date = moment(value).format('YYYY-MM-DD');
        this.setState({
            logDateGraphFrom: value
        });
        this.setState({
            valueDropDownType: "",
            valueDropDownName: "",
            direction: "in"
        });
        // this.props.dispatch(autoBalancingTransitPeering.getAllTimeInDay(date, value));
    }

    handleChangeLogDateTo(value) {
        this.setState({
            logDateGraphTo: value
        });
        this.setState({
            valueDropDownType: "",
            valueDropDownName: "",
            direction: "in"
        });
    }

    componentDidMount() {
        this.setClassForDatePicker();
        if (_.size(this.state.allTimeInDay) === 0) {
            let today = new Date();
            let date = moment(today).format('YYYY-MM-DD');
            // this.props.dispatch(autoBalancingTransitPeering.getAllTimeInDay(date, today));
        }

    }

    componentDidUpdate() {
        this.setClassForDatePicker();
    }


    componentWillReceiveProps(nextProps) {
        const {dataLogSummaryIrbForGraph, dataLogDetailIrbForGraph} = nextProps;
        this.setState({pageLoading: false});
        if (dataLogSummaryIrbForGraph.length > 0) {
            this.setState({
                    dataSummaryGraph: dataLogSummaryIrbForGraph
                }
            )
        }
        if (dataLogDetailIrbForGraph.length > 0) {
            let listNameIrb = getAllIrbName(dataLogDetailIrbForGraph, this.state.valueDropDownType);
            this.setState({
                    dataDetailGraph: dataLogDetailIrbForGraph,
                    listNameIrb: listNameIrb
                }
            )
        }
    }


    filter() {

    }

    handleSearch(e) {

    }

    handleDrawOnClick = (e) => {

        let from = moment(this.state.logDateGraphFrom).format('YYYY-MM-DD');
        let to = moment(this.state.logDateGraphTo).format('YYYY-MM-DD');
        if (from === to) {
            toast.error('From and To have the same value!');
            return;
        }

        let okSize = this.state.okSize;
        let criticalSize = this.state.criticalSize;
        if (okSize >= criticalSize) {
            toast.error('Crtical need more than Ok!');
            return;
        }


        this.setState({pageLoading: true});
        let option = {
            from: from,
            to: to,
            okSize: okSize,
            criticalSize: criticalSize
        };
        this.props.dispatch(autoBalancingTransitPeering.getLogSummaryIrbForGraphData(option));
    };


    render() {
        // const {logDateGraphFrom, logDateGraphTo, dataLogSummaryIrbForGraph} = this.props;
        const {
            search,
            pageLoading,
            searchLoading,
            dataSummaryGraph,
            listNameIrb,
        } = this.state;
        let dataSummaryGraphPeering = dataSummaryGraph.filter(function (a) {
            return a.type === "peering";
        });
        let dataSummaryGraphTransit = dataSummaryGraph.filter(function (a) {
            return a.type === "transit";
        });

        const onChangeDropDownType = (event, obj) => {

            let from = moment(this.state.logDateGraphFrom).format('YYYY-MM-DD');
            let to = moment(this.state.logDateGraphTo).format('YYYY-MM-DD');
            if (from === to) {
                toast.error('From and To have the same value!');
                return;
            }
            if (obj.value === '') {
                return;
            }
            this.setState({
                valueDropDownType: obj.value
            });
            this.setState({pageLoading: true});
            this.props.dispatch(autoBalancingTransitPeering.getLogDetailIrbForGraphData(from, to));
        };

        const onChangeDropDownName = (event, obj) => {
            let irbName = obj.value;
            let dataDetailGraph = this.state.dataDetailGraph;
            if (!irbName || !dataDetailGraph) {
                return;
            }
            let generalData = getDataForGraph(dataDetailGraph, irbName);
            this.setState({
                dataIrbGraph: generalData,
                irbName: irbName,
                valueDropDownName: obj.value
            });
        };

        const handleOnChangeOk = (event, obj) => {
            let value = obj.value;
            if (value >= 100) {
                toast.error('Need less than 100!');
            }
            if (value >= this.state.criticalSize) {
                toast.error('Need more than Ok!');
            }

            this.setState({
                okSize: value,
            });
        };

        const handleOnChangeCritical = (event, obj) => {
            let value = obj.value;
            if (value >= 100) {
                toast.error('Need less than 100!');
            }
            if (value <= this.state.okSize) {
                toast.error('Need more than Ok!');
            }

            this.setState({
                criticalSize: value
            });
        };

        const onChangeDirection = (event, obj) => {
            let direction = obj.value;
            this.setState({
                direction: direction
            });
        };

        const renderSummaryTab = () => {
            return (
                <Tab.Pane>
                    <Segment>
                        <Header> IRB </Header>
                        <Grid className='grid-toolbar' doubling stackable>
                            {/*<Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>*/}
                            {/*<Form.Input fluid label='Search by name' icon='search' placeholder="Search by name..."*/}
                            {/*name='searchByName'*/}
                            {/*loading={searchLoading['searchByName']}*/}
                            {/*value={search['searchByName']} onChange={this.handleSearch.bind(this)}/>*/}
                            {/*</Grid.Column>*/}
                            <Grid.Column computer={2} largeScreen={2} tablet={4} moblie={8}>
                                <Form.Field>
                                    <label>From</label>
                                    <DatePicker
                                        dateFormat="dd/MM/yyyy"
                                        selected={this.state.logDateGraphFrom}
                                        maxDate={this.state.logDateGraphTo}
                                        onChange={this.handleChangeLogDateFrom}
                                        locale="en"
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column computer={2} largeScreen={2} tablet={4} moblie={8}>
                                <Form.Field>
                                    <label>To</label>
                                    <DatePicker
                                        dateFormat="dd/MM/yyyy"
                                        selected={this.state.logDateGraphTo}
                                        maxDate={new Date()}
                                        onChange={this.handleChangeLogDateTo}
                                        locale="en"
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column computer={2} largeScreen={2} tablet={4} moblie={4}>
                                <label style={{color: 'green'}}>OK (less than)
                                </label>
                                <Input placeholder='Less than ...' value={this.state.okSize}
                                       onChange={handleOnChangeOk.bind(this)}/>
                            </Grid.Column>
                            <Grid.Column computer={2} largeScreen={2} tablet={4} moblie={4}>
                                <label style={{color: 'orange'}}>WARNING (beetween)
                                </label>
                                <Input disabled value={'' + this.state.okSize + '-' + this.state.criticalSize}/>
                            </Grid.Column>
                            <Grid.Column computer={2} largeScreen={2} tablet={4} moblie={4}>
                                <label style={{color: 'red'}}>CRITICAL (more than)
                                </label>
                                <Input placeholder='More than ...' value={this.state.criticalSize}
                                       onChange={handleOnChangeCritical.bind(this)}/>
                            </Grid.Column>
                            <Grid.Column computer={2} largeScreen={2} tablet={4} moblie={8}>
                                <Form.Field>
                                    <label>&nbsp;</label>
                                    <Button fluid positive onClick={this.handleDrawOnClick}>Draw</Button>
                                </Form.Field>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                    <Segment className="list">
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    <GraphSummary dataSummaryGraph={dataSummaryGraphPeering} type={"Peering summary"}>
                                    </GraphSummary>
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <GraphSummary dataSummaryGraph={dataSummaryGraphTransit} type={"Transit summary"}>
                                    </GraphSummary>
                                </Grid.Column>
                            </Grid.Row>

                        </Grid>
                    </Segment>
                </Tab.Pane>
            )
        };

        const renderDetailTab = () => {

            let optionTypeOfIrb = [
                {
                    key: '',
                    text: 'Please Select Type',
                    value: '',
                }, {
                    key: 'transit',
                    text: 'Transit',
                    value: 'transit',
                },
                {
                    key: 'peering',
                    text: 'Peering',
                    value: 'peering',
                }];
            let optionDirectionOfIrb = [
                {
                    key: '',
                    text: 'Please Select Direction',
                    value: '',
                }, {
                    key: 'in',
                    text: 'In',
                    value: 'in',
                },
                {
                    key: 'out',
                    text: 'Out',
                    value: 'out',
                }];
            let dataIrbGraph = this.state.dataIrbGraph;
            return (<Tab.Pane>
                <Segment>
                    <Header> IRB </Header>
                    <Grid className='grid-toolbar' doubling stackable>
                        <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                            <label>Type</label>
                            <Dropdown
                                placeholder='Select Type'
                                fluid
                                selection
                                value={this.state.valueDropDownType}
                                options={optionTypeOfIrb}
                                onChange={onChangeDropDownType.bind(this)}
                            />
                        </Grid.Column>
                        {
                            listNameIrb.length === 0 ? null :
                                <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                    <label>Name</label>
                                    <Dropdown
                                        placeholder='Select Name'
                                        fluid
                                        selection
                                        value={this.state.valueDropDownName}
                                        options={this.state.listNameIrb}
                                        onChange={onChangeDropDownName.bind(this)}
                                    />
                                </Grid.Column>
                        }
                        <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                            <label>Direction</label>
                            <Dropdown
                                placeholder='Select Name'
                                fluid
                                selection
                                value={this.state.direction}
                                options={optionDirectionOfIrb}
                                onChange={onChangeDirection.bind(this)}
                            />
                        </Grid.Column>
                        <Grid.Column computer={2} largeScreen={2} tablet={4} moblie={8}>
                            <Form.Field>
                                <label>From</label>
                                <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    selected={this.state.logDateGraphFrom}
                                    maxDate={this.state.logDateGraphTo}

                                    onChange={this.handleChangeLogDateFrom}
                                    locale="en"
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column computer={2} largeScreen={2} tablet={4} moblie={8}>
                            <Form.Field>
                                <label>To</label>
                                <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    selected={this.state.logDateGraphTo}
                                    maxDate={new Date()}
                                    onChange={this.handleChangeLogDateTo}
                                    locale="en"
                                />
                            </Form.Field>
                        </Grid.Column>
                        {/*<Grid.Column computer={2} largeScreen={2} tablet={4} moblie={8}>*/}
                        {/*<Form.Field>*/}
                        {/*<label>&nbsp;</label>*/}
                        {/*<Button fluid positive onClick={this.handleGetDetailIrbOnClick}>Get detail IRB</Button>*/}
                        {/*</Form.Field>*/}
                        {/*</Grid.Column>*/}
                        {/*{*/}
                        {/*this.state.listNameIrb.length === 0 ? null : <Grid.Column computer={2} largeScreen={2} tablet={4} moblie={8}>*/}
                        {/*<Form.Field>*/}
                        {/*<label>&nbsp;</label>*/}
                        {/*<Button fluid positive onClick={this.handleDrawDetailOnClick}>Draw</Button>*/}
                        {/*</Form.Field>*/}
                        {/*</Grid.Column>*/}
                        {/*}*/}
                    </Grid>
                </Segment>
                <Segment className="list">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <GraphDetail dataDetailGraph={dataIrbGraph} irbDetail={this.state.valueDropDownName}
                                             irbName={this.state.irbName} direction={this.state.direction}>
                                </GraphDetail>
                            </Grid.Column>

                        </Grid.Row>

                    </Grid>
                </Segment>
            </Tab.Pane>)
        };

        return (
            <div id="div-page-auto-balancing">
                <Head>
                    <title> Auto Balancing Data </title>
                </Head>
                <DashboardLayout>
                    <Dimmer active={pageLoading} inverted>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>
                    <Tab style={{marginTop: "14px"}}
                         panes={
                             [
                                 {
                                     menuItem: 'Summary',
                                     render: renderSummaryTab
                                 },
                                 {
                                     menuItem: 'Detail',
                                     render: renderDetailTab
                                 }
                             ]
                         }
                    /> :
                </DashboardLayout>
            </div>
        );
    };


    setClassForDatePicker() {
        const listDateWrapper = document.getElementsByClassName('react-datepicker-wrapper');
        for (let item of listDateWrapper) {
            item.classList.add("fluid");
        }

        const listDatePicker = document.getElementsByClassName('react-datepicker__input-container');
        for (let item of listDatePicker) {
            item.classList.add("ui");
            item.classList.add("input");
        }

        const listDatePickerInput = document.querySelectorAll('.react-datepicker-wrapper .react-datepicker__input-container input');
        for (let item of listDatePickerInput) {
            item.style.width = "100%";
        }
    }
}

const mapStateToProps = ({autoBalancingTransitPeering}) => (autoBalancingTransitPeering);

export default connect(mapStateToProps, null)(graphFlowHistory);