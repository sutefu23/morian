import '../styles/globals.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { parseCookies } from 'nookies';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';
const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps, context: NextPageContext) {
  const router = useRouter();
  const cookies = parseCookies(context);
  useEffect(() => {
    router.beforePopState(({ url }) => {
      // ログイン画面とエラー画面遷移時のみ認証チェックを行わない
      if (url !== '/login' && url !== '/_error') {
        if (!cookies.auth) {
          // CSR用リダイレクト処理
          window.location.href = '/login';
          return false;
        }
      }
      return true;
    });
  }, []);

  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </ChakraProvider>
  )
}

MyApp.getInitialProps = async (appContext: any) => {
  // SSR用認証チェック

  const cookies = parseCookies(appContext.ctx);
  // ログイン画面とエラー画面遷移時のみ認証チェックを行わない
  if (
    appContext.ctx.pathname !== '/login' &&
    appContext.ctx.pathname !== '/_error'
  ) {
    if (!cookies.auth) {
     // SSR or CSRを判定
      const isServer = typeof window === 'undefined';
      if (isServer) {
        console.log('in ServerSide');
        appContext.ctx.res.statusCode = 302;
        appContext.ctx.res.setHeader('Location', '/login');
        return {};
      } else {
        console.log('in ClientSide');
      }
    }
  }
  return {
    pageProps: {
      ...(appContext.Component.getInitialProps
        ? await appContext.Component.getInitialProps(appContext.ctx)
        : {}),
      pathname: appContext.ctx.pathname,
    },
  };
};
export default MyApp
