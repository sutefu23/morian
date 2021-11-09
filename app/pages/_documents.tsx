import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

type Props = null

class Document extends NextDocument<Props> {
  render() {
    return (
      <Html lang="ja" >
      <Head>
        <title>モリアン在庫管理</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default Document