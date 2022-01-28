import { Query } from "../interface"

// query引数からWHEREで使えるSQLステートメントを返します
export function buildWhereStatement<T>(query: Query<T>|Query<T>[]): string {
  if(Array.isArray(query)){
    const qArray = query.map(q => { 
      return buildWhereStatement(q)
    })
    return qArray.join(" AND ")
  }else{
    const val:string = (query.operator === "in") ? "(" + query.value.join(",") + ")": query.value.toString()
    return `${query.field} ${query.operator} '${val}'`
  }
}