# Movimientos — Banco Galicia

Rediseño de la pantalla de movimientos de una caja de ahorro del home banking de
Banco Galicia (Argentina). Una sola pantalla, mobile-first, en el navegador.

Diseño y desarrollo: **Pablo Esteban Choi**.

**En vivo:** https://galicia-movimientos-rediseno.netlify.app/
**Showcase:** https://galicia-movimientos-rediseno.netlify.app/showcase

Toda la interfaz está en español rioplatense. Los importes usan formato ARS
(`$1.234.567,89` — punto para miles, coma para decimales) y las fechas `dd/mm/aa`.

---

## El problema

<!-- TODO: author -->
<!-- Qué está mal en la pantalla actual, leído del screenshot de referencia.
     Es tu lectura del problema y tu argumento; escribila vos. -->

## La tesis

<!-- TODO: author -->
<!-- La idea que ordena el rediseño: qué dos preguntas distintas están mezcladas
     hoy en un solo stream y por qué separarlas cambia la pantalla. -->

## Decisiones

<!-- TODO: author -->
<!-- Una línea por decisión con su porqué: agrupación por día, columna de signo,
     los tres tratamientos de importe, la cadena cruda siempre visible, el par
     entró/salió en el encabezado, densidad de fila. -->

---

## Correr el proyecto

```bash
npm install
npm run dev
```

Abre en `http://localhost:3000`.

Para verificar el build de producción, que es lo que se despliega:

```bash
npm run build && npx next start -p 3000
```

Chequeos:

```bash
npx tsc --noEmit
npx eslint app components lib data
```

---

## Los seis estados

Cada estado es alcanzable por query param y desde el control flotante de abajo a
la derecha, que se puede descartar. Ninguno es decorativo.

| Estado | URL | Qué muestra |
| --- | --- | --- |
| Normal | `/` | Los 36 movimientos agrupados por día. |
| Carga | `/?state=loading` | Esqueleto con el ritmo real de las filas, después las filas, y recién después el resumen: el total depende del conjunto completo. Cicla para poder demostrarlo. |
| Cuenta nueva | `/?state=empty-new` | Nunca tuvo movimientos. Es onboarding, no un error: sin buscador ni chips, sin par entró/salió. |
| Filtro sin resultados | `/?state=empty-filter` | Aplica una búsqueda real que no encuentra nada. La salida está a mano: borrar el término o quitar los filtros. |
| Período sin actividad | `/?state=empty-quiet` | Aplica un rango real sobre un mes vacío. Mensaje distinto al anterior: no hay nada que reintentar. |
| Error de conexión | `/?state=error-connection` | Datos cacheados con su timestamp y un `Reintentar` que corre la secuencia de carga. Nunca una pantalla vacía. |
| Error parcial | `/?state=error-partial` | La cuenta cargó; un movimiento no liquidó todavía. Se nombra cuál y por cuánto. |

`empty-filter` y `empty-quiet` no están simulados: `lib/states.ts` les aplica un
preset real y caen por el mismo pipeline de filtrado que recorrería una persona,
así el demo no puede divergir del comportamiento.

---

## Stack

- **Next.js (App Router) + TypeScript**
- **Tailwind v4** — configuración CSS-first, tokens en `@theme`
- **Radix primitives** sin estilar, con Tailwind encima (`DropdownMenu`,
  `Popover`, `ToggleGroup`)
- **framer-motion** para la entrada de los grupos de día
- `clsx` + `tailwind-merge`

**Sin base de datos y sin ORM, a propósito.** Es una sola pantalla de producto:
los datos son fixtures tipados en `data/fixtures.ts`. Los primeros diez
movimientos están transcriptos textualmente del screenshot de referencia; el
resto existe para romper el layout — un nombre de comercio larguísimo, un importe
de ocho cifras, una devolución, una descripción que es puro código de banco, días
de un solo movimiento, un día de quince, un movimiento pendiente, dos filas del
mismo día que nada distingue, y un débito automático sin proveedor identificable.

Los importes se guardan como **centavos enteros**, nunca como float: los
subtotales por día y el par entró/salió son sumas, y un total corrido por un
centavo cuesta más confianza que una pantalla lenta.

La identidad de la cuenta —titular, número, CBU y alias— es ficticia. Las
capturas de referencia salieron de una cuenta real y esos datos no aportan nada
al diseño: la pantalla se ve igual con datos inventados. Los movimientos sí son
los de la referencia.

---

## Tokens

Todo el color, el tamaño y el ritmo se resuelve en **`app/tokens.css`**. Ningún
componente escribe un literal. Es el archivo que se toca para cambiar algo en
vivo.

| Querés cambiar | Tocá |
| --- | --- |
| El naranja de marca | `--color-brand` |
| La banda del encabezado | `--color-hero`, `--color-hero-ink` |
| Cómo se ven los importes | `--color-debit`, `--color-credit`, `--color-benefit` |
| Densidad de la fila | `--row-pad-y`, `--row-gap`, `--row-line-gap`, `--row-min-h` |
| La alineación de la columna de signo | `--sign-col`, `--amount-col` |
| Escala tipográfica | `--text-display` … `--text-micro` |
| Márgenes y ancho de la lista | `--gutter`, `--content-max` |
| Dónde aparece el sidebar | `--breakpoint-desk` |

`app/globals.css` contiene sólo la base, el `.num` que activa las cifras
tabulares, y los keyframes.

---

## Mapa del código

```
app/
  tokens.css            todos los tokens — el único lugar con literales
  globals.css           base, .num (tabular-nums), keyframes
  page.tsx              lee ?state= y monta la pantalla
  showcase/page.tsx     la pestaña de showcase

components/
  account-screen.tsx    dueño del ?state=, compone sidebar + pantalla + control
  movements-screen.tsx  búsqueda, filtros, rango, fases de carga, estados
  account-hero.tsx      saldo, CBU/alias, y el par entró/salió del período
  day-group.tsx         encabezado de día pegajoso + subtotal neto
  transaction-row.tsx   LA fila: nombre resuelto, cadena cruda, desambiguación
  amount.tsx            la grilla signo/dígitos con cifras tabulares
  date-range-menu.tsx   el menú de fechas
  sidebar.tsx           navegación, textual de la referencia
  top-actions.tsx       «Volver a cuentas» y «Más opciones»
  dev-control.tsx       selector flotante de estados
  primitives/           chips, buscador, botón de copiar, íconos SVG
  states/               esqueleto, vacíos, avisos

lib/
  types.ts              el dominio; los importes son centavos enteros
  movements.ts          stream (consumo/operación), tono, duplicados, subtotales
  filter.ts             búsqueda y filtros
  format.ts             ARS y fechas es-AR
  states.ts             los seis estados y sus presets
  cn.ts                 clsx + tailwind-merge

data/
  fixtures.ts           36 movimientos tipados
```

---

## Qué decidí yo y qué propuso el agente

<!-- TODO: author -->
<!-- La separación entre tus decisiones de diseño y lo que se implementó a
     partir de ellas. Es tu autoría; no la puede escribir otro. -->

---

## Autoría y licencia

Diseño y desarrollo por **Pablo Esteban Choi**, 2026.

Banco Galicia y su identidad visual pertenecen a Banco de Galicia y Buenos Aires
S.A.U. Este es un ejercicio de diseño no solicitado y sin afiliación con el
banco. Los datos de la cuenta son ficticios.
