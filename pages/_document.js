import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render () {
    return (
      <html>
        <Head >
            <link rel="shortcut icon" type="image/x-icon" href="/static/favicon.ico" />
            <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
            <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
