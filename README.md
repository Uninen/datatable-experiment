# Datatable experiment

Experimenting w/ highly opionated datatable design.

The basic idea is to provide feature-complete and super flexible set of primitive components that allow you to easily put together a fully customised datatable componen that you can very easily reuse and modify within your project.

Note: this is not intended as a final product but an experiment. Hence, the code and organisation is geared towards practicality, not purity.

## Design goals

- Fully responsive, mobile-first
- Fully customizable markup
- Work fluently for both client and backend data
- Customizable filters
- Customizable search
- Easily humanizable (nice labels, etc)

## Current functionality

- **100% control over markup and styling**; everything works via slots
- Works with **both local and remote data** (using your own api function)
- **Responsive**, can show different data for different breakpoints
- Automatic and responsive **pagination** (configurable)
- **Search** for both local and remote data (configurable)

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

- The component assumes a strict API that looks like `GET [base URL]/[data-model]` and `GET [base URL]/search/[data-model]`
- Search fields need to be hard-coded separately on backend and frontend (and obviously to be kept in sync)
- Current sorting functionality for local data is unoptimal for memory consumption and can be optimized a lot. In practise this only affects huge local tables (tens of thousands of rows) so at this point this is not a priority. With typical smaller datasets this is hardly noticeable.

## ToDo

- [ ] Filtering based on boolean
- [ ] Filtering based on string (equal)
- [ ] Filtering based on enum (equal)
- [ ] Filtering based on date (equal, smaller, greater)
- [ ] Filtering based on number (equal, smaller, greater)
- [ ] Sorting by comparator fn
- [x] Sorting by date
- [x] Search
- [x] Add window resize observer that watches Tailwind breakpoints and stores current breakpoint in state. (We can then use it for programatically reshape the table based on user configuration.)
