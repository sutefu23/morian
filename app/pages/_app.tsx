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
    const url = router.pathname
    if (url !== '/login' && url !== '/_error') {
      if (!cookies.token) {
        // CSR用リダイレクト処理
        window.location.href = '/login';
      }
    }
  }, []);

  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default MyApp
