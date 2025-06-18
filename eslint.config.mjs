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
    // Ignore generated Prisma files
    files: ["src/generated/**/*.js", "src/generated/**/*.ts", "src/generated/**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-empty-object-type": "off", 
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      "@typescript-eslint/no-wrapper-object-types": "off", 
      "@typescript-eslint/no-unsafe-function-type": "off"
    },
  },
  {
    // Fix for the collapse menu button
    files: ["src/components/admin-panel/collapse-menu-button.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off"
    }
  }
];

export default eslintConfig;
