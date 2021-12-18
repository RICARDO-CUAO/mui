---
title: Consulta de mídia no React para design responsivo
githubLabel: 'hook: useMediaQuery'
---

# useMediaQuery

<p class="description">Este é um hook de consulta de mídia CSS para React. Ele ouve correspondências para uma consulta de mídia no CSS. Permite a renderização de componentes com base no fato de a consulta corresponder ou não.</p>

Algumas das principais características:

- ⚛️ Tem uma API React idiomática.
- 🚀 É performático, ele observa o documento para detectar quando suas consultas de mídia mudam, em vez de pesquisar os valores periodicamente.
- 📦 [1 kB gzipped](/size-snapshot).
- 🤖 Suporta a renderização do lado do servidor.

{{"component": "modules/components/ComponentLinkHeader.js", "design": false}}

## Consulta de mídia simples

Você deve fornecer uma consulta de mídia ao primeiro argumento do hook. A string de consulta de mídia pode ser qualquer consulta de mídia CSS válida, por exemplo [`'(prefers-color-scheme: dark)'`](/customization/palette/#user-preference).

{{"demo": "pages/components/use-media-query/SimpleMediaQuery.js", "defaultCodeOpen": true}}

⚠️ Você não pode usar `'print'` devido a limitação de navegadores, por exemplo, este bug presente no [Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=774398).

## Using MUI's breakpoint helpers

You can use MUI's [breakpoint helpers](/customization/breakpoints/) as follows:

```jsx
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function MyComponent() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return <span>{`theme.breakpoints.up('sm') matches: ${matches}`}</span>;
}
```

{{"demo": "pages/components/use-media-query/ThemeHelper.js", "defaultCodeOpen": false}}

Como alternativa, você pode usar uma função de retorno, aceitando o tema como um primeiro argumento:

```jsx
import useMediaQuery from '@mui/material/useMediaQuery';

function MyComponent() {
  const matches = useMediaQuery((theme) => theme.breakpoints.up('sm'));

  return <span>{`theme.breakpoints.up('sm') matches: ${matches}`}</span>;
}
```

Você pode usar [json2mq](https://github.com/akiran/json2mq) para gerar uma string de consulta de mídia a partir de um objeto JavaScript.

## Usando a sintaxe JavaScript

Você pode usar [json2mq](https://github.com/akiran/json2mq) para gerar uma string de consulta de mídia a partir de um objeto JavaScript.

{{"demo": "pages/components/use-media-query/JavaScriptMedia.js", "defaultCodeOpen": true}}

## Testando

Você precisa de uma implementação de [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) em seu ambiente de teste.

Por exemplo, [jsdom não suporta ainda](https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom). Você deve usar um polyfill para isso. É recomendável usar [css-mediaquery](https://github.com/ericf/css-mediaquery) para emular.

```js
import mediaQuery from 'css-mediaquery';

function createMatchMedia(width) {
  return query => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {},
  });
}

describe('MeusTestes', () => {
  beforeAll(() => {
    window.matchMedia = createMatchMedia(window.innerWidth);
  });
});
```

## Renderização somente do lado do cliente

Para executar a hidratação no lado do servidor, o hook precisa renderizar duas vezes. Uma primeira vez com `false`, o valor do servidor e uma segunda vez com o valor resolvido. This double pass rendering cycle comes with a drawback. It's slower. Você pode definir a opção `noSsr` para `true` se você estiver fazendo renderização **somente no lado cliente**.

```js
const matches = useMediaQuery('(min-width:600px)', { noSsr: true });
```

ou pode ativar globalmente com o tema:

```js
const theme = createTheme({
  components: {
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
  },
});
```

## Server-side rendering

> ⚠️ Renderização do lado servidor e consultas de mídia do lado cliente são fundamentalmente conflitantes. Esteja ciente da escolha. O suporte só pode ser parcial.

Tente confiar em consultas de mídia CSS do lado do cliente primeiro. Por exemplo, você poderia usar:

- [`<Box display>`](/system/display/#hiding-elements)
- [`themes.breakpoints.up(x)`](/customization/breakpoints/#css-media-queries)
- or [`sx prop`](/system/basics/#heading-the-sx-prop)

Se nenhuma das alternativas acima for uma opção, você poderá continuar lendo esta seção da documentação.

Primeiro, você precisa adivinhar as características da solicitação do cliente, no servidor. Você tem a opção entre usar:

- **User agent**. Analise a string do user agent do cliente para extrair informações. É recomendável usar [ua-parser-js](https://github.com/faisalman/ua-parser-js) para analisar o user agent.
- **Client hints**. Leia as dicas que o cliente está enviando para o servidor. Esteja ciente de que esse recurso [não é suportado em qualquer lugar](https://caniuse.com/#search=client%20hint).

Por fim, você precisa fornecer uma implementação de [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) para o `useMediaQuery` com as características adivinhadas anteriormente. É recomendável usar [css-mediaquery](https://github.com/ericf/css-mediaquery) para emular o matchMedia.

Por exemplo, no lado do servidor:

```js
import ReactDOMServer from 'react-dom/server';
import parser from 'ua-parser-js';
import mediaQuery from 'css-mediaquery';
import { ThemeProvider } from '@mui/material/styles';

function handleRender(req, res) {
  const deviceType = parser(req.headers['user-agent']).device.type || 'desktop';
  const ssrMatchMedia = (query) => ({
    matches: mediaQuery.match(query, {
      // The estimated CSS width of the browser.
      width: deviceType === 'mobile' ? '0px' : '1024px',
    }),
  });

  const html = ReactDOMServer.renderToString(
    <ThemeProvider
      theme={{
        props: {
          // Modifica as opções padrão de useMediaQuery
          MuiUseMediaQuery: { ssrMatchMedia },
        },
      }}
    >
      <App />
    </ThemeProvider>,
  );

  // …
}
}
}
```

{{"demo": "pages/components/use-media-query/ServerSide.js", "defaultCodeOpen": false}}

Certifique-se de fornecer a mesma implementação de mídia de correspondência customizada para o lado do cliente para garantir uma correspondência de hidratação.

## Migrando de `withWidth()`

O componente de ordem superior `withWidth()` injeta a largura da tela da página. Você pode reproduzir o mesmo comportamento com o hook `useWidth`:

{{"demo": "pages/components/use-media-query/UseWidth.js"}}

## API

### `useMediaQuery(query, [options]) => matches`

#### Arguments

1. `query` (_string_ | _func_): A string representing the media query to handle or a callback function accepting the theme (in the context) that returns a string.
2. `options` (_object_ [optional]):

- `options.defaultMatches` (_bool_ [optional]): As `window.matchMedia()` is unavailable on the server, we return a default matches during the first mount. O valor padrão é `false`.
- `options.matchMedia` (_func_ [optional]): You can provide your own implementation of _matchMedia_. Isso pode ser usado para manipular uma janela iframe com conteúdo.
- `options.noSsr` (_bool_ [opcional]): Padrão `false`. To perform the server-side hydration, the hook needs to render twice. A first time with `false`, the value of the server, and a second time with the resolved value. Este ciclo de renderização de dupla passagem tem uma desvantagem. É mais lento. Você pode definir esta opção para `true` se você estiver fazendo renderização **somente no lado cliente**.
- `options.ssrMatchMedia` (_func_ [optional]): You can provide your own implementation of _matchMedia_ in a [server-side rendering context](#server-side-rendering).

Nota: Você pode alterar as opções padrão usando [`default props`](/customization/theme-components/#default-props), este recurso pertence ao tema através da chave `MuiUseMediaQuery`.

#### Returns

`matches`: Matches é `true` se o documento coincidir com a consulta de mídia, e `false` quando isso não ocorrer.

#### Examples

```jsx
import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function SimpleMediaQuery() {
  const matches = useMediaQuery('(min-width:600px)');

  return <span>{`(min-width:600px) matches: ${matches}`}</span>;
}
```