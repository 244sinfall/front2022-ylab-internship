export interface Category {
  children: Category[]
  parent: { _id: string } | null
  title: string
  _id: string
}
