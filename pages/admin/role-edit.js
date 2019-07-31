import React, { Component } from 'react';
import { Label, Header, Segment, Form, List, Icon, Checkbox } from 'semantic-ui-react';
import DashboardLayout from '../../src/components/Layout/DashboadLayout';
import Head from 'next/head';
import Router from 'next/router';
import { connect } from 'react-redux';
import {roleA} from '../../src/redux/_actions/admin/roleA';
import _ from 'lodash';
import '../../static/awesome/css/font-awesome.css';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import CheckboxTree from 'react-checkbox-tree';
class RoleEdit extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {roles, dispatch} = this.props;;
        const {action = '', loading = 0, current = {}} = roles;
        if(action === 'update' && loading === 0 && _.size(current) === 0) {
            const {originalUrl =  ''} = roles;
            const regex = new RegExp(/id\=(\d+)/);
            const find = originalUrl.match(regex);
            const id = find? parseInt(find[1]): null;
            if(!_.isNull(id)) dispatch(roleA.getRoleById({roleId: id}));
        }
        this.getData();
        
    }

    componentWillReceiveProps(nextProps) {
        const {roles} = nextProps;
        const {action = '', loading = 0, current = {}} = roles;
        if((action === 'insert' && loading === 2 && !_.isUndefined(current.roleId) && current.roleId !== '') || (action === 'update' && loading === 2 && _.size(current) > 0)) {
            Router.push('/admin/roles');
        }
    }

    getData() {
        this.props.dispatch(roleA.getOthers());
    }

    handleSelectRoute(e, data) {
        this.props.dispatch(roleA.updateCurrent('routeId', data.value));
    }

    validate() {
        let {roles, dispatch} = this.props;
        let {current = {}} = roles;
        
        let roleName = '';
        if(!current.roleName) {
            roleName = 'May be not empty';
        }
       
        if(!roleName) {
            return true;
        }
        dispatch(roleA.validate({roleName: roleName}));
        return false;
    }

    handleSave(e) {
        if(!this.validate()) return false;
        const {roles, dispatch} = this.props;
        let {current, action} = roles;
        if(action === 'insert') {
            dispatch(roleA.insertRole(current));
        } else if(action === 'update') {
            dispatch(roleA.updateRole(current));
        }
    }

    handleCancel() {
        Router.push('/admin/roles');
    }

    handleChangeInput(e) {
        const {roles = {}, dispatch} = this.props;
        const {name, value} = e.target;
        const {validate = {}} = roles;
        let _error = '';
        if(!value && !_.isUndefined(validate[name])) {
            _error = 'May be not empty';
        }
        dispatch(roleA.updateCurrent(name, value, _error));
    }

    handleCheckedPermission(data) {
        this.props.dispatch(roleA.updateCurrent('permission', data.checked));
    }

    handleExpanded(data) {
        this.props.dispatch(roleA.updateCurrent('expanded', data.expanded));
    }

    render() {
        let {roles = {}} = this.props;
        let {current = {
            roleId: '',
            roleName: '',
            routeId: '',
            permission: [],
            description: ''
        }, validate = {
            roleName: '',
            roleKey: '',
        }, loading = 0, action, operations= [], routes = [], expanded = []} = roles;
        const title = action === 'update'? 'Cập nhật Role': 'Thêm mới Role';
        let children = _.map(operations, item => ({label: item.operationName, value: item.operationId}));
        const nodes = [{
            value: 'all',
            label: 'Tất cả',
            children: children,
        }];
        const _routes = _.map(routes, item => ({text: item.routeName, value: item.routeId}));
        
        return (
            <div>
                <Head>
                    <title>{title}</title>
                </Head>
                <DashboardLayout>
                    <Segment>
                        <Header>{title}</Header>
                        <Form>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input name='roleName' value={current.roleName} onChange={this.handleChangeInput.bind(this)} fluid label={<label>Tên Role <strong className="error-validate">*</strong></label>} placeholder='Tên Role' error={validate.roleName? true: false}/>
                                <Label className={`error-text ${validate.roleName? '': 'hide'}`} basic color='red' pointing>
                                    {validate.roleName}
                                </Label>
                            </Form.Group>
                            <Form.Group grouped  widths='equal'>
                                <label>Quyền</label>
                                <Segment className='segment-checkbox'>
                                    <CheckboxTree 
                                        nodes={nodes}
                                        showNodeIcon={false}
                                        checked={current.permission}
                                        expanded={expanded}
                                        onCheck={checked => this.handleCheckedPermission({ checked })}
                                        onExpand={expanded => this.handleExpanded({ expanded })}
                                    />
                                </Segment>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.TextArea name='description' fluid={"true"} onChange={this.handleChangeInput.bind(this)} value={current.description || ''} label='Mô tả' placeholder='Mô tả' />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Dropdown
                                    label='Route' 
                                    fluid 
                                    placeholder='Chọn...' 
                                    search 
                                    selection
                                    clearable
                                    options={_routes}
                                    onChange={this.handleSelectRoute.bind(this)}
                                    value={current.routeId}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Button secondary type='submit' disabled={loading === 1} onClick={this.handleCancel.bind(this)}>Hủy</Form.Button>
                                <Form.Button primary type='submit' disabled={loading === 1} onClick={this.handleSave.bind(this)}>Lưu</Form.Button>
                            </Form.Group>
                        </Form>
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

RoleEdit.getInitialProps = async (context) => {
    const {req = {}, query = {}, store} = context;
    const { originalUrl } = req;
    if(query.id) {
        await store.dispatch(roleA.initUpdate({originalUrl, action: 'update'}));
    } else {
        await store.dispatch(roleA.initUpdate({originalUrl, action: 'insert'}));
    }
    return  store.getState();
}

// const mapStateToProps =({roles}) => ({roles});
const mapStateToProps = (state, props) => {
    const { roles = {} } = state;
    const _roles = props.roles;
    if(roles.originalUrl) {
        return {
            roles
        };
    } else {
        return {
            roles: {
                ..._roles,
                ...roles,
            }
        };
    }
    
};

export default connect(mapStateToProps, null)(RoleEdit);