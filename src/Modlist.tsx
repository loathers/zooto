import { Fragment, useMemo } from "react";

type Props = {
  mods: [mod: string, value: number | boolean][];
};

export function Modlist({ mods }: Props) {
  const combined = useMemo(
    () =>
      Object.entries(
        mods.reduce<Record<string, number | boolean>>((acc, [mod, value]) => {
          if (typeof value === "boolean") {
            acc[mod] = Boolean(acc[mod] ?? false) || value;
          }
          if (typeof value === "number") {
            acc[mod] = Number(acc[mod] ?? 0) + value;
          }
          return acc;
        }, {}),
      ),
    [mods],
  );

  return (
    <pre>
      {combined.map(([mod, value], i) => (
        <Fragment key={i}>
          <b>{mod}</b>:{" "}
          {typeof value === "boolean" ? (value ? "true" : "false") : value}
          <br />
        </Fragment>
      ))}
    </pre>
  );
}
