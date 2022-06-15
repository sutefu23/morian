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
    styles: {
        global: {
            body: {
                fontFamily: "'游ゴシック体', YuGothic, '游ゴシック', 'Yu Gothic', 'メイリオ', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', sans-serif",
                lineHeight: "1.5",
            },
        },
    },
    components: {
        Heading: {
            baseStyle: {
                color:"teal.400"
            },
        },
        Text: {
            sizes: {
            },
        },
        Table: {
            baseStyle: {
                table: {
                },
                th: {
                    fontWeight: 'normal',
                    bgColor: 'gray.100',

                },
            },
        },
        Flex:{
          baseStyle: {
            backgroundColor:"gray.200"
          }
        },
        Stack: {
          baseStyle: {
            backgroundColor:"whiteAlpha.900",
            boxShadow: "md"
          }
        },
        VStack:{
            baseStyle: {
                backgroundColor:"aliceblue",
            }    
        },
        InputLeftElement: {
          baseStyle: {
            color:"gray.300"
          }
        },
        Button: {
            baseStyle: {
                color: "teal"
            }
        },
        InputLeftAddon:{
            baseStyle: {
            }
        },
        Input:{
            baseStyle: {
            }
        }

    },
})
export default theme