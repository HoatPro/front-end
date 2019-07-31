import React, { Component, Fragment } from "react";
import {
  Header,
  Segment,
  Dimmer,
  Loader,
  Message,
  Form,
  Accordion,
  Icon,
  Dropdown,
  Button
} from "semantic-ui-react";
import DashboardLayout from "../../src/components/Layout/DashboadLayout";
import Head from "next/head";
import { connect } from "react-redux";
import _ from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactEcharts from "echarts-for-react";
import { getIplcTrafficChartOnRange } from "../../src/redux/_actions/iplc/trafficChartA";

class IplcTrafficAttrFilterDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      types: [-1, "Landline", "submarine"],
      locations: [-1, "Singapore", "Hong Kong", "Japan"],
      providers: [-1, "APG", "IA", "AAE-1", "AAG", "CMI", "CT", "CU"],
      localLocations: [-1, "Da Nang", "Ho Chi Minh", "Ha Noi"],
      selectedService: [-1],
      selectedType: [-1],
      selectedProvider: [-1],
      selectedLocation: [-1],
      selectedLocalLocation: [-1],
      fromDate: new Date(new Date().setDate(new Date().getDate() - 5)),
      toDate: new Date()
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state != nextState) {
      return true;
    }
    return false;
  }

  handleDropdownChange = (e, { name, value, options }) => {
    let newValue = value;

    if (value.includes(-1) || value.length === options.length - 1) {
      newValue = [-1];
    }

    this.setState({
      [name]: newValue
    });
  };

  handleChangeFromDate = date => {
    this.setState({
      fromDate: date
    });
  };

  handleChangeToDate = date => {
    this.setState({
      toDate: date
    });
  };

  handeSearch = () => {
    const data = {
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      provider: this.state.selectedProvider,
      type: this.state.selectedType,
      location: this.state.selectedLocation,
      localLocation: this.state.selectedLocalLocation
    };

    for (const attr in data) {
      if (data[attr].length == 0) {
        toast.error("Empty field deteted!");
        return;
      }
    }

    this.props.onSearch(data);
  };

  render() {
    const {
      fromDate,
      toDate,
      types,
      locations,
      providers,
      localLocations,
      selectedType,
      selectedProvider,
      selectedLocation,
      selectedLocalLocation
    } = this.state;

    return (
      <Form>
        <Form.Group>
          <Form.Field width={3}>
            <label>From</label>
            <DatePicker
              name='from'
              selected={fromDate}
              selectsStart
              minDate={new Date(new Date().setDate(new Date().getDate() - 7))}
              maxDate={new Date()}
              startDate={fromDate}
              endDate={toDate}
              onChange={this.handleChangeFromDate}
              dateFormat='dd/MM/yyyy'
            />
          </Form.Field>
          <Form.Field width={3}>
            <label>To</label>
            <DatePicker
              name='to'
              selected={toDate}
              selectsEnd
              startDate={fromDate}
              endDate={toDate}
              maxDate={new Date()}
              onChange={this.handleChangeToDate}
              dateFormat='dd/MM/yyyy'
            />
          </Form.Field>
          <Form.Field width={6}
            control={Dropdown}
            label='Type'
            placeholder='type'
            fluid
            multiple
            search
            options={types.map(e => ({
              key: e,
              text: e == -1 ? "All" : e,
              value: e
            }))}
            selection
            name='selectedType'
            value={selectedType}
            onChange={this.handleDropdownChange}
          />
          <Form.Field width={4}
            control={Dropdown}
            label='Local location'
            placeholder='type'
            fluid
            multiple
            search
            options={localLocations.map(e => ({
              key: e,
              text: e == -1 ? "All" : e,
              value: e
            }))}
            selection
            value={selectedLocalLocation}
            name='selectedLocalLocation'
            onChange={this.handleDropdownChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Field
            width={6}
            control={Dropdown}
            label='Location'
            placeholder='End location'
            fluid
            multiple
            search
            options={locations.map(e => ({
              key: e,
              text: e == -1 ? "All" : e,
              value: e
            }))}
            selection
            value={selectedLocation}
            name='selectedLocation'
            onChange={this.handleDropdownChange}
          />
          <Form.Field
            width={6}
            control={Dropdown}
            label='Provider'
            placeholder='provider'
            fluid
            multiple
            search
            options={providers.map(e => ({
              key: e,
              text: e == -1 ? "All" : e,
              value: e
            }))}
            selection
            value={selectedProvider}
            name='selectedProvider'
            onChange={this.handleDropdownChange}
          />
          <Form.Field>
            <label>&nbsp;</label>
            <Button onClick={this.handeSearch}>Search</Button>
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

class Chart extends Component {
  constructor(props) {
    super(props);
  }

  getOption = data => {
    const dateList = [];
    const usedList = [];
    const freeList = [];
    const percentList = [];
    const capacityList = [];
    for (let ele of data) {
      let used = Math.round(ele.used * 100) / 100;
      dateList.push(ele.date);
      usedList.push(used);
      let free = Math.round((ele.capacity - used) * 100) / 100;
      freeList.push(free);
      let percent = Math.round(((used * 100) / ele.capacity) * 100) / 100;
      percentList.push(percent/0.9);
      capacityList.push(ele.capacity);
    }

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "line"
        }
      },
      legend: {
        data: ["Capacity", "Used", "Free", "Percent"]
      },
      grid: {
        height: "425px"
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: { show: true }
        }
      },
      xAxis: [
        {
          type: "category",
          data: dateList
        }
      ],
      dataZoom: {
        show: true,
        start: 0
      },
      yAxis: [
        {
          type: "value",
          boundaryGap: [0, 0.1],
          name: "Gbps"
        },
        {
          type: "value",
          max: 100,
          boundaryGap: [0, 0.1],
          name: "%"
        }
      ],
      series: [
        {
          name: "Capacity",
          type: "line",
          yAxisIndex: 0,

          itemStyle: {
            normal: {
              lineStyle: {
                opacity: 0
              },
              label: {
                show: true,
                color: "#000"
              }
            }
          },
          data: capacityList
        },
        {
          name: "Used",
          type: "bar",
          stack: "sum",
          barCategoryGap: "50%",
          itemStyle: {
            normal: {
              color: "#5594fa",
              barBorderColor: "#5594fa",
              barBorderWidth: 2,
              barBorderRadius: 0,
              label: {
                show: true,
                position: "inside"
              }
            }
          },
          data: usedList
        },
        {
          name: "Free",
          type: "bar",
          stack: "sum",
          itemStyle: {
            normal: {
              color: "#dedede",
              barBorderColor: "#5594fa",
              barBorderWidth: 2,
              barBorderRadius: 0
            }
          },
          data: freeList
        },
        {
          name: "Percent",
          type: "line",
          yAxisIndex: 1,

          itemStyle: {
            normal: {
              lineStyle: {
                color: "gray",
                width: 4
              }
            }
          },

          data: percentList
        }
      ]
    };
    return option;
  };

  render() {
    const { data } = this.props;
    return (
      <React.Fragment>
        {data.length > 0 ? (
          <ReactEcharts
            fluid
            option={this.getOption(data)}
            style={{ height: "525px" }}
          />
        ) : (
          <Message warning>
            <Message.Header>No data to display.</Message.Header>
          </Message>
        )}
      </React.Fragment>
    );
  }
}

class IplcTrafficChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeout: null,
      premiumData: [],
      generalData: [],
      activeIndex: [0, 1, 2]
    };
  }

  componentWillReceiveProps(nextProps) {
    const { premiumData, generalData } = nextProps;
    this.setState({
      timeout: null,
      premiumData,
      generalData
    });
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    let newIndex = activeIndex;
    if (activeIndex.includes(index)) {
      newIndex = activeIndex.filter(idx => {
        return idx !== index;
      });
    } else {
      newIndex.push(index);
    }
    this.setState({ activeIndex: newIndex });
  };

  handleSearch = filterData => {
    const payload = filterData;
    this.props.dispatch(getIplcTrafficChartOnRange(payload));
  };

  render() {
    const { premiumData, generalData, activeIndex } = this.state;
    const { pageLoading } = this.props;
    return (
      <Fragment id="div-iplc-traffic-chart">
        <Head>
          <title>Traffic Chart</title>
        </Head>
        <DashboardLayout>
          <Dimmer active={pageLoading} inverted>
            <Loader size='large'>Loading</Loader>
          </Dimmer>
          <Segment>
            <Header>Traffic Chart</Header>
            <Accordion>
              <Accordion.Title
                active={activeIndex.includes(2)}
                index={2}
                onClick={this.handleClick}>
                <Icon name='dropdown' />
                Filter
              </Accordion.Title>
              <Accordion.Content active={activeIndex.includes(2)}>
                <IplcTrafficAttrFilterDropdown onSearch={this.handleSearch} />
              </Accordion.Content>
            </Accordion>
          </Segment>
          <Segment>
            <Header>IPLC Traffic</Header>
            <Accordion exclusive={false}>
              <Accordion.Title
                active={activeIndex.includes(0)}
                index={0}
                onClick={this.handleClick}>
                <Icon name='dropdown' />
                General
              </Accordion.Title>
              <Accordion.Content active={activeIndex.includes(0)}>
                <Chart data={generalData} service='General' />
              </Accordion.Content>

              <Accordion.Title
                active={activeIndex.includes(1)}
                index={1}
                onClick={this.handleClick}>
                <Icon name='dropdown' />
                Premium
              </Accordion.Title>
              <Accordion.Content active={activeIndex.includes(1)}>
                <Chart data={premiumData} service='Premium' />
              </Accordion.Content>
            </Accordion>
          </Segment>
        </DashboardLayout>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ iplcTrafficChart }) => iplcTrafficChart;

export default connect(
  mapStateToProps,
  null
)(IplcTrafficChart);
