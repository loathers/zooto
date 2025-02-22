import { Familiar } from "../calculate";
import { FamiliarContainer } from "./FamiliarContainer";
import { Modlist } from "./Modlist";

type Props = {
  familiars: Familiar[];
  title: string;
  type: "intrinsic" | "leftNipple" | "rightNipple";
  mod?: string;
};

export function FamiliarList({ title, type, familiars, mod }: Props) {
  return (
    <>
      <h2>Grafted to your {title}</h2>
      {familiars.length > 0 ? (
        <div
          style={{
            gap: "1em",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          }}
        >
          {familiars.map((familiar) => (
            <FamiliarContainer key={familiar.id} familiar={familiar}>
              <Modlist mods={familiar[type]} maximizee={mod} />
            </FamiliarContainer>
          ))}
        </div>
      ) : (
        <p>no familiar provides this modifier here</p>
      )}
    </>
  );
}
