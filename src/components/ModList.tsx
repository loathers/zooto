import { DataList } from "@chakra-ui/react";
import { Mods } from "../calculate.js";
import { memo } from "react";

type Props = {
  mods: Mods;
  sorted?: string;
};

function formatMod(mod: string) {
  if (mod.startsWith("Damage vs. ")) return "Dmg" + mod.substring(6);
  return mod;
}

export const ModList = memo(function ModList({ mods, sorted }: Props) {
  return (
    <DataList.Root orientation="horizontal" size="sm" gap={[1, null, 2]}>
      {Object.entries(mods).map(([mod, value]) => (
        <DataList.Item
          key={mod}
          alignItems="start"
          flexDirection={["column", null, "row"]}
          gap={1}
        >
          <DataList.ItemLabel color={mod === sorted ? "blue.500" : undefined}>
            {formatMod(mod)}
          </DataList.ItemLabel>
          <DataList.ItemValue color={mod === sorted ? "blue.700" : undefined}>
            {typeof value === "boolean" ? (value ? "true" : "false") : value}
          </DataList.ItemValue>
        </DataList.Item>
      ))}
    </DataList.Root>
  );
});
