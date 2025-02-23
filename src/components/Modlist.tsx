import { Stack, Text } from "@chakra-ui/react";
import { Mods } from "../calculate.js";

type Props = {
  mods: Mods;
  sorted?: string;
};

export function ModList({ mods, sorted }: Props) {
  return (
    <Stack gap={0}>
      {Object.entries(mods).map(([mod, value]) => (
        <Text key={mod} color={mod === sorted ? "blue" : undefined}>
          <b>{mod}</b>:{" "}
          {typeof value === "boolean" ? (value ? "true" : "false") : value}
        </Text>
      ))}
    </Stack>
  );
}
