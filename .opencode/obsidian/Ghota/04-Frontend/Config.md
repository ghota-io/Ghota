# Configuração Frontend

## Vite (`vite.config.js`)

```js
export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
    ],
});
```

- SSR activo
- Hot-reload com Laravel plugin

## Tailwind CSS (`tailwind.config.js` / `app.css`)

- Content paths: `resources/**/*.blade.php`, `resources/**/*.js`, `resources/**/*.vue`
- Dark mode: `class` (toggle via classe no `<html>`)
- Cores personalizadas:
  - `dark-bg: #1e1f22` (fundo página)
  - `dark-card: #2b2d31` (cards/sidebar)
  - `dark-hover: #35373c` (hover)
  - `dark-border: #3f4147` (bordas)
- Tipografia: Inter (via `@fontsource/inter`)

Nota: Tailwind 4 usa `@import "tailwindcss"` no `app.css`.

## PostCSS (`postcss.config.js`)

- `tailwindcss`
- `autoprefixer`

## `jsconfig.json`

```json
{
    "compilerOptions": {
        "paths": {
            "@/*": ["./resources/js/*"]
        }
    }
}
```

Alias `@/` → `resources/js/`

## Dependências npm (destaque)

| Package | Uso |
|---|---|
| `react-markdown` | Renderização markdown segura |
| `remark-gfm` | Tabelas, listas task |
| `remark-breaks` | Quebras de linha únicas |
| `lucide-react` | Ícones |
| `@fontsource/inter` | Fonte Inter |
| `laravel-echo` | WebSocket client |
| `pusher-js` | Transporte Reverb |
| `autoprefixer` | CSS vendor prefixes |
