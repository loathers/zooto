import { LuCircleChevronRight, LuCircleHelp } from "react-icons/lu";
import { Powers } from "../calculate.js";
import { Badge, Box, List, Stack } from "@chakra-ui/react";

type Props = {
  powers: Powers;
};

export function KickPowerList({ powers }: Props) {
  return (
    <Stack gap={0}>
      {Object.entries(powers).map(([effect, intensity]) => (
        <KickPower key={effect} effect={effect} intensity={intensity} />
      ))}
    </Stack>
  );
}

type KickPowerProps = {
  effect: string;
  intensity: number;
};

function KickPower({ effect, intensity }: KickPowerProps) {
  const percentage = `${Math.round(intensity * 100)}%`;
  switch (effect) {
    case "sniff":
      return (
        <Box>
          <b>Sniff</b> <Badge>{percentage} power</Badge>
          <List.Root variant="plain">
            <List.Item>
              <List.Indicator asChild>
                <LuCircleHelp />
              </List.Indicator>
              5(?) different possibilities for number of copies added
            </List.Item>
          </List.Root>
        </Box>
      );
    case "banish":
      return (
        <Box>
          <b>Banish</b> <Badge>{percentage} power</Badge>
          <List.Root variant="plain">
            <List.Item>
              <List.Indicator asChild>
                <LuCircleChevronRight />
              </List.Indicator>
              {111 - Math.floor(intensity * 80)} turns of ELB
            </List.Item>
            <List.Item>
              <List.Indicator asChild>
                <LuCircleChevronRight />
              </List.Indicator>
              {intensity === 1 ? "Does not take" : "Takes"} a turn
            </List.Item>
            <List.Item>
              <List.Indicator asChild>
                <LuCircleHelp />
              </List.Indicator>
              Won't return for 𝑥 turns
            </List.Item>
          </List.Root>
        </Box>
      );
    case "heal":
      return (
        <Box>
          <b>Heal</b> <Badge>{percentage} power</Badge>
          <List.Root variant="plain">
            <List.Item>
              <List.Indicator asChild>
                <LuCircleHelp />
              </List.Indicator>
              Steal 𝑥 HP
            </List.Item>
          </List.Root>
        </Box>
      );
    case "instakill":
      return (
        <Box>
          <b>Instakill</b> <Badge>{percentage} power</Badge>
          <List.Root variant="plain">
            <List.Item>
              <List.Indicator asChild>
                <LuCircleChevronRight />
              </List.Indicator>
              {111 - Math.floor(intensity * 80)} turns of ELY
            </List.Item>
            <List.Item>
              <List.Indicator asChild>
                <LuCircleChevronRight />
              </List.Indicator>
              {intensity === 1 ? "Does not take" : "Takes"} a turn
            </List.Item>
            <List.Item>
              <List.Indicator asChild>
                <LuCircleChevronRight />
              </List.Indicator>
              {intensity === 1 ? "Forces" : "Does not force"} all drops
            </List.Item>
          </List.Root>
        </Box>
      );
    case "stun":
      return (
        <Box>
          <b>Stun</b> <Badge>{percentage} power</Badge>
          <List.Root variant="plain">
            <List.Item>
              <List.Indicator asChild>
                <LuCircleChevronRight />
              </List.Indicator>
              Stunned for 𝑥 turns (between 1 and 6)
            </List.Item>
          </List.Root>
        </Box>
      );
    case "pp":
      return (
        <Box>
          <b>Pickpocket</b> <Badge>{percentage} power</Badge>
          <List.Root variant="plain">
            <List.Item>
              <List.Indicator asChild>
                <LuCircleChevronRight />
              </List.Indicator>
              Chance increases with power
            </List.Item>
          </List.Root>
        </Box>
      );
    default:
      return <>Unrecognised power "{effect}"</>;
  }
}
