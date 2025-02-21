import { useEffect, useMemo, useState } from "react";

import {
  calculateFamiliars,
  getAllModifiers,
  type Familiar,
} from "../calculate.js";

import { Modlist } from "./Modlist.js";
import { Kick } from "./Kick.js";

function App() {
  const [loading, setLoading] = useState(false);
  const allModifiers = useMemo(() => getAllModifiers(), []);

  const [familiars, setFamiliars] = useState<Familiar[]>([]);
  useEffect(() => {
    async function load() {
      setLoading(true);
      setFamiliars(await calculateFamiliars());
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
  const [maximizee, setMaximizee] = useState<string | null>(null);

  const maximized = useMemo(() => {
    if (!maximizee) return null;
    const [intrinsic, leftNipple, rightNipple] = (
      ["intrinsic", "leftNipple", "rightNipple"] as const
    ).map(
      (key) => {
        const relevant = familiars.filter((f) => f[key].find((m) => m[0] === maximizee));
        if (relevant.length === 0) return [];
        const sorted = relevant
          .sort(
            (a, b) =>
              Number(b[key].find((m) => m[0] === maximizee)?.[1] ?? 0) -
              Number(a[key].find((m) => m[0] === maximizee)?.[1] ?? 0),
          );
        const best = sorted[0][key].find((m) => m[0] === maximizee)?.[1] ?? 0;
        return sorted.filter((f) => (f[key].find((m) => m[0] === maximizee)?.[1] ?? 0) === best);
      }
    );
    return {
      maximizee,
      intrinsic,
      leftNipple,
      rightNipple,
    };
  }, [familiars, maximizee]);

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
      <div>
        <select onChange={(e) => setMaximizee(e.target.value || null)}>
          <option value="">or find best for modifier</option>
          {allModifiers.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      {(familiar || maximized) && (
        <>
          <h2>...grafted to your head, shoulders, or cheeks</h2>
          {maximized ? (
            maximized.intrinsic.length > 0 ? maximized.intrinsic.map((f) => (
              <>
                <b>{f.name}</b>
                <Modlist mods={f.intrinsic} maximizee={maximized.maximizee} />
              </>
            )) : (
              <p>no familiar provides this modifier here</p>
            )
          ) : (
            <Modlist mods={familiar?.intrinsic ?? []} />
          )}
          <h2>...grafted to your left nipple</h2>
          {maximized ? (
            maximized.leftNipple.length > 0 ? maximized.leftNipple.map((f) => (
              <>
                <b>{f.name}</b>
                <Modlist mods={f.leftNipple} maximizee={maximized.maximizee} />
              </>
            )) : (
              <p>no familiar provides this modifier here</p>
            )
          ) : (
            <Modlist mods={familiar?.leftNipple ?? []} />
          )}
          <h2>...grafted to your right nipple</h2>
          {maximized ? (
            maximized.rightNipple.length > 0 ? maximized.rightNipple.map((f) => (
              <>
                <b>{f.name}</b>
                <Modlist mods={f.rightNipple} maximizee={maximized.maximizee} />
              </>
            )) : (
              <p>no familiar provides this modifier here</p>
            )
          ) : (
            <Modlist mods={familiar?.rightNipple ?? []} />
          )}
          {familiar && (
            <>
              <h2>...grafted to your feet</h2>
              <Kick powers={familiar.kickPowers} />
            </>
          )}
        </>
      )}
    </>
  );
}

export default App;
