import { Powers } from "../calculate.js";
import { Badge, DataList, Stack, Text } from "@chakra-ui/react";
import { memo } from "react";

type Props = {
  powers: Powers;
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

export const KickPowerList = memo(function KickPowerList({ powers }: Props) {
  return (
    <DataList.Root orientation="horizontal" size="sm">
      {Object.entries(powers).map(([effect, intensity]) => (
        <DataList.Item key={effect}>
          <DataList.ItemLabel>{getKickLabel(effect)}</DataList.ItemLabel>
          <DataList.ItemValue>
            <Stack direction="row" wrap="wrap">
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
  switch (effect) {
    case "sniff":
      return (
        <>
          <Badge
            size={size}
            variant="outline"
            title="5(?) different possibilities for number of copies added"
          >
            𝑥 copies
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
          <Badge size={size} variant="outline" title="Banished for x turns">
            𝑥 turns
          </Badge>
        </>
      );
    case "heal":
      return (
        <>
          <Badge size={size} variant="outline" title="Steal x HP">
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
          <Badge size={size} variant="outline" title="Stunned for x rounds">
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
            title="Chance increases with power"
          >
            +𝑥% chance
          </Badge>
        </>
      );
    default:
      return null;
  }
}
