import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import '../src/assets/css/loginPage.css';
import {Button, Form, Grid, Header, Image, Message, Segment} from 'semantic-ui-react';
import Link from 'next/link';
import axios from 'axios';
import api from '../src/redux/_actions/api';

class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loggingIn: false,
            errorMessage: ''
        }
    }

    handleChangeInput(e) {
        const {name, value} = e.target;
        this.setState({
            [name]: value
        })
    }

    hanldeLogin = async () => {
        if(!this.state.loggingIn) {

            this.setState({loggingIn: true, errorMessage: ''});
            let params = {
                email: this.state.email, password: this.state.password
            };
            let _this = this;

            await axios.post(api.login, params)
                .then(function(resp){
                    if(resp.status === 200 && resp.data.message === 'success'){
                        document.cookie = 'authtoken=' + resp.data.authtoken;
                        window.location = "/";
                    } else {
                        _this.setState({loggingIn: false, errorMessage: 'Email or Password is invalid.'});
                    }
                    _this.setState({loggingIn: false});
                });



            //     fetch(API_URL+'/auth', {
            //     method: 'POST', headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email: this.state.email, password: this.state.password })
            //   })
            //     .then( r => r.json() )
            //   .then( resp => {

            //       /* returns a JSON object {result: "success"} or {error:""} with 400 status */

            //       if(!resp.result) {
            //           this.setState({errorMessage: 'Email or Password is invalid.'})
            //       }
            //       else {
            //           document.cookie = 'authtoken=' + resp.token;
            //           window.location = "/dashboard";
            //       }

            //       this.setState({loggingIn: false });
            //   })
        }
    };

    render(){
        let {email, password, loggingIn} = this.state;
        return (
                <Grid textAlign='center' style={{ padding: 0, margin: 0, height: '100%', width: '100%', backgroundColor: '#eaecefb5' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='blue' textAlign='center'>
                           Login to NET Dashboard
                        </Header>
                        <Form size='large'>
                            <Segment>
                                {
                                    this.state.errorMessage !== '' ?
                                        <Message negative>
                                            <Message.Header> {this.state.errorMessage} </Message.Header>
                                        </Message>
                                        : null
                                }

                                <Form.Input
                                    fluid icon='user'
                                    iconPosition='left'
                                    placeholder='Username'
                                    name='email'
                                    value={email}
                                    onChange={this.handleChangeInput.bind(this)}
                                    required
                                />
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    name='password'
                                    value={password}
                                    onChange={this.handleChangeInput.bind(this)}
                                    required
                                />
                                {/*<Link prefetch href='/'>*/}
                                    <Button color='blue' fluid size='large' onClick={(e) => this.hanldeLogin(e)}>
                                        {loggingIn ? 'Logging in...' : 'Log In'}
                                    </Button>
                                {/*</Link>*/}
                            </Segment>
                        </Form>
                        <Message icon>
                            {/*<Image size='tiny' src='/static/images/logoFtel.png'/>*/}
                            <Message.Content>
                                Copyright © 2019, NOC - AST
                            </Message.Content>
                        </Message>
                    </Grid.Column>
                </Grid>
        )
    }
}

export default Login;