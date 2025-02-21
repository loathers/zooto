import { Fragment } from "react";

import { Familiar } from "../calculate.js";
import { FamiliarContainer } from "./FamiliarContainer.js";

type Props = {
  familiars: Familiar[];
};

export function Kick({ familiars }: Props) {
  return (
    <>
      <h2>...grafted to your feet (for the combat skill; needs spading)</h2>
      <div style={{ gap: "1em", display: "flex", flexWrap: "wrap" }}>
        {familiars.map((familiar) => (
          <FamiliarContainer key={familiar.id} familiar={familiar}>
            <pre>
              {familiar.kick.map(([effect, intensity]) => (
                <Fragment key={effect}>
                  {renderPower(effect, intensity)}
                  <br />
                </Fragment>
              ))}
            </pre>
          </FamiliarContainer>
        ))}
      </div>
    </>
  );
}

function renderPower(effect: string, intensity: number) {
  const percentage = `${Math.round(intensity * 100)}%`;
  const turns = 110 - Math.floor(intensity * 80);
  switch (effect) {
    case "sniff":
      return (
        <>
          <b>Sniff</b> ({percentage} good)
        </>
      );
    case "banish":
      return (
        <>
          <b>Banish</b> ({percentage} good)
        </>
      );
    case "heal":
      return (
        <>
          <b>Sniff</b> ({percentage} good)
        </>
      );
    case "instakill":
      return (
        <>
          <b>Instakill</b> + {turns} turns of ELY
        </>
      );
    case "stun":
      return (
        <>
          <b>Stun</b> ({percentage} good)
        </>
      );
    case "pp":
      return (
        <>
          <b>Pickpocket</b> ({percentage} good)
        </>
      );
    default:
      return <>Unrecognised power "{effect}"</>;
  }
}
