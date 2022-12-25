# Check Splitter

This is a single-page web app that helps users split the check after eating out at a restaurant. The user will be able to enter the names of the diners who will be splitting the check, the items on the receipt, and the tax and tip. Then, the user can associate different items with different diners, signifying that those diners are equally responsible for that item. Finally, the web app will respond with how much each diner owes toward the final bill.

## Type Schema

```typescript
interface Item {
    name: string;
    price: number;
    dinerIds: number[]; // the ids of the responsible diners
}
```

```typescript
interface Diner {
    id: number;
    name: string;
    owes?: number; // the amount the diner is responsible for
    items?: Item[]; // the items that the diner ordered
}
```

```typescript
interface Check {
    items: Item[];
    diners: Diner[];
    tip: number; // tip percentage
    tax: number; // tax percentage
}
```

## API Schema

`POST /api/split`

- Request - `Check`. Will not have the `owes` or `items` field for the `Diner`s
- `200 OK`  - `Diner[]` where the `owes` field is necessarily filled.
- `400 Malformed Request`
- The responses follow the JSend schema.
