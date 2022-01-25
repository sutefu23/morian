import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { ButtonGroup, IconButton } from "@chakra-ui/react";

export const MonthSelect = () => {
  return (
    <ButtonGroup isAttached>
      <IconButton
        aria-label="previous month"
        icon={<ChevronLeftIcon />}
        bg="white"
      />
      <IconButton
        aria-label="next month"
        icon={<ChevronRightIcon />}
        bg="white"
      />
    </ButtonGroup>
  );
};
