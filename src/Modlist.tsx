import { Fragment, useMemo } from "react";

type Props = {
  mods: [mod: string, value: number][];
};

export function Modlist({ mods }: Props) {
  const combined = useMemo(
    () =>
      Object.entries(
        mods.reduce<Record<string, number>>((acc, [mod, value]) => {
          acc[mod] = (acc[mod] || 0) + value;
          return acc;
        }, {}),
      ),
    [mods],
  );

  return (
    <pre>
      {combined.map(([mod, value], i) => (
        <Fragment key={i}>
          <b>{mod}</b>: {value}
          <br />
        </Fragment>
      ))}
    </pre>
  );
}
