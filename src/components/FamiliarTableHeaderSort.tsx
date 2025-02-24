import { Header } from "@tanstack/react-table";
import { type ExtendedFamiliar } from "./FamiliarTable";
import {
  createListCollection,
  Group,
  IconButton,
  Popover,
  Portal,
} from "@chakra-ui/react";
import { LuArrowUp01, LuArrowDown10, LuArrowUpDown } from "react-icons/lu";
import { useMemo, useState } from "react";
import { Select } from "./Select";

type Props = {
  header: Header<ExtendedFamiliar, unknown>;
  onChange: (value: string) => void;
};

export function FamiliarTableHeaderSort({ header, onChange }: Props) {
  const sorted = header.column.getIsSorted();

  const { table } = header.getContext();

  const sortKey = table.options.meta?.sortKeys[header.id] ?? "";
  const [selected, setSelected] = useState(sortKey);

  const modifiers = useMemo(
    () => header.column.columnDef.meta?.modifiers ?? [],
    [header.column.columnDef.meta?.modifiers],
  );

  const options = createListCollection({
    items: modifiers,
    itemToValue: (m) => m[0],
    itemToString: (m) => m[1],
  });

  if (!header.column.getCanSort()) return null;
  if (!header.column.columnDef.meta?.modifiers) return null;

  return (
    <Popover.Root positioning={{ placement: "bottom-start" }}>
      <Popover.Trigger asChild>
        <IconButton
          variant={sorted ? "solid" : "outline"}
          size="2xs"
          title="Sort by modifier"
        >
          <LuArrowUpDown />
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Group attached alignItems="top">
              <Select
                size="xs"
                collection={options}
                placeholder="Select a modifier..."
                value={selected}
                onChange={setSelected}
              />
              <IconButton
                size="xs"
                variant={
                  sorted === "asc" && sortKey === selected ? "solid" : "outline"
                }
                disabled={!selected}
                title={
                  sorted === "asc" && sortKey === selected
                    ? "Clear sort"
                    : "Sort ascending"
                }
                onClick={() => {
                  onChange(selected);
                  if (sorted === "asc" && sortKey === selected) {
                    header.column.clearSorting();
                  } else {
                    header.column.toggleSorting(false);
                  }
                }}
              >
                <LuArrowUp01 />
              </IconButton>
              <IconButton
                size="xs"
                variant={
                  sorted === "desc" && sortKey === selected
                    ? "solid"
                    : "outline"
                }
                disabled={!selected}
                title={
                  sorted === "desc" && sortKey === selected
                    ? "Clear sort"
                    : "Sort descending"
                }
                onClick={() => {
                  onChange(selected);
                  if (sorted === "desc" && sortKey === selected) {
                    header.column.clearSorting();
                  } else {
                    header.column.toggleSorting(true);
                  }
                }}
              >
                <LuArrowDown10 />
              </IconButton>
            </Group>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
