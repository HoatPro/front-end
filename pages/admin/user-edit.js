import React, { Component } from 'react';
import { Label, Header, Segment, Form, Tab } from 'semantic-ui-react';
import DashboardLayout from '../../src/components/Layout/DashboadLayout';
import Head from 'next/head';
import Router from 'next/router';
import { connect } from 'react-redux';
import {userA} from '../../src/redux/_actions/admin/userA';
import _ from 'lodash';
import '../../static/awesome/css/font-awesome.css';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import CheckboxTree from 'react-checkbox-tree';
class UserEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isCompany: true,
            activeIndex: 0
        }
    }

    componentDidMount() {
        const {users, dispatch} = this.props;;
        const {action = '', loading = 0, current = {}} = users;
        if(action === 'update' && loading === 0 && _.size(current) === 0) {
            const {originalUrl =  ''} = users;
            const regex = new RegExp(/id\=(\d+)/);
            const find = originalUrl.match(regex);
            const id = find? parseInt(find[1]): null;
            if(!_.isNull(id)) dispatch(userA.getUserById({userId: id}));
        }
        this.getData();
        
    }

    componentWillReceiveProps(nextProps) {
        const {users} = nextProps;
        const {action = '', loading = 0, current = {}} = users;
        if((action === 'insert' && loading === 2 && !_.isUndefined(current.userId) && current.userId !== '') || (action === 'update' && loading === 2 && _.size(current) > 0)) {
            Router.push('/admin/users');
        }
    }

    getData() {
        this.props.dispatch(userA.getOthers());
    }

    handleSelectRoute(e, data) {
        this.props.dispatch(userA.updateCurrent('routeId', data.value));
    }

    validate() {
        let {users = {}, dispatch} = this.props;
        const {activeIndex} = this.state;
        let {current = {}, action} = users;
        
        let username = '', fullName = '', password = '', confirm = '', email = '';
        if(!current.username) {
            username = 'May be not empty';
        }

        if(!current.fullName) {
            fullName = 'May be not empty';
        }

        if(action === 'update') {
            if(activeIndex === 1) {
                if(!current.oldPassword) {
                    password = 'May be not empty';
                }
                if(!current.newPassword) {
                    password = 'May be not empty';
                } else if(current.newPassword === current.oldPassword) {
                    password = 'Mật khẩu mới không được trùng mật khẩu hiện tại';
                }
                if(current.confirmNewPassword !== current.newPassword) {
                    confirm = 'Không khớp với mật khẩu mới';
                }
            }
        } else {
            if(!current.isCompany) {
                if(!current.password) {
                    password = 'May be not empty';
                }
                if(current.confirm !== current.password) {
                    confirm = 'Không khớp với mật khẩu';
                }
            }
        }
        
        if(!current.email) {
            email = 'May be not empty';
        }
        
        if(!username && !fullName && !password && !confirm && !email) {
            return true;
        }
        dispatch(userA.validate({username: username, password: password, fullName: fullName, confirm: confirm, email: email}));
        return false;
    }

    handleSave(e) {
        if(!this.validate()) return false;
        const {users, dispatch} = this.props;
        const {activeIndex} = this.state;
        let {current, action} = users;
        if(action === 'insert') {
            dispatch(userA.insertUser(current));
        } else if(action === 'update') {
            if(activeIndex === 1) {
                dispatch(userA.resetPassword(current))
            } else {
                dispatch(userA.updateUser(current));
            }
        }
    }

    handleCancel() {
        Router.push('/admin/users');
    }

    handleChangeInput(e) {
        const {users = {}, dispatch} = this.props;
        const {name, value} = e.target;
        const {validate = {}} = users;
        let _error = '';
        if(!value && !_.isUndefined(validate[name])) {
            _error = 'May be not empty';
        }
        dispatch(userA.updateCurrent(name, value, _error));
    }

    handleCheckedGroup(data) {
        this.props.dispatch(userA.updateCurrent('checked', data.checked));
    }

    handleExpanded(data) {
        this.props.dispatch(userA.updateCurrent('expanded', data.expanded));
    }

    handleCompany() {
        const {dispatch, users = {}} = this.props;
        const {current = { isCompany: true}} = users;
        dispatch(userA.updateCurrent('isCompany', !current.isCompany));
    }

    onTabChange(e, data) {
        this.setState({activeIndex: data.activeIndex})
    }

    renderTab(checkbox) {
        const {activeIndex} = this.state;
        let {users = {}} = this.props;
        let {current = {
            userId: '',
            username: '',
            fullName: '',
            password: '',
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            email: '',
            confirm: '',
            checked: [],
            description: '',
            isCompany: true,
            isAdmin: false
        }, validate = {
            username: '',
            fullName: '',
            password: '',
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            email: '',
            confirm: '',
        }, loading = 0, action, groups= [], expanded = []} = users;
        const panes = [
            {
                menuItem: 'Thông tin tài khoản',
                render: () => <Tab.Pane>
                    <Form>
                        <Form.Group className="form-group" widths='equal'>
                            <Form.Input name='username' value={current.username} onChange={this.handleChangeInput.bind(this)} fluid label={<label>Tên Tài khoản <strong className="error-validate">*</strong></label>} placeholder='Tên User' error={validate.username? true: false}/>
                            <Label className={`error-text ${validate.username? '': 'hide'}`} basic color='red' pointing>
                                {validate.username}
                            </Label>
                        </Form.Group>
                        <Form.Group className="form-group" widths='equal'>
                            <Form.Input name='fullName' value={current.fullName} onChange={this.handleChangeInput.bind(this)} fluid label={<label>Họ tên <strong className="error-validate">*</strong></label>} placeholder='Họ tên' error={validate.fullName? true: false}/>
                            <Label className={`error-text ${validate.fullName? '': 'hide'}`} basic color='red' pointing>
                                {validate.fullName}
                            </Label>
                        </Form.Group>
                        <Form.Group className="form-group" widths='equal'>
                            <Form.Input name='email' value={current.email} onChange={this.handleChangeInput.bind(this)} fluid label={<label>Email <strong className="error-validate">*</strong></label>} placeholder='Email' error={validate.email? true: false}/>
                            <Label className={`error-text ${validate.email? '': 'hide'}`} basic color='red' pointing>
                                {validate.email}
                            </Label>
                        </Form.Group>
                        <Form.Group grouped  widths='equal'>
                            <label>Nhóm Quyền</label>
                            <Segment className='segment-checkbox'>
                                <CheckboxTree 
                                    nodes={checkbox}
                                    showNodeIcon={false}
                                    checked={current.checked}
                                    expanded={expanded}
                                    onCheck={checked => this.handleCheckedGroup({ checked })}
                                    onExpand={expanded => this.handleExpanded({ expanded })}
                                />
                            </Segment>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.TextArea name='description' fluid={"true"} onChange={this.handleChangeInput.bind(this)} value={current.description || ''} label='Mô tả' placeholder='Mô tả' />
                        </Form.Group>
                        <Form.Group>
                            <Form.Button secondary type='submit' disabled={loading === 1} onClick={this.handleCancel.bind(this)}>Hủy</Form.Button>
                            <Form.Button primary type='submit' disabled={loading === 1} onClick={this.handleSave.bind(this)}>Lưu</Form.Button>
                        </Form.Group>
                    </Form>
                </Tab.Pane>
            },
            {
                menuItem: 'Thay đổi mật khẩu',
                render: () => <Tab.Pane>
                    <Form>
                        <Form.Group className='form-group' widths='equal' >
                            <Form.Input 
                                name='oldPassword' 
                                type="password" 
                                value={current.oldPassword || ''} 
                                onChange={this.handleChangeInput.bind(this)} 
                                fluid 
                                label={<label>Mật khẩu hiện tại<strong className="error-validate">*</strong></label>} placeholder='Mật khẩu hiện tại' error={validate.oldPassword? true: false}/>
                            <Label className={`error-text ${validate.oldPassword? '': 'hide'}`} basic color='red' pointing>
                                {validate.oldPassword}
                            </Label>
                        </Form.Group>
                        <Form.Group className='form-group' widths='equal' >
                            <Form.Input 
                                name='newPassword' 
                                type="password" 
                                value={current.newPassword || ''} 
                                onChange={this.handleChangeInput.bind(this)} 
                                fluid 
                                label={<label>Mật khẩu mới<strong className="error-validate">*</strong></label>} placeholder='Mật khẩu mới' error={validate.newPassword? true: false}/>
                            <Label className={`error-text ${validate.newPassword? '': 'hide'}`} basic color='red' pointing>
                                {validate.newPassword}
                            </Label>
                        </Form.Group>
                        <Form.Group className='form-group' widths='equal'>
                            <Form.Input 
                                name='confirmNewPassword' 
                                type="password" 
                                value={current.confirmNewPassword || ''} 
                                onChange={this.handleChangeInput.bind(this)} 
                                fluid 
                                label={<label>Nhập lại Mật khẩu <strong className="error-validate">*</strong></label>} placeholder='Nhập lại Mật khẩu' error={validate.confirmNewPassword? true: false}/>
                            <Label className={`error-text ${validate.confirmNewPassword? '': 'hide'}`} basic color='red' pointing>
                                {validate.confirmNewPassword}
                            </Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Button secondary type='submit' disabled={loading === 1} onClick={this.handleCancel.bind(this)}>Hủy</Form.Button>
                            <Form.Button primary type='submit' disabled={loading === 1} onClick={this.handleSave.bind(this)}>Lưu</Form.Button>
                        </Form.Group>
                    </Form>
                </Tab.Pane>
            },
        ]

        return <Tab panes={panes} onTabChange={this.onTabChange.bind(this)} activeIndex={activeIndex} />    
    }

    render() {
        let {users = {}} = this.props;
        let {current = {
            userId: '',
            username: '',
            fullName: '',
            password: '',
            email: '',
            confirm: '',
            checked: [],
            description: '',
            isCompany: true,
            isAdmin: false
        }, validate = {
            username: '',
            fullName: '',
            password: '',
            email: '',
            confirm: '',
        }, loading = 0, action, groups= [], expanded = []} = users;
        const title = action === 'update'? 'Cập nhật Tài khoản': 'Thêm mới Tài khoản';
        let nodes = [];
        let children = _.map(groups, item => ({label: item.groupName, value: item.groupId}));
        nodes = [{
            value: 'all',
            label: 'Tất cả',
            children: children,
        }];
        
        return (
            <div>
                <Head>
                    <title>{title}</title>
                </Head>
                <DashboardLayout>
                    <Segment>
                        <Header>{title}</Header>
                        {
                            action === 'insert'? (<Form>
                                <Form.Group className="form-group" widths='equal'>
                                    <Form.Input name='username' value={current.username} onChange={this.handleChangeInput.bind(this)} fluid label={<label>Tên Tài khoản <strong className="error-validate">*</strong></label>} placeholder='Tên User' error={validate.username? true: false}/>
                                    <Label className={`error-text ${validate.username? '': 'hide'}`} basic color='red' pointing>
                                        {validate.username}
                                    </Label>
                                </Form.Group>
                                <Form.Group className="form-group" widths='equal'>
                                    <Form.Input name='fullName' value={current.fullName} onChange={this.handleChangeInput.bind(this)} fluid label={<label>Họ tên <strong className="error-validate">*</strong></label>} placeholder='Họ tên' error={validate.fullName? true: false}/>
                                    <Label className={`error-text ${validate.fullName? '': 'hide'}`} basic color='red' pointing>
                                        {validate.fullName}
                                    </Label>
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Checkbox toggle onChange={this.handleCompany.bind(this)} checked={current.isCompany} label='Sử dụng tài khoản email công ty' />
                                </Form.Group>
                                <Form.Group className={current.isCompany? 'hide': 'form-group'} widths='equal' >
                                    <Form.Input 
                                        name='password' 
                                        type="password" 
                                        value={current.password} 
                                        onChange={this.handleChangeInput.bind(this)} 
                                        fluid 
                                        label={<label>Mật khẩu <strong className="error-validate">*</strong></label>} placeholder='Mật khẩu' error={validate.password? true: false}/>
                                    <Label className={`error-text ${validate.password? '': 'hide'}`} basic color='red' pointing>
                                        {validate.password}
                                    </Label>
                                </Form.Group>
                                <Form.Group className={current.isCompany? 'hide': 'form-group'} widths='equal'>
                                    <Form.Input 
                                        name='confirm' 
                                        type="password" 
                                        value={current.confirm} 
                                        onChange={this.handleChangeInput.bind(this)} 
                                        fluid 
                                        label={<label>Nhập lại Mật khẩu <strong className="error-validate">*</strong></label>} placeholder='Nhập lại Mật khẩu' error={validate.confirm? true: false}/>
                                    <Label className={`error-text ${validate.confirm? '': 'hide'}`} basic color='red' pointing>
                                        {validate.confirm}
                                    </Label>
                                </Form.Group>
                                <Form.Group className="form-group" widths='equal'>
                                    <Form.Input name='email' value={current.email} onChange={this.handleChangeInput.bind(this)} fluid label={<label>Email <strong className="error-validate">*</strong></label>} placeholder='Email' error={validate.email? true: false}/>
                                    <Label className={`error-text ${validate.email? '': 'hide'}`} basic color='red' pointing>
                                        {validate.email}
                                    </Label>
                                </Form.Group>
                                <Form.Group grouped  widths='equal'>
                                    <label>Nhóm Quyền</label>
                                    <Segment className='segment-checkbox'>
                                        <CheckboxTree 
                                            nodes={nodes}
                                            showNodeIcon={false}
                                            checked={current.checked}
                                            expanded={expanded}
                                            onCheck={checked => this.handleCheckedGroup({ checked })}
                                            onExpand={expanded => this.handleExpanded({ expanded })}
                                        />
                                    </Segment>
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.TextArea name='description' fluid={"true"} onChange={this.handleChangeInput.bind(this)} value={current.description || ''} label='Mô tả' placeholder='Mô tả' />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Button secondary type='submit' disabled={loading === 1} onClick={this.handleCancel.bind(this)}>Hủy</Form.Button>
                                    <Form.Button primary type='submit' disabled={loading === 1} onClick={this.handleSave.bind(this)}>Lưu</Form.Button>
                                </Form.Group>
                            </Form>) : current.userId && current.password? this.renderTab(nodes)
                            : <Form>
                                <Form.Group className="form-group" widths='equal'>
                                    <Form.Input name='username' value={current.username} onChange={this.handleChangeInput.bind(this)} fluid label={<label>Tên Tài khoản <strong className="error-validate">*</strong></label>} placeholder='Tên User' error={validate.username? true: false}/>
                                    <Label className={`error-text ${validate.username? '': 'hide'}`} basic color='red' pointing>
                                        {validate.username}
                                    </Label>
                                </Form.Group>
                                <Form.Group className="form-group" widths='equal'>
                                    <Form.Input name='fullName' value={current.fullName} onChange={this.handleChangeInput.bind(this)} fluid label={<label>Họ tên <strong className="error-validate">*</strong></label>} placeholder='Họ tên' error={validate.fullName? true: false}/>
                                    <Label className={`error-text ${validate.fullName? '': 'hide'}`} basic color='red' pointing>
                                        {validate.fullName}
                                    </Label>
                                </Form.Group>
                                <Form.Group className="form-group" widths='equal'>
                                    <Form.Input name='email' value={current.email} onChange={this.handleChangeInput.bind(this)} fluid label={<label>Email <strong className="error-validate">*</strong></label>} placeholder='Email' error={validate.email? true: false}/>
                                    <Label className={`error-text ${validate.email? '': 'hide'}`} basic color='red' pointing>
                                        {validate.email}
                                    </Label>
                                </Form.Group>
                                <Form.Group grouped  widths='equal'>
                                    <label>Nhóm Quyền</label>
                                    <Segment className='segment-checkbox'>
                                        <CheckboxTree 
                                            nodes={nodes}
                                            showNodeIcon={false}
                                            checked={current.checked}
                                            expanded={expanded}
                                            onCheck={checked => this.handleCheckedGroup({ checked })}
                                            onExpand={expanded => this.handleExpanded({ expanded })}
                                        />
                                    </Segment>
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.TextArea name='description' fluid={"true"} onChange={this.handleChangeInput.bind(this)} value={current.description || ''} label='Mô tả' placeholder='Mô tả' />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Button secondary type='submit' disabled={loading === 1} onClick={this.handleCancel.bind(this)}>Hủy</Form.Button>
                                    <Form.Button primary type='submit' disabled={loading === 1} onClick={this.handleSave.bind(this)}>Lưu</Form.Button>
                                </Form.Group>
                            </Form>
                        }                        
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

UserEdit.getInitialProps = async (context) => {
    const {req = {}, query = {}, store} = context;
    const { originalUrl } = req;
    if(query.id) {
        await store.dispatch(userA.initUpdate({originalUrl, action: 'update'}));
    } else {
        await store.dispatch(userA.initUpdate({originalUrl, action: 'insert'}));
    }
    return  store.getState();
};

// const mapStateToProps =({users}) => ({users});
const mapStateToProps = (state, props) => {
    const { users = {} } = state;
    const _users = props.users;
    if(users.originalUrl) {
        return {
            users
        };
    } else {
        return {
            users: {
                ..._users,
                ...users,
            }
        };
    }
    
};

export default connect(mapStateToProps, null)(UserEdit);