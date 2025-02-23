import { Image, List, Stack, Table, Text } from "@chakra-ui/react";
import { Familiar, getAllModifiers } from "../calculate";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  RowData,
  SortingFnOption,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { KickPowerList } from "./KickPowerList";
import { ModList } from "./Modlist";
import { useState } from "react";
import { LuCheck, LuX } from "react-icons/lu";
import { FamiliarTableColumnVisibility } from "./FamiliarTableColumnVisibility";
import { FamiliarTableHeader } from "./FamiliarTableHeader";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    modifiers?: [label: string, value: string][];
  }
}

declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    sortKeys: Record<string, string>;
  }
}

export type ExtendedFamiliar = Familiar & { standard: boolean };

type Props = {
  familiars: ExtendedFamiliar[];
};

const columnHelper = createColumnHelper<ExtendedFamiliar>();

const sortByModifier: SortingFnOption<ExtendedFamiliar> = (a, b, columnId) => {
  const table = a.getAllCells()[0].getContext().table;
  const sortKey = table.options.meta?.sortKeys?.[columnId];
  if (!sortKey) return 0;
  if (!(columnId in a.original)) return 0;

  // @ts-expect-error This is too generic to reasonably achieve
  const valueA = a.original[columnId][sortKey] ?? 0;
  // @ts-expect-error This is too generic to reasonably achieve
  const valueB = b.original[columnId][sortKey] ?? 0;

  return Number(valueA) - Number(valueB);
};

const columns = [
  columnHelper.accessor("name", {
    header: "Familiar",
    cell: (info) => (
      <Stack direction="row" alignItems="center">
        <Image
          src={`https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/${info.row.original.image}`}
        />
        <Text>{info.getValue()}</Text>
      </Stack>
    ),
  }),
  columnHelper.accessor("standard", {
    header: "Standard",
    cell: (info) => <Text>{info.getValue() ? <LuCheck /> : <LuX />}</Text>,
  }),
  columnHelper.accessor("attributes", {
    header: "Tags",
    cell: (info) => (
      <List.Root variant="plain">
        {info.getValue().map((a) => (
          <List.Item key={a}>{a}</List.Item>
        ))}
      </List.Root>
    ),
  }),
  columnHelper.accessor("intrinsic", {
    header: "Head, etc",
    cell: (info) => (
      <ModList
        mods={info.getValue()}
        sorted={
          info.column.getIsSorted()
            ? info.table.options.meta?.sortKeys[info.column.id]
            : undefined
        }
      />
    ),
    sortingFn: sortByModifier,
    meta: {
      modifiers: getAllModifiers().map((m) => [m, m]),
    },
  }),
  columnHelper.accessor("leftNipple", {
    header: "Left Nipple",
    cell: (info) => (
      <ModList
        mods={info.getValue()}
        sorted={
          info.column.getIsSorted()
            ? info.table.options.meta?.sortKeys[info.column.id]
            : undefined
        }
      />
    ),
    sortingFn: sortByModifier,
    meta: {
      modifiers: getAllModifiers().map((m) => [m, m]),
    },
  }),
  columnHelper.accessor("rightNipple", {
    header: "Right Nipple",
    cell: (info) => (
      <ModList
        mods={info.getValue()}
        sorted={
          info.column.getIsSorted()
            ? info.table.options.meta?.sortKeys[info.column.id]
            : undefined
        }
      />
    ),
    sortingFn: sortByModifier,
    meta: {
      modifiers: getAllModifiers().map((m) => [m, m]),
    },
  }),
  columnHelper.accessor("kick", {
    header: "Feet",
    cell: (info) => <KickPowerList powers={info.getValue()} />,
    sortingFn: sortByModifier,
    meta: {
      modifiers: [
        ["banish", "Banish"],
        ["heal", "Heal"],
        ["instakill", "Instakill"],
        ["pp", "Pickpocket"],
        ["sniff", "Sniff"],
        ["stun", "Stun"],
      ],
    },
  }),
];

export function FamiliarTable({ familiars }: Props) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    name: true,
    standard: true,
    attributes: false,
    intrinsic: true,
    leftNipple: true,
    rightNipple: true,
    kick: true,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortKeys, setSortKeys] = useState({});

  const table = useReactTable({
    data: familiars,
    columns,
    state: {
      columnVisibility,
      sorting,
    },
    meta: {
      sortKeys,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
  });

  return (
    <Table.Root>
      <Table.Header>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Row key={headerGroup.id} verticalAlign="top">
            {headerGroup.depth === 0 && (
              <Table.ColumnHeader>
                <FamiliarTableColumnVisibility
                  headers={table.getAllColumns().reduce(
                    (acc, column) => ({
                      ...acc,
                      [column.id]: column.columnDef.header ?? column.id,
                    }),
                    {},
                  )}
                  value={columnVisibility}
                  onChange={setColumnVisibility}
                />
              </Table.ColumnHeader>
            )}
            {headerGroup.headers.map((header) => (
              <FamiliarTableHeader
                key={header.id}
                header={header}
                onChange={(v) =>
                  setSortKeys((sk) => ({ ...sk, [header.id]: v }))
                }
              />
            ))}
          </Table.Row>
        ))}
      </Table.Header>
      <Table.Body>
        {table.getRowModel().rows.map((row) => (
          <Table.Row key={row.id} verticalAlign="top">
            <Table.Cell />
            {row.getVisibleCells().map((cell) => (
              <Table.Cell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
