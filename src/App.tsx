import { Fragment, useEffect, useMemo, useState } from "react";
import { Client, fetchExchange } from "@urql/core";
import { graphql } from "gql.tada";
import effects from "./effects.json";
import { Modlist } from "./Modlist";

const client = new Client({
  url: "https://data.loathers.net/graphql",
  exchanges: [fetchExchange],
});

const isMod = (mod: (string | number)[]): mod is [string, number] => {
  if (!mod) return false;
  if (mod.length !== 2) return false;
  if (typeof mod[0] !== "string") return false;
  if (typeof mod[1] !== "number") return false;
  return true;
};

const familiarQuery = graphql(`
  query Familiars {
    allFamiliars {
      nodes {
        id
        name
        image
        attributes
      }
    }
  }
`);

type Attribute = keyof typeof effects.intrinsic;

type Familiar = {
  name: string;
  id: number;
  image: string;
  attributes: Attribute[];
};

function App() {
  const [familiars, setFamiliars] = useState<Familiar[]>([]);

  useEffect(() => {
    async function load() {
      const familiars = await client.query(familiarQuery, {}).toPromise();
      if (!familiars.data?.allFamiliars) {
        return;
      }
      setFamiliars(
        familiars.data.allFamiliars.nodes
          .filter((f) => f !== null)
          .map((f) => ({
            ...f,
            attributes: f.attributes.filter((a) => a !== null) as Attribute[],
          }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      );
    }

    load();
  }, [setFamiliars]);

  const [familiar, setFamiliar] = useState<Familiar | null>(null);

  const [intrinsics, leftNipple, rightNipple] = useMemo(
    () =>
      (["intrinsic", "leftNipple", "rightNipple"] as const).map(
        (key) =>
          familiar?.attributes.map((a) => effects[key][a]).filter(isMod) ?? [],
      ),
    [familiar],
  );

  return (
    <>
      <h1>Zooto</h1>
      <select
        onChange={(e) =>
          setFamiliar(
            familiars.find((f) => f.id === Number(e.target.value)) || null,
          )
        }
      >
        <option value="">Select a familiar</option>
        {familiars.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
      {familiar ? (
        <>
          <p>Mods: {familiar.attributes.join(", ")}</p>
          <h2>...grafted to your head, shoulders, or cheeks</h2>
          <Modlist mods={intrinsics} />
          <h2>...grafted to your left nipple</h2>
          <Modlist mods={leftNipple} />
          <h2>...grafted to your right nipple</h2>
          <Modlist mods={rightNipple} />
          <h2>...grafted to your feet</h2>
          <pre>
            {Object.entries(
              familiar.attributes
                .map((a) => effects.kick[a])
                .filter(Boolean)
                .reduce<Record<string, number>>(
                  (acc, effect) => ({
                    ...acc,
                    [effect]: (acc[effect] || 0) + 1,
                  }),
                  {},
                ),
            ).map(([effect, intensity], i) => (
              <Fragment key={i}>
                {effect} (level {intensity})<br />
              </Fragment>
            ))}
          </pre>
        </>
      ) : (
        <p>Select a familiar to see more information</p>
      )}
    </>
  );
}

export default App;
