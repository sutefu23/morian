import * as React from "react";
import { useOverlay, DismissButton, FocusScope } from "react-aria";
import { Box } from "@chakra-ui/react";

interface PopoverProps {
  popoverRef?: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Popover(props: PopoverProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { popoverRef = ref, isOpen, onClose, children } = props;

  // Handle events that should cause the popup to close,
  // e.g. blur, clicking outside, or pressing the escape key.
  const { overlayProps } = useOverlay(
    {
      isOpen,
      onClose,
      shouldCloseOnBlur: true,
      isDismissable: true
    },
    popoverRef
  );

  // Add a hidden <DismissButton> component at the end of the popover
  // to allow screen reader users to dismiss the popup easily.
  return (
    <FocusScope restoreFocus>
      <Box
        {...overlayProps}
        ref={popoverRef}
        background="white"
        border="1px solid lightgray"
        borderRadius="md"
        position="absolute"
        zIndex="10"
        top="100%"
        width="100%"
        boxShadow="lg"
        marginTop="1"
      >
        {children}
        <DismissButton onDismiss={onClose} />
      </Box>
    </FocusScope>
  );
}
