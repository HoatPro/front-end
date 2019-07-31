import React, { Component } from 'react'
import { Menu, Accordion } from 'semantic-ui-react'
import Link from "next/link";
import Router from 'next/router'
import TextIcon from "../Extension/TextIcon";
import { connect } from "react-redux";
import { sideMenuA } from '../../redux/_actions/sideMenuA';

class SideMenu extends Component {
    state = { smallMenu: false };

    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.props.sideMenuR;
        const newIndex = activeIndex === index ? -1 : index;
        this.props.dispatch(sideMenuA.sendIndex(newIndex));
        // this.setState({ activeIndex: newIndex })
    };

    handleItemClick = (e) => {
        // this.setState({activeItem: name});
        // Router.push(name);
        // this.props.dispatch(sideMenuA.sendIndex(-1));
    };

    componentDidMount() {
        const path = Router.asPath;
        const index = path.split('/');
        if(index.length === 2){
            this.props.dispatch(sideMenuA.activeItem(path));
            this.props.dispatch(sideMenuA.sendIndex(-1));
        }
        else if(index.length > 2){
            this.props.dispatch(sideMenuA.activeItem(`/${index[2]}`));
            this.props.dispatch(sideMenuA.sendIndex(index[1]));
        }

    }

    componentWillReceiveProps(nextProps) {
        const iconDropdown = document.querySelectorAll('.title>i.dropdown.icon');
        const itemSidebar = document.querySelectorAll('.item-side-bar');
        if (nextProps.sideMenuR.smallMenu !== this.state.smallMenu) {
            this.setState({ smallMenu: nextProps.sideMenuR.smallMenu });

            if (nextProps.sideMenuR.smallMenu) {
                // a.style.cssText = 'display:none !important';
                iconDropdown.forEach(el => el.style.display = 'none');
                itemSidebar.forEach(item => {
                    const temp = item.innerHTML;
                    item.innerHTML = item.getAttribute("name");
                    item.setAttribute("name", temp);
                    item.style.cssText = 'padding-left: 0px';
                })

            } else {
                iconDropdown.forEach(el => el.style.display = 'inline');
                itemSidebar.forEach(item => {
                    const temp = item.innerHTML;
                    item.innerHTML = item.getAttribute("name");
                    item.setAttribute("name", temp);
                    item.style.cssText = 'padding-left: 20px';
                })
            }
        }
    }
    // changeSize = () => this.setState({smallSidebar: !this.props.smallMenu});

    getMenu = () => {
        const activeIndex = this.props.sideMenuR.activeIndex;
        const { smallMenu, activeItem } = this.props.sideMenuR;
        return (
            <Accordion as={Menu} fixed='left' borderless className={(smallMenu ? 'small-side' : '') + ' side'} vertical>
                <Link prefetch href="/">
                    <Menu.Item active={activeItem === '/'} onClick={this.handleItemClick}>
                        <TextIcon hideText={smallMenu} color='blue' name='home'>
                            Dashboard
                        </TextIcon>
                    </Menu.Item>
                </Link>
                {/*<Menu.Item>*/}
                    {/*<Accordion.Title*/}
                        {/*active={activeIndex === 'admin'}*/}
                        {/*content={<TextIcon hideText={smallMenu} name='users'>*/}
                                    {/*Admin*/}
                                {/*</TextIcon>}*/}
                        {/*index={'admin'}*/}
                        {/*onClick={this.handleClick}*/}
                    {/*/>*/}
                    {/*<Accordion.Content active={activeIndex === 'admin'} >*/}
                        {/*<Menu vertical secondary>*/}
                            {/*<Link href={'/admin/users'}>*/}
                                {/*<Menu.Item active={activeItem === '/users'}>*/}
                                    {/*<div className={'item-side-bar'} name='U'>Users</div>*/}
                                {/*</Menu.Item>*/}
                            {/*</Link>*/}
                            {/*<Link href={'/admin/routes'}>*/}
                                {/*<Menu.Item active={activeItem === '/routes'}>*/}
                                    {/*<div className={'item-side-bar'} name='RT'>Routes</div>*/}
                                {/*</Menu.Item>*/}
                            {/*</Link>*/}
                            {/*<Link href={'/admin/roles'}>*/}
                                {/*<Menu.Item active={activeItem === '/roles'}>*/}
                                    {/*<div className={'item-side-bar'} name='RL'>Roles</div>*/}
                                {/*</Menu.Item>*/}
                            {/*</Link>*/}
                            {/*<Link href={'/admin/groups'}>*/}
                                {/*<Menu.Item active={activeItem === '/groups'}>*/}
                                    {/*<div className={'item-side-bar'} name='G'>Groups</div>*/}
                                {/*</Menu.Item>*/}
                            {/*</Link>*/}
                        {/*</Menu>*/}
                    {/*</Accordion.Content>*/}
                {/*</Menu.Item>*/}
                <Menu.Item>
                    <Accordion.Title
                        active={activeIndex === 'group-mp'}
                        content={<TextIcon hideText={smallMenu} name='microsoft'>
                            BRAS
                        </TextIcon>}
                        index={'group-mp'}
                        onClick={this.handleClick}
                    />
                    <Accordion.Content active={activeIndex === 'group-mp'} >
                        <Menu vertical secondary>
                            <Link href={'/group-mp/group-mp-topos'}>
                                <Menu.Item active={activeItem === '/group-mp-topos'}>
                                    <div className={'item-side-bar'} name="Sh">Show</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/group-mp/group-mp-list'}>
                                <Menu.Item active={activeItem === '/group-mp-list'}>
                                    <div className={'item-side-bar'} name="Li">Group MP List</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/group-mp/group-mp-summary'}>
                                <Menu.Item active={activeItem === '/group-mp-summary'}>
                                    <div className={'item-side-bar'} name="Su">Summary</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/group-mp/parts'}>
                                <Menu.Item active={activeItem === '/parts'}>
                                    <div className={'item-side-bar'} name="Mn">Parts of device</div>
                                </Menu.Item>
                            </Link>
                        </Menu>
                    </Accordion.Content>
                </Menu.Item>
                <Menu.Item>
                    <Accordion.Title
                        active={activeIndex === 'cgnat'}
                        content={<TextIcon hideText={smallMenu} name='keyboard'>
                            CGNAT
                        </TextIcon>}
                        index={'cgnat'}
                        onClick={this.handleClick}
                    />
                    <Accordion.Content active={activeIndex === 'cgnat'} >
                        <Menu vertical secondary>
                            <Link href={'/cgnat/prefer'}>
                                <Menu.Item active={activeItem === '/prefer'}>
                                    <div className={'item-side-bar'} name="CP">CGNAT Prefer</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/cgnat/summary'}>
                                <Menu.Item active={activeItem === '/summary'}>
                                    <div className={'item-side-bar'} name="Sm">Summary</div>
                                </Menu.Item>
                            </Link>
                        </Menu>
                    </Accordion.Content>
                </Menu.Item>
                <Menu.Item>
                    <Accordion.Title
                        active={activeIndex === 'iplc'}
                        content={<TextIcon hideText={smallMenu} name='globe'>
                            IPLC
                        </TextIcon>}
                        index={'iplc'}
                        onClick={this.handleClick}
                    />
                    <Accordion.Content active={activeIndex === 'iplc'} >
                        <Menu vertical secondary>
                            <Link href={'/iplc/traffic-statistics'}>
                                <Menu.Item active={activeItem === '/traffic-statistics'}>
                                    <div className={'item-side-bar'} name="Pa">Traffic statistics</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/iplc/traffic-chart'}>
                                <Menu.Item active={activeItem === '/traffic-chart'}>
                                    <div className={'item-side-bar'} name="Pa">Traffic Chart</div>
                                </Menu.Item>
                            </Link>
                        </Menu>
                    </Accordion.Content>
                </Menu.Item>
                <Menu.Item>
                    <Accordion.Title
                        active={activeIndex === 'devices'}
                        content={<TextIcon hideText={smallMenu} name='tachometer alternate'>
                            DEVICES
                        </TextIcon>}
                        index={'devices'}
                        onClick={this.handleClick}
                    />
                    <Accordion.Content active={activeIndex === 'devices'} >
                        <Menu vertical secondary>
                            <Link href={'/devices/add-new-device'}>
                                <Menu.Item active={activeItem === '/add-new-device'}>
                                    <div className={'item-side-bar'} name="od">Add new device</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/devices/remove-ports'}>
                                <Menu.Item active={activeItem === '/remove-ports'}>
                                    <div className={'item-side-bar'} name="od">Remove ports logs</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/devices/devices'}>
                                <Menu.Item active={activeItem === '/devices'}>
                                    <div className={'item-side-bar'} name="Pa">All devices</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/devices/function-list'}>
                                <Menu.Item active={activeItem === '/function-list'}>
                                    <div className={'item-side-bar'} name="Pa">Function List</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/devices/areas-and-rooms'}>
                                <Menu.Item active={activeItem === '/areas-and-rooms'}>
                                    <div className={'item-side-bar'} name="Pa">Areas and Rooms</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/devices/warehouse'}>
                                <Menu.Item active={activeItem === '/warehouse'}>
                                    <div className={'item-side-bar'} name="Pa">Warehouse</div>
                                </Menu.Item>
                            </Link>
                        </Menu>
                    </Accordion.Content>
                </Menu.Item>
                {/*tuongdm*/}
                <Menu.Item>
                    <Accordion.Title
                        active={activeIndex === 'auto-balancing-transit-peering'}
                        content={<TextIcon hideText={smallMenu} name='bug'>
                            Transit/Peering
                        </TextIcon>}
                        index={'auto-balancing-transit-peering'}
                        onClick={this.handleClick}
                    />
                    <Accordion.Content active={activeIndex === 'auto-balancing-transit-peering'} >
                        <Menu vertical secondary>
                            <Link href={'/auto-balancing-transit-peering/irb-detail'}>
                                <Menu.Item active={activeItem === 'irb-detail'}>
                                    <div className={'item-side-bar'} name="od">IRB detail</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/auto-balancing-transit-peering/graph-flow-history'}>
                                <Menu.Item active={activeItem === '/graph-flow-history'}>
                                    <div className={'item-side-bar'} name="Pa">Graph flow history</div>
                                </Menu.Item>
                            </Link>
                        </Menu>
                    </Accordion.Content>
                </Menu.Item>
                <Menu.Item>
                    <Accordion.Title
                        active={activeIndex === 'auto-balancing-iplc'}
                        content={<TextIcon hideText={smallMenu} name='certificate'>
                            Balancing IPLC
                        </TextIcon>}
                        index={'auto-balancing-iplc'}
                        onClick={this.handleClick}
                    />
                    <Accordion.Content active={activeIndex === 'auto-balancing-iplc'} >
                        <Menu vertical secondary>
                            <Link href={'/auto-balancing-iplc/ipv6-to-mpop'}>
                                <Menu.Item active={activeItem === 'ipv6-to-mpop'}>
                                    <div className={'item-side-bar'} name="od">IpV6 to MPOP</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/auto-balancing-iplc/iplc-report'}>
                                <Menu.Item active={activeItem === 'iplc-report'}>
                                    <div className={'item-side-bar'} name="od">IPLC report</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/auto-balancing-iplc/equal-report'}>
                                <Menu.Item active={activeItem === 'equal-report'}>
                                    <div className={'item-side-bar'} name="od">Equal report</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/auto-balancing-iplc/iplc-mpop-by-gw-ipv6'}>
                                <Menu.Item active={activeItem === 'iplc-mpop-by-gw-ipv6'}>
                                    <div className={'item-side-bar'} name="od">IPLC - MP by GW's (ipv6)</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/auto-balancing-iplc/equal-mpop-by-gw-ipv6'}>
                                <Menu.Item active={activeItem === 'equal-mpop-by-gw-ipv6'}>
                                    <div className={'item-side-bar'} name="od">Equal - MP by GW's (ipv6)</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/auto-balancing-iplc/iplc-mpop-by-gw-ipv4'}>
                                <Menu.Item active={activeItem === 'iplc-mpop-by-gw-ipv4'}>
                                    <div className={'item-side-bar'} name="od">IPLC - MP by GW's (ipv4)</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/auto-balancing-iplc/equal-mpop-by-gw-ipv4'}>
                                <Menu.Item active={activeItem === 'equal-mpop-by-gw-ipv4'}>
                                    <div className={'item-side-bar'} name="od">Equal - MP by GW's (ipv4)</div>
                                </Menu.Item>
                            </Link>
                            {/*<Link href={'/auto-balancing/mail-history'}>*/}
                            {/*<Menu.Item active={activeItem === '/mail-history'}>*/}
                            {/*<div className={'item-side-bar'} name="Pa">Mail history</div>*/}
                            {/*</Menu.Item>*/}
                            {/*</Link>*/}
                        </Menu>
                    </Accordion.Content>
                </Menu.Item>
                {/* tungls */}
                <Menu.Item>
                    <Accordion.Title
                        active={activeIndex === 'tool-cgnat'}
                        content={<TextIcon hideText={smallMenu} name='cog'>
                            TOOL CGNAT
                        </TextIcon>}
                        index={'tool-cgnat'}
                        onClick={this.handleClick}
                    />
                    <Accordion.Content active={activeIndex === 'tool-cgnat'} >
                        <Menu vertical secondary>
                            <Link href={'/tool-cgnat/devices'}>
                                <Menu.Item active={activeItem === '/devices'}>
                                    <div className={'item-side-bar'} name="Pa">Devices config</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/tool-cgnat/error-log'}>
                                <Menu.Item active={activeItem === '/error-log'}>
                                    <div className={'item-side-bar'} name="od">Error</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/tool-cgnat/recommend-devices'}>
                                <Menu.Item active={activeItem === '/recommend-devices'}>
                                    <div className={'item-side-bar'} name="od">Recommend action</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/tool-cgnat/history'}>
                                <Menu.Item active={activeItem === '/history'}>
                                    <div className={'item-side-bar'} name="od">History</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/tool-cgnat/log-config'}>
                                <Menu.Item active={activeItem === '/log-config'}>
                                    <div className={'item-side-bar'} name="od">Log Config</div>
                                </Menu.Item>
                            </Link>
                            <Link href={'/tool-cgnat/variables-config'}>
                                <Menu.Item active={activeItem === '/variables-config'}>
                                    <div className={'item-side-bar'} name="od">Variables Config</div>
                                </Menu.Item>
                            </Link>
                        </Menu>
                    </Accordion.Content>
                </Menu.Item>

            </Accordion>
        )
    };

    render() {
        const { smallMenu } = this.props.sideMenuR;
        return (
            <div className='parent'>
                <div className={(smallMenu ? 'small-side ' : '') + 'side'}>
                    {this.getMenu()}
                </div>
                <div className={(smallMenu ? 'small-content ' : '') + 'content-layout'}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ sideMenuR }) => ({ sideMenuR });

export default connect(mapStateToProps, null )(SideMenu);