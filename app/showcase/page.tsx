import { ProtoNav } from "@/components/proto-nav";
import { TransactionRow } from "@/components/transaction-row";
import { Amount } from "@/components/amount";
import { movements } from "@/data/fixtures";
import { derive } from "@/lib/movements";

export const metadata = { title: "Showcase · Movimientos Galicia" };

const list = derive(movements);
const byId = (id: string) => list.find((m) => m.id === id)!;

/* ── shell ─────────────────────────────────────────────────────────────── */

function Section({
  n,
  title,
  lede,
  children,
}: {
  n: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line px-5 py-10 sm:px-8">
      <p className="text-micro font-semibold uppercase tracking-[var(--tracking-overline)] text-brand-ink">
        {n}
      </p>
      <h2 className="mt-1 text-[1.375rem] font-semibold tracking-tight text-ink">
        {title}
      </h2>
      {lede && (
        <p className="mt-2 max-w-[46rem] text-body leading-relaxed text-ink-2">
          {lede}
        </p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 max-w-[46rem] border-l-2 border-line-2 pl-3 text-meta leading-relaxed text-ink-3">
      {children}
    </p>
  );
}

/** Phone-width frame, so every row is judged at the width it ships at. */
function Phone({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-[23.4375rem]">
      {label && (
        <p className="mb-1.5 text-micro font-semibold uppercase tracking-[var(--tracking-overline)] text-ink-3">
          {label}
        </p>
      )}
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface">
        {children}
      </div>
    </div>
  );
}

function Rows({ ids }: { ids: string[] }) {
  return (
    <ul className="px-[var(--gutter)]">
      {ids.map((id, i) => (
        <TransactionRow
          key={id}
          movement={byId(id)}
          className={i > 0 ? "border-t border-line" : undefined}
        />
      ))}
    </ul>
  );
}

/* ── 2 · colour ────────────────────────────────────────────────────────── */

const SWATCHES: {
  group: string;
  items: { token: string; hex: string; use: string; ratio?: string }[];
}[] = [
  {
    group: "Marca",
    items: [
      { token: "--color-brand", hex: "#ff6b00", use: "Relleno e interacción. Nunca texto sobre blanco.", ratio: "2,85:1" },
      { token: "--color-brand-ink", hex: "#c24800", use: "La variante que sí sirve como texto.", ratio: "4,97:1" },
      { token: "--color-brand-soft", hex: "#fff1e6", use: "Fondo de chip activo en reposo." },
      { token: "--color-on-brand", hex: "#16181d", use: "Texto sobre naranja.", ratio: "6,22:1" },
    ],
  },
  {
    group: "Tinta",
    items: [
      { token: "--color-ink", hex: "#16181d", use: "Comercio resuelto, saldo, créditos.", ratio: "16,4:1" },
      { token: "--color-ink-2", hex: "#4a4f59", use: "Débitos y datos que desambiguan la fila.", ratio: "8,2:1" },
      { token: "--color-ink-3", hex: "#6b7280", use: "La cadena cruda del banco.", ratio: "4,8:1" },
      { token: "--color-ink-4", hex: "#8b90a0", use: "Sólo separadores y trazos. Nunca texto.", ratio: "3,4:1" },
    ],
  },
  {
    group: "Plata",
    items: [
      { token: "--color-debit", hex: "#4a4f59", use: "Sale plata. Peso normal, tinta apagada.", ratio: "8,2:1" },
      { token: "--color-credit", hex: "#16181d", use: "Entra plata propia. Semibold, tinta plena.", ratio: "16,4:1" },
      { token: "--color-benefit", hex: "#0b7a3e", use: "Beneficio otorgado por el banco. Sólo eso.", ratio: "5,4:1" },
    ],
  },
  {
    group: "Estado",
    items: [
      { token: "--color-pending", hex: "#8a5a00", use: "Pendiente de acreditación.", ratio: "4,9:1" },
      { token: "--color-danger", hex: "#b3261e", use: "No pudimos actualizar.", ratio: "6,4:1" },
    ],
  },
];

function Swatches() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {SWATCHES.map((g) => (
        <div key={g.group}>
          <p className="mb-2 text-micro font-semibold uppercase tracking-[var(--tracking-overline)] text-ink-3">
            {g.group}
          </p>
          <ul className="overflow-hidden rounded-[var(--radius-md)] border border-line">
            {g.items.map((s, i) => (
              <li
                key={s.token}
                className={`flex items-start gap-3 bg-surface p-3 ${i > 0 ? "border-t border-line" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 size-8 shrink-0 rounded-[var(--radius-sm)] border border-line-2"
                  style={{ background: s.hex }}
                />
                <div className="min-w-0">
                  <p className="num text-meta font-semibold text-ink">
                    {s.token}
                  </p>
                  <p className="num text-meta text-ink-3">
                    {s.hex}
                    {s.ratio && <> · {s.ratio} sobre blanco</>}
                  </p>
                  <p className="mt-0.5 text-meta leading-snug text-ink-2">
                    {s.use}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ── 3 · type ──────────────────────────────────────────────────────────── */

const TYPE = [
  { token: "--text-display", px: "32px", cls: "text-display font-semibold tracking-tight", sample: "$517.996,13", num: true },
  { token: "--text-amount", px: "17px", cls: "text-amount font-semibold", sample: "−$157.300,70", num: true },
  { token: "--text-name", px: "16px", cls: "text-name font-medium", sample: "Coto", num: false },
  { token: "--text-body", px: "15px", cls: "text-body", sample: "Mostrando datos del 14/08 09:12", num: false },
  { token: "--text-raw", px: "13px", cls: "text-raw text-ink-3", sample: "Coto sucursal 103", num: false },
  { token: "--text-meta", px: "12px", cls: "text-meta text-ink-2", sample: "Visa ••••8214 · 1 de 2", num: false },
  { token: "--text-micro", px: "11px", cls: "text-micro font-semibold uppercase tracking-[var(--tracking-overline)] text-ink-3", sample: "Últimos movimientos", num: false },
];

/* ── 4 · the amount column ─────────────────────────────────────────────── */

const STRIP: { cents: number; tone: "debito" | "credito" | "beneficio" }[] = [
  { cents: -15_730_070, tone: "debito" },
  { cents: 1_000_000, tone: "beneficio" },
  { cents: -57_705_686, tone: "debito" },
  { cents: -3_470_160, tone: "debito" },
  { cents: 96_805_498, tone: "credito" },
  { cents: -312_000, tone: "debito" },
  { cents: 1_248_035_055, tone: "credito" },
];

/** The reference screen's treatment, rebuilt for comparison. */
function BeforeStrip() {
  return (
    <ul className="space-y-2 text-right" style={{ fontVariantNumeric: "proportional-nums" }}>
      {STRIP.map((a, i) => (
        <li key={i} className="text-amount text-ink">
          {a.cents < 0 ? "-" : ""}$
          {new Intl.NumberFormat("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(Math.abs(a.cents) / 100)}
        </li>
      ))}
    </ul>
  );
}

function AfterStrip() {
  return (
    <ul className="space-y-2">
      {STRIP.map((a, i) => (
        <li key={i} className="flex justify-end">
          <Amount cents={a.cents} tone={a.tone} />
        </li>
      ))}
    </ul>
  );
}

/* ── page ──────────────────────────────────────────────────────────────── */

export default function Showcase() {
  return (
    <div className="min-h-dvh bg-surface">
      <ProtoNav active="/showcase" />

      <header className="px-5 pb-8 pt-10 sm:px-8">
        <p className="text-micro font-semibold uppercase tracking-[var(--tracking-overline)] text-brand-ink">
          Teléfono, escritorio y los seis estados
        </p>
        <h1 className="mt-1 max-w-[36rem] text-[2rem] font-semibold leading-tight tracking-tight text-ink">
          Tokens, la fila y la pantalla
        </h1>
        <p className="mt-3 max-w-[46rem] text-body leading-relaxed text-ink-2">
          Todo el color, el tamaño y el ritmo de la interfaz se resuelve en{" "}
          <code className="num rounded bg-surface-2 px-1 py-0.5 text-meta">
            app/tokens.css
          </code>
          . Ningún componente escribe un literal. La fila es un solo componente
          reutilizado en toda la pantalla.
        </p>
      </header>

      <Section
        n="01"
        title="La fila"
        lede="Tres líneas, y la tercera sólo cuando hay algo que poner en ella. El nombre resuelto arriba; la cadena cruda del banco siempre visible debajo; los datos que desambiguan al pie."
      >
        <div className="flex flex-wrap items-start gap-8">
          <Phone label="Fila estándar">
            <Rows ids={["m-02", "m-08", "m-04"]} />
          </Phone>
          <ol className="max-w-[26rem] space-y-3 text-body leading-relaxed text-ink-2">
            <li>
              <strong className="font-semibold text-ink">1 · Nombre resuelto.</strong>{" "}
              «Coto», no «Coto sucursal 103». El número de sucursal no le dice
              nada a la persona.
            </li>
            <li>
              <strong className="font-semibold text-ink">2 · Cadena cruda.</strong>{" "}
              Textual, sin editar, sin truncar, sin ocultar. Es lo único que se
              puede cruzar contra el resumen en PDF, y en un teléfono no hay
              hover que la revele.
            </li>
            <li>
              <strong className="font-semibold text-ink">3 · Desambiguación.</strong>{" "}
              Últimos cuatro dígitos, «1 de 2», «Débito automático», estado.
              Va en tinta más oscura que la línea 2 aunque esté más abajo: es la
              línea que contesta «¿por qué aparece dos veces?».
            </li>
          </ol>
        </div>
        <Note>
          La cadena cruda envuelve en varias líneas antes que truncarse. Es la
          lectura más estricta de la regla: si se recorta, deja de servir para
          reconciliar.
        </Note>
      </Section>

      <Section
        n="02"
        title="La columna de importes"
        lede="El signo vive en su propia columna de ancho fijo y el bloque de dígitos tiene ancho mínimo, así el − y el + caen siempre en la misma x. Los signos forman una tira que se lee en vertical sin leer un solo número."
      >
        <div className="flex flex-wrap gap-10">
          <div>
            <p className="mb-3 text-micro font-semibold uppercase tracking-[var(--tracking-overline)] text-ink-3">
              Hoy
            </p>
            <BeforeStrip />
            <p className="mt-3 max-w-[15rem] text-meta leading-relaxed text-ink-3">
              Cifras proporcionales, signo en el flujo. Las comas no se alinean
              y el signo se pierde contra el dígito.
            </p>
          </div>
          <div>
            <p className="mb-3 text-micro font-semibold uppercase tracking-[var(--tracking-overline)] text-brand-ink">
              Rediseño
            </p>
            <AfterStrip />
            <p className="mt-3 max-w-[15rem] text-meta leading-relaxed text-ink-3">
              <code className="num">tabular-nums</code>, coma alineada, signo en
              columna propia. El importe de ocho cifras crece hacia la izquierda
              en vez de truncarse.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <p className="mb-3 text-micro font-semibold uppercase tracking-[var(--tracking-overline)] text-ink-3">
            Tres tratamientos, no dos
          </p>
          <ul className="max-w-[38rem] overflow-hidden rounded-[var(--radius-md)] border border-line">
            {[
              { t: "debito" as const, c: -15_730_070, label: "Débito", desc: "Sale plata. Peso normal, tinta apagada." },
              { t: "credito" as const, c: 96_805_498, label: "Crédito", desc: "Entra plata propia: venta de títulos, dólares, una devolución. Semibold, tinta plena." },
              { t: "beneficio" as const, c: 1_000_000, label: "Beneficio", desc: "Un beneficio económico que otorgó el banco: reintegro, cashback, descuento. Sólo esto va en verde." },
            ].map((r, i) => (
              <li
                key={r.t}
                className={`flex items-start justify-between gap-4 bg-surface p-4 ${i > 0 ? "border-t border-line" : ""}`}
              >
                <div className="min-w-0">
                  <p className="text-name font-medium text-ink">{r.label}</p>
                  <p className="mt-0.5 text-meta leading-snug text-ink-2">
                    {r.desc}
                  </p>
                </div>
                <Amount cents={r.c} tone={r.t} />
              </li>
            ))}
          </ul>
          <Note>
            Verde no significa «entra plata». Significa «el banco te dio algo».
            Una venta de títulos es plata propia moviéndose, no un regalo — va en
            tinta plena, no en verde. Así el verde sigue siendo raro y por eso
            sigue significando algo. Débito y crédito se separan por peso{" "}
            <em>y</em> por luminancia (8,2:1 contra 16,4:1) además del signo, así
            que la distinción sobrevive en escala de grises.
          </Note>
        </div>
      </Section>

      <Section
        n="03"
        title="Consumo y operación en una sola lista"
        lede="Dos modelos mentales, un solo stream. Las operaciones —pago de tarjeta, dólares, títulos, transferencias— llevan un riel a la izquierda y una sangría. El consumo va al ras. Son dos carriles que se escanean sin decidir nada de antemano."
      >
        <Phone>
          <Rows ids={["m-02", "m-04", "m-09", "m-03", "m-11"]} />
        </Phone>
        <Note>
          El riel es posición, no color: sobrevive en escala de grises y no
          inventa una categoría. La clasificación sale del tipo de movimiento que
          el banco ya registra, nunca de adivinar a partir del nombre del
          comercio.
        </Note>
      </Section>

      <Section
        n="04"
        title="Los casos que rompen la fila"
        lede="Cada fixture de acá existe para quebrar el layout. Si la fila aguanta esto, aguanta el resto."
      >
        <div className="flex flex-wrap items-start gap-8">
          <Phone label="Nombre larguísimo · importe de ocho cifras · devolución · código puro">
            <Rows ids={["m-27", "m-28", "m-29", "m-30"]} />
          </Phone>
          <Phone label="Duplicado exacto · servicio sin identificar · pendiente">
            <Rows ids={["m-14", "m-15", "m-19", "m-01"]} />
          </Phone>
        </div>
        <Note>
          «1 de 2» se deriva de la lista misma, y sólo después de agotar todo lo
          que el banco sí mandó: los dos pagos de Mastercard del 07/08 no lo
          necesitan porque los últimos cuatro dígitos ya los separan. Cuando no
          hay proveedor en el dato, la fila lo dice —{" "}
          <em>Servicio no identificado</em> — en vez de mostrar la abreviatura.
        </Note>
      </Section>

      <Section
        n="05"
        title="Color"
        lede="Cuatro niveles de tinta, todos AA sobre blanco. El naranja de Galicia es ancla de marca e interacción; nunca significa plata."
      >
        <Swatches />
      </Section>

      <Section
        n="06"
        title="Tipografía"
        lede="Stack de sistema a propósito: la pantalla de referencia es SF Pro en iOS, y SF Pro, Segoe y Roboto traen cifras tabulares reales. Una webfont cambiaría justamente los números que vinimos a arreglar."
      >
        <ul className="overflow-hidden rounded-[var(--radius-md)] border border-line">
          {TYPE.map((t, i) => (
            <li
              key={t.token}
              className={`flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 bg-surface px-4 py-3 ${i > 0 ? "border-t border-line" : ""}`}
            >
              <span className={`${t.cls} ${t.num ? "num" : ""} text-ink`}>
                {t.sample}
              </span>
              <span className="num text-meta text-ink-3">
                {t.token} · {t.px}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        n="07"
        title="El naranja, y lo que mide"
        lede="La banda es una decisión de este rediseño, no un requisito de marca: en la pantalla de referencia el encabezado es blanco con tipografía negra, y el naranja aparece sólo en el chevron y en el link FILTRAR. Por eso la banda lleva un valor más profundo del mismo tono — inventar la banda y después justificar su contraste con una regla corporativa que no existe sería introducir un problema de accesibilidad que la pantalla original no tenía."
      >
        <ul className="max-w-[42rem] overflow-hidden rounded-[var(--radius-md)] border border-line">
          {[
            { hex: "#ff6b00", fg: "#ffffff", token: "blanco sobre --color-brand", ratio: "2,86:1", ok: false, use: "Lo que se había implementado antes. Queda por debajo de 4,5:1 (AA texto) y también de 3:1 (AA texto grande), así que ningún tamaño la salva. Descartado." },
            { hex: "#cc4a00", fg: "#ffffff", token: "--color-hero — implementado", ratio: "4,62:1", ok: true, use: "El valor más claro del mismo naranja donde el blanco pasa AA. Conserva el tono y la banda, y es lo que está en pantalla." },
            { hex: "#ab3e00", fg: "#ffffff", token: "--color-hero-wash sobre la banda", ratio: "6,14:1", ok: true, use: "El hover de los controles de la banda oscurece en vez de aclarar. Un lavado claro habría llevado el blanco a 2,81:1: el mismo problema mudado a otro estado." },
            { hex: "#ff6b00", fg: "#16181d", token: "--color-brand + --color-on-brand", ratio: "6,22:1", ok: true, use: "El naranja de marca queda intacto y sigue llevando marcas, rieles, focus y el chip activo, con tinta casi negra encima." },
          ].map((r, i) => (
            <li key={i} className={`flex items-center gap-4 p-4 ${i > 0 ? "border-t border-line" : ""}`}>
              <span
                className="grid size-16 shrink-0 place-items-center rounded-[var(--radius-sm)] text-meta font-semibold"
                style={{ background: r.hex, color: r.fg }}
              >
                $438
              </span>
              <div className="min-w-0">
                <p className="num text-meta font-semibold text-ink">{r.token}</p>
                <p className={`num text-meta font-semibold ${r.ok ? "text-benefit" : "text-danger"}`}>
                  {r.ratio} {r.ok ? "· pasa AA" : "· no pasa AA"}
                </p>
                <p className="mt-0.5 text-meta leading-snug text-ink-2">{r.use}</p>
              </div>
            </li>
          ))}
        </ul>
        <Note>
          Adentro de la banda la jerarquía es tamaño y peso, nunca opacidad:
          bajar la tinta deshace el arreglo. Por eso hay un solo token de tinta
          para el hero, y nada más en la app depende del valor de la banda.
        </Note>
      </Section>

      <Section
        n="08"
        title="Los seis estados"
        lede="Cada uno es alcanzable por ?state= y desde el control flotante de abajo a la derecha. Dos de ellos no están simulados: el filtro sin resultados aplica una búsqueda real que no encuentra nada, y el período sin actividad aplica un rango real sobre un mes vacío. Los dos caen por el mismo camino que recorrería una persona."
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            { k: "loading", t: "Carga", d: "Esqueleto con el ritmo real de las filas —mismos headers de día, mismas filas de 2 y 3 líneas— y después las filas antes que el resumen: el total depende del conjunto completo, así que no puede aparecer honestamente antes. Pulso de opacidad, no barrido: un barrido es un degradado." },
            { k: "empty-new", t: "Cuenta nueva", d: "Onboarding, no error. Sin buscador ni chips: no hay nada sobre qué buscar. Sin par entró/salió: no hay período que resumir." },
            { k: "empty-filter", t: "Filtro sin resultados", d: "La salida está a mano: borrar el término, o quitar todos los filtros y ampliar el rango." },
            { k: "empty-quiet", t: "Período sin actividad", d: "Otro mensaje distinto: el mes existe y está vacío. «No es un error y no hay nada que reintentar»." },
            { k: "error-connection", t: "Error de conexión", d: "Los datos cacheados siguen en pantalla con su timestamp. Una pantalla vacía destruye más valor que un dato viejo declarado como viejo." },
            { k: "error-partial", t: "Error parcial", d: "La cuenta cargó; un movimiento todavía no liquidó. Se nombra cuál y por cuánto, y la fila lleva su chip." },
          ].map((x) => (
            <li key={x.k} className="rounded-[var(--radius-md)] border border-line p-4">
              <p className="text-name font-medium text-ink">{x.t}</p>
              <p className="num mt-0.5 text-meta text-brand-ink">?state={x.k}</p>
              <p className="mt-1.5 text-meta leading-relaxed text-ink-2">{x.d}</p>
            </li>
          ))}
        </ul>
      </Section>

      <footer className="border-t border-line px-5 py-10 text-meta text-ink-3 sm:px-8">
        Rediseño de la pantalla de Movimientos de una caja de ahorro · Banco
        Galicia, Argentina. Datos de prueba tipados, sin base de datos. Las filas
        reales de las pantallas de referencia están textuales en{" "}
        <code className="num">data/fixtures.ts</code>, junto con los casos
        deliberadamente feos.
      </footer>
    </div>
  );
}
