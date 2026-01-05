
import { useState } from 'react'
import './App.css'

type Product = {
  category: string, price: string, stocked: boolean, name: string
}

function SearchBar({ searchValue, doOnlyShowInStock }) {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input id="onlyInStock" type="checkbox"/>
        {' '}
        Only show products in stock
      </label>
    </form>
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

function ProductCategoryRow({ category: categoryName }: { category: string }) {
  return (
    <tr>
      <th colSpan={2}>
        {categoryName}
      </th>
    </tr>
  )
}

function ProductTable({ products }: { products: Product[] }) {
  const rows = []
  let lastCategory = ''

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow category={product.category} key={product.category} />
      )
    }

    rows.push(<ProductRow product={product} key={product.name} />)
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

function FilterableProductTable({ products }: { products: Product[]}) {
  return (
    <div>
      <SearchBar/>
      <ProductTable products={products}/>
    </div>
  )
}

export default function App() {
  const products = getProducts()

  return <FilterableProductTable products={products}/>
}
