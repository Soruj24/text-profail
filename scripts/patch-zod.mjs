import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const zodPkgPath = path.resolve(__dirname, '../node_modules/zod/package.json');

if (fs.existsSync(zodPkgPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(zodPkgPath, 'utf8'));
    
    console.log('Patching zod package.json for Vercel compatibility...');

    // Simplify exports to avoid resolution issues in some environments
    if (pkg.exports) {
      // Ensure ./v3 and ./v4/core are explicitly available as top-level strings if possible
      // or at least have clear import/require paths.
      
      const patchExport = (key, distPath) => {
        if (pkg.exports[key]) {
          // If it's an object, make sure 'import' and 'require' are at the top
          if (typeof pkg.exports[key] === 'object') {
            const original = pkg.exports[key];
            pkg.exports[key] = {
              "types": original.types || `./${key}/index.d.cts`,
              "import": original.import || `./${key}/index.js`,
              "require": original.require || `./${key}/index.cjs`,
              ...original
            };
          }
        } else {
          // If missing, add it
          pkg.exports[key] = {
            "types": `./${key}/index.d.cts`,
            "import": `./${key}/index.js`,
            "require": `./${key}/index.cjs`
          };
        }
      };

      patchExport('./v3', 'v3');
      patchExport('./v4/core', 'v4/core');
      
      // Some environments prefer a flatter structure
      // Let's also add them as direct entries if they are missing
      if (!pkg.exports['./v3']) pkg.exports['./v3'] = "./v3/index.js";
      if (!pkg.exports['./v4/core']) pkg.exports['./v4/core'] = "./v4/core/index.js";
    }

    fs.writeFileSync(zodPkgPath, JSON.stringify(pkg, null, 2));
    console.log('Successfully patched zod package.json');
  } catch (error) {
    console.error('Error patching zod package.json:', error);
  }
} else {
  console.error('zod package.json not found at', zodPkgPath);
}
