import client from "$/cache"

test("プレーンなキャッシュ値テスト", async () =>{
  const key = "test"
  client.set(key,"test")
  const value = await client.get(key)
  expect(value).toBe("test")

  const res = await client.del(key)
  expect(res).toBeTruthy
})

type testProp = {
  prop: number
}

test("オブジェクトのキャッシュ値テスト", async () =>{
  const key = "object"
  client.set<testProp>(key,{prop: 1})
  const obj = await client.get<testProp>(key)
  if(obj instanceof Error){
    throw obj;
  }
  if(obj == null){
    throw new Error('failed');
  }
  expect(obj.prop).toBe(1)

  const res = await client.del(key)
  expect(res).toBeTruthy
})