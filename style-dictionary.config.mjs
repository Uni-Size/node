// Style Dictionary build config.
//
// Reads the token source files in `tokens/` and generates
// `app/tokens.generated.css`, a CSS file that wraps the resulting
// custom properties in a Tailwind CSS v4 `@theme { ... }` block so it can be
// pulled straight into `app/globals.css` via `@import`.
//
// `tokens.generated.css` is a build artifact (see .gitignore) — never edit
// it by hand, edit the JSON files in `tokens/` and run `npm run tokens:build`.
import StyleDictionary from 'style-dictionary';

// Token names are the JSON path joined with '-'. The default `name/kebab`
// would collapse '--' in keys like `text.14--line-height`, but Tailwind v4
// needs exactly `--text-14--line-height` to pair a line-height with a size.
StyleDictionary.registerTransform({
  name: 'name/tailwind',
  type: 'name',
  transform: (token) => token.path.join('-'),
});

/** @type {import('style-dictionary/types').Config} */
export default {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transforms: ['attribute/cti', 'name/tailwind', 'color/css', 'fontFamily/css'],
      buildPath: 'app/',
      files: [
        {
          destination: 'tokens.generated.css',
          format: 'css/variables',
          options: {
            selector: '@theme',
            outputReferences: true,
          },
        },
      ],
    },
  },
};
