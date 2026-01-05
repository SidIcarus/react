
import { useState } from 'react'
import './App.css'

type Product = {
  category: string, price: string, stocked: boolean, name: string
}

function FilterableProductTable({ products }: { products: Product[]}) {
  const [filterText, setFilterText] = useState('')
  const [doShowInStockOnly, setDoShowInStockOnly] = useState(false)

  return (
    <div>
      <SearchBar
        doShowInStockOnly={doShowInStockOnly}
        filterText={filterText}
        onFilterTextChange={setFilterText}
        onDoShowInStockOnlyChange={setDoShowInStockOnly}
      />
      <ProductTable
        doShowInStockOnly={doShowInStockOnly}
        filterText={filterText}
        products={products}
      />
    </div>
  )
}

function SearchBar(
  { filterText, doShowInStockOnly, onFilterTextChange, onDoShowInStockOnlyChange }: {
      filterText: string,
      doShowInStockOnly: boolean,
      onFilterTextChange: (str: string) => void,
      onDoShowInStockOnlyChange: (bool: boolean) => void
    }
) {
  return (
    <form>
      <input
        type="text"
        placeholder="Search..."
        value={filterText}
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          id="onlyInStock"
          type="checkbox"
          checked={doShowInStockOnly}
          onChange={(e) => onDoShowInStockOnlyChange(e.target.checked)}
        />
        {' '}
        Only show products in stock
      </label>
    </form>
  )
}

function ProductTable(
  { products, filterText, doShowInStockOnly }: { products: Product[], filterText: string, doShowInStockOnly: boolean }
) {
  const rows = []
  let lastCategory = ''

  const filteredProducts = products.filter(p => matchesQuery(p.name, filterText))

  filteredProducts.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow category={product.category} key={product.category} />
      )
    }

    if (!doShowInStockOnly || product.stocked && doShowInStockOnly) {
      rows.push(<ProductRow product={product} key={product.name} />)
    }
    lastCategory = product.category
  })

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function matchesQuery(text: string, query: string) {
  // Instead of creating one regex per token, we build one regex using lookaheads
  const tokens = query
    .trim()
    .split(/\s+/)
    .map(token => `(?=.*${escapeRegExp(token)})`)

  const regex = new RegExp(tokens.join(''), 'i')
  return regex.test(text)
}

function ProductCategoryRow({ category: categoryName }: { category: string }) {
  return (
    <tr>
      <th colSpan={2}>
        {categoryName}
      </th>
    </tr>
  )
}

function ProductRow({ product }: { product: Product }) {
  return (
    <tr>
      <td className={product.stocked ? '' : 'isNotStocked'}>{product.name}</td>
      <td>{product.price}</td>
    </tr>
  )
}

function getProducts(): Product[] {
  return [
    { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
    { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
    { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
    { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
    { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
    { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
  ]
}

export default function App() {
  const products = getProducts()

  return <FilterableProductTable products={products}/>
}
