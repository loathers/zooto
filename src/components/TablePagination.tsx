import { Table } from "@tanstack/react-table";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPageText,
  PaginationPrevTrigger,
  PaginationRoot,
} from "./ui/pagination";
import { Box, Stack } from "@chakra-ui/react";

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
      <Stack direction="row" alignItems="center">
        <PaginationPrevTrigger />
        <Box display={["none", null, "block"]}>
          <PaginationItems />
        </Box>
        <Box display={["block", null, "none"]}>
          <PaginationPageText />
        </Box>
        <PaginationNextTrigger />
      </Stack>
    </PaginationRoot>
  );
}
