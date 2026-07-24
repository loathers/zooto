import { Header } from "@tanstack/react-table";
import { Group, IconButton, Popover, Portal } from "@chakra-ui/react";
import { LuCheck, LuFilter, LuX } from "react-icons/lu";

type Props<TData> = {
  header: Header<TData, unknown>;
};

export function FamiliarTableHeaderFilter<TData>({ header }: Props<TData>) {
  if (!header.column.getCanFilter()) return null;

  return (
    <Popover.Root positioning={{ placement: "bottom-start" }}>
      <Popover.Trigger asChild>
        <IconButton
          variant={header.column.getIsFiltered() ? "solid" : "outline"}
          size="2xs"
          title="Filter by value"
        >
          <LuFilter />
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content width="auto">
            <Group attached>
              <IconButton
                variant={
                  header.column.getFilterValue() === true ? "solid" : "outline"
                }
                size="xs"
                title="Show where value is true"
                onClick={() => {
                  header.column.setFilterValue(
                    header.column.getFilterValue() === true ? undefined : true,
                  );
                }}
              >
                <LuCheck />
              </IconButton>
              <IconButton
                variant={
                  header.column.getFilterValue() === false ? "solid" : "outline"
                }
                size="xs"
                title="Show where value is false"
                onClick={() => {
                  header.column.setFilterValue(
                    header.column.getFilterValue() === false
                      ? undefined
                      : false,
                  );
                }}
              >
                <LuX />
              </IconButton>
            </Group>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
