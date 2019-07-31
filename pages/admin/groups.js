import React, { Component, Fragment } from 'react';
import { Button, Input, Header, Grid, Segment, Icon, Modal } from 'semantic-ui-react';
import DashboardLayout from '../../src/components/Layout/DashboadLayout';
import CustomTable from '../../src/components/Table/Table';
import Head from 'next/head';
import Link from 'next/link';
import { connect } from 'react-redux';
import {groupA} from '../../src/redux/_actions/admin/groupA';
import _ from 'lodash';
import moment from 'moment';

class Groups extends Component {

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
        const {groups} = nextProps;
        const {action = '', loading = false, current = {}} = groups;
        if(action === 'delete' && loading && _.size(current) === 0) {
            this.getData();
        }
    }

    getData(_search, _pagination) {
        const { groups = {}, dispatch } = this.props;
        const {search = {}, pagination = {}} = groups;
        dispatch(groupA.getGroups({
            search: _search ? _search : search,
            pagination: _pagination ? _pagination : pagination
        }));
    }

    handleDeleteRow(id) {
        const {groups, dispatch} = this.props;
        const {list = []} = groups;
        const find = _.find(list, {groupId: id});
        if(find) {
            dispatch(groupA.handleDeleteRow(find));
        } 
    }

    handleUpdateRow(id) {
        const {groups = {}, dispatch} = this.props;
        const {list = []} = groups;
        const find = _.find(list, {groupId: id});
        if(find) {
            dispatch(groupA.handleUpdateRow(find));
        } 
    }

    handleClose() {
        this.props.dispatch(groupA.modal(false));
    }

    onDelete() {
        const {groups = {}} = this.props;
        const {current = {}} = groups;
        const id = current.groupId;
        if(id) this.props.dispatch(groupA.deleteGroup({id: id}));
    }

    handleSearch(e) {
        const {name, value} = e.target;
        const {groups, dispatch} = this.props;
        let {search = {}, pagination = {}} = groups;
        search[name] = value;
        dispatch(groupA.handleSearch(value));
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
        const {groups = {}} = this.props;
        const {open = false, current = {groupName: '', groupId: ''}, search = {str: ''}, searchLoading = false, pagination = {currentPage: 0, countPage: 1}, list = []} = groups;
        let _list = [];
        _.forEach(list, (item, i) => {
            let index = (pagination.currentPage * pagination.sizePage) + i + 1;
            let children = [index];
            _.forEach(['groupName', 'roles', 'description', 'createdDate'], c => {
                let value = item[c];
                if(c === 'createdDate') {
                    value = moment(value).format('DD-MM-YYYY HH:mm:ss');
                }
                else if(c === 'roles') {
                    let temp =  [];
                    _.forEach(value, v => {
                        temp.push(v.roleName);
                    });
                    value = temp.join(', ');
                }
                if(_.isNull(value)) value = ''; 
                children.push(value);
            });
            const id = item.groupId;
            children.push({
                cell: ( <Fragment>
                            <Link href={`/admin/group-edit?id=${id}`}>
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
            ['STT', 'Tên', 'Quyền', 'Mô tả', 'Ngày tạo', ''],
        ];
        return (
            <div>
                <Head>
                    <title> Danh sách Group </title>
                </Head>
                <DashboardLayout>
                    <Segment>
                        <Header>Danh sách Group</Header>
                        <Grid className='grid-toolbar' doubling stackable>
                            <Grid.Column computer={3} largeScreen={3} tablet={5} moblie={8}>
                                <Input icon='search' placeholder="Tìm kiếm..." name='str' loading={searchLoading} value={search.str} onChange={this.handleSearch.bind(this)} />
                            </Grid.Column>
                            <Grid.Column floated='right' textAlign="right" computer={3} largeScreen={3} tablet={5} moblie={8}>

                                <Link href="/admin/group-edit"><Button primary>Thêm mới</Button></Link>
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
                            <Modal.Header>Xóa Group</Modal.Header>
                            <Modal.Content>
                                <p>Bạn có muốn xóa Group: {`"${current.groupName}"`} không?</p>
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

const mapStateToProps = ({ groups }) => ({ groups });

export default connect(mapStateToProps, null)(Groups);