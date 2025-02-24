import { Checkmark, IconButton, Menu, Portal } from "@chakra-ui/react";
import { LuTableProperties } from "react-icons/lu";
import { ExtendedFamiliar } from "./FamiliarTable";
import { Column } from "@tanstack/react-table";

type Props = {
  columns: Column<ExtendedFamiliar>[];
};

export function FamiliarTableColumnVisibility({ columns }: Props) {
  return (
    <Menu.Root
      onSelect={({ value }) =>
        columns.find((c) => c.id === value)?.toggleVisibility()
      }
    >
      <Menu.Trigger asChild>
        <IconButton variant="outline" size="2xs" title="Column visibility">
          <LuTableProperties />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {columns.map((column) => (
              <Menu.Item key={column.id} value={column.id} cursor="pointer">
                <Checkmark checked={column.getIsVisible()} />{" "}
                {typeof column.columnDef.header === "string"
                  ? column.columnDef.header
                  : column.id}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
