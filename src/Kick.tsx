import { Fragment, useMemo } from "react";

type Props = {
  powers: string[];
};

export function Kick({ powers }: Props) {
  const t = useMemo(
    () =>
      Object.entries(
        powers.reduce<Record<string, number>>(
          (acc, effect) => ({
            ...acc,
            [effect]: (acc[effect] || 0) + 1,
          }),
          {},
        ),
      ).map(
        ([effect, intensity]) => [effect, intensity / powers.length] as const,
      ),
    [powers],
  );

  return (
    <pre>
      {t.map(([effect, intensity], i) => (
        <Fragment key={i}>
          <b>{effect}</b>: ({Math.round(intensity * 100)}%)
          <br />
        </Fragment>
      ))}
    </pre>
  );
}
