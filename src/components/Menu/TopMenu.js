import React, { Component } from 'react';
import { connect } from 'react-redux'
import { sideMenuA } from '../../redux/_actions/sideMenuA';
// import 'semantic-ui-css/semantic.min.css';
import { Icon, Image, Input, Menu, Button } from 'semantic-ui-react';
import Link from 'next/link';
import cookie from "js-cookie";


class TopMenu extends React.Component {
  doSearch(event) {
    console.log("search");
    // this.props.actions.search(event.target.value);  
  }

  toggleMenu = () => {
      this.props.dispatch(sideMenuA.toggleMenu())
  };

    handleLogout() {
        cookie.remove("authtoken");
        // Router.push("/login");
    }

  render() {
    return (
      <Menu fixed="top" className="top-menu">
        <Menu.Item className="logo-space-menu-item">
          <div className="display-inline logo-space">
            {/*<Image src="/static/images/icons8-r.png" />*/}
            <p>NET DAS</p>
          </div>
        </Menu.Item>

        <Menu.Item
          className="no-border"
          onClick={this.toggleMenu}
        >
          <Icon name="bars" />
        </Menu.Item>

        <Menu.Item className="no-border drop-left-padding">
          <Input
            className="icon"
            icon="search"
            placeholder="Search..."
            onChange={this.doSearch.bind(this)}
          />
        </Menu.Item>

        <Menu.Menu position="right">
          {/* <Menu.Item className="no-border" position="right"> */}
          {/* <Notification /> */}
          {/* <Label
                className="label-on-corner"
                color="teal"
                size={"mini"}
                floating
                circular
              >
                22
              </Label> */}
          {/* </Menu.Item> */}

          <Menu.Item className="no-border" position="right">
            <div className="display-inline">
              <Link prefetch href='/login'>
                <Button animated size='tiny' onClick={this.handleLogout}>
                  <Button.Content visible>
                    <Image avatar spaced='right' src='https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png' />
                    Admin
                  </Button.Content>
                  <Button.Content hidden>Log Out</Button.Content>
                </Button>
              </Link>
            </div>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}

export default connect(null)(TopMenu);