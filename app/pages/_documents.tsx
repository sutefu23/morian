import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

type Props = null

class Document extends NextDocument<Props> {
  render() {
    return (
      <Html lang="ja" >
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default Document