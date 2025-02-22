import { useEffect, useMemo, useState } from "react";

import {
  calculateFamiliars,
  getAllModifiers,
  type Familiar,
} from "../calculate.js";

import { Kick } from "./Kick.js";
import { FamiliarList } from "./FamiliarList.js";

function App() {
  const [loading, setLoading] = useState(false);
  const allModifiers = useMemo(() => getAllModifiers(), []);

  const [allFamiliars, setAllFamiliars] = useState<Familiar[]>([]);
  useEffect(() => {
    async function load() {
      setLoading(true);
      setAllFamiliars(await calculateFamiliars());
      setLoading(false);
    }

    load();
  }, [setAllFamiliars]);

  const [nonStandardFamiliars, setNonStandardFamiliars] = useState<string[]>(
    [],
  );

  const [standardOnly, setStandardOnly] = useState(false);
  const [noPokefam, setNoPokefam] = useState(true);

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

  const familiars = useMemo(() => {
    let filtered = allFamiliars;

    if (standardOnly)
      filtered = filtered.filter((f) => !nonStandardFamiliars.includes(f.name));
    if (noPokefam)
      filtered = filtered.filter((f) => !f.attributes.includes("pokefam"));
    return filtered;
  }, [allFamiliars, nonStandardFamiliars, standardOnly, noPokefam]);

  useEffect(() => {
    if (
      familiar &&
      ((standardOnly && nonStandardFamiliars.includes(familiar.name)) ||
        (noPokefam && familiar.attributes.includes("pokefam")))
    ) {
      setFamiliar(null);
    }
  }, [standardOnly, familiar, nonStandardFamiliars, noPokefam]);

  const maximized = useMemo(() => {
    if (!maximizee) return null;
    const [intrinsic, leftNipple, rightNipple] = (
      ["intrinsic", "leftNipple", "rightNipple"] as const
    ).map((key) => {
      const relevant = familiars.filter((f) =>
        f[key].find((m) => m[0] === maximizee),
      );
      if (relevant.length === 0) return [];
      const sorted = relevant.sort(
        (a, b) =>
          Number(b[key].find((m) => m[0] === maximizee)?.[1] ?? 0) -
          Number(a[key].find((m) => m[0] === maximizee)?.[1] ?? 0),
      );
      const best = sorted[0][key].find((m) => m[0] === maximizee)?.[1] ?? 0;
      return sorted.filter(
        (f) => (f[key].find((m) => m[0] === maximizee)?.[1] ?? 0) === best,
      );
    });
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
      <div style={{ display: "flex", gap: "0.5em", alignItems: "center" }}>
        <select
          value={familiar?.id ?? ""}
          onChange={(e) => {
            setFamiliar(
              familiars.find((f) => f.id === Number(e.target.value)) || null,
            );
            setMaximizee(null);
          }}
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
        <select
          value={maximizee ?? ""}
          onChange={(e) => {
            setMaximizee(e.target.value || null);
            setFamiliar(null);
          }}
        >
          <option value="">or find best for modifier</option>
          {allModifiers.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={standardOnly}
            onChange={(e) => setStandardOnly(e.target.checked)}
          />{" "}
          Standard only
        </label>
        <label>
          <input
            type="checkbox"
            checked={noPokefam}
            onChange={(e) => setNoPokefam(e.target.checked)}
          />{" "}
          No Pokéfam
        </label>
      </div>
      {(familiar || maximized) && (
        <>
          <FamiliarList
            title="head, shoulders, or butt cheeks (for the intrinsic)"
            type="intrinsic"
            familiars={familiar ? [familiar] : (maximized?.intrinsic ?? [])}
            mod={maximized?.maximizee}
          />
          <FamiliarList
            title="left nipple (for the buff)"
            type="leftNipple"
            familiars={familiar ? [familiar] : (maximized?.leftNipple ?? [])}
            mod={maximized?.maximizee}
          />
          <FamiliarList
            title="right nipple (for the buff)"
            type="rightNipple"
            familiars={familiar ? [familiar] : (maximized?.rightNipple ?? [])}
            mod={maximized?.maximizee}
          />
          {familiar && <Kick familiars={familiar ? [familiar] : []} />}
        </>
      )}
    </>
  );
}

export default App;
