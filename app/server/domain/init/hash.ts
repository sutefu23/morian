import bcrypt from 'bcrypt'

// bcrypt用ハッシュ値生成。要環境変数として保存
function createHash() {
  console.log('hassher: run!')
  const saltRounds = 10 //ストレッチング回数

  const salt = bcrypt.genSaltSync(saltRounds)
  console.log('salt:' + salt)

  console.log('hasher: finish!')
  process.exit(0)
}

export default createHash()
