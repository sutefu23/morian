import {
  Alert,
  AlertIcon,
  AlertStatus
} from '@chakra-ui/react'
import React from 'react'

const StatusBar = (props: {status: AlertStatus, message: string}) => (
  <Alert status={props.status}>
  <AlertIcon />
  {props.message}
</Alert>
)

export default StatusBar