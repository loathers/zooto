import { Fragment } from "react";

import { Familiar } from "../calculate.js";

type Props = {
  familiar: Familiar;
};

export function Kick({ familiar }: Props) {
  return (
    <pre style={{ textWrap: "wrap" }}>
      <ul style={{ paddingLeft: 0, listStyle: "none" }}>
        {familiar.kick.map(([effect, intensity]) => (
          <Fragment key={effect}>{renderPower(effect, intensity)}</Fragment>
        ))}
      </ul>
    </pre>
  );
}

function renderPower(effect: string, intensity: number) {
  const percentage = `${Math.round(intensity * 100)}%`;
  switch (effect) {
    case "sniff":
      return (
        <li>
          <b>Sniff</b> ({percentage} power)
          <ul>
            <li>
              <i>5(?) different possibilities for number of copies added</i>
            </li>
          </ul>
        </li>
      );
    case "banish":
      return (
        <li>
          <b>Banish</b> ({percentage} power)
          <ul>
            <li>{111 - Math.floor(intensity * 80)} turns of ELY</li>
            <li>{intensity === 1 ? "Does not take" : "Takes"} a turn</li>
            <li>
              <i>Won't return for 𝑥 turns</i>
            </li>
          </ul>
        </li>
      );
    case "heal":
      return (
        <li>
          <b>Heal</b> ({percentage} power)
          <ul>
            <li>
              <i>Steal 𝑥 HP</i>
            </li>
          </ul>
        </li>
      );
    case "instakill":
      return (
        <li>
          <b>Instakill</b> ({percentage} power)
          <ul>
            <li>{111 - Math.floor(intensity * 80)} turns of ELY</li>
            <li>{intensity === 1 ? "Does not take" : "Takes"} a turn</li>
            <li>{intensity === 1 ? "Forces" : "Does not force"} all drops</li>
          </ul>
        </li>
      );
    case "stun":
      return (
        <li>
          <b>Stun</b> ({percentage} power)
          <ul>
            <li>
              <i>for 𝑥 (between 1 and 6) turns</i>
            </li>
          </ul>
        </li>
      );
    case "pp":
      return (
        <li>
          <b>Pickpocket</b> ({percentage} power)
          <ul>
            <li>
              <i>Chance increases with power</i>
            </li>
          </ul>
        </li>
      );
    default:
      return <>Unrecognised power "{effect}"</>;
  }
}
