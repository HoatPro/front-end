import React from 'react'
import { Provider } from 'react-redux'
import App, { Container } from 'next/app'
import Head from 'next/head';
import withRedux from 'next-redux-wrapper'
import { initStore } from '../src/redux/store'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import redirectTo from '../src/components/Common/redirectTo.js';
import fetch from 'isomorphic-unfetch';
import _config from '../src/utils/config';
const config = _config[_config.environment];
import { parseCookies, setCookie, destroyCookie } from 'nookies';


export default withRedux(initStore)(
    class MyApp extends App {

        static clearCookies(res){
            destroyCookie(ctx, 'authtoken');
            destroyCookie(ctx, 'redirect');
            destroyCookie(ctx, 'user');
        }
        static async getInitialProps ({ Component, router, ctx }) {
            let pageProps = {};
            const coo = parseCookies(ctx);
            if (Component.getInitialProps) {
                pageProps = await Component.getInitialProps(ctx)
            }
            const query = ctx.query || {};
            const authtoken = coo.authtoken || query.token;
            if(typeof coo.authtoken == 'undefined') {
                if(ctx.pathname == "/login" || ctx.pathname == "/forgot-password") return {pageProps};
                else {
                    const redirect = config.originRoot + '/openid';
                    redirectTo(redirect, { res: ctx.res, status: 301 } );
                }
            }
            else {
                setCookie(ctx,'authtoken', authtoken, {
                    maxAge: 24 * 60 * 60,
                    path: '/',
                });
                let url = '';
                if(_config.environment === "production") {
                    if(ctx.res) {
                        url = 'http://172.27.131.172:3001';
                    } else {
                        url = config.originBackend;
                    }
                } else {
                    url = config.originBackend;
                }

                var response = await fetch(`${url}/netd-api/auth-user`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ access_token:coo.authtoken })
                })
                    .then( r => r.json() )
                    .then((resp) => {
                        if(ctx.pathname == "/login") {
                            if(resp.status === 200 && resp.message === "success") {
                                redirectTo('/', { res: ctx.res, status: 301 });
                            }
                            else {
                                this.clearCookies(ctx);
                            }

                            return {...pageProps, ...{query: ctx.query, authtoken: coo.authtoken}};

                        }
                        else {
                            if(resp.status === 200 && resp.message === "success")
                            {
                                setCookie(ctx,'authtoken', authtoken,{
                                    maxAge: 24 * 60 * 60,
                                    path: '/',
                                });
                                setCookie(ctx,'user', JSON.stringify(data.user),{
                                    maxAge: 24 * 60 * 60,
                                    path: '/',
                                });
                                return {...pageProps, ...{query: ctx.query, authtoken: coo.authtoken}};
                            }
                            else {
                                this.clearCookies(ctx);
                                redirectTo('/login', { res: ctx.res, status: 301 });
                            }
                        }
                    })
                    .catch((err) => { console.log(err); return {pageProps}; })
            }
            if(response !== null) {
                pageProps = response;
                return {pageProps};
            } else
                return {pageProps};

        }
        render () {
            const { Component, pageProps, store } = this.props;
            return (
                <Container>
                    <Head>
                        <title>Net Dashboard</title>
                    </Head>
                    <Provider store={store}>
                        <Component {...pageProps} />
                    </Provider>
                    <ToastContainer autoClose={2000} />
                </Container>
            )
        }
    }
)
