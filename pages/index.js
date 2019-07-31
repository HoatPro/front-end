import React, { Component } from 'react';
// import 'semantic-ui-css/semantic.min.css';
// import '../src/assets/css/index.css';
import { Segment } from 'semantic-ui-react';
import DashboardLayout from '../src/components/Layout/DashboadLayout';
import Head from 'next/head'
class Index extends React.Component {
  // static async getInitialProps(context) {
  // const { id } = context.query;
  // const res = await fetch(`https://api.tvmaze.com/shows/${id}`);
  // const show = await res.json();

  // console.log(`fetched show: ${show.name}`)
  // return { show }
  // }s

  render() {
    return (
      <div>
        <Head>
          <title> Home </title>
        </Head>
        <DashboardLayout>
          <Segment>
            <h1> NET Dashboard</h1>
          </Segment>
        </DashboardLayout>
      </div>
     
    )
  }
}

export default Index;