import React, { Component, Fragment } from 'react';
import { Button, Input, Header, Grid, Segment, Icon, Modal } from 'semantic-ui-react';
import DashboardLayout from '../../src/components/Layout/DashboadLayout';
import CustomTable from '../../src/components/Table/Table';
import Head from 'next/head';
import Link from 'next/link';
import { connect } from 'react-redux';
import {userA} from '../../src/redux/_actions/admin/userA';
import _ from 'lodash';
import moment from 'moment';

class Users extends Component {

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
        const {users} = nextProps;
        const {action = '', loading = false, current = {}} = users;
        if(action === 'delete' && loading && _.size(current) === 0) {
            this.getData();
        }
    }

    getData(_search, _pagination) {
        const { users = {}, dispatch } = this.props;
        const {search = {}, pagination = {}} = users;
        dispatch(userA.getUsers({
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }));
    }

    handleDeleteRow(id) {
        const {users, dispatch} = this.props;
        const {list = []} = users;
        const find = _.find(list, {userId: id});
        if(find) {
            dispatch(userA.handleDeleteRow(find));
        } 
    }

    handleUpdateRow(id) {
        const {users = {}, dispatch} = this.props;
        const {list = []} = users;
        const find = _.find(list, {userId: id});
        if(find) {
            dispatch(userA.handleUpdateRow(find));
        } 
    }

    handleClose() {
        this.props.dispatch(userA.modal(false));
    }

    onDelete() {
        const {users = {}} = this.props;
        const {current = {}} = users;
        const id = current.userId;
        if(id) this.props.dispatch(userA.deleteUser({id: id}));
    }

    handleSearch(e) {
        const {name, value} = e.target;
        const {users, dispatch} = this.props;
        let {search = {}, pagination = {}} = users;
        search[name] = value;
        dispatch(userA.handleSearch(value));
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            console.log(value);
            this.getData(search, pagination);
        }, 500);
    }

    onPageChange(e, data) {
        const {activePage} = data;
        const {search = {}, pagination = {}} = this.props;
        this.getData(search, {...pagination, currentPage: activePage - 1});
    }

    render() {
        const {users = {}} = this.props;
        const {
            open = false, 
            current = {username: '', userId: ''}, 
            search = {str: ''}, 
            searchLoading = false, 
            pagination = {currentPage: 0, countPage: 1}, 
            list = []
        } = users;
        let _list = [];
        _.forEach(list, (item, i) => {
            let index = (pagination.currentPage * pagination.sizePage) + i + 1;
            let children = [index];
            _.forEach(['username', 'fullName', 'email', 'groups', 'type', 'description', 'createdDate'], c => {
                let value = item[c];
                if(c === 'createdDate') {
                    value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                }
                else if(c === 'groups') {
                    let temp =  [];
                    _.forEach(value, v => {
                        temp.push(v.groupName);
                    });
                    value = temp.join(', ');
                } else if(c === 'type') {
                    value = value === 1? <Icon className='icon-success' name="check" />: '';
                }
                if(_.isNull(value)) value = ''; 
                children.push(value);
            });
            const id = item.userId;
            children.push({
                cell: (<Fragment>
                            <Link href={`/admin/user-edit?id=${id}`}>
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
            ['STT', 'Tên tài khoản', 'Họ tên', 'Email', 'Nhóm quyền','Admin', 'Mô tả',  'Ngày tạo', ''],
        ];
        return (
            <div>
                <Head>
                    <title> Danh sách Tài khoản </title>
                </Head>
                <DashboardLayout>
                    <Segment>
                        <Header>Danh sách Tài khoản</Header>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Input icon='search' placeholder="Tìm kiếm..." name='str' loading={searchLoading} value={search.str} onChange={this.handleSearch.bind(this)} />
                            </Grid.Column>
                            <Grid.Column floated='right' textAlign="right" computer={3} largeScreen={3} tablet={5} moblie={8}>

                                <Link href="/admin/user-edit"><Button primary>Thêm mới</Button></Link>
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
                            <Modal.Header>Xóa User</Modal.Header>
                            <Modal.Content>
                                <p>Bạn có muốn xóa User: {`"${current.username}"`} không?</p>
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

const mapStateToProps = ({ users }) => ({ users });

export default connect(mapStateToProps, null)(Users);