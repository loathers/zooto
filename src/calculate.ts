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

type Attribute = keyof typeof effects.intrinsic;
export type Mod =
  | [type: string, value: number]
  | [type: string, value: boolean];
export type Power = [effect: string, intensity: number];

export type Familiar = {
  name: string;
  id: number;
  image: string;
  attributes: Attribute[];
  intrinsic: Mod[];
  leftNipple: Mod[];
  rightNipple: Mod[];
  kickPowers: Power[];
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

function precalculateEffects(
  familiar: Omit<
    Familiar,
    "intrinsic" | "leftNipple" | "rightNipple" | "kickPowers"
  >,
): Familiar {
  const [intrinsic, leftNipple, rightNipple] = (
    ["intrinsic", "leftNipple", "rightNipple"] as const
  ).map((key) =>
    Object.entries(
      familiar.attributes
        .map((a) => effects[key][a])
        .filter(isMod)
        .reduce<Record<string, number | boolean>>((acc, [mod, value]) => {
          if (typeof value === "boolean") {
            acc[mod] = Boolean(acc[mod] ?? false) || value;
          }
          if (typeof value === "number") {
            acc[mod] = Number(acc[mod] ?? 0) + value;
          }
          return acc;
        }, {}),
    ),
  );

  const kickAttributes = familiar.attributes
    .map((a) => effects.kick[a])
    .filter(Boolean);

  const kickPowers: Power[] = Object.entries(
    kickAttributes.reduce<Record<string, number>>(
      (acc, effect) => ({
        ...acc,
        [effect]: (acc[effect] || 0) + 1,
      }),
      {},
    ),
  ).map(([effect, intensity]) => [effect, intensity / kickAttributes.length]);

  return {
    ...familiar,
    intrinsic,
    leftNipple,
    rightNipple,
    kickPowers,
  };
}
