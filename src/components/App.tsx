import { useEffect, useState } from "react";

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
  }, []);

  return (
    <Container maxWidth="100%">
      <Stack py={6} gap={6}>
        <Heading size="5xl">
          <Stack
            direction="row"
            gap={2}
            justifyContent="center"
            alignItems="center"
          >
            <Text>Zooto</Text>
            {Object.values(loading).some((v) => v === true) ? (
              <Spinner size="lg" />
            ) : (
              <Image height="1em" src="/zoot.png" />
            )}
          </Stack>
        </Heading>
        <FamiliarTable familiars={familiars} />
      </Stack>
    </Container>
  );
}

export default App;
