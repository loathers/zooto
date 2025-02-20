import { useEffect, useMemo, useState } from "react";
import { Client, fetchExchange } from "@urql/core";
import { graphql } from "gql.tada";
import effects from "./effects.json";
import { Modlist } from "./Modlist";
import { Kick } from "./Kick";

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
  const [loading, setLoading] = useState(false);

  const [familiars, setFamiliars] = useState<Familiar[]>([]);
  useEffect(() => {
    async function load() {
      setLoading(true);
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
      setLoading(false);
    }

    load();
  }, [setFamiliars]);

  const [nonStandardFamiliars, setNonStandardFamiliars] = useState<string[]>(
    [],
  );
  useEffect(() => {
    async function load() {
      const request = await fetch("https://oaf.loathers.net/standard.php");
      const standardPhp = await request.text();
      const standardPhpFamiliars =
        standardPhp.match(/<b>Familiars<\/b><p>(.*?)<p>/)?.[1] ?? "";
      setNonStandardFamiliars(
        [
          ...standardPhpFamiliars.matchAll(
            /<span class="i">(.*?)(?:, )?<\/span>/g,
          ),
        ].map((m) => m[1]),
      );
    }

    load();
  }, [setNonStandardFamiliars]);

  const [familiar, setFamiliar] = useState<Familiar | null>(null);

  const [intrinsics, leftNipple, rightNipple] = useMemo(
    () =>
      (["intrinsic", "leftNipple", "rightNipple"] as const).map(
        (key) =>
          familiar?.attributes.map((a) => effects[key][a]).filter(isMod) ?? [],
      ),
    [familiar],
  );
  const kickPowers = useMemo(
    () =>
      familiar?.attributes.map((a) => effects.kick[a]).filter(Boolean) ?? [],
    [familiar],
  );

  return (
    <>
      <h1>Zooto</h1>
      <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
        <select
          onChange={(e) =>
            setFamiliar(
              familiars.find((f) => f.id === Number(e.target.value)) || null,
            )
          }
        >
          <option value="">
            {loading ? "Loading familiars..." : "Select a familiar"}
          </option>
          {familiars.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        {familiar ? (
          <div>
            <img
              style={{ verticalAlign: "middle" }}
              src={`https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/${familiar.image}`}
            />
            {" • "}
            {nonStandardFamiliars.includes(familiar.name)
              ? "out of standard"
              : "currently in standard"}
            {" • "}
            {familiar.attributes.join(", ") || <i>no known attributes</i>}
          </div>
        ) : (
          <div>Select a familiar to see more information</div>
        )}
      </div>
      {familiar && (
        <>
          <h2>...grafted to your head, shoulders, or cheeks</h2>
          <Modlist mods={intrinsics} />
          <h2>...grafted to your left nipple</h2>
          <Modlist mods={leftNipple} />
          <h2>...grafted to your right nipple</h2>
          <Modlist mods={rightNipple} />
          <h2>...grafted to your feet</h2>
          <Kick powers={kickPowers} />
        </>
      )}
    </>
  );
}

export default App;
