import { Select, SelectProps } from "@chakra-ui/react";
import { VFC } from "react";

const years = [2022, 2023, 2024, 2025, 2026, 2027];

export interface YearSelectProps {
  month: string;
  defaultValue?: SelectProps["value"];
}

export const YearSelect: VFC<YearSelectProps> = (props) => {
  const { month, defaultValue } = props;

  return (
    <Select
      placeholder="Select option"
      border="none"
      _hover={{ bg: "gray.100" }}
    >
      {years.map((year) => (
        <option value={year} selected={String(year) === String(defaultValue)}>
          {month} {year}
        </option>
      ))}
    </Select>
  );
};
