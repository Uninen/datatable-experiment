import MiniSearch from 'minisearch'

import { PaginationObject, TableProps, LocalTableProps } from '../types'

// heavily inspired by paginate() by Jason Watmore
// https://jasonwatmore.com/post/2018/08/07/javascript-pure-pagination-logic-in-vanilla-js-typescript
export function paginate(
  totalItems: number,
  currentPage: number = 1,
  perPage: number = 10,
  maxPages: number = 7
): PaginationObject {
  const totalPages = Math.ceil(totalItems / perPage)

  // ensure current page isn't out of range
  if (currentPage < 1) {
    currentPage = 1
  } else if (currentPage > totalPages) {
    currentPage = totalPages
  }

  let startPage: number, endPage: number
  if (totalPages <= maxPages) {
    // total pages less than max so show all pages
    startPage = 1
    endPage = totalPages
  } else {
    // total pages more than max so calculate start and end pages
    let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2)
    let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1
    if (currentPage <= maxPagesBeforeCurrentPage) {
      // current page near the start
      startPage = 1
      endPage = maxPages
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
      // current page near the end
      startPage = totalPages - maxPages + 1
      endPage = totalPages
    } else {
      // current page somewhere in the middle
      startPage = currentPage - maxPagesBeforeCurrentPage
      endPage = currentPage + maxPagesAfterCurrentPage
    }
  }

  // calculate start and end item indexes
  let startIndex = (currentPage - 1) * perPage
  let endIndex = Math.min(startIndex + perPage - 1, totalItems - 1)

  // create an array of pages to ng-repeat in the pager control
  let pages = Array.from(Array(endPage + 1 - startPage).keys()).map((i) => startPage + i)

  // return object with all pager properties required by the view
  return {
    totalItems,
    totalPages,
    currentPage,
    startPage,
    endPage,
    startIndex,
    endIndex,
    pages,
  }
}

// Inspired by https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
export function sortByKey(key: string) {
  let desc = false
  return function innerSort(a: any, b: any) {
    if (key.startsWith('-')) {
      desc = true
      key = key.substr(1)
    }

    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0
    }

    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key]
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key]

    let comparison = 0
    if (varA > varB) {
      comparison = 1
    } else if (varA < varB) {
      comparison = -1
    }
    return desc ? comparison * -1 : comparison
  }
}

// Inspired by https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
export function generateID(): string {
  var d = new Date().getTime()
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now() //use high-precision timer if available
  }
  return 'xxxxxxxxxx'.replace(/[x]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

export function useLocalSearch(
  data: any,
  fields: string[],
  options: any = {
    prefix: true,
    fuzzy: 0.2,
  }
) {
  const searchOptions = {
    fields,
    searchOptions: options,
  }
  const instance = new MiniSearch(searchOptions)
  instance.addAll(data)
  return instance
}

export function isLocal(prop: TableProps): prop is LocalTableProps {
  return prop.mode === 'local'
}
