# 自定題目練習系統

## How to use ?

### 匯入題庫

點擊圖中題庫按鈕

![image.png](./docs/img/image.png)

點擊"新增 題目/標籤" 上傳`.json`檔(詳細格式可以查看[question.json](./src/assets/questions.json))

![image-1.png](./docs/img/image-1.png)

### 練習設定
上傳完成後可以回到首頁到點擊【開始練習】
可以設定標籤來排除不想練習的題目(預設是全部)

### 練習中

#### 填空題

如果預到填空題請填入**代號**
![image-2.png](./docs/img/image-2.png)

### 練習結束

做答完後按下送出按鈕，會出現得分數和答對與答錯的題數
選項顯示綠色代表答對
選項顯示黃色代表應該要選擇的答案
選項顯示紅色代表使用者選擇的錯誤答案

![image-3.png](./docs/img/image-3.png)

## Feature
- 題目
  - [x] 上傳題目
  - [x] 練習題目
  - [x] 新增一個欄位-題型
    - [x] 填空題
    - [ ] 複選題
  - [ ] 新增題目
  - [ ] 匯出題目
- 練習
  - [x] 可以多選標籤
  - [ ] 熟練度系統
    - [ ] 做對一次加一分 錯一次扣一分 最低0分
  - [ ] 作答中reload不會失去作答狀態和資料
  - [ ] 做答時間
- 其它
  - [ ] 歷史記錄
  - [ ] 設定考試日期
  - [ ] 黑夜模式

## Libary

- React
- react-dom
- shadcn/ui# custom-training
