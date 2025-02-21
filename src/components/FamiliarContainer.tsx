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
        />
        <b>{familiar.name}</b>
      </div>
      <div style={{ marginTop: "4px", fontSize: "6px" }}>
        {familiar.attributes.join(", ") || <i>no known attributes</i>}
      </div>
      {children}
    </div>
  );
}
