# UI 重新設計與品味稽核（合併報告）

> 來源：兩份 subagent 報告（重設計提案 / 設計品味稽核），本文件去重後合併。
> 專案：React 18.3 + Vite 5.4 + Tailwind 3.4 + shadcn/ui（new-york / zinc）+ react-router-dom 6.27，繁體中文、offline-first。
> 閱讀方式：第 1 至 4 章是「要改成什麼」，第 5 章是「現在為什麼難看」，第 6 章是「現在就是壞的」，第 7 章是「先做哪一步」。

---

## 0. 一句話結論

設計系統 **結構存在、視覺未定義**。shadcn 原生元件沒有漂移，問題全部出在 app 層：它自己發明了一套顏色、字級、圓角規則，繞過上一層的 token。

- 9 個死 CSS class 產生零輸出，**15 個死 `motion-preset-*`** 讓 `README.md:30` 打勾的「答對時有 scale 動畫」**從來沒有渲染過**。
- 47 處手動配對的 `dark:` 硬編碼色票（`bg-sky-200 dark:bg-sky-900`、`dark:bg-emerald-700`、`dark:bg-gray-700/35`…），跨 11 個檔案。
- 深色模式 `--border: 0 0% 60%` 比前景文字還亮，暗色畫面整體像線框圖。
- 最便宜的 80% 收益：修深色 border/input、加 `fontSize`/`fontFamily` token 區塊、把 55 個原始色票工具類換成 3 組語意 token。

### 設計系統狀態表

| 層級 | 狀態 | 證據 |
|---|---|---|
| CSS tokens | 有，shadcn `new-york` + `zinc` | `src/index.css:5-57` |
| token → Tailwind 串接 | 完整 | `tailwind.config.js:12-53` |
| 圓角階梯 | 3 階衍生，無更大端 | `tailwind.config.js:7-11` |
| 字體階梯 | **缺** | 全 `src/` 零 `font-family` / `font-sans` |
| 間距階梯 | Tailwind 預設（可接受） | `index.css` 無自訂 |
| 陰影 / z-index token | **缺** | 散落 `shadow`、`shadow-md`、`shadow-lg`、`z-10` |
| 語意答案色 | **缺** | `--correct/--wrong/--hint` 不存在 |
| token 採用率 | **壞** | 47 處硬編碼，且全部手動配 `dark:` |
| `--secondary`/`--muted`/`--accent` | **三個值完全相同** | `index.css:8,14,16,18` |
| 淺色 `--card` vs `--background` | **完全相同** | `index.css:8` 與 `:6` |
| 深色 `--card` vs `--background` | **反轉**（card 比背景更深） | `index.css:33-36` |

---

# 第一部：重新設計提案

## 1. 設計方向

**符號：熟練度階梯（due ladder）。** 這個 app 最具代表性的物件是 `due` 階梯（`-3 … 8+`，對應 1 分鐘到 4 天，`src/lib/functions.js:18-30`）。今天它散落在三個檔案裡當文字片段（`熟練/5`、`普通/2`、`不熟練/-1`、`未作答`）。重設計把階梯變成視覺主軸：一條**刻痕水平軌道**，出現在自動練習 HUD、題目列表列、歷史摘要。

### 1.1 色票

保留 `zinc`（`components.json:9`），讓既有 shadcn 原生元件保持一致；把純黑 `primary` 換成單一去飽和玉色，並加入語意答案色。

提案 A（重設計報告）：`primary` 直接當玉色。

```css
LIGHT   --background 240 20% 99%      --foreground 240 10% 12%
        --card 240 25% 100%           --muted-foreground 240 4% 42%
        --primary 172 58% 28%         --ring 172 58% 34%
        --border 240 8% 88%           --destructive 0 72% 45%
        --correct 152 52% 34%         --wrong 4 70% 46%    --hint 40 82% 40%
DARK    --background 240 10% 9%       --foreground 240 16% 93%
        --card 240 10% 12%           --muted-foreground 240 6% 62%
        --primary 172 42% 58%         --ring 172 40% 45%
        --border 240 8% 22%           --destructive 0 58% 52%
        --correct 152 46% 62%         --wrong 4 62% 60%    --hint 40 80% 60%
```

修掉的三件事：深色下 card 終於**比背景亮**；border 不再接近白；`primary` 是真的品牌色，不是黑/白板磚（現在淺色下每顆按鈕都是一塊重黑矩形，深色下是重白矩形）。

提案 B（品味稽核報告）：`primary` 維持中性，把玉色只用在狀態，另外補三組語意色取代現在三套並存的色票。

```css
:root {
  --score-good: 142 72% 29%;   /* #15803d → 5.02:1 on white */
  --score-warn:  25 95% 42%;   /* #c2410c → 5.18:1 on white */
  --score-bad:    0 72% 45%;   /* #dc2626 → 4.83:1 on white */
  --ans-correct: 142 55% 93%;  /* 淺色填色 */
  --ans-wrong:     0 78% 95%;
  --ans-missed:   45 92% 90%;
}
.dark {
  --score-good: 142 55% 55%;  --score-warn:  25 90% 60%;  --score-bad:    0 75% 62%;
  --ans-correct: 160 60% 22%; --ans-wrong:     0 55% 26%; --ans-missed:   42 70% 24%;
}
/* 表面階層：打破三個 token 同值 */
:root {
  --secondary: 240 4.8% 97%;    /* 內凹井 */
  --muted:      240 4.8% 96.5%;  /* 頁面層底 */
  --accent:     240 5% 93%;     /* hover，比 secondary 深一階 */
}
```

兩份報告在「玉色要不要變成 `primary`」上不一致。**預設採提案 B**（`primary` 維持中性，玉色只當狀態色），理由是 blast radius 小：改 `primary` 會讓全部 `Button variant="default"` 一起變色，改 `--accent` / `--score-*` / `--ans-*` 只影響狀態表面。見第 7 章待決事項。

### 1.2 字體

**單一字體家族、零網路請求。** 這是 offline-first app（IndexedDB + localStorage，`src/classes/API.js`），CDN 字體會破壞離線。拉丁 display 字體沒有 CJK 覆蓋，配上 `PingFang TC` 會變成兩個聲音。

```js
// tailwind.config.js → theme.extend
fontFamily: {
  sans: ['"PingFang TC"','"Noto Sans TC"','"Microsoft JhengHei"','"Hiragino Sans TC"',
         'system-ui','-apple-system','"Segoe UI"','sans-serif'],
},
fontSize: {
  xs:      ['0.75rem',  { lineHeight: '1.5rem' }],
  sm:      ['0.875rem', { lineHeight: '1.4rem' }],
  base:    ['1rem',     { lineHeight: '1.7rem' }],  // CJK 需要比拉丁更多行高
  stem:    ['1.125rem', { lineHeight: '1.9rem' }],  // 題目本文（取代 text-lg）
  'stem-lg':['1.375rem', { lineHeight: '2.2rem' }], // 單題模式（取代 text-xl/2xl）
  title:   ['1.5rem',   { lineHeight: '2rem'    }],  // 頁面標題（取代 text-2xl）
  display: ['1.875rem',  { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
},
fontWeight: { normal: '400', medium: '500', semibold: '600' }, // 砍掉散落的 700
```

- 現在 `lang="zh-Hant"` 走 Tailwind preflight 預設（macOS PingFang / Windows 微軟正黑 / Linux Noto），**同一個畫面在不同 OS 長相不同**（`tailwind.config.js:5-55` 無 `fontFamily`、`index.css` 無 `@font-face`、`index.html:1-13` 無 font link）。
- 段落寬度上限 `max-w-[68ch]`。
- 所有計時器、分數、計數加 `tabular-nums`，否則每秒橫向抖動：`StateBoard.jsx:66`、`AutoTraining.jsx:86-89`、`TrainingInProgress.jsx:162-166`、`HistoryView.jsx:123-139`、`formatTime`（`src/lib/functions.js:168-172`）。
- h1/h2 加 `-0.01em` 字距、line-height 1.5。

### 1.3 圓角與陰影

```js
borderRadius: {
  sm: 'calc(var(--radius) - 4px)',    // 4px
  md: 'calc(var(--radius) - 2px)',    // 6px
  lg: 'var(--radius)',                // 8px
  xl: 'calc(var(--radius) + 4px)',    // 12px  ← 新增，現在是未使用的預設值
  '2xl': 'calc(var(--radius) + 8px)', // 16px
},
boxShadow: {
  subtle: '0 1px 2px 0 hsl(var(--shadow-color) / 0.06)',
  raised: '0 1px 3px 0 hsl(var(--shadow-color) / 0.08), 0 8px 24px -12px hsl(var(--shadow-color) / 0.12)',
},
// :root { --shadow-color: 240 10% 10%; } .dark { --shadow-color: 0 0% 0%; }
```

---

## 2. 資訊架構（IA）

**問題：** 6 條扁平路由、零持續導覽、頁面識別靠一個永遠只寫 `首頁 / <跟 h1 同一句>` 的麵包屑、設定藏在一顆沒有標籤的圖示後、首頁給 5 張等權重卡片，其中 2 個主要目的地和 3 個次要目的地沒有區別。

```
現在                              提案
────────────────────────────────  ──────────────────────────────────────────
<App>                             <App>
  <TheNavbar/>  只有圖示對話框      <AppShell>
  <Routes/>                          ├ skip-link → #content
                                      ├ header (sticky): logo · nav · 主題 · ⚙
無共用容器                            ├ <main id="content" class="app-container">
無 layout route                       └ <Routes/>
路由名 ≠ 頁面標題                   /            首頁（儀表板）
                                      /training/auto     直接練習（header CTA）
                                      /training/setting  自定練習
                                      /upload            題庫
                                      /history           紀錄
                                      404                新增
```

決策：

- **路由路徑凍結。** `useHistory` 時間戳、`README.md`、`docs/how-to-use.md`、使用者書籤都依賴它們。只改 nav 標籤與順序。`/upload` 頁面目前自稱「題庫管理」、文件稱「自定題庫」三個名字，統一為「題庫」。
- **`TheBreadcrumb.jsx` 刪除。** 六個使用點有五個只渲染一個跟頁面 `<h1>` 相同的 crumb；`TrainingInProgress` 是唯一兩層的，但它描述的是流程步驟不是階層。`PageHeader` 取代全部六處。
- **`Navbar.jsx` 刪除**，摺進 `AppShell`。設定 Dialog 內容原樣保留，補上真標籤與 `aria-*`。
- **首頁改成儀表板，不是連結格線。** 資料本來就在 `useSetting()`（`trainingCount`、`checkTrainingCount()`、`enableTraining`），但只被 `autoStartTraining()` 吃掉從未呈現。這是全 app 唯一的不對稱版面：7/5 hero 分割，其餘全部安靜。三張等權重卡片正是它要取代的通用預設。
- **每日上限進 IA。** `enableTraining` + `checkTrainingCount()`（`src/provider/SettingProvider.jsx:38-41`）把自動模式鎖在一個沒人找得到的對話框裡。儀表板顯示環，header 顯示剩餘次數，`⚙` 保留覆寫。
- 題庫頁拆兩個區：`PageHeader`（身分 + 全域動作）+ **只在 `hasChecked` 時浮現的 sticky 選取工具列**。現在 6 顆按鈕擠一列，其中 3 顆隨選取變化出現/消失，導致整列位移（`ManageQuestions.jsx:185-260`）。

## 3. 版面線框圖

### 首頁（儀表板）

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEADER (sticky, h-14)                                                │
│ [img] 自定題目練習  今日│題庫│紀錄              (直接練習)  ☀  ⚙      │
├──────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────┐ ┌───────────────────────────────┐  │
│ │ 今日進度                        │ │  直接練習                      │  │
│ │  ●●●●○○○○  ← due rail 刻痕軌道 │ │  系統依熟練度挑題，一次一題      │  │
│ │  熟練 12 · 普通 5 · 待複習 3     │ │  剩 2 / 3 次 · ████████░░░░ 8/10 │  │
│ │  到期 7 題 · 今日已答 1         │ │  [ 開始 → ]                   │  │
│ │  [自定練習 →]                   │ └───────────────────────────────┘  │
│ └────────────────────────────────┘ ┌───────────────────────────────┐  │
│                                     │ 自定練習 選標籤→選題數→作答    │  │
│                                     └───────────────────────────────┘  │
│  題庫  上傳·匯出·啟用停用   紀錄 檢視過去練習   說明書  主題           │
└──────────────────────────────────────────────────────────────────────┘
md 7/5 分割 · lg:max-w-6xl · <lg 先疊 hero 再 2-up · <sm 單欄
```

- 左側數字全部**衍生**，不加 state：到期 = `filterByTime(questions).length`（`lib/functions.js:44`）、今日已答 = `trainingCount`、剩 = `3 - trainingCount`。
- 右側主要卡：滿版玉色、玉色前景字、無邊框，全 app 唯一飽和表面。`checkTrainingCount()` 為 true 時停用，原因直接寫在卡內不用 toast。
- `Alert` 改成 `Card`。`Alert` 有 `role="alert"`，拿來當導覽表面語意錯誤，而且掛載時會逐張廣播。
- 刪掉 `w-100`。

### 題庫

```
┌──────────────────────────────────────────────────────────────────────┐
│ 題庫                                              [下載範例 .json]    │
│ 依標籤分組，共 142 題 · 12 個標籤                                       │
├──────────────────────────────────────────────────────────────────────┤
│ STICKY TOOLBAR (僅 hasChecked)                                       │
│ 已選 7 題   [啟用][停用][刪除][匯出] │ [全選]              [取消選取]  │
├──────────────────────────────────────────────────────────────────────┤
│ ☐ 全部 142     已啟用 138 · 已停用 4              [篩選: 全部 ▾]       │
│ ┌──────────────────────────────────────────────────────────────────┐  │
│ │ ● 單選  ● 熟練/5  2.需求法則是指… │ A.人們想要 B.人們需要 │ 2h │  │ ← md+
│ │ ● 填空  ● 普通/1  ______是指…    │ A.消費者需求 …       │ 已到期│  │
│ ├──────────────────────────────────────────────────────────────────┤  │
│ │ ▼ 單字 · economic  把經濟學跟 [≡] 放進同一句                    │  │ ← <md
│ │   熟練/5  已作答 3 次 · 下次 2 天後 · ch.4                       │  │
│ └──────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

- **一個** sticky 表頭，不是每個標籤一組。現在 `QuestionsTable.jsx` 對每個標籤渲染一個 `QuestionSection`，每個都渲染自己的 7 欄表頭（`QuestionSection.jsx:41-49`）→ 12 個標籤就有 12 組疊在可摺疊內容裡的表頭。
- 桌面：真 `<table>` 語意（或 `role="table"` grid），表頭 `sticky top-[var(--header-h)]`。行動：一題一卡，兩者由同一個 `questions` 陣列餵資料。
- 篩選器重用已安裝的 `ui/toggle-group.jsx` 或 `ui/select.jsx`，**不要**新增 `tabs`。
- 列狀態格：4 分支三元（`QuestionSection.jsx:62-71`）換成 `DueBadge tone={proficiencyLevel(q.due)}`。
- 群組 checkbox 補 `ref` + `indeterminate`，現在是沒有三態的純 `type="checkbox"`。
- 空狀態：裸字串 `'目前沒有任何題目'`（`:264`）→ `EmptyState` + 上傳 CTA。
- 載入：現在 IndexedDB 開啟期間什麼都沒有 → 依 `useIndexedDB` 的 `ready` 顯示 `Skeleton` 列。
- 破壞性動作（全部清除）移進 `⋯` `DropdownMenu`（已安裝但零使用）→ 6 顆純圖示按鈕變 4 顆有標籤 + 1 個溢出選單。

### 練習畫面（自動 / 自定共用）

```
┌──────────────────────────────────────────────────────────────────────┐
│ TRAINING HUD (sticky, header 下方)                                   │
│ 第 3 / 8 題   ▓▓▓▓▓▓░░░░░░░  ●●●●○○○  03:42            [離開]        │
├──────────────────────────────────────────────────────────────────────┤
│   ● ● ● ● ○ ○ ○ ○ ○     ← DueRail（提示目前熟練度區間）                │
│   ● 熟練/6                                                        │
│   ┌──────────────────────────────────────────────┐                   │
│   │ 2. 需求法則是指消費者對商品的需求              │                   │
│   │ ┌──────────────────────────────────────────┐ │                   │
│   │ │ A  人們想要什麼                            │ │                   │
│   │ └──────────────────────────────────────────┘ │                   │
│   │ ┌──────────────────────────────────────────┐ │                   │
│   │ │ ● B  人們需要什麼              ✓          │ │                   │
│   │ └──────────────────────────────────────────┘ │                   │
│   └──────────────────────────────────────────────┘                   │
├──────────────────────────────────────────────────────────────────────┤
│ STICKY ACTION BAR (<md)                          [ 確認 → ]          │
└──────────────────────────────────────────────────────────────────────┘
                     card max-w-2xl，所有斷點都置中
```

- `max-w-[380px] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%]`（`AutoTraining.jsx:96`）是四階寬度遞減，螢幕越寬卡片越窄，再加 `sm:items-start`（`:104`）→ 640px 以上內容偏離中心。改成單一 `max-w-2xl mx-auto`。
- HUD 取代 `StateBoard.jsx`：它是 `<section class="…border…shadow">` 裡放 `<ul><li>` 和**拿來當標籤用的 disabled `Toggle`**（`:57-62`），一個沒有任何互動的 toggle 原生元件。重用 `progress`、真的 `Badge`、計時器加 `tabular-nums`。
- 選項列抽成 `QuestionCard`，讓 `SingleChoiceItem` / `MultipleChoiceItem` / `VocabularyItem` 停止各自攜帶三份 `isCorrect/isWrong/inWrongCorrect` 三元與三份 New / 不熟練 / 再複習一下 chip（每檔約 26 行 × 3）。
- `motion-preset-confetti` / `shake` / `bounce` 保留，那是 README 的功能，但移進共用列元件並加 reduced-motion 防護。
- 分數面板共用 `ScoreSummary`，取代 `AutoTraining.jsx:76-90` 與 `TrainingInProgress.jsx:152-166` 兩份幾乎一樣的複製。

其他頁面：`TrainingSettings` 用 `FormField` 列取代 `1./2./3./4.` 裝飾編號；`HistoryView` 是唯一已接近目標的頁面，加 Skeleton、ConfirmDialog、統計列即可。

---

## 4. 元件重用計畫

**直接重用（16 個已安裝原生元件，零新相依）**：`button` `input` `label` `switch` `select` `dialog` `alert-dialog` `sheet` `collapsible` `toggle` `toggle-group` `progress` `dropdown-menu` `breadcrumb` `sonner`。

**透過既有 `components.json` 補上**（`npx shadcn add card skeleton separator`）。這些是**複製進 `src/components/ui/` 的原始碼**，不是 npm 套件，不違反「不新增 UI 套件」。

| 新元件 | 路徑 | 取代 |
|---|---|---|
| `Card` | `ui/card.jsx` | `HistoryView.jsx:89` 手刻卡片；`HomeView.jsx:46-89` 拿 Alert 當卡片 |
| `Skeleton` | `ui/skeleton.jsx` | `'載入中...'`（`HistoryView.jsx:75`）；`ManageQuestions`/`TrainingSettings`/`AutoTraining` 缺載入 |
| `Separator` | `ui/separator.jsx` | `StateBoard.jsx:52`、`AutoTraining.jsx:76` 的 border + shadow 堆疊 |
| `AppShell` | `layout/AppShell.jsx` | `Navbar.jsx` + 每頁 `p-6` + 4 個魔法寬度 |
| `PageHeader` | `layout/PageHeader.jsx` | `TheBreadcrumb.jsx` + 6 處重複 `<h1>/<h2>` |
| `ConfirmDialog` | `common/ConfirmDialog.jsx` | 4 個 `AlertDialog`（`ManageQuestions.jsx:186-260`）、`window.confirm`（`HistoryView.jsx:36`）、8 個 `alert()`（`CreateQuestionForm.jsx:123-152`）、`alert()`（`QuestionProvider.jsx:67`） |
| `EmptyState` | `common/EmptyState.jsx` | 裸字串（`ManageQuestions.jsx:264`）、客製區塊（`HistoryView.jsx:77-85`）、首頁空白 |
| `DueRail` | `training/DueRail.jsx` | 3 份重複的 `due > 7 / >= 0 / !== null / else` 階梯 |
| `DueBadge` | `training/DueBadge.jsx` | `QuestionSection.jsx:62-71` |
| `OptionRow` / `StatusChip` | `training/` | 各約 40 行 × 3 檔、26 行 × 3 檔 |
| `TrainingHUD` | `training/TrainingHUD.jsx` | `StateBoard.jsx`（整檔） |
| `ScoreSummary` | `training/ScoreSummary.jsx` | `AutoTraining.jsx:76-90` + `TrainingInProgress.jsx:152-166` |
| `SelectionToolbar` | `manage/SelectionToolbar.jsx` | `ManageQuestions.jsx:173-261` |
| `FormField` | `common/FormField.jsx` | `TrainingSettings.jsx:114-152`、`CreateQuestionForm.jsx` 的臨時 Label+Input 配對 |

**純函式加進既有的 `src/lib/functions.js`（不開新檔）**：
`proficiencyLevel(due) → { label, tone }`（階梯用詞的唯一來源）、`formatDueAt(question)`（修 `(h:m)` 誤標）、`scoreTone(score) → 'correct'|'hint'|'wrong'`（取代 3 份 `>=80 / >=60 / else` 三元：`AutoTraining.jsx:78-84`、`TrainingInProgress.jsx:153-160`、`HistoryView.jsx:124`）。

## 5. 深色模式與 RWD 策略

**深色模式**
1. 單一 token 來源。47 處手動配對（`dark:bg-emerald-700`、`dark:bg-gray-700/35`、`bg-sky-200 dark:bg-sky-900`、`text-green-500 dark:text-green-400`）全換成語意 token。這才是真正的深色模式修正，這些配對每個單看都合理、合起來就在漂。
2. 修深色反轉（`--card` 比 `--background` 深）與 60% 白邊框。
3. `:root { color-scheme: light }`、`.dark { color-scheme: dark }` → 原生捲軸、`<input type=number>` spinner 跟著變色。
4. 修 Toaster 接線（見第 6 章 bug 1）與 `'system'` 切換跳躍：`ThemeProvider` 暴露 `resolvedTheme`，加 `matchMedia` change listener 讓 app 實時跟隨 OS。
5. **reduced-motion 是強制項，不是打磨。** 16 處 `motion-preset-*`（`tailwindcss-motion@0.4.3-beta`）沒有任何一個尊重它。加 `@media (prefers-reduced-motion: reduce)`。
6. 給實作者的契約：`src/components/**` 與 `src/pages/**` 內不得出現任何字面色票，只准 `hsl(var(--token))`、語意 `bg-*`/`text-*`，或針對 token 的 `dark:`。

**RWD**
- 單一容器在 `AppShell`：`mx-auto w-full max-w-6xl px-4 md:px-6`，每頁丟掉自己的 `p-6`。
- 斷點：`<640` 單欄 + sticky 底部動作列，全站無橫向捲軸；`640–1023` 內容允許時兩欄；`≥1024` 滿版 `max-w-6xl`。
- **sticky header 偏移衝突，必須處理。** `FillInTheBlankItem.jsx:22` 與 `MatchingItem.jsx:21` 用 `sticky top-0` 放選項庫。app header 一旦 sticky，這兩處會滑到 header 底下。桌面改成 `sticky top-[var(--header-h)]`，行動改成 `Collapsible`（選項清單 3 至 8 個，現在會把整題擠出畫面）。
- 觸控目標：填空/配對的行內輸入是 `h-8 w-28` 塞在段落文字中（`FillInTheBlankItem.jsx:71`），行動端低於 44px → `h-10 w-24 sm:h-8 sm:w-28`。
- 刪掉 4 個臨時寬度：`w-100`（`HomeView.jsx:45`）、`md:w-[750px]`（`QuestionsTable.jsx:8`）、四階 max-width 遞減（`AutoTraining.jsx:96`）、`max-w-[280px]`（`TrainingSettings.jsx:146`）。刪掉 `mt-[100px]`（`TrainingInProgress.jsx:191`）。

---

# 第二部：設計品味稽核

## 6. 死 class / 死 no-op（零成本，訊號最高）

已對照 `tailwindcss/package.json@3.4.14`（`spacing` 沒有 `18` 也沒有 `100`）與 `tailwindcss-motion/src/presets.js`（真實清單：`blur-*`、`fade`、`float`、`flomoji`、`focus`、`oscillate`、`pulse`、`rebound`、`seesaw`、`slide-*`、`stretch`、`typewriter`、`wobble`）。

| Class | file:line | 效果 |
|---|---|---|
| `w-100` | `src/pages/HomeView.jsx:45` | spacing 階梯不存在 → 首頁格線無約束，通通滿版到視窗邊緣 |
| `sm:h-18` | `src/components/Navbar.jsx:32` | 不存在 → navbar 在**每個**斷點都是 `h-14`，`sm:` 意圖靜默失效，`md:h-20` 直接從 56px 跳 80px |
| `md:px-10;` | `src/components/manage/QuestionSection.jsx:16` | token 內的尾端 `;` → 候選是 `md:px-10;` 永不命中，`md+` 標籤列沒有水平留白 |
| `place-items-stretch` ×4 | `SingleChoiceItem.jsx:44`、`MultipleChoiceItem.jsx:75`、`VocabularyItem.jsx:35,39` | 不是 Tailwind 工具類（正確寫法是 `items-stretch`） |
| `motion-preset-bounce` ×9 | `SingleChoice:16,22,28`；`MultipleChoice:45,51,57`；`Vocabulary:15,21,27` | **死**。New / 不熟練 / 再複習 badge 不動 |
| `motion-preset-confetti` ×3 | `SingleChoice:51`；`MultipleChoice:84`；`Vocabulary:46` | **死**。README 的「答對動畫」 |
| `motion-preset-shake` ×3 | `SingleChoice:53`；`MultipleChoice:86`；`Vocabulary:48` | **死**。答錯回饋只是靜態換色 |

**有效，別動**：`motion-preset-slide-left`（`AutoTraining.jsx:104`）、`motion-duration-300`、`motion-delay-300`、`-motion-translate-y-in-150`（`baseAnimations.js:459-467` 有定義 `150`，`:165` 有 `supportsNegativeValues: true`）。

其他死碼：`VocabularyItem.jsx:97` 的 `peer` 沒有任何 `peer-*` 消費；`TrainingSettings.jsx:125` 手動 `data-state`（Radix 已透過 `TogglePrimitive.Item` 持有）。

## 7. 排版

**7.1 最大可讀性問題：主要閱讀表面只有 14px。** 對繁體中文測驗 app 來說，**答案選項的標籤就是內容**。

```diff
// src/components/training/item/SingleChoiceItem.jsx:106
// src/components/training/item/MultipleChoiceItem.jsx:134（完全相同）
- className={`w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300 sm:ms-2`}
+ className={`w-full py-4 text-base leading-relaxed font-medium text-foreground`}
```

順便消掉一組硬編碼的 `text-gray-900` / `dark:text-gray-300` 配對，它在跟 `--foreground` 打架。

**7.2 「題目本文」有三種尺寸**

```diff
// VocabularyItem.jsx:31  ← 同一語意層級，大兩階
- <h2 className={`my-3 font-bold ${mod === 'one-problem-mod' ? 'text-2xl' : 'text-xl'}`}>
+ <h2 className={cn('text-stem', mod === 'one-problem-mod' && 'text-stem-lg')}>
// SingleChoiceItem.jsx:32 / MultipleChoiceItem.jsx:61
// FillInTheBlankItem.jsx:19 / MatchingItem.jsx:18
- <h2 className="my-2 text-lg">
+ <h2 className="text-stem">
```

**7.3 「頁面標題」有三種尺寸**：`HistoryView.jsx:62` 用 `text-2xl`，而 `TrainingSettings.jsx:111`、`ManageQuestions.jsx:164`、`QuestionsTable.jsx:9` 都用 `text-xl`，語意相同。注意 `ManageQuestions.jsx:164` 與 `QuestionsTable.jsx:9` 是**同一頁兩個 `h2`**，只隔 3 個元素。

**7.4 每頁把麵包屑又當標題重複一次**（約 30px 之下）

```jsx
// TrainingSettings.jsx:107 / :111
<BreadcrumbPage>練習設定頁面</BreadcrumbPage>
<h1 className="my-2 text-xl font-bold">練習設定頁面</h1>
// HistoryView.jsx:58 / :62
<BreadcrumbPage>練習紀錄</BreadcrumbPage>
<h1 className="text-2xl font-bold flex items-center gap-2">…練習紀錄</h1>
```

四個畫面把同一件事講兩次。刪掉重複的那一個，不要兩個都刪。

**7.5 `HomeView.jsx:45-90` 的標題層級結構上無效。** `alert.jsx:28` 渲染 `<h5>`，`HomeView.jsx:51,58,66,74,86` 渲染 `<AlertTitle className="text-base font-bold">`，整頁**沒有任何 `h1`–`h4`**。螢幕閱讀器使用者拿到的是 `h5` 當第一個地標級標題。

**7.6 字重詞彙未定義。** `font-bold`（700）散落 12 處（`HomeView.jsx:51`、`ManageQuestions.jsx:164`、`QuestionsTable.jsx:9`、`TrainingSettings.jsx:111`、`HistoryView.jsx:62,123,131,135,139`、`QuestionSection.jsx:16`、`VocabularyItem.jsx:31`、`CreateQuestionForm.jsx:267`、`AutoTraining.jsx:80,83`）；`font-semibold`（600）在 `dialog.jsx:64`、`alert-dialog.jsx:56`、`sheet.jsx:77`、`dropdown-menu.jsx:119`、`select.jsx:86`、`HistoryView.jsx:93,112`。600/700 只差一階，看起來像意外而不是規則。

**7.7 `leading-none` 用在三個地方**：`alert.jsx:30`、`dialog.jsx:64`、`HistoryView.jsx:93`。繁體中文的 `leading-none` 會切到下伸部與聲調，跟 `SingleChoiceItem.jsx:34` 需要顯式 `<br />` 是同一個原因。

## 8. 顏色（含量測比值）

**8.1 深色 `--border` / `--input` 亮約 5 倍，整個 app 看起來像線框圖**

```css
/* src/index.css:49-50 */
--border: 0 0% 60%;
--input:  0 0% 60%;
```

| 配對 | 比值 | 判定 |
|---|---|---|
| `--border` `#999999` vs 深色 `--card` `#18181b` | **6.22 : 1** | 邊框比 `--foreground`（正文 11.3:1）還亮 |
| `--input` `#999999` vs 深色 `--background` `#242426` | **5.44 : 1** | 每個輸入框都在發光 |
| `--border` `#e4e4e7` vs 白（淺色） | 1.27 : 1 | 正確 |

淺色與深色不對稱約 5 倍。深色 `--foreground` 是 `0 0% 86%`（`:34`），邊框卻是 `0 0% 60%`，比文字暗、比地面暗，於是每張卡、每個對話框、每個輸入框、每個表格列在深色下都讀成一個描邊方盒。

```diff .dark {
- --border: 0 0% 60%;
- --input:  0 0% 60%;
+ --border: 240 3.7% 22%;   /* #2f2f34 → 在 #18181b 上 1.24:1 */
+ --input:  240 3.7% 26%;   /* #38383d → 可見但仍退後 */
}
```

**8.2 `destructive` 按鈕 WCAG AA 失敗，2.74 : 1**

```css
/* src/index.css:20-21 */  --destructive: 0 84.2% 60.2%;          /* #ef4444 */
                            --destructive-foreground: 0 0% 86%;  /* #dcdcdc */
```

`#ef4444` + `#dcdcdc` = **2.74 : 1**（AA 需要 4.5 : 1）。這是 app 內最高流量的破壞性控制：`ManageQuestions.jsx:199,213,223,239,255` 的 `AlertDialogAction`，以及 `TrainingSettings.jsx:176`（全部取消）、`HistoryView.jsx:67`（清除全部）的 `Button variant="destructive"`。

```diff
  :root {
-   --destructive: 0 84.2% 60.2%;
+   --destructive: 0 72.2% 45.1%;       /* #dc2626 */
    --destructive-foreground: 0 0% 98%; /* #fafafa → 4.63:1 */
  }
  .dark {
-   --destructive: 0 62.8% 30.6%;
+   --destructive: 0 62.8% 34.1%;       /* #a72323 */
    --destructive-foreground: 0 0% 98%;
  }
```

**8.3 分數顏色在白底上 AA 失敗，而且是兩套不同色票**

| 位置 | Class | 白底比值 |
|---|---|---|
| `HistoryView.jsx:124` | `text-orange-500` `#f97316` | **2.80 : 1** |
| `HistoryView.jsx:124` | `text-green-500` `#22c55e` | 2.30 : 1 |
| `HistoryView.jsx:124` | `text-red-500` `#ef4444` | **3.76 : 1** |
| `HistoryView.jsx:135` | `text-green-600` `#16a34a` | **3.30 : 1** |
| `HistoryView.jsx:139` | `text-red-600` `#dc2626` | 4.83 : 1（通過） |
| `AutoTraining.jsx:80,83` / `TrainingInProgress.jsx:156,159` | `text-green-500` / `text-red-500` | 失敗 |

同一套 80/60 門檻邏輯寫了三遍，配三套色票：`AutoTraining.jsx:78-84`（green-500 / red-500 + `dark:`）、`TrainingInProgress.jsx:154-160`（green-500 / red-400，`:159` 只留 `dark:` 卻掉了淺色類）、`HistoryView.jsx:123-125`（green-500 / orange-500 / red-500，完全沒有 `dark:`）。

```diff
// AutoTraining.jsx:78 · TrainingInProgress.jsx:154 · HistoryView.jsx:123
- className={`${score >= 80 ? 'font-bold text-green-500 dark:text-green-400'
-              : score >= 60 ? ''
-              : 'font-bold text-red-500 dark:text-red-400'} text-lg`}
+ className={cn('text-2xl font-semibold tabular-nums', {
+   'text-score-good': score >= 80,
+   'text-score-warn': score >= 60 && score < 80,
+   'text-score-bad':  score < 60,
+ })}
```

**8.4 一張題目卡同時抽四套不相干的顏色系統**（`SingleChoiceItem.jsx:93` 一個選項列）

| 角色 | 現況 | 行號 |
|---|---|---|
| 中性邊框 | `border-gray-200 dark:border-gray-700` | `SingleChoice:93`、`MultipleChoice:119`、`Vocabulary:89` |
| 選取 | `bg-sky-200 dark:bg-sky-500` | `SingleChoice:88`、`MultipleChoice:94`、`Vocabulary:53` |
| 正確 | `bg-green-200 dark:bg-emerald-700` | `SingleChoice:51`、`MultipleChoice:84`、`Vocabulary:46` |
| 錯誤 | `bg-red-200 dark:bg-red-500` | `SingleChoice:53`、`MultipleChoice:86`、`Vocabulary:48` |
| 漏答 | `bg-yellow-200 dark:bg-yellow-600` | `SingleChoice:55`、`MultipleChoice:88`、`Vocabulary:50` |

注意 `green-200`（淺）配 `emerald-700`（深），**同一個狀態兩個色相**。整組逐字複製在 3 個檔案。9 段重複 class 字串可塌縮成 1 組 token。

**8.5 有 token 卻用原始灰色階**

```diff
// TrainingSettings.jsx:151
- <p className="ml-1 text-sm text-gray-500">共有 {questionsLength} 題</p>
+ <p className="ml-1 text-sm text-muted-foreground">共有 {questionsLength} 題</p>
// SingleChoiceItem.jsx:36
- <span className="text-sm text-gray-500 dark:text-gray-100/65">ch {problem.remark}</span>
+ <span className="text-sm text-muted-foreground">ch {problem.remark}</span>
```

**8.6 分數面板硬編灰色階，而且重複。** `AutoTraining.jsx:76` 與 `TrainingInProgress.jsx:152` 逐字相同：`bg-gray-200/25 … text-gray-500 shadow dark:bg-gray-700/35 dark:text-gray-100/65`。

**8.7 `--secondary`、`--muted`、`--accent` 三個值完全相同，淺色 `--card` == `--background`**（`index.css:8,14,16,18`）。所以 `hover:bg-accent`（`button.jsx:15,17`、`toggle.jsx:10,16`）與 `hover:bg-secondary`（`button.jsx:16`）視覺上相同，而且**完全沒有表面層級**，淺色下每張卡都是白上加一條 1.27:1 的髮絲線。這就是 `HistoryView.jsx:89` 不得不伸手拿 `shadow-sm`、`TrainingInProgress.jsx:172` 不得不拿 `md:shadow-lg` 才感覺得到浮起的原因。

**8.8 飽和的 sky chip 跟 zinc 配色打架。** `QuestionSection.jsx:16` `bg-sky-200 dark:bg-sky-900`（`#7dd3fc` / `#0c4a6e`，深色下 1.64:1 幾乎看不見）；`:83,96` `bg-sky-200 dark:bg-sky-600`。`--ring` / `--primary` 都是 zinc，整個 app 唯一的品牌色是兩個檔案裡的硬編 sky。

**8.9 `!important` 在跟 shadcn 原生元件對抗**

```jsx
// HomeView.jsx:47,50
<Alert className="custom-alert cursor-pointer bg-[hsl(var(--foreground))] text-[hsl(var(--background))]">
  <MdNotStarted className="h-5 w-5 !text-[hsl(var(--background))]" />
```

根因是 `alert.jsx:7` 硬寫 `[&>svg]:text-foreground`，所以圖示必須用 `!` 覆蓋。附帶兩點：`HomeView.jsx:47` 的 `cursor-pointer` 是多餘的，`index.css:69` 已經 `@apply cursor-pointer`；整張卡用原始 `hsl(var(--…))` 括號語法上色卻保留 `alert.jsx:7` 的 `border-border`，於是深色下得到 `#999999` 髮絲線框住一張 `#dcdcdc` 的卡。

## 9. 間距與版面

**9.1 間距魔法數字**：`TrainingInProgress.jsx:191` 的 `z-10 mt-[100px] w-full`，`mt-[100px]` 不在任何階梯上，存在只為了讓開表單，全 repo 沒有第二處使用。

**9.2 有 token 卻用臨時寬度**

```jsx
// AutoTraining.jsx:96
max-w-[380px] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%]   // 四個魔法值，螢幕越寬越窄
// QuestionsTable.jsx:8
mx-5 space-y-3 md:mx-auto md:w-[750px]                        // 固定 750px
// TrainingSettings.jsx:110
mx-auto mt-3 max-w-96 rounded-md border p-5                   // 384px 卡片，卻滿版 p-6 頁面
// TrainingInProgress.jsx:172
my-5 space-y-6 md:space-y-12 md:p-6 md:shadow-lg              // 24px → 48px，中間沒有階梯
// TrainingSettings.jsx:146
w-full max-w-[280px]
```

`TrainingSettings.jsx:110` 是最明顯的品味失敗：1440px 螢幕上一張 384px 的卡置中在滿版麵包屑底下，沒有頁面標題也沒有區塊最大寬度。

**9.3 `gap-5` 是一次性的。** `HomeView.jsx:45` 的 `grid gap-5 p-6 md:grid-cols-2 lg:grid-cols-3`，其他所有格線用 `gap-2/3/4/6`（`AutoTraining.jsx:68` `gap-2 sm:gap-4 md:gap-6`、`CreateQuestionForm.jsx:204-205`、`HistoryView.jsx:120`）。加上 `w-100` 是死的（第 6 章），沒有任何 `max-w-*`，`lg:grid-cols-3` 的卡片會在超寬螢幕上拉到全寬。

**9.4 `.custom-row` 對繁體中文套用 `font-mono`**

```css
/* src/index.css:72-74 */
.custom-row { @apply grid rounded-md border px-4 py-2 font-mono text-sm shadow-sm; }
```

用在 `QuestionSection.jsx:41`（表頭）與 `:59`（所有列）。CJK 字形沒有等寬覆蓋，會退到系統 CJK 字體，**前進寬度是旁邊拉丁/數字符號的兩倍** → `:59` 的 `grid-cols-[1fr_1fr_6fr_5fr_1fr_1fr_1fr]` 永遠對不上 `:41` 的 `grid-cols-7`。表頭標籤（`:42-48`：類型/狀態/題目/選項/答案/下次做答時間/備註/已啟用）只有在單字題才對齊，其他四種題型「題目」表頭會壓在 6fr 欄、「下次做答時間」壓在 1fr 欄上。若想保留等寬外觀，只對 `QuestionSection.jsx:111-116`（下次做答時間）套 `tabular-nums`。

**9.5 `.custom-alert` / `.custom-row` 定義在 `@layer` 之外**（`index.css:68-74`，在 `:66` 的 `@layer` 區塊關閉之後）。產出在 `@tailwind utilities` 之後，所以 `.custom-alert` 的 `hover:scale-105` **無法被任何工具類覆蓋**，是單向門。搭配 `HomeView.jsx:45` 的 grid，grid 子元素的 `hover:scale-105` 在行動端會溢出到鄰居並在視窗邊緣被裁掉。

## 10. 圓角與陰影

**10.1 圓角實際上只有三階，且沒有更大端**（`tailwind.config.js:7-11`，`index.css:30` `--radius: 0.5rem`）。使用中的值：`4px`（`rounded`：`SingleChoice:93`、`MultipleChoice:119`、`Vocabulary:89`、`FillInTheBlank:55,60,71`）、`4px`（`rounded-sm`：`MatchingItem:21`、`select.jsx:96`、`dropdown-menu.jsx:22,66,80,101`）、`6px`（`rounded-md`）、`8px`（`rounded-lg`：`alert.jsx:7`、`HistoryView.jsx:77,89`、`FileUploader:92`、`StateBoard.jsx:52`、`dialog.jsx:33`、`alert-dialog.jsx:31`）。`rounded-xl` / `2xl` 保留 Tailwind 預設但**零使用**。

漂移的具體證據，兩個結構相同、相差 2px 的面板：

```jsx
// FillInTheBlankItem.jsx:22
"sticky top-0 my-2 flex flex-wrap justify-center gap-3 rounded-md border p-3 text-sm shadow"
// MatchingItem.jsx:21
"sticky top-0 my-2 flex flex-wrap justify-center gap-3 rounded-sm border p-3 text-sm shadow"
```

同一個元素、同一個用途（A/B/C 選項庫）、不同圓角。另外互動的選項列用 `rounded`（4px），而 `Toggle`（`TrainingSettings.jsx:120-131`）、`Button`、`Input` 都用 `rounded-md`（6px），所以同角色的標籤 chip 和篩選 chip 圓角不同。

**10.2 六級陰影、零命名，而且 `shadow` 被拿來當卡片**

| 等級 | 檔案 |
|---|---|
| `shadow`（裸） | `FillInTheBlank:22`、`Matching:21`、`StateBoard:52`、`QuestionSection:16` |
| `shadow-sm` | `button.jsx:13,14,16`、`input.jsx:10`、`select.jsx:17`、`toggle.jsx:16`、`switch.jsx:9`、`HistoryView:89` |
| `shadow-md` | `Navbar.jsx:32` |
| `shadow-lg` | `dialog.jsx:33`、`alert-dialog.jsx:31`、`sheet.jsx:29`、`dropdown-menu:38`、`select.jsx:58`、`switch.jsx:17`（thumb）、`sonner.jsx:14`、`TrainingInProgress.jsx:172` |

最常用的「卡片」浮起用裸 `shadow`，而按鈕只用 `shadow-sm`，層級是反的：可點的按鈕比靜態資訊面板還平。沒有任何陰影帶色，全部是純 `rgb(0 0 0 / …)` 打在 `hsl(240 …)` 的 zinc 地面上。整個 app 層只有 4 處 transition 宣告（`FileUploader.jsx:92`、`QuestionSection.jsx:35`、`Navbar.jsx:36`、`index.css:69`）。

## 11. 圖示

**11.1 同時三套圖示庫。**

| 庫 | 位置 |
|---|---|
| `lucide-react` | `HistoryView.jsx:5`、`Navbar.jsx:12`，**只有 2 個檔案** |
| `react-icons`（7 個子包） | `HomeView.jsx:3-5`、`Navbar.jsx:11,13`、`ManageQuestions.jsx:18,19`、`AutoTraining.jsx:6`、`FileUploader.jsx:11`、`QuestionSection.jsx:5`、`VocabularyItem.jsx:5,6`、`SingleChoiceItem.jsx:6,7`、`MultipleChoiceItem.jsx:5,6` |
| `@radix-ui/react-icons` | `dialog.jsx:3`、`select.jsx:2`、`breadcrumb.jsx:4`、`dropdown-menu.jsx:4`、`sheet.jsx:3`，**正確**，shadcn 慣例，留著 |

`lucide-react` 已在 `dependencies`（`package.json:29`）且是三者中最新的。統一到它是 find-and-replace，不是新相依。

**11.2 一列 5 顆按鈕裡有四種字形風格**：`ManageQuestions.jsx:189,206,213`（加 `FileUploader.jsx:82`）混用 `IoIosRemoveCircle`（柔邊圓、細）、`FaDownload`（實心）、`FaTrashAlt`（實心）、`RiAddCircleFill`（實心），沒有共用筆畫粗細也沒有共用尺寸。

**11.3 尺寸不一致，有一處完全沒給尺寸。** 顯式 `h-5 w-5`（20px）：`HomeView.jsx:50,57,65,73,85`、`Navbar.jsx:46,69,75,81`、`SingleChoice:17,24`、`MultipleChoice:46,52`、`Vocabulary:16,22`、`AutoTraining.jsx:70`。隱式 16px（來自 `button.jsx:8` 的 `[&_svg]:size-4`）：`ManageQuestions.jsx:189,206,213`、`FileUploader:82`。**沒有尺寸類**：

```jsx
// QuestionSection.jsx:35
<IoIosArrowDown className={`${open ? '-rotate-180' : 'rotate-0'} transition-transform`} />
```

它從 `:16` 的 `text-lg` `<h4>` 繼承 `1em` → 18px，而每個兄弟圖示都是 20px。它還是全 app 唯一的展開收合控制，而且 `transition-transform` **沒有 `duration-*`**，所以手風琴箭頭是在兩個旋轉角度之間硬切。

**11.4 單選/勾選控制用藍色強調，對上 zinc 配色。** `SingleChoiceItem.jsx:101`、`MultipleChoiceItem.jsx:127`、`VocabularyItem.jsx:97`（三處完全相同）：`from-radio/checkbox … text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600`。`--ring` 是 zinc（`index.css:51`），選取填色是 sky，**三種互動顏色**並存。

## 12. 動態（`tailwindcss-motion@0.4.3-beta`）

**運作中**：`AutoTraining.jsx:104` 的 `motion-preset-slide-left`（題目切換）與同行的 `motion-duration-300`。

**壞掉**：15 個死 preset 類（第 6 章）。badge 進場與對錯回饋完全不輸出。`presets.js` 中最接近的真實替代：`motion-preset-rebound`（badge 進場）、`motion-preset-wobble` / `motion-preset-seesaw`（答錯）、`motion-preset-stretch` 或 `motion-scale-in-105` + `motion-scale-loop`（答對）。

**完全缺漏**
- 全 `src/` 零 `motion-reduce` / `prefers-reduced-motion`。`.custom-alert` 的 `hover:scale-105`（`index.css:69`）、slide 過場、所有 badge 進場都是無條件執行。
- 三個檔案裡的硬寫 `700ms` timeout，跟 motion token 系統（`--motion-duration` 預設 750ms）不一致：`SingleChoiceItem.jsx:79-81`、`MultipleChoiceItem.jsx:36-38`、`VocabularyItem.jsx:78-80`。
- **`select.jsx:71` 的 `h-[var(--radix-select-trigger-height)]` 把 popper 視窗鎖死成觸發器高度**，這是已知 shadcn 缺陷。`CreateQuestionForm.jsx:212-218` 有 5 個項目而 `SelectItem` 是 `py-1.5 text-sm`，清單被裁到約 36px。

## 13. RWD 具體缺陷

| 問題 | file:line |
|---|---|
| `CreateQuestionForm` 欄位列永不換行，`grid-cols-2` 沒有 `md:` 前綴 | `CreateQuestionForm.jsx:205` |
| 同一表單的選項列 `flex gap-2` 三個子元素（`Input` + `SelectTrigger w-24` + `Button 刪除`）沒有 `flex-wrap` → 400px 以下保證溢出 | `CreateQuestionForm.jsx:266, 302, 351, 375` |
| `QuestionsTable` 是固定 `md:w-[750px]` 內含 `min-w-max`；`CollapsibleContent` 有 `overflow-x-auto`（`QuestionSection.jsx:39`）但外層 `<section>`（`QuestionsTable.jsx:8`）沒有，而且 `md:mx-auto` 讓 `mx-5` 在 `md:` 還留著 → 捲動容器深了一層 | `QuestionsTable.jsx:8` |
| `HomeView` 格線沒有任何 `max-w-*` | `HomeView.jsx:45` |
| `Navbar` 的 `sm:h-18` 是死的 → `sm:` 還是 `h-14`，然後直接跳 `md:h-20`，`sm:` 高度根本不存在 | `Navbar.jsx:32` |
| `Navbar.jsx:43` 的 `ml-auto … gap-4` 掛在一個只含單一 `DialogTrigger` 的 nav 上 | `Navbar.jsx:43` |
| `TrainingSettings.jsx:154` 用 `[&>*]:flex [&>*]:items-center [&>*]:gap-2` 排「產生教學/包含題目」，脆弱的任意變體選擇器，一個 2 欄格線就夠了 | `TrainingSettings.jsx:154` |

## 14. 工具類合併（`src/lib/utils.js:1-6` 的 `twMerge(clsx(...))` 本身正確，20 個 `cn()` 呼叫點無誤用）

兩個**可用性**缺口，不是 bug：
- `AlertTitle`（`alert.jsx:30`）把 `mb-1 font-medium leading-none` 合併在 `className` **之前**，所以 `HomeView.jsx:51` 的 `text-base font-bold` 靠 `twMerge` 取勝。這是對的，但只因為用了 `cn`。任何新消費者若用裸 `<h5>` 會默默失去覆寫。
- `ClassValue` 接受陣列（clsx 特性），但 `cn` 沒有文件，`cn(a, b.join(' '))` 會被邀請出來。`AutoTraining.jsx:78-84` 與 `TrainingInProgress.jsx:154-160` 正是手動拼 template string；改成 `cn(..., { 'text-score-good': … })`（見 8.3）同時解決色票重複與合併衝突。

---

# 第三部：已確認的真實 bug（非外觀問題）

| # | 位置 | 問題 |
|---|---|---|
| 1 | `src/components/ui/sonner.jsx:1` | `useTheme` 從 **`next-themes`** 匯入，但 app 用自己的 `src/provider/ThemeProvider.jsx`。tree 裡沒有 next-themes provider → `useTheme()` 回傳 `undefined` → `theme` 永遠是 `'system'` → **使用者明確選 light/dark 時 toast 永遠不跟隨**。`next-themes` 其他地方零使用（grep 僅 1 處命中）。 |
| 2 | `src/index.css:33-36` | 深色模式表面階層反轉：`--background: 240 10% 15%` 但 `--card: 240 10% 10%`（card 比頁面**更深**）。加上 `--border: 0 0% 60%` 在深色下是接近白的髮絲線。 |
| 3 | `src/components/Navbar.jsx:72` | `theme === 'light' ? 'dark' : 'light'`。當儲存值是 `'system'`（`ThemeProvider` 預設）時，第一次點擊直接跳 `'dark'`，不管 OS 實際設定。 |
| 4 | `src/pages/TrainingInProgress.jsx:72` | unmount 清理檢查 `window.location.pathname !== '/training/progress'`，真實路由是 `/training/in-progress`。狀態因此每次 unmount 都被清掉。`:66-71` 那 6 行註解描述的是程式碼沒實作的意圖。 |
| 5 | `src/pages/TrainingInProgress.jsx:131` | submit 時 `document.body.style.height = '1px'`，**永不清除**。計分之後頁面無法再變長。 |
| 6 | `src/pages/TrainingSettings.jsx:80-92` | `handleSelectAll` / `handleClearAll` 就地 mutate React state（`prev.currentTags = …`）並回傳同一個物件。靠巧合運作，StrictMode 雙重渲染下會壞。 |
| 7 | `src/pages/TrainingSettings.jsx:118-131` | `ToggleGroup type="multiple"` 用手動 `data-state` + `onClick` + `dataset.value` hack，而不是受控的 `value` / `onValueChange`。 |
| 8 | `src/pages/HomeView.jsx:45` | `w-100` 不是 Tailwind 類別，no-op。 |
| 9 | `src/components/manage/QuestionSection.jsx:16` | `className="md:px-10; mb-3 …"`。`;` 讓第一個工具類失效。 |
| 10 | `src/components/manage/QuestionSection.jsx:112` | `formatTime(minutes) + ' (h:m)'`。`formatTime`（`src/lib/functions.js:168`）回傳 `m:ss` 不是 `h:m`。標籤說謊。 |
| 11 | `src/components/manage/FileUploader.jsx:47-49` | `JSON.parse` 失敗只 `console.error`，使用者沒有任何錯誤回饋。 |
| 12 | `src/components/ui/select.jsx:71` | `h-[var(--radix-select-trigger-height)]` 鎖死 popper 高度，`CreateQuestionForm.jsx:212-218` 的 5 個項目清單被裁到約 36px。 |
| 13 | 15 處死 `motion-preset-*` | `README.md:30` 打勾的「答對時有 scale 動畫」**從未渲染**。 |
| 14 | `package.json:57-58` | `react-icons` 與 `react-dropzone` 放在 `devDependencies`，但都在執行期被 import（`Navbar.jsx:11`、`FileUploader.jsx:15`）。 |
| 15 | `src/index.css:68-74` | `.custom-alert` / `.custom-row` 定義在 `@layer` 之外，產出順序在 utilities 之後，`hover:scale-105` 無法被覆蓋。 |
| 16 | `src/components/ui/breadcrumb.jsx`、`dropdown-menu.jsx` | `dropdown-menu` 零 import；`breadcrumb` 只被 `TheBreadcrumb` 使用，而它永遠只渲染一個 item。死 UI 原生元件。 |
| 17 | `README.md` | `歷史記錄` 仍是 `[ ]` 未勾，但 `src/pages/HistoryView.jsx` 存在且可用。文件過期。 |

**功能對等契約（來自 `README.md` + `docs/how-to-use.md`，一項都不能掉）**：上傳 `.json` / 下載範例 / 匯出全部 / 刪除選取 / 全部清除 / 啟用選取 / 停用選取 / 手動新增題目（5 種題型）/ 標籤多選 / 題目數量 / 產生教學 / 包含題目 / 全選 / 全部取消 / 單題自動模式 / 全部一次自定模式 / 逐題對錯漏答顯示 / 答題計時 / 熟練度 ±1 下限 −3 / `due: null` 教學卡 / 答對動畫 / IndexedDB 持久化含版本合併 / 每日 3 題上限與退出 / 歷史記錄 / 深色模式 / reload 還原（部分）。

**不動的東西**：不重寫、不新增相依、不改路由名稱、不動 `classes/Question.js` / `classes/API.js` / `hooks/*` / `lib/functions.js` 的邏輯（除新增 3 個 helper）、不重設計熟練度演算法。註記但不改：`src/classes/Question.js` ↔ `src/lib/functions.js` 存在循環 import（`functions.js:1` 引入 `classes/Question`，後者再引回來），目前能解析，UI pass 不要碰。

---

# 第四部：優先執行步驟

## P0 基礎層（先做，之後每一步都繼承它）

| # | 檔案 | 變更 |
|---|---|---|
| 1 | `src/index.css` | 依第 1.1 節重調 `:root`/`.dark`；加入 `--score-good/warn/bad`、`--ans-correct/wrong/missed`（兩套主題）；修 `--card`/背景反轉；深色 `--border`/`--input` 降到 `240 3.7% 22%/26%`；修 `--destructive` 到 AA；加 `color-scheme`；加 `scroll-behavior: smooth` 與 reduced-motion 區塊；`body` 加 `font-sans` / `tabular-nums`；`.custom-alert`/`.custom-row` 移進 `@layer components` 並移除 `font-mono` 與 `hover:scale-105` |
| 2 | `tailwind.config.js` | `theme.extend`：第 1.2 節的 `fontSize`/`fontFamily`/`fontWeight`、第 1.3 節的 `borderRadius`/`boxShadow`、`maxWidth.app`、`height.header`、`zIndex.{header:40, overlay:50, toast:60}`（取代散落的 `z-10`）。保留圓角階梯與 3 個 plugin |
| 3 | `src/components/ui/sonner.jsx` | `next-themes` → `@/provider/ThemeProvider`（**bug 1**） |
| 4 | `src/provider/ThemeProvider.jsx` | 加入 `resolvedTheme`；加 `matchMedia('(prefers-color-scheme: dark)')` change listener；既有 `localStorage` / class 邏輯不動 |
| 5 | `index.html` | 加 `description`、`theme-color`（淺/深 media）、`og:title`/`og:description`、SVG favicon。保留 `lang="zh-Hant"` |

## P1 共用原生元件（解鎖所有頁面）

| # | 檔案 | 變更 |
|---|---|---|
| 6 | `src/components/ui/card.jsx`、`skeleton.jsx`、`separator.jsx` | `npx shadcn add card skeleton separator`（既有 config，無新相依） |
| 7 | `src/lib/functions.js` | **只新增**：`proficiencyLevel`、`formatDueAt`、`scoreTone`。既有 export 不動 |
| 8 | `src/components/layout/AppShell.jsx`（新） | Sticky header（logo 補真 `alt`、nav、直接練習 CTA、主題切換、`⚙` Sheet）、skip-link → `#content`、`<main id="content">` 帶共用容器 |
| 9 | `src/components/layout/PageHeader.jsx`（新） | `{ title, description, actions }` |
| 10 | `src/components/common/ConfirmDialog.jsx`（新） | 包既有 `ui/alert-dialog`；`{ open, onOpenChange, kind, title, description, onConfirm }` |
| 11 | `src/components/common/EmptyState.jsx`（新） | `{ icon, title, description, action }` |
| 12 | `src/components/common/FormField.jsx`（新） | `Label htmlFor` + control + `description` + 行內 `error` |
| 13 | `src/App.jsx` | `<Routes/>` 包進 `<AppShell>`；`<Toaster/>` 移進 `<Router>`；**路由 `path` 不變**；加 `path="*"` → 有品牌感的 404 |
| 14 | `src/App.jsx` + `HomeView.jsx` + `ManageQuestions.jsx` + `TrainingSettings.jsx` | 把重複的初始化 `useEffect`（`HomeView.jsx:35-40`、`ManageQuestions.jsx:49-54`、`TrainingSettings.jsx:32-37` 三份一模一樣）提到 `App.jsx` 一次，刪掉另外 2 份與它們的 `questions.length === 0` guard（順便解決「三個頁面競爭初始化」） |

## P2 頁面重建（依此順序，每項可獨立上線）

| # | 檔案 | 變更 |
|---|---|---|
| 15 | `src/components/Navbar.jsx` | **刪除。** 內容移進 `AppShell.jsx`；修沒有 `asChild` 的 `DialogTrigger`、補 `aria-label`、補 GitHub 連結標籤、`sm:h-18` → `sm:h-16 md:h-20` |
| 16 | `src/components/TheBreadcrumb.jsx` | **刪除。** 由 `PageHeader` 取代，移除 6 處 import |
| 17 | `src/pages/HomeView.jsx` | 第 3 節儀表板。`Alert`→`Card`；加 `DueRail`；數字全衍生；刪 `w-100`；修 `!important` 圖示；刪多餘 `cursor-pointer` |
| 18 | `src/pages/ManageQuestions.jsx` | `PageHeader` + `SelectionToolbar` + 單一 `ConfirmDialog` 取代 `open1..open5`；`EmptyState`；依 `ready` 顯示 `Skeleton`；破壞性動作移進 `ui/dropdown-menu` |
| 19 | `src/components/manage/QuestionsTable.jsx` | 單一 sticky 表頭；桌面表格 + 行動卡片；用既有 `ToggleGroup` 做啟用狀態篩選；刪 `md:w-[750px]`，捲動容器上移一層 |
| 20 | `src/components/manage/QuestionSection.jsx` | `DueBadge`；修 `md:px-10;` typo；群組 checkbox 三態；用 `formatDueAt` 修 `(h:m)` 標籤；字面色票全換 token；`.custom-row` 移除 `font-mono`；chevron 補 `h-5 w-5` + `duration-200` |
| 21 | `src/pages/TrainingSettings.jsx` | 受控 `ToggleGroup`（刪 `data-state`/`data-value`/`name="tag"`/手動 `✔`）；`FormField` 列；不可變更新修 `handleSelectAll`/`handleClearAll`；刪 `[&>*]:flex`；switch 補 `Label htmlFor`；刪裝飾性 `1./2./3./4.`；`max-w-96` → `max-w-xl`；修表單列 `md:` 換行與選項列 `flex-wrap` |
| 22 | `src/components/training/TrainingHUD.jsx`（新）+ **刪除** `src/components/training/StateBoard.jsx` | 第 3 節 HUD。保留 `onTimeUpdate` / `initialTime` 契約，`TrainingInProgress.jsx:30-48` 依賴它 |
| 23 | `src/components/training/{DueRail,DueBadge,OptionRow,StatusChip,ScoreSummary}.jsx`（新） | 第 4 節表格。接著改寫 5 個 `item/*.jsx`。**同時把 15 個死 `motion-preset-*` 換成真實 preset**（bug 13） |
| 24 | `src/pages/AutoTraining.jsx` | HUD；所有斷點統一 `max-w-2xl`；sticky 確認列；`ScoreSummary`；刪 `Progress` 旁那個沒意義的 `RiCheckboxCircleFill`；分數改 `text-score-*` |
| 25 | `src/pages/TrainingInProgress.jsx` | HUD；`ScoreSummary`；sticky 提交列；刪 `mt-[100px]`、`body.style.height`、修 `/training/progress` 路徑不符並刪掉那 6 行誤導註解；`max-w-4xl` 改共用容器 |
| 26 | `src/pages/HistoryView.jsx` | `Skeleton`；`ConfirmDialog` 取代 `window.confirm`；統計列；字面色票換 `--score-*`；共用容器 |
| 27 | `src/components/manage/CreateQuestionForm.jsx` | 8 個 `alert()` → `FormField` 行內錯誤 + `aria-invalid`/`aria-describedby`；`DialogContent` max-height + focus 管理；`variant="destructive"` 刪除鈕改 `size="icon"` + `aria-label` |
| 28 | `src/components/manage/FileUploader.jsx` | dropzone token 上色；`isDragActive` 要被宣告而不只是變色；`JSON.parse` 失敗改錯誤 toast（bug 11） |
| 29 | `src/components/training/item/{FillInTheBlankItem,MatchingItem}.jsx` | `sticky top-[var(--header-h)]`；行動端選項庫改 `Collapsible`；觸控目標尺寸；統一 `rounded-md`；行內 `style={{ backgroundColor: 'hsl(var(--background))' }}` 改 `bg-background` |
| 30 | `src/components/ui/select.jsx` | 移除 popper 高度鎖（bug 12） |

## P3 清理（無外觀影響）

| # | 檔案 | 變更 |
|---|---|---|
| 31 | `package.json` | `react-icons` + `react-dropzone` 移出 `devDependencies`（bug 14）。圖示統一後移除 `react-icons`。`next-themes` 在 #3 之後變成未使用，**移除前先問**，它是明確安裝的相依 |
| 32 | 9 個檔案 | `react-icons` → `lucide-react`，15 個圖示 1:1 替換。**兩份報告在此有分歧**：重設計提案主張這一輪就做；品味稽核主張單獨一輪、等 token 工作落定再做（它碰不到任何版面）。建議後者，成本一樣、風險更低 |
| 33 | `src/utils/componentFactory.js` | 選用：把 `switch` + `React.createElement` 換成 `export const itemByType = { 單選題: SingleChoiceItem, … }`，行為相同、少約 14 行 |
| 34 | `src/components/ui/breadcrumb.jsx` | #16 落地後零引用，選用刪除（bug 16） |
| 35 | `README.md` | `歷史記錄` `[ ]` → `[x]`（bug 17）。`作答中reload…` 維持未勾，直到 #25 的行為決策定案 |

## 待決事項（實作前先確認）

1. **`TrainingInProgress` reload 還原**：修正路徑並啟用，還是保留今天「一律清除」的行為？兩個報告都標記這是需要明確決策、不能默默改掉的行為。
2. **`primary` 要不要變成玉色**：兩份報告不一致。本文件預設採提案 B（維持中性 + 玉色只當狀態色），因為 blast radius 小得多。
3. **`next-themes` 保留還是移除**：#3 之後它就沒人用了，但它是被明確安裝的相依。
4. **圖示統一排在 token 工作之後還是同一輪**：見 P3 #32 的建議。

## 附錄：最省力的 10 項快取（視覺收益 ÷ 工時）

| # | 變更 | file:line | 工時 | 收益 |
|---|---|---|---|---|
| 1 | 深色 `--border`/`--input` `0 0% 60%` → `240 3.7% 22%/26%` | `index.css:49-50` | 2 行 | **極高**，一次修掉所有深色畫面的線框感（6.22:1 → 1.24:1） |
| 2 | `--destructive` → `0 72.2% 45.1%` + `--destructive-foreground: 0 0% 98%` | `index.css:20-21,47-48` | 4 行 | **極高**，2.74:1 → 4.63:1，覆蓋 7 個最高流量的破壞性控制 |
| 3 | 答案選項標籤 `text-sm` → `text-base`，順便刪掉硬編灰階配對 | `SingleChoiceItem.jsx:106`、`MultipleChoiceItem.jsx:134` | 2 行 | **極高**，14px→16px CJK 是主要閱讀表面 |
| 4 | 5 個 `AlertTitle` 的 `text-base font-bold` 改 `text-stem` | `HomeView.jsx:51,58,66,74,86` | 6 行 + config | 高，首頁層級變得可讀一致 |
| 5 | 4 個頁面中 2 頁刪掉重複標題 | `TrainingSettings.jsx:111`、`HistoryView.jsx:62` | 2 行 | 高，消除可見的「練習設定頁面 / 練習設定頁面」 |
| 6 | `w-100` → `w-full max-w-6xl mx-auto` | `HomeView.jsx:45` | 1 行 | 高，停止超寬螢幕上格線邊到邊 |
| 7 | 刪 15 個死 `motion-preset-*`，換成真實 preset | `SingleChoice:16,22,28,51,53`；`MultipleChoice:45,51,57,84,86`；`Vocabulary:15,21,27,46,48` | 15 行 | 高，讓 README 的「答對動畫」第一次真的存在 |
| 8 | `sm:h-18` → `sm:h-16 md:h-20`；`.custom-alert` 加 `motion-reduce:transition-none`，`hover:scale-105` 換 `hover:ring-1 hover:ring-ring` | `Navbar.jsx:32`、`index.css:68-70` | 3 行 | 高，修 navbar 56→80px 跳躍、行動格線溢出，並加上 reduced-motion |
| 9 | 統一兩個選項庫面板圓角，`.custom-row` 移除 `font-mono` | `MatchingItem.jsx:21` `rounded-sm`→`rounded-md`；`index.css:73` | 2 行 | 中，修 2px 圓角漂移與 CJK 等寬欄位錯位 |
| 10 | 手風琴 chevron 補 `duration-200` + `h-5 w-5` | `QuestionSection.jsx:35` | 1 行 | 中，全 app 唯一的展開控制目前在硬切且比兄弟圖示小 2px |

**順手的免費收穫**：刪 `cursor-pointer`（`HomeView.jsx:47`，`index.css:69` 已有）、刪 `md:px-10;` 的尾端 `;`（`QuestionSection.jsx:16`）、`text-gray-500` → `text-muted-foreground`（`TrainingSettings.jsx:151`）、`StateBoard.jsx:66` + `HistoryView.jsx:123-139` 加 `tabular-nums`、`mt-[100px]` → `mt-24`（`TrainingInProgress.jsx:191`）。