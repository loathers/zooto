import { type Familiar } from "../calculate";

type Props = {
  familiar: Familiar;
  children?: React.ReactNode;
};

export function FamiliarContainer({ familiar, children }: Props) {
  return (
    <div
      key={familiar.id}
      style={{ border: "1px solid black", padding: "1em" }}
    >
      <div style={{ gap: "0.3em", display: "flex", alignItems: "center" }}>
        <img
          src={`https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/${familiar.image}`}
          alt={familiar.name}
        />
        <span>
          <b>{familiar.name}</b>
          <sup
            style={{ marginLeft: "0.5em", fontSize: "8px", cursor: "help" }}
            title={`Known Tags: ${familiar.attributes.join(", ") || "(none)"}`}
          >
            ⓘ
          </sup>
        </span>
      </div>
      {children}
    </div>
  );
}
