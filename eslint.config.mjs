import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Trasforma gli errori di variabili non utilizzate in warning
      "@typescript-eslint/no-unused-vars": "warn",
      // Permette caratteri non escapati (trasforma errore in warning)
      "react/no-unescaped-entities": "warn",
      // Trasforma errori TypeScript in warning per il build
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/exhaustive-deps": "warn",
      // Altre regole utili per il development
      "no-console": "warn",
      "prefer-const": "warn",
    },
  },
];

export default eslintConfig;
