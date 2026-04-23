# Design System — "Strutura"

> Sistema editorial-minimalista inspirado em revistas literárias e livros acadêmicos. Tipografia protagonista, cores discretas, geometria de jornal impresso.

---

## 1. Filosofia

**Princípio central:** conteúdo é o herói. Design serve leitura, nunca compete com ela.

Três decisões que definem a identidade:

1. **Serifa de alto contraste como voz** — não é uma escolha neutra; é declaração editorial.
2. **Paleta quase monocromática** — a cor aparece só onde importa (destaques, estados ativos).
3. **Geometria tipográfica** — a hierarquia vem do peso e tamanho da fonte, não de caixas decorativas.

**O que evitar:** gradientes coloridos, sombras suaves difusas, ícones genéricos, cantos arredondados. Nada de "purple-to-pink".

---

## 2. Tipografia

### Famílias

| Papel             | Família        | Uso                                           |
| ----------------- | -------------- | --------------------------------------------- |
| **Display**       | Bodoni Moda    | Títulos, numerais grandes, ênfases dramáticas |
| **Serif (corpo)** | EB Garamond    | Texto corrido, parágrafos, leitura longa      |
| **Mono**          | JetBrains Mono | Labels, metadados, números, símbolos técnicos |

**Import (Google Fonts):**

```css
@import url("https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,700;1,400&family=JetBrains+Mono:wght@400;600&family=Bodoni+Moda:ital,wght@0,400;0,700;0,900;1,400&display=swap");
```

### Escala tipográfica

| Token        | Tamanho                      | Peso | Uso                       |
| ------------ | ---------------------------- | ---- | ------------------------- |
| `display-xl` | 5rem / 6rem (mobile/desktop) | 900  | Títulos de capítulo       |
| `display-lg` | 2.5rem                       | 700  | Subtítulos principais     |
| `display-md` | 1.5rem                       | 700  | Seções dentro de capítulo |
| `display-sm` | 1.25rem                      | 700  | Subseções                 |
| `body-lg`    | 1.125rem                     | 400  | Parágrafos principais     |
| `body`       | 1rem                         | 400  | Texto padrão              |
| `body-sm`    | 0.875rem                     | 400  | Notas, legendas           |
| `caption`    | 0.75rem                      | 400  | Metadados                 |
| `mono-label` | 0.625rem (10px)              | 400  | Etiquetas, seções         |

### Regras de ouro

- **Line-height apertado em display** (`leading-none` ou 0.85–0.95) para impacto visual.
- **Line-height generoso em body** (1.6–1.75) para leitura confortável.
- **Tracking widest em labels mono** (`letter-spacing: 0.15em` ou mais). Sempre MAIÚSCULAS em labels mono.
- **Itálico na display serif** é uma arma poderosa — use para palavras-chave dentro de títulos.
- **Drop caps** (`::first-letter` com display font) para abrir seções longas de texto corrido.

### Exemplos de uso

```jsx
/* Título de capítulo com itálico parcial */
<h2 className="display text-6xl font-black leading-none">
  A música, <br/><em className="font-normal">decomposta.</em>
</h2>

/* Label de seção */
<p className="mono text-xs uppercase tracking-widest text-stone-500">§ 01</p>

/* Drop cap */
<p className="drop-cap text-lg leading-relaxed">
  Teoria musical é a linguagem...
</p>
```

---

## 3. Cores

### Paleta base (Tailwind `stone`)

| Token       | Hex       | Uso                                                        |
| ----------- | --------- | ---------------------------------------------------------- |
| `stone-50`  | `#fafaf9` | Background principal                                       |
| `stone-100` | `#f5f5f4` | Background de callouts, cards sutis                        |
| `stone-200` | `#e7e5e4` | Divisores sutis, fundo de `<code>` inline                  |
| `stone-300` | `#d6d3d1` | Bordas secundárias, divisores                              |
| `stone-400` | `#a8a29e` | Texto desativado                                           |
| `stone-500` | `#78716c` | Texto secundário, labels mono                              |
| `stone-600` | `#57534e` | Texto de apoio                                             |
| `stone-700` | `#44403c` | -                                                          |
| `stone-900` | `#1c1917` | **Texto principal, bordas fortes, backgrounds invertidos** |

### Acentos

| Token       | Hex       | Uso                                       |
| ----------- | --------- | ----------------------------------------- |
| `amber-50`  | `#fffbeb` | Background de avisos/prompts              |
| `amber-100` | `#fef3c7` | Hover em teclas brancas, destaques suaves |
| `amber-200` | `#fde68a` | Active states em interação                |

**Regra:** use amber com parcimônia. O sistema é 95% stone, 5% amber. Se precisar de outra cor, pause e repense — provavelmente a solução é tipográfica, não cromática.

### Contraste invertido

Blocos importantes ganham fundo `stone-900` com texto `stone-50`. Usar para:

- CTAs fortes
- Códigos destacados (bloco mono)
- Seções de fechamento / conclusão
- Botões em estado ativo

---

## 4. Espaçamento

Grid base de **4px**. Tokens em múltiplos:

| Token      | Valor | Uso                                   |
| ---------- | ----- | ------------------------------------- |
| `space-1`  | 4px   | Gaps mínimos entre elementos densos   |
| `space-2`  | 8px   | Padding interno de chips/tags         |
| `space-3`  | 12px  | Gap entre itens de lista              |
| `space-4`  | 16px  | Padding de cards                      |
| `space-6`  | 24px  | Padding horizontal de container       |
| `space-8`  | 32px  | Separação entre parágrafos            |
| `space-10` | 40px  | Separação antes de novas seções       |
| `space-12` | 48px  | Gap entre sidebar e content           |
| `space-16` | 64px  | Separação máxima entre blocos grandes |

**Regra de ritmo vertical:** cada elemento de título tem `mt-10 mb-3`. Cada parágrafo tem `mb-6`. Caixas de callout têm `my-8`.

---

## 5. Layout

### Grid principal

```
┌─────────────────────────────────────────────────┐
│  HEADER (border-b-2 stone-900, sticky)           │
├──────────┬──────────────────────────────────────┤
│          │                                       │
│ SIDEBAR  │  CONTENT                              │
│ (56px)   │  max-w-3xl                            │
│ sticky   │                                       │
│ top-24   │                                       │
│          │                                       │
├──────────┴──────────────────────────────────────┤
│  FOOTER (border-t-2 stone-900)                   │
└─────────────────────────────────────────────────┘
```

### Container

- **Max-width global:** `max-w-7xl` (1280px)
- **Max-width de conteúdo de leitura:** `max-w-3xl` (768px)
- **Padding lateral:** `px-6`

### Breakpoints

| Breakpoint       | Largura | Comportamento                                  |
| ---------------- | ------- | ---------------------------------------------- |
| default (mobile) | < 640px | Sidebar some, nav vira chips flexbox no rodapé |
| `md`             | 768px+  | Labels do header ficam visíveis                |
| `lg`             | 1024px+ | Sidebar aparece, grid de 2 colunas             |

---

## 6. Bordas & divisores

**Filosofia:** nada de `box-shadow`. Estrutura vem de linhas.

| Estilo                        | Uso                                   |
| ----------------------------- | ------------------------------------- |
| `border-b-2 border-stone-900` | Separação entre páginas/header/footer |
| `border border-stone-300`     | Bordas de cards                       |
| `border-l-4 border-stone-900` | Callouts e destaques                  |
| `border-b border-stone-200`   | Divisores suaves dentro de listas     |
| `border-2 border-stone-900`   | Botões fortes, blocos ativos          |

**Cantos:** sempre retos. `border-radius: 0`. Essa é uma escolha identitária.

---

## 7. Componentes

### 7.1 Label de seção

```jsx
<p className="mono text-xs uppercase tracking-widest text-stone-500 mb-2">
  § 01
</p>
```

Usada acima de todo título de capítulo. O símbolo `§` + número é parte da identidade.

### 7.2 Botão de ação primária

```jsx
<button
  className="mono text-xs border-2 border-stone-900 px-3 py-1.5 
                   hover:bg-stone-900 hover:text-stone-50 transition-colors"
>
  ▸ tocar escala
</button>
```

**Variante compacta** (para botões inline em listas):

```jsx
<button className="note-btn mono text-xs border border-stone-900 px-2 py-1">
  ▸
</button>
```

### 7.3 Callout / destaque

```jsx
<div className="border-l-4 border-stone-900 pl-5 py-2 my-8 bg-stone-100">
  <p className="mono text-[10px] uppercase tracking-widest text-stone-500 mb-2">
    Título do callout
  </p>
  <p className="text-base leading-relaxed">Conteúdo do destaque.</p>
</div>
```

**Três variantes:**

- `bg-stone-100` — callouts neutros (dica, nota)
- `bg-amber-50` — avisos, prompts de ação
- `bg-stone-900 text-stone-50` — fechamentos dramáticos

### 7.4 Card de item

```jsx
<div className="border border-stone-300 p-4 bg-white">
  <div className="flex items-start gap-3">{/* conteúdo */}</div>
</div>
```

### 7.5 Chip / tag inline mono

```jsx
<span className="mono bg-stone-900 text-stone-50 px-2 py-0.5 text-xs">
  Cmaj7
</span>
```

**Variante suave:**

```jsx
<span className="mono bg-stone-200 px-1.5 text-xs">F♯</span>
```

### 7.6 Sidebar nav link

```jsx
<button
  className={`side-link mono text-xs text-left text-stone-500 
                    hover:text-stone-900 ${active ? "active" : ""}`}
>
  01 · Introdução
</button>
```

Com pseudo-elemento no estado ativo:

```css
.side-link.active::before {
  content: "";
  position: absolute;
  left: -16px;
  top: 50%;
  width: 8px;
  height: 1px;
  background: #1c1917;
}
```

### 7.7 Tabela editorial

```jsx
<table className="mono text-sm w-full border-collapse">
  <thead>
    <tr className="border-b-2 border-stone-900">
      <th className="text-left p-2">Coluna</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-stone-200">
      <td className="p-2">Valor</td>
    </tr>
  </tbody>
</table>
```

### 7.8 Footer paginal

```jsx
<footer className="border-t-2 border-stone-900 mt-16 py-6">
  <div className="flex justify-between items-baseline">
    <span className="mono text-[10px] uppercase tracking-widest text-stone-500">
      Projeto · Volume
    </span>
    <span className="mono text-[10px] uppercase tracking-widest text-stone-500">
      3 / 11
    </span>
  </div>
</footer>
```

---

## 8. Interação & motion

**Princípio:** micro-interações discretas. Nada de bounces ou parallax.

### Transições

```css
transition: all 0.15s ease; /* botões, hovers */
transition: all 0.2s ease; /* nav links, estados */
transition: all 0.1s ease; /* feedback tátil (piano keys) */
```

### Hover states

- Texto: muda de `stone-500` para `stone-900`
- Botão primário: inverte fundo (claro → escuro)
- Card: `transform: translateY(-1px)` — elevação mínima
- Piano key branca: passa para `amber-100`

### Active states

- Botão: `transform: translateY(0)` (volta à base)
- Tecla piano branca: `amber-200`

**Não usar:** `scale()` em botões, animações de entrada tipo fade-in em scroll, transições > 300ms.

---

## 9. Padrões visuais

### 9.1 Numeração de seções

Toda seção começa com:

```
§ 01
A Música, decomposta.
```

O parágrafo acima do título usa `mono text-xs uppercase tracking-widest text-stone-500`.

### 9.2 Drop caps

Usar no primeiro parágrafo de qualquer seção de texto corrido longo:

```css
.drop-cap::first-letter {
  font-family: "Bodoni Moda", serif;
  font-size: 5.5rem;
  float: left;
  line-height: 0.85;
  padding: 0.3rem 0.5rem 0 0;
  font-weight: 900;
}
```

### 9.3 Grid pattern decorativo

Para backgrounds texturizados sutis:

```css
.grid-pattern {
  background-image:
    linear-gradient(to right, rgba(28, 25, 23, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(28, 25, 23, 0.04) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

### 9.4 Símbolos

Usar símbolos tipográficos reais em vez de ícones:

- `▸` para play/avançar
- `→` para navegação
- `§` para seções
- `·` como separador (nunca `|` ou `/`)
- `♯ ♭` para acidentes musicais (não `#` ou `b`)

---

## 10. Exemplo mínimo

Página completa com o design system aplicado:

```jsx
<div
  className="min-h-screen bg-stone-50 text-stone-900"
  style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
>
  {/* Header */}
  <header className="border-b-2 border-stone-900 sticky top-0 bg-stone-50 z-20">
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-baseline">
      <div className="flex items-baseline gap-4">
        <span className="mono text-xs uppercase tracking-widest text-stone-500">
          Vol. I
        </span>
        <h1 className="display text-2xl font-black tracking-tight">
          Título do Projeto
        </h1>
      </div>
    </div>
  </header>

  {/* Content */}
  <main className="max-w-3xl mx-auto px-6 py-12">
    <p className="mono text-xs uppercase tracking-widest text-stone-500 mb-2">
      § 01
    </p>
    <h2 className="display text-6xl font-black leading-none mb-8 tracking-tight">
      Um título <em className="font-normal">memorável.</em>
    </h2>
    <p className="drop-cap text-lg leading-relaxed mb-6">
      Texto de abertura que captura a atenção do leitor...
    </p>

    <div className="border-l-4 border-stone-900 pl-5 py-2 my-8 bg-stone-100">
      <p className="mono text-[10px] uppercase tracking-widest text-stone-500 mb-2">
        Nota
      </p>
      <p className="text-base leading-relaxed">Conteúdo do callout.</p>
    </div>
  </main>

  {/* Footer */}
  <footer className="border-t-2 border-stone-900 mt-16 py-6">
    <div className="max-w-7xl mx-auto px-6 flex justify-between items-baseline">
      <span className="mono text-[10px] uppercase tracking-widest text-stone-500">
        Projeto · 2025
      </span>
    </div>
  </footer>
</div>
```

---

## 11. Checklist de conformidade

Antes de publicar algo no sistema, verifique:

- [ ] Fontes importadas (Bodoni Moda, EB Garamond, JetBrains Mono)
- [ ] Background é `stone-50`, texto é `stone-900`
- [ ] Zero `border-radius` (cantos retos em todos os componentes)
- [ ] Labels mono estão em maiúsculas com `tracking-widest`
- [ ] Pelo menos um título usa itálico serif para ênfase
- [ ] Nenhuma sombra difusa (`box-shadow`) — só bordas
- [ ] Footer tem divisor superior `border-t-2 border-stone-900`
- [ ] Símbolos tipográficos reais (▸ → §) em vez de ícones decorativos
- [ ] Paleta se limita a stone + amber (exceções documentadas)
- [ ] Texto de leitura com `leading-relaxed` (1.625)

---

## 12. Quando quebrar as regras

Três situações em que é aceitável desviar do sistema:

1. **Tema dark:** inverter stone-50/stone-900 e ajustar amber para um tom mais quente (amber-200 vira amber-300 no fundo escuro).
2. **Dados/dashboards:** pode adicionar uma cor semântica (verde/vermelho) para status, mas apenas em chips pequenos, nunca em blocos grandes.
3. **Componentes interativos complexos** (editores, mapas): aí o utilitário supera a estética. Mas mantenha tipografia e paleta coerentes.

---

_Sistema batizado de "Strutura" — referência à arquitetura editorial italiana dos anos 60. Toda decisão deriva de uma pergunta: "essa escolha serve o texto, ou se serve a si mesma?"_
