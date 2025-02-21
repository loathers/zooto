import { Familiar } from "../calculate";
import { Modlist } from "./Modlist";

type Props = {
  familiars: Familiar[];
  type: "intrinsic" | "leftNipple" | "rightNipple";
  mod?: string;
};

export function FamiliarList({ type, familiars, mod }: Props) {
  return (
    <>
      <h2>...grafted to your left nipple</h2>
      <div style={{ gap: "1em", display: "flex", flexWrap: "wrap" }}>
        {familiars.length > 0 ? (
          familiars.map((familiar) => (
            <div
              key={familiar.id}
              style={{ border: "1px solid black", padding: "1em" }}
            >
              <div
                style={{ gap: "0.3em", display: "flex", alignItems: "center" }}
              >
                <img
                  src={`https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/${familiar.image}`}
                />
                <b>{familiar.name}</b>
              </div>
              <div style={{ fontSize: "6px" }}>
                {familiar.attributes.join(", ") || <i>no known attributes</i>}
              </div>
              <Modlist mods={familiar[type]} maximizee={mod} />
            </div>
          ))
        ) : (
          <p>no familiar provides this modifier here</p>
        )}
      </div>
    </>
  );
}
