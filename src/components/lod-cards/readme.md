# lod-cards



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute        | Description                                      | Type      | Default     |
| ------------------------- | ---------------- | ------------------------------------------------ | --------- | ----------- |
| `countQuery` _(required)_ | `count-query`    | The count query to use for total number of items | `string`  | `undefined` |
| `ctaDisabled`             | `cta-disabled`   | Wether to hide the call to action button or not  | `boolean` | `false`     |
| `ctaText`                 | `cta-text`       | Custom call to action text                       | `string`  | `undefined` |
| `ctaUrl`                  | `cta-url`        | Custom call to action url                        | `string`  | `undefined` |
| `endpoint` _(required)_   | `endpoint`       | The SparQL Endpoint                              | `string`  | `undefined` |
| `itemsPerPage`            | `items-per-page` | Maximum items per page                           | `number`  | `10`        |
| `pagerDisabled`           | `pager-disabled` | Wether to hide the pager or not                  | `boolean` | `false`     |
| `query` _(required)_      | `query`          | The query to use for data fetching               | `string`  | `undefined` |
| `readMoreText`            | `read-more-text` | Custom read more text for the cards              | `string`  | `undefined` |


## Dependencies

### Depends on

- [lod-card](../lod-card)

### Graph
```mermaid
graph TD;
  lod-cards --> lod-card
  style lod-cards fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
