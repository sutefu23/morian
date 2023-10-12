import type { Decimal } from '$/node_modules/@prisma/client/runtime/library'
import { DeepPartial } from '~/types/DeepPartial.spec'

/**
 * Decimalを整数の場合は整数に、小数点以下を持つ数なら4桁までの丸めた数字を文字列にして返します。
 *
 * @return {string}
 */
export const align = (decimal: Decimal | undefined | DeepPartial<Decimal>): string => {
  if (!decimal) return ''
  return (decimal as Decimal).isInteger() ? (decimal as Decimal).toFixed() : (decimal as Decimal).round().toString()
}
