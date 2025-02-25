import { flexRender, Header } from "@tanstack/react-table";
import { ExtendedFamiliar } from "./FamiliarTable";
import { Group, Stack, Table } from "@chakra-ui/react";
import { FamiliarTableHeaderSort } from "./FamiliarTableHeaderSort";
import { FamiliarTableHeaderFilter } from "./FamiliarTableHeaderFilter";
import { FamiliarTableColumnVisibility } from "./FamiliarTableColumnVisibility";

type Props = {
  header: Header<ExtendedFamiliar, unknown>;
  onChangeSortKey: (value: string) => void;
};

export function FamiliarTableHeader({ header, onChangeSortKey }: Props) {
  if (header.isPlaceholder) return <Table.ColumnHeader />;

  const table = header.getContext().table;

  return (
    <Table.ColumnHeader>
      <Stack
        direction="row"
        alignItems="center"
        gap={1}
        justifyContent="space-between"
      >
        {header.index === 0 && (
          <FamiliarTableColumnVisibility
            columns={table.getAllColumns()}
          />
        )}
        {flexRender(header.column.columnDef.header, header.getContext())}
        <Group gap={1}>
          <FamiliarTableHeaderSort
            header={header}
            onChange={onChangeSortKey}
          />
          <FamiliarTableHeaderFilter header={header} />
        </Group>
      </Stack>
    </Table.ColumnHeader>
  );
}
