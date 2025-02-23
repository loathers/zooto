import { Client, fetchExchange } from "@urql/core";
import { graphql } from "gql.tada";
import effects from "./effects.json";

const client = new Client({
  url: "https://data.loathers.net/graphql",
  exchanges: [fetchExchange],
});

const FamiliarQuery = graphql(`
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

export function getAllModifiers() {
  return [
    ...new Set(
      [
        ...Object.values(effects.intrinsic),
        ...Object.values(effects.leftNipple),
        ...Object.values(effects.rightNipple),
      ]
        .map((mod) => mod[0] as string)
        .sort(),
    ),
  ];
}

type Attribute = keyof typeof effects.intrinsic | "pokefam";
export type Mod =
  | [type: string, value: number]
  | [type: string, value: boolean];
export type Power = [effect: string, intensity: number];

export type RawFamiliar = {
  name: string;
  id: number;
  image: string;
  attributes: Attribute[];
};

export type Mods = Record<string, number | boolean>;
export type Powers = Record<string, number>;

export type Familiar = RawFamiliar & {
  intrinsic: Mods;
  leftNipple: Mods;
  rightNipple: Mods;
  kick: Powers;
};

export const isMod = (mod: (string | number | boolean)[]): mod is Mod => {
  if (!mod) return false;
  if (mod.length !== 2) return false;
  if (typeof mod[0] !== "string") return false;
  if (typeof mod[1] !== "number" && typeof mod[1] !== "boolean") return false;
  return true;
};

export async function calculateFamiliars() {
  const familiars = await client.query(FamiliarQuery, {}).toPromise();
  if (!familiars.data?.allFamiliars) {
    return [];
  }
  return familiars.data.allFamiliars.nodes
    .filter((f) => f !== null)
    .map((f) => ({
      ...f,
      attributes: f.attributes.filter((a) => a !== null) as Attribute[],
    }))
    .map((f) => precalculateEffects(f))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function precalculateEffects(familiar: RawFamiliar): Familiar {
  const [intrinsic, leftNipple, rightNipple] = (
    ["intrinsic", "leftNipple", "rightNipple"] as const
  ).map((key) => calculateStandardEffects(key, familiar));

  const kick = calculateKickEffects(familiar);

  return {
    ...familiar,
    intrinsic,
    leftNipple,
    rightNipple,
    kick,
  };
}

function calculateStandardEffects(
  key: "intrinsic" | "leftNipple" | "rightNipple",
  familiar: RawFamiliar,
) {
  return familiar.attributes
    .filter((a) => a in effects[key])
    .map(
      (a) => (effects[key] as Record<string, (string | number | boolean)[]>)[a],
    )
    .filter(isMod)
    .reduce<Record<string, number | boolean>>((acc, [mod, value]) => {
      if (typeof value === "boolean") {
        acc[mod] = Boolean(acc[mod] ?? false) || value;
      }
      if (typeof value === "number") {
        acc[mod] = Number(acc[mod] ?? 0) + value;
      }
      return acc;
    }, {});
}

function calculateKickEffects(familiar: RawFamiliar) {
  const results = familiar.attributes
    .filter((a) => a in effects.kick)
    .map((a) => (effects.kick as Record<string, string>)[a]);

  const summed = results.reduce<Record<string, number>>(
    (acc, effect) => ({
      ...acc,
      [effect]: (acc[effect] || 0) + 1,
    }),
    {
      // Because we do maths on these two we want them to never be undefined
      sniff: 0,
      banish: 0,
    },
  );

  // Only the winner of sniff vs banish is counted. In a draw neither seem to apply
  const [sniff, banish] = ["sniff", "banish"].map((effect) => summed[effect]);
  if (sniff === banish) {
    summed.sniff = 0;
    summed.banish = 0;
  } else {
    const loser = ["sniff", "banish"].sort((a, b) => summed[a] - summed[b])[0];
    summed[loser] = 0;
  }

  return Object.fromEntries(
    Object.entries(summed)
      .filter(([, intensity]) => intensity > 0)
      .map<Power>(([effect, intensity]) => [
        effect,
        intensity / results.length,
      ]),
  );
}
