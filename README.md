# 自定題目練習系統

- [How to use ?](./docs/how-to-use.md)

## Feature
- 題目
  - [x] 上傳題目
  - [x] 練習題目
  - [x] 題型
    - [x] 單選題
    - [x] 填空題
    - [x] 配對題
    - [x] 單字題
    - [x] 多選題
  - [x] 匯出題目
  - [x] tag字體放大、變粗、變手風琴
  - [ ] 自己新增題目
- 練習
  - [x] 可以多選標籤
  - [x] 做答時間
  - [x] 讓題目有**啟用/關閉**的功能(enabled)
  - [x] 單題式
  - [x] 作答完顯示哪題對哪題錯(自定練習)
  - [ ] 作答中reload不會失去作答狀態和資料
  - 熟練度系統
    - [x] 做 對一次加一分 錯一次扣一分 最低-3分
    - [x] 如果due是null會有教學
      - 直接增加題目
    - [x] 新增 系統判斷 功能 (讓系統判斷目前該練習哪些題目)
    - [x] 做題答對時有scale動畫
- 其它
  - [x] 黑夜模式
  - [ ] 歷史記錄

## How to Run?

```shell
git clone https://github.com/lucashsu95/custom-training
```

```shell
pnpm i
```

**沒有pnpm?**
```shell
npm install -g pnpm 
```

```shell
pnpm dev
```



## **Libary**

- React
- React-dom
- Shadcn/ui
- Tailwindcss