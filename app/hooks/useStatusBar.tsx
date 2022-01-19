import { useEffect, useMemo, useState, useRef } from "react";
import type {
  AlertStatus
} from '@chakra-ui/react'
import StatusBar from "~/components/feedback/statusBar";
export const useModalHook = (
  props: {status: AlertStatus, message: string}
) => {
  const { status, message } = props;
  const [ isOpen, setIsOpen ] = useState<boolean>(false);


   //useRef is good for preserving the identity of things -- without this handeOnRequestChange would be a new fn every render!
  const handleOnRequestClose = useRef((force = false) => setIsOpen(force)).current;

  const Status = useMemo(() => {
      isOpen && (
      <StatusBar status={status} message={message}/>
    )

  }, [isOpen, handleOnRequestClose, status, message])

  return {
    Status,
    setIsOpen
  };
};