/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      /* ── 字體 ── */
      fontFamily: {
        sans: [
          '"PingFang TC"',
          '"Noto Sans TC"',
          '"Microsoft JhengHei"',
          '"Hiragino Sans"',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'sans-serif',
        ],
      },
      fontSize: {
        xs:        ['0.75rem',  { lineHeight: '1.5rem' }],
        sm:        ['0.875rem', { lineHeight: '1.4rem' }],
        base:      ['1rem',     { lineHeight: '1.7rem' }],     // CJK 需要比拉丁更多行高
        stem:      ['1.125rem', { lineHeight: '1.9rem' }],     // 題目本文（取代散落的 text-lg）
        'stem-lg': ['1.375rem', { lineHeight: '2.2rem' }],     // 單題模式（取代 text-xl/2xl）
        title:     ['1.5rem',   { lineHeight: '2rem' }],       // 頁面標題（取代 text-2xl）
        display:   ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
      },
      fontWeight: {
        normal:   '400',
        medium:   '500',
        semibold: '600',
        bold:     '600',  // 讓 font-bold 等同 font-semibold，避免散落的 700
      },

      /* ── 圓角（5 階） ── */
      borderRadius: {
        sm:   'calc(var(--radius) - 4px)',   // 4px
        md:   'calc(var(--radius) - 2px)',   // 6px
        lg:   'var(--radius)',               // 8px
        xl:   'calc(var(--radius) + 4px)',   // 12px
        '2xl':'calc(var(--radius) + 8px)',   // 16px
      },

      /* ── 陰影 ── */
      boxShadow: {
        subtle: '0 1px 2px 0 hsl(var(--shadow-color) / 0.06)',
        raised: '0 1px 3px 0 hsl(var(--shadow-color) / 0.08), 0 8px 24px -12px hsl(var(--shadow-color) / 0.12)',
      },

      /* ── 尺寸 token ── */
      maxWidth: {
        app: '72rem',  // 1152px，取代散落的 max-w-6xl / md:w-[750px] 等
      },
      height: {
        header: 'var(--header-h)',  // 56px
      },

      /* ── z-index 階梯 ── */
      zIndex: {
        header:  '40',
        overlay: '50',
        toast:   '60',
      },

      /* ── 顏色（保留既有 shadcn + 新增語意色） ── */
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        /* ── 新增語意色 ── */
        score: {
          good: 'hsl(var(--score-good))',
          warn: 'hsl(var(--score-warn))',
          bad:  'hsl(var(--score-bad))',
        },
        ans: {
          correct: 'hsl(var(--ans-correct))',
          wrong:   'hsl(var(--ans-wrong))',
          missed:  'hsl(var(--ans-missed))',
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('tailwindcss-motion'),
  ],
}
