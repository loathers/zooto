import { Fragment, useEffect, useState } from "react";
import { Client, fetchExchange } from "@urql/core";
import { graphql } from "gql.tada";
import effects from "./effects.json";

const client = new Client({
  url: "https://data.loathers.net/graphql",
  exchanges: [fetchExchange],
});

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
          .sort((a,b) => a.name.localeCompare(b.name)),
      );
    }

    load();
  }, [setFamiliars]);

  const [familiar, setFamiliar] = useState<Familiar | null>(null);

  return (
    <>
      <h1>Zooto</h1>
      <select onChange={(e) => setFamiliar(familiars.find((f) => f.id === Number(e.target.value)) || null)}>
        <option value="">Select a familiar</option>
        {familiars.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
      {familiar ? (
        <>
          <h2>...grafted to your head, shoulders, or cheeks</h2>
          <pre>
              {familiar.attributes.map((a) => effects.intrinsic[a]).filter(Boolean).map(([mod, value], i) => (
                <Fragment key={i}><b>{mod}</b>: {value}<br /></Fragment>
              ))}
          </pre>
          <h2>...grafted to your left nipple</h2>
          <pre>
              {familiar.attributes.map((a) => effects.leftNipple[a]).filter(Boolean).map(([mod, value], i) => (
                <Fragment key={i}><b>{mod}</b>: {value}<br /></Fragment>
              ))}
          </pre>
          <h2>...grafted to your right nipple</h2>
          <pre>
              {familiar.attributes.map((a) => effects.rightNipple[a]).filter(Boolean).map(([mod, value], i) => (
                <Fragment key={i}><b>{mod}</b>: {value}<br /></Fragment>
              ))}
          </pre>
          <h2>...grafted to your feet</h2>
          <pre>
              {Object.entries(familiar.attributes.map((a) => effects.kick[a]).filter(Boolean).reduce<Record<string, number>>((acc, effect) => ({ ...acc, [effect]: (acc[effect] || 0) + 1 }), {})).map(([effect, intensity], i) => (
                <Fragment key={i}>{effect} (level {intensity})<br /></Fragment>
              ))}
          </pre>
        </>
      ) : (
        "Select a familiar to see more information"
      )}
    </>
  );
}

export default App;
