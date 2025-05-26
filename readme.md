[![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)](https://stenciljs.com)

# What is this repo?

This is the District09 LOD component library.

NPM Link: https://www.npmjs.com/package/@district09/lod-widgets

# Why does this use Stencil and what is it?

Stencil is a compiler for building fast web apps using Web Components.

Stencil combines the best concepts of the most popular frontend frameworks into a compile-time rather than runtime tool. Stencil takes TypeScript, JSX, a tiny virtual DOM layer, efficient one-way data binding, an asynchronous rendering pipeline (similar to React Fiber), and lazy-loading out of the box, and generates 100% standards-based Web Components that run in any browser supporting the Custom Elements v1 spec.

Stencil components are just Web Components, so they work in any major framework or with no framework at all.

## Getting Started

run:

```bash
npm install
npm start
```

To build the component for production, run:

```bash
npm run build
```

To run the unit tests for the components, run:

```bash
npm test
```

Need help? Check out the docs [here](https://stenciljs.com/docs/my-first-component).

## Available components

- LodAddress
  - HTML: <lod-address/>
  - [Documentation](https://github.com/StadGent/js_widget-lod/blob/main/src/components/lod-address/readme.md)
- LodTable
  - HTML: <lod-table/>
  - [Documentation](https://github.com/StadGent/js_widget-lod/blob/main/src/components/lod-table/readme.md)
- LodCards
  - HTML: <lod-cards/>
  - [Documentation](https://github.com/StadGent/js_widget-lod/blob/main/src/components/lod-cards/readme.md)
- LodCard
  - HTML: <lod-card/>
  - [Documentation](https://github.com/StadGent/js_widget-lod/blob/main/src/components/lod-card/readme.md)
- LodDecisionsList
  - HTML: <lod-decisions-list/>
  - [Documentation](https://github.com/StadGent/js_widget-lod/blob/main/src/components/lod-decisions-list/readme.md)
- LodRegulationsList
  - HTML: <lod-regulations-list/>
  - [Documentation](https://github.com/StadGent/js_widget-lod/blob/main/src/components/lod-regulations-list/readme.md)
- LodDecisionCard
  - HTML: <lod-decision-card/>
  - [Documentation](https://github.com/StadGent/js_widget-lod/blob/main/src/components/lod-decision-card/readme.md)
- LodOpeningHours
  - HTML: <lod-opening-hours/>
  - [Documentation](https://github.com/StadGent/js_widget-lod/blob/main/src/components/lod-opening-hours/readme.md)

### Using the components

You can install the components with npm and just use import

```
npm i @district09/lod-widgets
```

Or you can also import the components via a script tag:

```html
<script
  type="module"
  src="https://unpkg.com/@district09/lod-widgets/dist/lod-widgets/lod-widgets.esm.js"
></script>

<lod-cards></lod-cards>
<lod-table></lod-table>
```

This will only load the necessary javascript for the components that are used on your page.
This means if you don't have lod-table, it won't load the js files for lod-table and it will make your application faster :)

You can also import the script as part of your `node_modules` in your applications entry file:

```tsx
import "lod-widgets/dist/lod-widgets/lod-widgets.esm.js";
```

# [Checkout the demo here](https://stadgent.github.io/js_widget-lod/)
