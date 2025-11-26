# 字コンテ（ワークスペース）のバージョン管理・履歴保持の提案

ワークスペースの編集履歴や、クライアント提出ごとのバージョンを管理するためのデータベース設計案です。
用途や開発の優先度に合わせて、2つのパターンを提案します。

## パターンA: JSONスナップショット方式（推奨・採用）

**特徴**: 実装が簡単で、柔軟性が高い。
**仕組み**: 「保存」や「提出」のタイミングで、その時点の全シーンデータをJSON形式で1つのカラムに保存します。
**メリット**:
- テーブル構成がシンプル（1テーブル追加するだけ）。
- スキーマ変更（カラム追加など）に強い。
- 復元（Revert）が容易（JSONを読み込んで現在のテーブルに上書きするだけ）。
**デメリット**:
- SQLで特定のシーンの変更履歴だけを検索するのは少し大変（不可能ではない）。

### テーブル定義案

```sql
CREATE TABLE public.storyboard_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL, -- 1, 2, 3...
  name TEXT, -- 例: "初稿", "修正案1"
  scenes_data JSONB NOT NULL, -- その時点の scenes テーブルの中身を配列で丸ごと保存
  
  created_by UUID REFERENCES public.profiles(id), -- 誰が保存したか
  created_at TIMESTAMPTZ DEFAULT NOW(),
  comment TEXT -- 保存時のコメント（例: "クライアント指摘対応"）
);
```

### 運用イメージ
1. PMが「完了・確認依頼」ボタンを押す。
2. バックエンド（またはEdge Function）で、現在の `scenes` データを取得。
3. `storyboard_versions` に新しいレコードを作成し、`scenes_data` に 2 のデータを保存。
4. `version_number` は `MAX(version_number) + 1` で自動採番。

---

## パターンB: リレーショナル・スナップショット方式

**特徴**: 厳格なデータ管理。
**仕組み**: バージョンごとに、シーン1つ1つを別テーブル（または履歴テーブル）にコピーします。
**メリット**:
- SQLで詳細な分析が可能（例: 「このセリフがいつ変わったか」をクエリで特定しやすい）。
**デメリット**:
- データ量が増えやすい。
- `scenes` テーブルにカラムを追加した際、履歴テーブルにも追加が必要でメンテナンスコストが高い。

### テーブル定義案

```sql
-- バージョン管理テーブル（ヘッダー）
CREATE TABLE public.storyboard_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- バージョンごとのシーン詳細テーブル
CREATE TABLE public.storyboard_version_scenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  version_id UUID REFERENCES public.storyboard_versions(id) ON DELETE CASCADE NOT NULL,
  original_scene_id UUID, -- 元のシーンID（追跡用）
  scene_no INTEGER,
  action TEXT,
  dialogue TEXT,
  duration INTEGER,
  video_url TEXT,
  -- その他のカラムも全てコピー
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
