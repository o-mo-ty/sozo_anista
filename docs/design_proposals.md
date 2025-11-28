# ページヘッダーデザイン案

現在のシンプルすぎるヘッダーを、よりモダンで「Creative Pro Dark」な世界観に合わせるための3つのデザイン案です。

## 案A: Modern Minimal (モダン・ミニマル)
**コンセプト**: 余計な装飾を削ぎ落とし、タイポグラフィと階層構造で美しさを表現する。
**特徴**:
- タイトル上に小さな「英語ラベル」を配置し、プロフェッショナル感を演出。
- タイトル横にさりげないアクセント（縦線など）を追加。
- 背景は透明のまま、文字の強弱で魅せる。

```tsx
<div className="flex flex-col gap-1 mb-8">
  <span className="text-xs font-bold tracking-[0.2em] text-indigo-400 uppercase">
    Dashboard
  </span>
  <div className="flex items-center gap-4">
    <div className="h-8 w-1 bg-indigo-500 rounded-full" />
    <h1 className="text-4xl font-bold text-white tracking-tight">ダッシュボード</h1>
  </div>
  <p className="text-zinc-400 ml-5 mt-1">プロジェクトの状況概要とタスク確認</p>
</div>
```

---

## 案B: Glass & Glow (グラス & グロー)
**コンセプト**: 没入感と先進性。背景に溶け込むようなガラス表現と、ほのかな光。
**特徴**:
- ヘッダー全体を薄い「すりガラス」のコンテナで囲む。
- 背景に極めて薄いグラデーション（グロー）を配置し、奥行きを出す。
- アイコンを大きく配置し、視覚的なインパクトを与える。

```tsx
<div className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/30 p-8 mb-8">
  {/* Background Glow */}
  <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
  
  <div className="relative z-10 flex items-center gap-6">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-950 border border-white/10 shadow-xl">
      <LayoutGrid className="h-8 w-8 text-indigo-400" />
    </div>
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">ダッシュボード</h1>
      <p className="text-zinc-400">プロジェクトの状況概要とタスク確認</p>
    </div>
  </div>
</div>
```

---

## 案C: Contextual Hero (コンテクスチュアル・ヒーロー)
**コンセプト**: 作業への没入。ナビゲーションとタイトルを一体化させ、ツールとしての使いやすさを強調。
**特徴**:
- パンくずリスト（現在地）をタイトルの一部として統合。
- タイトルを非常に大きく表示し、自信に満ちた印象に。
- 下線（ボーダー）を引き、コンテンツエリアとの境界を明確にする。

```tsx
<div className="mb-10 pb-6 border-b border-zinc-800">
  <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
    <span>Home</span>
    <ChevronRight className="h-4 w-4" />
    <span className="text-zinc-200">Dashboard</span>
  </nav>
  
  <div className="flex items-end justify-between">
    <h1 className="text-5xl font-bold text-white tracking-tighter">
      Dashboard
      <span className="text-lg font-normal text-zinc-500 ml-4 tracking-normal">
        ダッシュボード
      </span>
    </h1>
    {/* 右側にアクションボタンなどを配置可能 */}
  </div>
</div>
```

---

### 推奨
**案A (Modern Minimal)** または **案B (Glass & Glow)** が、現在の「Creative Pro Dark」なUIガイドライン（`SPEC.md`）に最も馴染みつつ、実装コストと見た目のバランスが良いと考えます。
