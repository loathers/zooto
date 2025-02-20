import { Fragment } from "react";

type Props = {
  mods: [mod: string, value: number | boolean][];
};

export function Modlist({ mods }: Props) {
  return (
    <pre>
      {mods.map(([mod, value], i) => (
        <Fragment key={i}>
          <b>{mod}</b>:{" "}
          {typeof value === "boolean" ? (value ? "true" : "false") : value}
          <br />
        </Fragment>
      ))}
    </pre>
  );
}
