export {}

// 拡張メソッドの定義
declare global {
  interface String {
    toNarrowCase(): string
  }
}

// 拡張メソッドの実装
String.prototype.toNarrowCase = function () {
  return (this as unknown as string).replace(
    /[Ａ-Ｚａ-ｚ０-９]/g,
    (s: string) => {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    }
  )
}
