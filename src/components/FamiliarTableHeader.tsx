import { flexRender, Header } from "@tanstack/react-table";
import { ExtendedFamiliar } from "./FamiliarTable";
import {
  createListCollection,
  Group,
  IconButton,
  Popover,
  Portal,
  Select,
  Stack,
  Table,
} from "@chakra-ui/react";
import {
  LuArrowUp01,
  LuArrowUp10,
  LuCircleX,
  LuSettings,
} from "react-icons/lu";
import { useMemo, useState } from "react";

type Props = {
  header: Header<ExtendedFamiliar, unknown>;
  onChange: (value: string) => void;
};

export function FamiliarTableHeader({ header, onChange }: Props) {
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

  if (header.isPlaceholder) return <Table.ColumnHeader />;

  return (
    <Table.ColumnHeader>
      <Stack>
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          justifyContent="space-between"
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          {header.column.getCanSort() &&
            header.column.columnDef.meta?.modifiers && (
              <Popover.Root positioning={{ placement: "bottom-start" }}>
                <Popover.Trigger asChild>
                  <IconButton
                    variant={sorted ? "solid" : "outline"}
                    size="2xs"
                    title="Sort by modifier"
                  >
                    <LuSettings />
                  </IconButton>
                </Popover.Trigger>
                <Portal>
                  <Popover.Positioner>
                    <Popover.Content padding={3}>
                      <Stack>
                        <Select.Root
                          size="sm"
                          collection={options}
                          value={[selected]}
                          onValueChange={(e) => setSelected(e.value[0])}
                        >
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select a modifier..." />
                          </Select.Trigger>
                          <Select.Content>
                            {options.items.map((item) => (
                              <Select.Item key={item[0]} item={item}>
                                {item[1]}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                        <Group attached>
                          <IconButton
                            variant={
                              sorted === "asc" && sortKey === selected
                                ? "solid"
                                : "outline"
                            }
                            disabled={sorted === "asc" && sortKey === selected}
                            size="xs"
                            title="Sort ascending"
                            onClick={() => {
                              onChange(selected);
                              header.column.toggleSorting(false);
                            }}
                          >
                            <LuArrowUp01 />
                          </IconButton>
                          <IconButton
                            variant={
                              sorted === "desc" && sortKey === selected
                                ? "solid"
                                : "outline"
                            }
                            disabled={sorted === "desc" && sortKey === selected}
                            size="xs"
                            title="Sort descending"
                            onClick={() => {
                              onChange(selected);
                              header.column.toggleSorting(true);
                            }}
                          >
                            <LuArrowUp10 />
                          </IconButton>
                          <IconButton
                            variant="outline"
                            size="xs"
                            title="Clear sort"
                            onClick={() => {
                              onChange("");
                              header.column.clearSorting();
                            }}
                          >
                            <LuCircleX />
                          </IconButton>
                        </Group>
                      </Stack>
                    </Popover.Content>
                  </Popover.Positioner>
                </Portal>
              </Popover.Root>
            )}
        </Stack>
      </Stack>
    </Table.ColumnHeader>
  );
}
