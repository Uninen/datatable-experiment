![CI](https://github.com/Uninen/datatable-experiment/workflows/CI/badge.svg)

# Datatable experiment

Experimenting w/ highly opionated datatable design.

The basic idea is to provide feature-complete and super flexible set of primitive components that allow you to easily put together a fully customised datatable componen that you can very easily reuse and modify within your project.

Note: this is not intended as a final product but an experiment. Hence, the code and organisation is geared towards practicality, not purity.

## Current functionality

- Accepts **any json array** of objects as data, display only the fields you need
- **100% control over markup and styling**; everything works via slots
- Works with **both local and remote data** (using your own api function)
- **Responsive**, remove less important data columns for small breakpoints
- Automatic and responsive **pagination**
- **Search** for both local and remote data
- Simple **filtering** for both local and remote boolean values
- Simple and powerful way to **export data** using your own export function
- Written in TypeScript, tested with Cypress.io

## Design goals

- Fully responsive, mobile-first
- Fully customizable markup
- Work fluently for both client and backend data
- Customizable filters
- Customizable search
- Easily humanizable (nice labels, etc)

## Project setup

Install dependencies:

```
yarn
```

Run development server:

```
yarn dev
```

Run tests locally:

```
yarn test
```

## Design decisions

- While keeping unnecessary dependencies as few as possible, there's no point of keep reinventing the wheel. Current dependencies include

  - [minisearch](https://github.com/lucaong/minisearch) (6k) for local search
  - [dayjs](https://github.com/iamkun/dayjs) (3k) for date filter
  - [lodash-es](https://github.com/lodash/lodash) (~5k) for a few utilities like `clone`

- The component assumes a strict API that looks like `GET [base URL]/[data-model]` and `GET [base URL]/search/[data-model]`
- Search fields need to be hard-coded separately on backend and frontend (and obviously to be kept in sync)
- Current sorting functionality for local data is unoptimal for memory consumption and can be optimized a lot. In practise this only affects huge local tables (tens of thousands of rows) so at this point this is not a priority. With typical smaller datasets this is hardly noticeable.

## Known issues

- Ordering fails if trying to order another column when one column has been ordered. (Workaround: reset ordering before ordering by another column.)

## ToDo

- [ ] Filtering based on string (equal)
- [ ] Filtering based on enum (equal)
- [ ] Filtering based on date (equal, smaller, greater)
- [ ] Filtering based on number (equal, smaller, greater)
- [ ] Sorting by comparator fn
- [x] Filtering based on boolean
- [x] Sorting by date
- [x] Search
- [x] Add window resize observer that watches Tailwind breakpoints and stores current breakpoint in state. (We can then use it for programatically reshape the table based on user configuration.)
