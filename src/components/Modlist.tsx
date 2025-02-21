import { Mod } from "../calculate.js";

type Props = {
  mods: Mod[];
  maximizee?: string;
};

export function Modlist({ mods, maximizee }: Props) {
  return (
    <pre>
      {mods.map(([mod, value]) => (
        <span
          key={mod}
          style={{ color: mod === maximizee ? "blue" : undefined }}
        >
          <b>{mod}</b>:{" "}
          {typeof value === "boolean" ? (value ? "true" : "false") : value}
          <br />
        </span>
      ))}
    </pre>
  );
}
