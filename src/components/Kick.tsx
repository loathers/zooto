import { Fragment } from "react";

import { Power } from "../calculate.js";

type Props = {
  powers: Power[];
};

export function Kick({ powers }: Props) {
  return (
    <pre>
      {powers.map(([effect, intensity], i) => (
        <Fragment key={i}>
          <b>{effect}</b>: ({Math.round(intensity * 100)}%)
          <br />
        </Fragment>
      ))}
    </pre>
  );
}
