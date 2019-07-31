import React, { Component, Fragment } from 'react';
import { Button, Input, Header, Grid, Segment, Icon, Modal } from 'semantic-ui-react';
import DashboardLayout from '../../src/components/Layout/DashboadLayout';
import CustomTable from '../../src/components/Table/Table';
import Head from 'next/head';
import Link from 'next/link';
import { connect } from 'react-redux';
import {routeA} from '../../src/redux/_actions/admin/routeA';
import _ from 'lodash';
import moment from 'moment';
import Router from 'next/router';

class Routes extends Component {

    constructor(props) {
        super(props);
        this.state = {
             timeout: null
        }
    }

    componentDidMount() {
        this.getData();
    }

    componentWillReceiveProps(nextProps) {
        const {routes} = nextProps;
        const {action = '', loading = false, current = {}} = routes;
        if(action === 'delete' && loading && _.size(current) === 0) {
            this.getData();
        }
    }

    getData(_search, _pagination) {
        const { routes, dispatch } = this.props;
        const {search = {}, pagination = {}} = routes;
        dispatch(routeA.getRouteParents());
        dispatch(routeA.getRoutes({
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }));
    }

    handleDeleteRow(id) {
        const {routes, dispatch} = this.props;
        const {list = []} = routes;
        const find = _.find(list, {routeId: id});
        if(find) {
            dispatch(routeA.handleDeleteRow(find));
        } 
    }

    handleUpdateRow(id) {
        const {routes, dispatch} = this.props;
        const {list = []} = routes;
        const find = _.find(list, {routeId: id});
        if(find) {
            dispatch(routeA.handleUpdateRow(find));
        } 
    }

    handleClose() {
        this.props.dispatch(routeA.modal(false));
    }

    onDelete() {
        const {routes} = this.props;
        const {current = {}} = routes;
        const id = current.routeId;
        if(id) this.props.dispatch(routeA.deleteRoute({id: id}));
    }

    handleSearch(e) {
        const {name, value} = e.target;
        const {routes, dispatch} = this.props;
        let {search = {}, pagination = {}} = routes;
        search[name] = value;
        dispatch(routeA.handleSearch(value));
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            console.log(value);
            this.getData(search, pagination);
        }, 500);
    }

    onPageChange(e, data) {
        const {activePage} = data;
        const {dispatch, search = {}, pagination = {}} = this.props;
        this.getData(search, {...pagination, currentPage: activePage - 1});
    }

    render() {
        const {routes} = this.props;
        const {parents = [], open = false, current = {routeName: '', routeId: ''}, search = {str: ''}, searchLoading = false, pagination = {currentPage: 0, countPage: 1}} = routes;
        let list = [];
        _.forEach(routes.list, (item, i) => {
            let temp = [];
            let index = 1;
            if(_.isNull(pagination.currentPage) || _.isUndefined(pagination.currentPage)){
                index = i + 1;
            }else {
                index = (pagination.currentPage * pagination.sizePage) + i + 1;
            }
            temp.push(index);
            _.forEach(['routeName', 'routeKey', 'parentId', 'description', 'createdDate'], c => {
                let value = item[c];
                if(c === 'createdDate') value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                if(c === 'parentId') {
                    const find = _.find(parents, {routeId: value});
                    if(find) {
                        value = find.routeName;
                    }
                }
                if(_.isNull(value)) value = ''; 
                temp.push(value);
            });
            const id = item.routeId;
            temp.push({
                cell: (<Fragment>
                    <Link href={'/admin/route-edit?id=' + id} >
                        <Button size="mini" icon onClick={() => this.handleUpdateRow(id)}>
                            <Icon name="pencil" />
                        </Button>
                    </Link>
                    <Button color="red" size="mini" icon onClick={() => this.handleDeleteRow(id)}>
                        <Icon name="delete" />
                    </Button>
                </Fragment>),
                props: {
                    textAlign: 'center'
                }
            });
            list.push(temp);
        });
        const header = [
            ['STT', 'Tên', 'Route', 'Route parent', 'Mô tả', 'Ngày tạo', ''],
        ];
        return (
            <div>
                <Head>
                    <title> Danh sách Route </title>
                </Head>
                <DashboardLayout>
                    <Segment>
                        <Header>Danh sách Route</Header>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Input icon='search' placeholder="Tìm kiếm..." name='str' loading={searchLoading} value={search.str} onChange={this.handleSearch.bind(this)} />
                            </Grid.Column>
                            {/* <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Input icon='search' placeholder="Route parent..." />
                            </Grid.Column> */}
                            <Grid.Column floated='right' textAlign="right" computer={3} largeScreen={3} tablet={5} moblie={8}>

                                <Link href="/admin/route-edit"><Button primary>Thêm mới</Button></Link>
                            </Grid.Column>
                        </Grid>
                        <CustomTable
                            header={header}
                            body={list}
                            pagination={true}
                            paginationProps={{
                                defaultActivePage: pagination.currentPage + 1,
                                totalPages: pagination.countPage
                            }}
                            onPageChange={this.onPageChange.bind(this)}
                        />
                        <Modal size={'mini'} open={open} 
                            onClose={this.handleClose.bind(this)}
                            closeOnEscape={true}
                            closeOnDimmerClick={false}
                        >
                            <Modal.Header>Xóa Route</Modal.Header>
                            <Modal.Content>
                                <p>Bạn có muốn xóa Route: {`"${current.routeName}"`} không?</p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button negative onClick={this.handleClose.bind(this)}>Không</Button>
                                <Button positive icon='checkmark' labelPosition='right' content='Có' onClick={this.onDelete.bind(this)} />
                            </Modal.Actions>
                        </Modal>
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

const mapStateToProps = ({ routes }) => ({ routes });

export default connect(mapStateToProps, null)(Routes);