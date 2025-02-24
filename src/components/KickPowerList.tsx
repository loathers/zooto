import { Powers } from "../calculate.js";
import { Badge, Stack, Text } from "@chakra-ui/react";
import { memo } from "react";

type Props = {
  powers: Powers;
};

export const KickPowerList = memo(function KickPowerList({ powers }: Props) {
  return (
    <Stack gap={0}>
      {Object.entries(powers).map(([effect, intensity]) => (
        <KickPower key={effect} effect={effect} intensity={intensity} />
      ))}
    </Stack>
  );
});

type KickPowerProps = {
  effect: string;
  intensity: number;
};

function KickPower({ effect, intensity }: KickPowerProps) {
  const percentage = `${Math.round(intensity * 100)}%`;
  switch (effect) {
    case "sniff":
      return (
        <Stack direction="row">
          <Text>
            <b>Sniff</b>: {percentage}
          </Text>
          <Badge
            variant="outline"
            title="5(?) different possibilities for number of copies added"
          >
            𝑥 copies
          </Badge>
        </Stack>
      );
    case "banish":
      return (
        <Stack direction="row" wrap="wrap">
          <Text>
            <b>Banish</b>: {percentage} power
          </Text>
          <Badge colorPalette="blue">
            {111 - Math.floor(intensity * 80)} ELB
          </Badge>
          {intensity === 1 && <Badge title="Does not take a turn">FREE</Badge>}
          <Badge variant="outline" title="Banished for x turns">
            𝑥 turns
          </Badge>
        </Stack>
      );
    case "heal":
      return (
        <Stack direction="row">
          <Text>
            <b>Heal</b>: {percentage} power
          </Text>
          <Badge variant="outline" title="Steal x HP">
            𝑥 HP
          </Badge>
        </Stack>
      );
    case "instakill":
      return (
        <Stack direction="row">
          <Text>
            <b>Instakill</b>: {percentage} power
          </Text>
          <Badge colorPalette="yellow">
            {111 - Math.floor(intensity * 80)} ELY
          </Badge>
          {intensity === 1 && <Badge title="Does not take a turn">FREE</Badge>}
          {intensity === 1 && <Badge title="Forces all drops">YR</Badge>}
        </Stack>
      );
    case "stun":
      return (
        <Stack direction="row">
          <Text>
            <b>Stun</b>: {percentage} power
          </Text>
          <Badge variant="outline" title="Stunned for x rounds">
            𝑥 rounds
          </Badge>
        </Stack>
      );
    case "pp":
      return (
        <Stack direction="row">
          <Text>
            <b>Pickpocket</b>: {percentage} power
          </Text>
          <Badge variant="outline" title="Chance increases with power">
            +𝑥% chance
          </Badge>
        </Stack>
      );
    default:
      return <>Unrecognised power "{effect}"</>;
  }
}
