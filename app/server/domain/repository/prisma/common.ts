import { Query } from "../interface"

// query引数からWHEREで使えるSQLステートメントを返します
export function buildWhereStatement<T>(query: Query<T>|Query<T>[]) {
  if(Array.isArray(query)){
    const qArray = query.map(q => { 
      let val
      if(q.operator === "in"){
        val = "(" + q.value.join(",") + ")"
      }else{
        val = q.value
      }
      `${q.field} ${q.operator} ${val}`}
      )
    return qArray.join(" AND ")
  }else{
    return `${query.field} ${query.operator} ${query.value}`
  }
}