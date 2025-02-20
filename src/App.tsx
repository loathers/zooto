import { useEffect, useState } from "react";
import { Modlist } from "./Modlist";
import { Kick } from "./Kick";
import { calculateFamiliars, Familiar } from "./calculate";

function App() {
  const [loading, setLoading] = useState(false);

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
          <Modlist mods={familiar.intrinsics} />
          <h2>...grafted to your left nipple</h2>
          <Modlist mods={familiar.leftNipple} />
          <h2>...grafted to your right nipple</h2>
          <Modlist mods={familiar.rightNipple} />
          <h2>...grafted to your feet</h2>
          <Kick powers={familiar.kickPowers} />
        </>
      )}
    </>
  );
}

export default App;
