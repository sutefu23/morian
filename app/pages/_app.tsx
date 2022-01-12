import '../styles/globals.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { parseCookies } from 'nookies';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';
import { RecoilRoot } from 'recoil';
import dynamic from 'next/dynamic'
import ErrorBoundary from '~/components/ErrorBoundary';
import AdminLayout from '~/components/layout/AdminLayout';
const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps, context: NextPageContext) {
  const router = useRouter();
  const cookies = parseCookies(context);
  useEffect(() => {
    const url = router.pathname
    if (url !== '/login' && url !== '/_error') {
      if (!cookies.token) {
        // CSR用リダイレクト処理
        router.push('/login');
      }
    }
  }, []);
  const NoSsr = dynamic(() => import('../components/NoSsr'))
  return (
    <NoSsr>
    <ErrorBoundary>
    <ChakraProvider>
      <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <AdminLayout>
        <Component {...pageProps} />
        </AdminLayout>
      </QueryClientProvider>
      </RecoilRoot>
    </ChakraProvider>
    </ErrorBoundary>
    </NoSsr>
  )
}

export default MyApp
