import React, { Component, Fragment } from 'react';
import { Button, Input, Header, Grid, Segment, Icon, Modal } from 'semantic-ui-react';
import DashboardLayout from '../../src/components/Layout/DashboadLayout';
import CustomTable from '../../src/components/Table/Table';
import Head from 'next/head';
import Link from 'next/link';
import { connect } from 'react-redux';
import {roleA} from '../../src/redux/_actions/admin/roleA';
import _ from 'lodash';
import moment from 'moment';

class Roles extends Component {

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
        const {roles} = nextProps;
        const {action = '', loading = false, current = {}} = roles;
        if(action === 'delete' && loading && _.size(current) === 0) {
            this.getData();
        }
    }

    getData(_search, _pagination) {
        const { roles = {}, dispatch } = this.props;
        const {search = {}, pagination = {}} = roles;
        dispatch(roleA.getRoles({
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }));
    }

    handleDeleteRow(id) {
        const {roles, dispatch} = this.props;
        const {list = []} = roles;
        const find = _.find(list, {roleId: id});
        if(find) {
            dispatch(roleA.handleDeleteRow(find));
        } 
    }

    handleUpdateRow(id) {
        const {roles = {}, dispatch} = this.props;
        const {list = []} = roles;
        const find = _.find(list, {roleId: id});
        if(find) {
            dispatch(roleA.handleUpdateRow(find));
        } 
    }

    handleClose() {
        this.props.dispatch(roleA.modal(false));
    }

    onDelete() {
        const {roles = {}} = this.props;
        const {current = {}} = roles;
        const id = current.roleId;
        if(id) this.props.dispatch(roleA.deleteRole({id: id}));
    }

    handleSearch(e) {
        const {name, value} = e.target;
        const {roles, dispatch} = this.props;
        let {search = {}, pagination = {}} = roles;
        search[name] = value;
        dispatch(roleA.handleSearch(value));
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
        const {roles = {}} = this.props;
        const {open = false, current = {roleName: '', roleId: ''}, search = {str: ''}, searchLoading = false, pagination = {currentPage: 0, countPage: 1}, list = []} = roles;
        let _list = [];
        _.forEach(list, (item, i) => {
            let index = (pagination.currentPage * pagination.sizePage) + i + 1;
            let children = [index];
            _.forEach(['roleName', 'routeKey', 'operations', 'description', 'createdDate'], c => {
                let value = item[c];
                if(c === 'createdDate') {
                    value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                }
                else if(c === 'operations') {
                    let temp =  [];
                    _.forEach(value, v => {
                        temp.push(v.operationName);
                    });
                    value = temp.join(', ');
                }
                if(_.isNull(value)) value = ''; 
                children.push(value);
            });
            const id = item.roleId;
            children.push({
                cell: (<Fragment>
                    <Link href={`/admin/role-edit?id=${id}}`}>
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
            _list.push(children);
        });
        const header = [
            ['STT', 'Tên', 'Route', 'Hành động', 'Mô tả', 'Ngày tạo', ''],
        ];
        return (
            <div>
                <Head>
                    <title> Danh sách Role </title>
                </Head>
                <DashboardLayout>
                    <Segment>
                        <Header>Danh sách Role</Header>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Input icon='search' placeholder="Tìm kiếm..." name='str' loading={searchLoading} value={search.str} onChange={this.handleSearch.bind(this)} />
                            </Grid.Column>
                            <Grid.Column floated='right' textAlign="right" computer={3} largeScreen={3} tablet={5} moblie={8}>

                                <Link href="/admin/role-edit"><Button primary>Thêm mới</Button></Link>
                            </Grid.Column>
                        </Grid>
                        <CustomTable
                            header={header}
                            body={_list}
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
                            <Modal.Header>Xóa Role</Modal.Header>
                            <Modal.Content>
                                <p>Bạn có muốn xóa Role: {`"${current.roleName}"`} không?</p>
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

const mapStateToProps = ({ roles }) => ({ roles });

export default connect(mapStateToProps, null)(Roles);