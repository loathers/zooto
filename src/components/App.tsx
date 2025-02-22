import { useCallback, useEffect, useState } from "react";

import { calculateFamiliars, type Familiar } from "../calculate.js";

import { FamiliarList } from "./FamiliarList.js";
import { Controls, FamiliarSections } from "./Controls.js";
import { FamiliarKickList } from "./FamiliarKickList.js";

function App() {
  const [loading, setLoading] = useState(false);

  // Load familiars
  const [allFamiliars, setAllFamiliars] = useState<Familiar[]>([]);
  useEffect(() => {
    async function load() {
      setLoading(true);
      setAllFamiliars(await calculateFamiliars());
      setLoading(false);
    }

    load();
  }, [setAllFamiliars]);

  // Load standard list
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

  // Handle controls
  const [sections, setSections] = useState<FamiliarSections>({});
  const handleControls = useCallback((familiarSections: FamiliarSections) => {
    setSections(familiarSections);
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        Zooto <img style={{ height: "0.8em" }} src="/zoot.png" />
      </h1>
      <Controls
        loading={loading}
        allFamiliars={allFamiliars}
        nonStandardFamiliars={nonStandardFamiliars}
        onChange={handleControls}
      />
      {sections.intrinsic !== undefined && (
        <FamiliarList
          title="head, shoulders, or butt cheeks (for the intrinsic)"
          type="intrinsic"
          familiars={sections.intrinsic}
          mod={sections.modifier}
        />
      )}
      {sections.leftNipple !== undefined && (
        <FamiliarList
          title="left nipple (for the buff)"
          type="leftNipple"
          familiars={sections.leftNipple}
          mod={sections.modifier}
        />
      )}
      {sections.rightNipple !== undefined && (
        <FamiliarList
          title="right nipple (for the buff)"
          type="rightNipple"
          familiars={sections.rightNipple}
          mod={sections.modifier}
        />
      )}
      {sections.kick !== undefined && (
        <FamiliarKickList
          title="feet (for the combat skill)"
          familiars={sections.kick}
        />
      )}
    </>
  );
}

export default App;
