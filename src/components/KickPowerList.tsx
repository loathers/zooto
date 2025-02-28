import { Powers } from "../calculate.js";
import { Badge, DataList, Stack } from "@chakra-ui/react";
import { memo } from "react";

type Props = {
  powers: Powers;
  sorted?: string;
};

function getKickLabel(effect: string) {
  return (
    {
      sniff: "Sniff",
      banish: "Banish",
      heal: "Heal",
      instakill: "Instakill",
      stun: "Stun",
      pp: "Pickpocket",
    }[effect] ?? effect
  );
}

export const KickPowerList = memo(function KickPowerList({
  powers,
  sorted,
}: Props) {
  return (
    <DataList.Root orientation="horizontal" size="sm" gap={[1, null, 2]}>
      {Object.entries(powers).map(([effect, intensity]) => (
        <DataList.Item
          key={effect}
          alignItems="start"
          flexDirection={["column", null, "row"]}
          gap={1}
        >
          <DataList.ItemLabel
            color={effect === sorted ? "blue.500" : undefined}
          >
            {getKickLabel(effect)}
          </DataList.ItemLabel>
          <DataList.ItemValue
            color={effect === sorted ? "blue.700" : undefined}
          >
            <Stack direction="row" wrap="wrap" gap={1}>
              {Math.round(intensity * 100)}%
              <KickPowerBadges
                size="xs"
                effect={effect}
                intensity={intensity}
              />
            </Stack>
          </DataList.ItemValue>
        </DataList.Item>
      ))}
    </DataList.Root>
  );
});

type KickPowerBadgesProps = {
  effect: string;
  intensity: number;
  size: React.ComponentProps<typeof Badge>["size"];
};

function KickPowerBadges({ size, effect, intensity }: KickPowerBadgesProps) {
  if (intensity === 0) return null;
  switch (effect) {
    case "sniff":
      const copies = (() => {
        if (intensity < 0.3) return "2-3";
        if (intensity < 0.6) return "3-4";
        if (intensity < 0.9) return "4-5";
        return "5-6";
      })();
      return (
        <>
          <Badge
            size={size}
            variant="outline"
            title={`BEING SPADED: ${copies} copies added to the CSV`}
          >
            {copies} copies
          </Badge>
        </>
      );
    case "banish":
      return (
        <>
          <Badge size={size} colorPalette="blue">
            {111 - Math.floor(intensity * 80)} ELB
          </Badge>
          {intensity === 1 && <Badge title="Does not take a turn">FREE</Badge>}
          <Badge
            size={size}
            variant="outline"
            title="BEING SPADED: Banished for x turns"
          >
            𝑥 turns
          </Badge>
        </>
      );
    case "heal":
      return (
        <>
          <Badge size={size} variant="outline" title="BEING SPADED: Steal x HP">
            𝑥 HP
          </Badge>
        </>
      );
    case "instakill":
      return (
        <>
          <Badge size={size} colorPalette="yellow">
            {111 - Math.floor(intensity * 80)} ELY
          </Badge>
          {intensity === 1 && (
            <Badge size={size} title="Does not take a turn">
              FREE
            </Badge>
          )}
          {intensity === 1 && (
            <Badge size={size} title="Forces all drops">
              YR
            </Badge>
          )}
        </>
      );
    case "stun":
      return (
        <>
          <Badge
            size={size}
            variant="outline"
            title="BEING SPADED: Stunned for x rounds"
          >
            𝑥 rounds
          </Badge>
        </>
      );
    case "pp":
      return (
        <>
          <Badge
            size={size}
            variant="outline"
            title="BEING SPADED: Chance increases with power"
          >
            +𝑥% chance
          </Badge>
        </>
      );
    default:
      return null;
  }
}
