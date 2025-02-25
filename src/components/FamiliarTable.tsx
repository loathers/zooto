import { Image, List, Stack, Table, Text } from "@chakra-ui/react";
import { Familiar, getAllModifiers } from "../calculate";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowData,
  SortingFnOption,
  useReactTable,
} from "@tanstack/react-table";
import { KickPowerList } from "./KickPowerList";
import { useState } from "react";
import { LuCheck, LuX } from "react-icons/lu";
import { FamiliarTableHeader } from "./FamiliarTableHeader";
import { TablePagination } from "./TablePagination";
import { ModList } from "./ModList";

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
      <Stack direction={["column", null, null, "row"]} alignItems="center">
        <Image
          src={`https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/${info.row.original.image}`}
        />
        <Text whiteSpace="wrap" fontSize={["xs", null, "sm"]}>
          {info.getValue()}
        </Text>
      </Stack>
    ),
    enableColumnFilter: false,
    enableHiding: false,
  }),
  columnHelper.accessor("standard", {
    header: "Standard",
    cell: (info) => <Text>{info.getValue() ? <LuCheck /> : <LuX />}</Text>,
    enableColumnFilter: true,
    filterFn: "equals",
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
    enableColumnFilter: false,
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
    enableColumnFilter: false,
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
    enableColumnFilter: false,
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
    enableColumnFilter: false,
  }),
  columnHelper.accessor("kick", {
    header: "Feet",
    cell: (info) => (
      <KickPowerList
        powers={info.getValue()}
        sorted={
          info.column.getIsSorted()
            ? info.table.options.meta?.sortKeys[info.column.id]
            : undefined
        }
      />
    ),
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
    enableColumnFilter: false,
  }),
];

export function FamiliarTable({ familiars }: Props) {
  const [sortKeys, setSortKeys] = useState({});

  const table = useReactTable({
    data: familiars,
    columns,
    initialState: {
      columnVisibility: {
        attributes: false,
        standard: false,
      },
      columnFilters: [{ id: "standard", value: true }],
    },
    meta: {
      sortKeys,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Stack alignItems="center">
      <TablePagination table={table} />
      <Table.ScrollArea width="100%">
        <Table.Root>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id} verticalAlign="top">
                {headerGroup.headers.map((header) => (
                  <FamiliarTableHeader
                    key={header.id}
                    header={header}
                    onChangeSortKey={(v) =>
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
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
      <TablePagination table={table} />
    </Stack>
  );
}
