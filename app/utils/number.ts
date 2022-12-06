export {}

// 拡張メソッドの定義
declare global {
  interface Number {
    toYenFormat(): string
    toYenFormatKanji(): string
  }
}

// 拡張メソッドの実装側
Number.prototype.toYenFormat = function () {
  const num = (this as number).valueOf()
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY'
  }).format(num)
}

Number.prototype.toYenFormatKanji = function () {
  const num = (this as number).valueOf()
  return `${num.toLocaleString()}円`
}
