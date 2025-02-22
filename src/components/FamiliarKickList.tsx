import { Familiar } from "../calculate";
import { FamiliarContainer } from "./FamiliarContainer";
import { Kick } from "./Kick";

type Props = {
  familiars: Familiar[];
  title: string;
};

export function FamiliarKickList({ title, familiars }: Props) {
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
              <Kick familiar={familiar} />
            </FamiliarContainer>
          ))}
        </div>
      ) : (
        <p>no familiar provides this modifier here</p>
      )}
    </>
  );
}
