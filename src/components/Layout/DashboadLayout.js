import 'semantic-ui-css/semantic.min.css';
import '../../assets/css/index.css';
import '../../assets/css/style.css';
import '../../assets/css/NavMenu.css';
import "react-toastify/dist/ReactToastify.css";
import React, { Component } from 'react';
import TopMenu from '../Menu/TopMenu';
import SideMenu from '../Menu/SideMenu';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

class DashboardLayout extends Component {
    
    componentWillReceiveProps(nextProps) {
        const {alerts} = this.props;
        const _alerts = nextProps.alerts || {};
        if(_alerts.message !== alerts.message) {
            if(_alerts.type === 'success') {
                toast.success(_alerts.message);
            } else if(_alerts.type === 'warn') {
                toast.warn(_alerts.message);
            } else if(_alerts.type === 'error') {
                toast.error(_alerts.message);
            }
        }
    }

    render() {
        return (
            <div className="grid">
                <div className="menu">
                    <TopMenu />
                </div>
                <div className="main-content">
                    <SideMenu>
                        {this.props.children}
                    </SideMenu>
                </div>
            </div>
        )
    }
}
const mapStateToProps =({alerts}) => ({alerts});

export default connect(mapStateToProps, null)(DashboardLayout);