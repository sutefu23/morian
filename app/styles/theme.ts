// theme.js
import { extendTheme } from "@chakra-ui/react"

const config = {
    initialColorMode: 'light',
    useSystemColorMode: false,
  }

const theme = extendTheme({
    config:{
        initialColorMode: 'light',
        useSystemColorMode: false,            
    },
})
export default theme