# SOZO Anime Studio - System Specification開発要件定義書

## 1. プロジェクト概要
アニメ制作会社（自社）が使用する「AI制作進行管理 & クライアントレビューシステム」。
プロジェクト立ち上げから納品までの7段階のフローを管理し、各フェーズでの「チェック（承認）」と「修正」を円滑に行う。

## 2. ユーザー役割 (Roles)

### A. Production Team (自社)
- **Sales/PM:** プロジェクト立ち上げ、ヒアリング管理、シナリオ提示、進行管理。
- **Creator:** 字コンテ作成、ビデオコンテ制作、動画生成、修正対応。

### B. Client (外部)
- **Reviewer:** 提案（シナリオ・コンテ・動画）の確認、フィードバック、承認（認証フラグ）。

## 3. 制作ワークフロー (Detailed Flow)

### Phase 1: Project Launch (プロジェクト立ち上げ)
- **Actor:** PM (Production Manager)
- **Action:** プロジェクトを新規作成。
- **Input:** プロジェクト概要、クライアントのメールアドレス。
- **System:** クライアントへ招待メールを送信（ログインURL含む）。
- **Status:** `preparing`

### Phase 2: Hearing (ヒアリング)
- **Actor:** Client
- **Trigger:** クライアントがメールからログイン。
- **UI:** ログイン直後、ヒアリングシート入力画面へ誘導。
- **Action:** ヒアリングシート（全項目）を入力し、「保存」を押下。
- **System:** 入力内容を保存し、自動的にシナリオ生成を開始。
- **Status:** `hearing_completed`

### Phase 3: Scenario (シナリオ選定)
- **Actor:** Client
- **System:** ヒアリング内容を元に、AIがシナリオ案を3つ生成して表示。
- **Action:** 3案の中から1つを選択し、要望やコメントを追記して「保存」を押下。
- **System:** 選択されたシナリオとコメントを確定し、字コンテ生成を開始。
- **Status:** `scenario_selected`

### Phase 4: Text Storyboard (字コンテ制作 & レビュー)
- **System:** 選択されたシナリオから字コンテ（秒数、ストーリー、シーン、セリフ）を自動生成。
- **Actor:** PM / Creator
    - **Action:** ワークスペースで生成された字コンテを確認・修正（微調整）。
    - **Action:** 修正完了後、「完了」ボタンを押下。
- **System:** クライアントへ確認依頼の通知を送信。
- **Actor:** Client
    - **Action:** 字コンテを確認し、レビューを行う。
    - **Branch A (修正あり):** コメントを入力して「差し戻し」 → PMが再度修正。
    - **Branch B (OK):** 「承認（OK）」ボタンを押下。
- **Status:** `text_storyboard_review` -> `text_storyboard_approved`

### Phase 5: Video Storyboard (ビデオコンテ)
- **Trigger:** 字コンテ承認後、フェーズ移行。
- **Action:** 字コンテを元にビデオイメージ（静止画＋動き or 簡易動画）を制作。
- **Flow:** Creator制作 → Client確認 → Comment/Fix。

### Phase 6: Rough Video (ラフビデオ / Frame.io)
- **Action:** 本番動画生成・編集（Frame.io連携）。
- **Review:** Frame.io上で詳細なレビューと修正指示。


## 4. 機能要件

### A. ダッシュボード
- プロジェクト一覧と現在のフェーズ（Step 1-7）の可視化。
- 「認証フラグ（承認済）」のステータス管理。

### B. 制作画面 (Workspace)
- **Scenario Editor:** 3案並列表示・選択機能。
- **Storyboard Table:** シーンごとのAction/Dialogue/Duration編集。
- **Review Interface:** 各フェーズごとの「承認ボタン」と「コメント欄」。

## 5. データモデル (Supabase Schema Draft)

- **projects**:
  - `id`, `client_name`, `sales_rep`, `pm_name`, `current_phase` (1-7)
- **scenarios**:
  - `id`, `project_id`, `option_a`, `option_b`, `option_c`, `selected_option`
- **scenes**:
  - `id`, `project_id`, `scene_no`, `action`, `dialogue`, `duration`
- **approvals**:
  - `id`, `project_id`, `phase_number`, `approved_at`, `memo`, `approved_by`

## 6. 外部システム連携
- **OpenAI API:** シナリオ・字コンテ生成。
- **Sora API:** ビデオコンテ・本番動画生成。
- **Frame.io:** 動画レビュー。

## 7. UI/UX Design Guidelines

### A. Design Concept
**"Creative Pro Dark"**
- クリエイターの作業に集中できる、没入感のあるダークモードを基調とする。
- コンテンツ（動画・画像）が主役となるよう、UI自体は主張しすぎない「Zinc/Slate」系のニュートラルカラーを採用。
- **Glassmorphism:** サイドバーやモーダルには「すりガラス効果 (backdrop-blur)」を使用し、モダンで奥行きのある表現を行う。

### B. Color Palette
- **Background:** `bg-zinc-950` (Deep Dark)
- **Surface:** `bg-zinc-900/50` (Glassy Panels)
- **Primary:** `text-white` (High Emphasis)
- **Accent:** `indigo-500` (Action Buttons, Active States) - 知的でクリエイティブな印象。
- **Status Colors:**
  - **Success (Approved):** `emerald-500`
  - **Warning (Review):** `amber-500`
  - **Error (Fix Required):** `rose-500`

### C. Typography
- **Font Family:** `Inter` (Google Fonts) - 可読性が高く、UIに適したサンセリフ体。
- **Headings:** Bold / Tracking-tight (引き締まった印象)。
- **Body:** Regular / Relaxed (読みやすさ重視)。

### D. Components (shadcn/ui)
- **Cards:** プロジェクト一覧やシーン詳細に使用。枠線は薄く (`border-zinc-800`)、ホバー時に微細なグロー効果。
- **Tables:** 字コンテ編集に使用。密度を高め (`compact`)、プロフェッショナルなツール感を出す。
- **Dialogs/Sheets:** 詳細情報の表示や編集フォームに使用。アニメーション付きでスムーズに表示。

### E. Micro-Interactions
- ボタンのホバー、クリック時のフィードバックを徹底する。
- ページ遷移やタブ切り替えには `framer-motion` を使用し、シームレスな体験を提供する。

## 8. Screen List (画面一覧)

### A. Public / Auth
1.  **Login:** メール/パスワード認証。パスワードリセット機能付き。

### B. Dashboard
2.  **Production Dashboard:** 全プロジェクトのステータス管理、新規プロジェクト作成。
3.  **Client Dashboard:** 参加しているプロジェクトの一覧。

### C. Project Workspace (Tab Layout)
4.  **Overview Tab:**
    - プロジェクト基本情報、ヒアリング回答（アンケート結果）、現在のフェーズ表示。
5.  **Scenario Tab:**
    - **Production:** シナリオ3案の入力・編集。
    - **Client:** 3案の比較・選択・承認。
6.  **Workspace Tab (Unified Table):**
    - **TanStack Table** を使用したメイン作業画面。
    - フェーズ（字コンテ → ビデオコンテ → ラフビデオ）の進行に合わせて、カラム（Video列など）が動的に追加される。
    - **Production:** コンテ入力、動画生成、Frame.io連携。
    - **Client:** 各行（シーン）ごとの確認、コメント、承認。

### D. Admin
7.  **User Management:** 社内スタッフとクライアントアカウントの管理。

## 9. Others (その他要件)

### A. Notifications
- **Email:** Resend を使用して、招待メールやレビュー依頼通知を送信する。

### B. Infrastructure
- **Frontend:** Vercel
- **Backend/DB:** Supabase
- **AI API:** OpenAI API (GPT-4o) / Gemini API (Option)
  - ※ 制御のしやすさ（Structured Outputs）と既存プロンプトの流用を考慮し、初期はOpenAI推奨。

### C. Supported Devices
- **PC Only:** Chrome / Edge / Safari (Latest versions)
- ※ モバイル対応はフェーズ2以降（現在はPC最適化）。

### D. Future Scope
- 決済・請求機能（Stripe）
- 一般公開（Public Sign-up）
- モバイルアプリ版