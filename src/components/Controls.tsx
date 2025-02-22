import { useEffect, useMemo, useState } from "react";
import { Familiar, getAllModifiers } from "../calculate";

export type Mode = "familiar" | "modifier" | "kick" | "";
export type FamiliarSections = {
  modifier?: string;
  intrinsic?: Familiar[];
  leftNipple?: Familiar[];
  rightNipple?: Familiar[];
  kick?: Familiar[];
};

type Props = {
  loading: boolean;
  allFamiliars: Familiar[];
  nonStandardFamiliars: string[];
  onChange: (familiarSections: FamiliarSections) => void;
};

function findBestFor(
  familiars: Familiar[],
  key: "intrinsic" | "leftNipple" | "rightNipple" | "kick",
  modifier: string,
) {
  const relevant = familiars.filter((f) =>
    f[key].find((m) => m[0] === modifier),
  );
  if (relevant.length === 0) return [];

  // We use Math.abs() since all the enchantments are "good" and negatives don't compete with positives (-combat and +combat are on different... nipples)
  // We use Number() so that boolean modifiers are treated as 0 or 1
  const sorted = relevant.sort(
    (a, b) =>
      Math.abs(Number(b[key].find((m) => m[0] === modifier)?.[1] ?? 0)) -
      Math.abs(Number(a[key].find((m) => m[0] === modifier)?.[1] ?? 0)),
  );
  const best = sorted[0][key].find((m) => m[0] === modifier)?.[1] ?? 0;

  // Find all the familiars that have the best score, but if there are fewer than 5 with that score, show the runners up.
  return sorted.filter(
    (f, i) =>
      i < 5 || (f[key].find((m) => m[0] === modifier)?.[1] ?? 0) === best,
  );
}

export function Controls({
  loading,
  allFamiliars,
  nonStandardFamiliars,
  onChange,
}: Props) {
  // Mode
  const [mode, setMode] = useState<Mode>("");

  // Per mode settings
  const [singleFamiliar, setSingleFamiliar] = useState<Familiar | null>(null);
  const allModifiers = useMemo(() => getAllModifiers(), []);
  const [modifier, setModifier] = useState<string | null>(null);
  const [kickPower, setKickPower] = useState<string | null>(null);

  // Familiar filters
  const [standardOnly, setStandardOnly] = useState(false);
  const [noPokefam, setNoPokefam] = useState(true);

  // Filtered familiars
  const familiars = useMemo(() => {
    let filtered = allFamiliars;

    if (standardOnly)
      filtered = filtered.filter((f) => !nonStandardFamiliars.includes(f.name));
    if (noPokefam)
      filtered = filtered.filter((f) => !f.attributes.includes("pokefam"));
    return filtered;
  }, [allFamiliars, nonStandardFamiliars, standardOnly, noPokefam]);

  // Unselect familiar if they have been filtered out post-selection
  useEffect(() => {
    if (singleFamiliar && !familiars.some((f) => f.id === singleFamiliar.id)) {
      setSingleFamiliar(null);
    }
  }, [singleFamiliar, familiars]);

  // Passing the value back up the tree
  const display = useMemo(() => {
    switch (mode) {
      case "familiar":
        return singleFamiliar
          ? {
              intrinsic: [singleFamiliar],
              leftNipple: [singleFamiliar],
              rightNipple: [singleFamiliar],
              kick: [singleFamiliar],
            }
          : {};
      case "modifier":
        return modifier
          ? {
              modifier,
              intrinsic: findBestFor(familiars, "intrinsic", modifier),
              rightNipple: findBestFor(familiars, "rightNipple", modifier),
              leftNipple: findBestFor(familiars, "leftNipple", modifier),
            }
          : {};
      case "kick":
        return kickPower
          ? {
              kick: findBestFor(familiars, "kick", kickPower),
            }
          : {};
      default:
        return {};
    }
  }, [mode, familiars, singleFamiliar, kickPower, modifier]);

  useEffect(() => {
    onChange(display);
  }, [onChange, display]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "0.5em",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
          <option value="">Select a mode to browse by</option>
          <option value="familiar">Browse by familiar</option>
          <option value="modifier">Maximize by desired modifier</option>
          <option value="kick">Maximize by desired kick power</option>
        </select>
        {mode === "familiar" && (
          <select
            value={singleFamiliar?.id ?? ""}
            onChange={(e) => {
              setSingleFamiliar(
                familiars.find((f) => f.id === Number(e.target.value)) || null,
              );
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
        )}
        {mode === "modifier" && (
          <select
            value={modifier ?? ""}
            onChange={(e) => {
              setModifier(e.target.value || null);
            }}
          >
            <option value="">Select a modifier</option>
            {allModifiers.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}
        {mode === "kick" && (
          <select
            value={kickPower ?? ""}
            onChange={(e) => {
              setKickPower(e.target.value || null);
            }}
          >
            <option value="">Select a kick power</option>
            <option value="pp">Pickpocket</option>
            <option value="sniff">Sniff</option>
            <option value="stun">Stun</option>
            <option value="banish">Banish</option>
            <option value="instakill">Instakill</option>
            <option value="heal">Heal</option>
          </select>
        )}
      </div>
      <div
        style={{
          display: "flex",
          gap: "0.5em",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
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
    </div>
  );
}
