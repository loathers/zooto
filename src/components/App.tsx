import { useEffect, useMemo, useState } from "react";

import { calculateFamiliars, type Familiar } from "../calculate.js";

import {
  Container,
  Heading,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FamiliarTable } from "./FamiliarTable.js";

function App() {
  const [loading, setLoading] = useState(false);

  // Load familiars
  const [familiars, setFamiliars] = useState<Familiar[]>([]);
  useEffect(() => {
    async function load() {
      setLoading(true);
      setFamiliars(await calculateFamiliars());
      setLoading(false);
    }

    load();
  }, [setFamiliars]);

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

  const extendedFamiliars = useMemo(() => {
    return familiars.map((f) => ({
      ...f,
      standard: !nonStandardFamiliars.includes(f.name),
    }));
  }, [familiars, nonStandardFamiliars]);

  return (
    <Container>
      <Stack py={6} gap={6}>
        <Heading size="5xl">
          <Stack
            direction="row"
            gap={2}
            justifyContent="center"
            alignItems="center"
          >
            <Text>Zooto</Text>
            {loading ? <Spinner /> : <Image height="1em" src="/zoot.png" />}
          </Stack>
        </Heading>
        <FamiliarTable familiars={extendedFamiliars} />
      </Stack>
    </Container>
  );
}

export default App;
