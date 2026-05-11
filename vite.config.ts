import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dol from "data-of-loathing/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dol()],
});
