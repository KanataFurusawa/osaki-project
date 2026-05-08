"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const menuData = {
  food: [
    { id: 1, name: "唐揚げ", price: 600, image: "https://cdn2.deevid.ai/user-image/v2_watermarked-1e55094d-0b6a-416d-9f22-b5bf8d2dec1b.jpg", stock: true },
    { id: 2, name: "ラーメン", price: 800, image: "https://cdn2.deevid.ai/user-image/v2_watermarked-26a9059b-108e-4f6d-ba30-0a76e3e1e319.jpg", stock: true },
    { id: 3, name: "ハンバーガー", price: 900, image: "https://cdn2.deevid.ai/user-image/v2_watermarked-674fbae6-b8a8-4b0c-9f06-4bba0c8e4906.jpg", stock: false }, // 品切れ例
    { id: 4, name: "カレーライス", price: 850, image: "...", stock: true },  
  ],
  drink: [
    { id: 5, name: "コーラ", price: 300, image: "...", stock: true },
    { id: 6, name: "ビール", price: 500, image: "...", stock: true },
  ],
  dessert: [
    { id: 7, name: "アイス", price: 400, image: "...", stock: true },
    { id: 8, name: "ケーキ", price: 300, image: "...", stock: false },
  ],
}

export default function Home() {
  const [category, setCategory] = useState<"food" | "drink" | "dessert">("food")
  const [counts, setCounts] = useState<{ [key: number]: number }>({})
  const [cart, setCart] = useState<{ [key: number]: number }>({})
  const [showCart, setShowCart] = useState(false)
  const [people, setPeople] = useState(1)
  const [error, setError] = useState("")

  const IMAGE_STYLE = "w-full aspect-[4/3] object-cover rounded"

  const changeCount = (id: number, delta: number) => {
    setCounts((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }))
  }

  const addToCart = (item: any) => {
    if (!item.stock) {
      setError("この商品は品切れです")
      return
    }

    const count = counts[item.id] || 0
    if (count === 0) return

    setCart((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + count,
    }))

    setCounts((prev) => ({ ...prev, [item.id]: 0 }))
    setError("")
  }

  const allItems = Object.values(menuData).flat()

  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = allItems.find((i) => i.id === Number(id))
    return sum + (item?.price || 0) * qty
  }, 0)

  const perPerson = people > 0 ? Math.ceil(total / people) : 0

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const newCart = { ...prev }
      delete newCart[id]
      return newCart
    })
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-50">

      {/* ヘッダー */}
      <header className="sticky top-0 bg-white border-b p-4 text-center font-bold">
        OSAKI 亭
      </header>

      {/* カテゴリ */}
      <div className="flex gap-2 p-2 bg-white border-b">
        {["food", "drink", "dessert"].map((c) => (
          <Button key={c} onClick={() => setCategory(c as any)}>
            {c}
          </Button>
        ))}
      </div>

      {/* メニュー */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {menuData[category].map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 space-y-2">

              <img src={item.image} className={IMAGE_STYLE} />

              <div className="flex justify-between">
                <p>{item.name}</p>
                <p className="text-lg font-bold">¥{item.price}</p>
              </div>

              {!item.stock && (
                <p className="text-red-500 text-sm">品切れ</p>
              )}

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button onClick={() => changeCount(item.id, -1)}>-</Button>
                  <span>{counts[item.id] || 0}</span>
                  <Button onClick={() => changeCount(item.id, 1)}>+</Button>
                </div>

                <Button onClick={() => addToCart(item)}>
                  追加
                </Button>
              </div>

            </CardContent>
          </Card>
        ))}
      </main>

      {/* エラー */}
      {error && (
        <div className="text-center text-red-500">{error}</div>
      )}

      {/* フッター */}
      <footer className="p-4">
        <Button className="w-full bg-orange-500" onClick={() => setShowCart(true)}>
          カートを見る
        </Button>
      </footer>

      {/* カート（スライド） */}
      <div className={`fixed bottom-0 left-0 w-full bg-white p-4 transition-transform duration-300 ${showCart ? "translate-y-0" : "translate-y-full"}`}>

        <h2 className="font-bold mb-2">注文リスト</h2>

        {Object.entries(cart).map(([id, qty]) => {
  const item = allItems.find((i) => i.id === Number(id))
  return (
    <div key={id} className="flex justify-between items-center">
      <span>{item?.name} × {qty}</span>

      <div className="flex items-center gap-2">
        <span>¥{(item?.price || 0) * qty}</span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => removeFromCart(Number(id))}
        >
          削除
        </Button>
      </div>
    </div>
  )
})}

        <div className="mt-2 font-bold">
          合計: ¥{total}
        </div>

        {/* 割り勘 */}
        <div className="mt-2">
          <input
            type="number"
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            className="border p-1 w-16"
          />
          人 → 1人あたり ¥{perPerson}
        </div>

        <div className="flex gap-2 mt-4">
         <Button variant="outline" className="w-1/2" onClick={() => setShowCart(false)}>
           閉じる
         </Button>

          <Button className="w-1/2 bg-green-500 hover:bg-green-600">
           注文確定
         </Button>
        </div>
      </div>

    </div>
  )
}