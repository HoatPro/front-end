import React, { Component } from 'react';
import { Label, Header, Segment, Form } from 'semantic-ui-react';
import DashboardLayout from '../../src/components/Layout/DashboadLayout';
import Head from 'next/head';
import Router from 'next/router';
import { connect } from 'react-redux';
import {routeA} from '../../src/redux/_actions/admin/routeA';
import _ from 'lodash';

class RouteEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isParent: true,
        }
    }

    componentDidMount() {
        const {routes, dispatch} = this.props;
        const {action = '', loading = 0, current = {}} = routes;
        if(action === 'update' && loading === 0 && _.size(current) === 0) {
            const {originalUrl =  ''} = routes;
            const regex = new RegExp(/id\=(\d+)/);
            const find = originalUrl.match(regex);
            const id = find? parseInt(find[1]): null;
            if(!_.isNull(id)) dispatch(routeA.getRouteById({routeId: id}));
        }
        this.getData();
        
    }

    componentWillReceiveProps(nextProps) {
        const {routes} = nextProps;
        const {action = '', loading = 0, current = {}} = routes;
        if((action === 'insert' && loading === 2 && !_.isUndefined(current.routeId) && current.routeId !== '') || (action === 'update' && loading === 2 && _.size(current) > 0)) {
            Router.push('/admin/routes');
        }
        if(action === 'update' && loading === 0 && _.size(current) > 0) {
            if(current.parentId) this.setState({isParent: false});
        }
    }

    getData() {
        this.props.dispatch(routeA.getRouteParents());
    }

    handleParent() {
        this.setState({isParent: !this.state.isParent});
    }

    handleSelectParent(e, data) {
        this.props.dispatch(routeA.updateCurrent('parentId', data.value));
    }

    validate() {
        let {routes, dispatch} = this.props;
        let {current = {}} = routes;
        
        let routeName = '', routeKey = '';
        if(!current.routeName) {
            routeName = 'May be not empty';
        }
        if(!current.routeKey) {
            routeKey = 'May be not empty';
        }
        if(!routeName && !routeKey) {
            return true;
        }
        dispatch(routeA.validate({routeName: routeName, routeKey: routeKey}));
        return false;
    }

    handleSave(e) {
        if(!this.validate()) return false;
        const {routes, dispatch} = this.props;
        let {current, action} = routes;
        if(action === 'insert') {
            dispatch(routeA.insertRoute(current));
        } else if(action === 'update') {
            dispatch(routeA.updateRoute(current));
        }
    }

    handleCancel() {
        Router.push('/admin/routes');
    }

    handleChangeInput(e) {
        const {routes, dispatch} = this.props;
        const {name, value} = e.target;
        const {validate = {}} = routes;
        let _error = '';
        if(!value && !_.isUndefined(validate[name])) {
            _error = 'May be not empty';
        }
        dispatch(routeA.updateCurrent(name, value, _error));
    }

    getId() {
        const { originalUrl, dispatch } = this.props;
        const regex = new RegExp(/id\=(\d+)/);
        console.log(originalUrl)
        // const pathname = history.location.pathname;
        const find = originalUrl.match(regex);
        const id = find? parseInt(find[1]): null;
        return id;
        // dispatch(stockOrderingActions.viewStockOrdering({id: id}));
    }

    render() {
        let {routes} = this.props;
        const {isParent} = this.state;
        let {current = {
            parentId: '',
            routeName: '',
            routeKey: '',
            description: ''
        }, validate = {
            routeName: '',
            routeKey: '',
        }, loading = 0, action} = routes;
        let parents = [];
        _.forEach(routes.parents, item => {
            parents.push({text: item.routeName, value: item.routeId});
        });
        const title = action === 'update'? 'Cập nhật Route': 'Thêm mới Route';
        
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
                                <Form.Input name='routeName' value={current.routeName} onChange={this.handleChangeInput.bind(this)} fluid label={<label>Tên Route <strong className="error-validate">*</strong></label>} placeholder='Tên Route' error={validate.routeName? true: false}/>
                                <Label className={`error-text ${validate.routeName? '': 'hide'}`} basic color='red' pointing>
                                    {validate.routeName}
                                </Label>
                            </Form.Group>
                            <Form.Group className="form-group" widths='equal'>
                                <Form.Input fluid name='routeKey' value={current.routeKey} onChange={this.handleChangeInput.bind(this)} label={<label>Route <strong className="error-validate">*</strong></label>} placeholder='URL (VD: /routes)' error={validate.routeKey? true: false}/>
                                <Label className={`error-text ${validate.routeKey? '': 'hide'}`} basic color='red' pointing>
                                    {validate.routeKey}
                                </Label>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.TextArea name='description' fluid={"true"} onChange={this.handleChangeInput.bind(this)} value={current.description || ''} label='Mô tả' placeholder='Mô tả' />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Checkbox toggle onChange={this.handleParent.bind(this)} checked={isParent} label='Is parent' />
                            </Form.Group>
                            <Form.Group widths='equal' className={isParent? 'hide': ''}>
                                <Form.Dropdown 
                                    label='Parent' 
                                    fluid 
                                    placeholder='Chọn...' 
                                    search 
                                    selection 
                                    clearable
                                    options={parents}
                                    onChange={this.handleSelectParent.bind(this)}
                                    value={current.parentId}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Button secondary  type='submit' disabled={loading === 1} onClick={this.handleCancel.bind(this)}>Hủy</Form.Button>
                                <Form.Button primary type='submit' disabled={loading === 1} onClick={this.handleSave.bind(this)}>Lưu</Form.Button>
                            </Form.Group>
                        </Form>
                    </Segment>
                </DashboardLayout>
            </div>
        );
    }
}

RouteEdit.getInitialProps = async (context) => {
    const {req = {}, query = {}, store} = context;
    const { originalUrl } = req;
    if(query.id) {
        await store.dispatch(routeA.initUpdate({originalUrl, action: 'update'}));
    } else {
        await store.dispatch(routeA.initUpdate({originalUrl, action: 'insert'}));
    }
    return  store.getState();
}

// const mapStateToProps =({routes}) => ({routes});
const mapStateToProps = (state, props) => {
    const { routes } = state;
    const _routes = props.routes;
    if(routes.originalUrl) {
        return {
            routes
        };
    } else {
        return {
            routes: {
                ...props.routes,
                ...routes,
            }
        };
    }
    
};

export default connect(mapStateToProps, null)(RouteEdit);