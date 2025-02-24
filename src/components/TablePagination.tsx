import { Table } from "@tanstack/react-table";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "./ui/pagination";
import { Stack } from "@chakra-ui/react";

type Props<T> = {
  table: Table<T>;
};

export function TablePagination<T>({ table }: Props<T>) {
  return (
    <PaginationRoot
      count={table.getRowCount()}
      pageSize={table.getState().pagination.pageSize}
      page={table.getState().pagination.pageIndex + 1}
      onPageChange={({ page }) => table.setPageIndex(page - 1)}
    >
      <Stack direction="row">
        <PaginationPrevTrigger />
        <PaginationItems />
        <PaginationNextTrigger />
      </Stack>
    </PaginationRoot>
  );
}
