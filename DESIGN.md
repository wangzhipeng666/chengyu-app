---
version: alpha
name: chengyu-learning-app
description: 成语学习app设计系统 - 现代中式学习应用，温暖、专业、书卷气风格。以暖棕色系为品牌色，翠绿色为辅助色，营造传统书卷与现代学习相结合的视觉体验。

colors:
  # 品牌色
  primary: "#8B5E3C"
  primary-light: "#A67C5B"
  primary-dark: "#6B4423"
  primary-soft: "#F5EDE4"
  on-primary: "#FFFFFF"

  # 辅助色 - 翠绿 (学习/成长)
  accent: "#2D8B5E"
  accent-light: "#4AA67C"
  accent-dark: "#1A6B42"
  accent-soft: "#E8F5EE"

  # 背景色
  canvas: "#FDFBF7"
  canvas-warm: "#F8F4ED"
  canvas-card: "#FFFFFF"
  canvas-elevated: "#FFFFFF"

  # 边框色
  hairline: "#E8E2D9"
  hairline-light: "#F0EBE3"
  hairline-focus: "#8B5E3C"

  # 文字色
  ink: "#2C2416"
  ink-secondary: "#5A4E3C"
  ink-muted: "#8C7E6A"
  ink-light: "#A89B88"
  on-dark: "#FFFFFF"

  # 语义色
  success: "#2D8B5E"
  success-soft: "#E8F5EE"
  warning: "#D4A843"
  warning-soft: "#FDF6E3"
  error: "#C45B4A"
  error-soft: "#FDEAEA"

  # 装饰色
  gold: "#D4A843"
  gold-soft: "#FDF6E3"
  coral: "#E07B5A"
  coral-soft: "#FDEEE8"

typography:
  # 字体家族
  fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
  fontFamilySerif: "'Noto Serif SC', 'STSong', 'SimSun', serif"

  # 显示层级
  display-xl:
    fontFamily: "{typography.fontFamilySerif}"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 2px

  display-lg:
    fontFamily: "{typography.fontFamilySerif}"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 1px

  # 标题层级
  heading-1:
    fontFamily: "{typography.fontFamily}"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.4

  heading-2:
    fontFamily: "{typography.fontFamily}"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.4

  heading-3:
    fontFamily: "{typography.fontFamily}"
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.5

  # 正文层级
  body-lg:
    fontFamily: "{typography.fontFamily}"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6

  body-md:
    fontFamily: "{typography.fontFamily}"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6

  body-sm:
    fontFamily: "{typography.fontFamily}"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5

  # 辅助文字
  caption:
    fontFamily: "{typography.fontFamily}"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4

  label:
    fontFamily: "{typography.fontFamily}"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4

rounded:
  none: 0px
  sm: 6px
  md: 10px
  lg: 14px
  xl: 20px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  xxl: 24px
  xxxl: 32px
  huge: 48px

shadow:
  none: "none"
  sm: "0 1px 2px rgba(44, 36, 22, 0.05)"
  md: "0 2px 8px rgba(44, 36, 22, 0.08)"
  lg: "0 4px 16px rgba(44, 36, 22, 0.1)"
  xl: "0 8px 24px rgba(44, 36, 22, 0.12)"
  card: "0 2px 12px rgba(44, 36, 22, 0.06)"
  card-hover: "0 4px 20px rgba(44, 36, 22, 0.1)"

components:
  # 按钮样式
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 12px 24px
    shadow: "{shadow.sm}"
    hoverShadow: "{shadow.md}"

  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 12px 24px
    border: "1px solid {colors.primary}"

  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 8px 16px

  # 卡片样式
  card:
    backgroundColor: "{colors.canvas-card}"
    rounded: "{rounded.xl}"
    padding: 20px
    shadow: "{shadow.card}"
    border: "1px solid {colors.hairline-light}"

  card-featured:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xl}"
    padding: 20px
    shadow: "{shadow.md}"

  card-accent:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: 20px

  # 输入框样式
  input:
    backgroundColor: "{colors.canvas-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 12px 16px
    border: "1px solid {colors.hairline}"
    focusBorder: "{colors.primary}"

  # 导航样式
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    activeColor: "{colors.primary}"
    typography: "{typography.caption}"
    padding: 8px 12px

  # 标签样式
  tag:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: 4px 12px

  tag-success:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: 4px 12px

  tag-warning:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: 4px 12px

  tag-error:
    backgroundColor: "{colors.error-soft}"
    textColor: "{colors.error}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: 4px 12px

layout:
  maxWidth: "960px"
  paddingX: "16px"
  paddingXDesktop: "32px"
  sectionGap: "24px"
  sectionGapDesktop: "32px"
  cardGap: "12px"
  cardGapDesktop: "16px"

responsive:
  breakpoints:
    sm: "0px - 639px"
    md: "640px - 1023px"
    lg: "1024px+"
  mobile:
    maxWidth: "100%"
    navHeight: "56px"
    navPosition: "bottom"
    paddingX: "16px"
  desktop:
    maxWidth: "960px"
    navHeight: "64px"
    navPosition: "top"
    paddingX: "32px"

animation:
  transitionFast: "150ms ease"
  transitionNormal: "200ms ease"
  transitionSlow: "300ms ease"
  transitionSpring: "300ms cubic-bezier(0.34, 1.56, 0.64, 1)"
---

## Overview

成语学习app采用现代中式设计风格，融合传统书卷气与现代学习应用的简洁。以暖棕色为主品牌色，传达知识的厚重与温暖；翠绿色为辅助色，象征学习的成长与进步。

**Key Characteristics:**
- 温暖的米白色背景，营造舒适阅读环境
- 暖棕色品牌色系，体现传统文化底蕴
- 翠绿色点缀，象征学习成长
- 圆润的卡片设计，亲和力强
- 柔和的阴影层次，营造轻盈感

## Colors

### Brand
- **Primary** (`#8B5E3C`): 主品牌色，暖棕色，用于主要CTA和品牌标识
- **Primary Light** (`#A67C5B`): 浅暖棕，用于hover状态
- **Primary Dark** (`#6B4423`): 深暖棕，用于按下状态
- **Primary Soft** (`#F5EDE4`): 柔和暖棕背景

### Accent
- **Accent** (`#2D8B5E`): 辅助色，翠绿，用于成功状态和学习相关元素
- **Accent Light** (`#4AA67C`): 浅翠绿
- **Accent Soft** (`#E8F5EE`): 柔和翠绿背景

### Surface
- **Canvas** (`#FDFBF7`): 主背景，温暖米白
- **Canvas Warm** (`#F8F4ED`): 暖色调背景
- **Canvas Card** (`#FFFFFF`): 卡片背景

### Text
- **Ink** (`#2C2416`): 主要文字，深棕黑
- **Ink Secondary** (`#5A4E3C`): 次要文字
- **Ink Muted** (`#8C7E6A`): 辅助文字

### Semantic
- **Success** (`#2D8B5E`): 成功/正确
- **Warning** (`#D4A843`): 警告/提醒
- **Error** (`#C45B4A`): 错误/失败

## Typography

### Font Family
- **Primary**: Noto Sans SC (思源黑体) - 正文和UI
- **Serif**: Noto Serif SC (思源宋体) - 标题和强调

### Hierarchy

| Token | Size | Weight | Use |
|---|---|---|---|
| `{typography.display-xl}` | 36px | 700 | 页面大标题 |
| `{typography.display-lg}` | 28px | 600 | 区块标题 |
| `{typography.heading-1}` | 24px | 600 | 卡片标题 |
| `{typography.heading-2}` | 20px | 600 | 子标题 |
| `{typography.heading-3}` | 18px | 500 | 小节标题 |
| `{typography.body-lg}` | 16px | 400 | 正文大字 |
| `{typography.body-md}` | 15px | 400 | 默认正文 |
| `{typography.body-sm}` | 14px | 400 | 辅助正文 |
| `{typography.caption}` | 12px | 400 | 说明文字 |
| `{typography.label}` | 13px | 500 | 标签文字 |

## Layout

### Spacing System
- Base unit: 4px
- Section gap: 24px
- Card gap: 12px
- Content padding: 16px

### Container
- Max width: 960px (桌面端居中)
- Center aligned
- Horizontal padding: 16px (移动端) / 32px (桌面端)

### Responsive Breakpoints

| 断点 | 宽度 | 设备 | 布局 |
|------|------|------|------|
| `sm` | < 640px | 手机竖屏 | 单列，底部导航 |
| `md` | 640px - 1023px | 平板竖屏 | 单列，底部导航 |
| `lg` | ≥ 1024px | 桌面/平板横屏 | 多列，顶部导航 |

## Components

### Buttons
- Primary: 暖棕色背景，白色文字，圆角14px
- Secondary: 透明背景，暖棕色边框和文字
- Ghost: 透明背景，灰色文字

### Cards
- White background with subtle shadow
- Border radius: 20px
- Padding: 20px
- Hover: elevated shadow

### Navigation

#### 移动端（< 1024px）

- Fixed bottom navigation，高度 56px
- 5 tab items: 首页/练习/词典/错题本/收藏
- Active state: primary color with subtle background
- 练习页面隐藏底部导航
- 安全区域适配（env(safe-area-inset-bottom)）

#### 桌面端（≥ 1024px）

- Fixed top navigation，高度 64px
- 水平排列 5 个导航项，图标 + 文字
- 当前页面高亮：primary color + 背景色
- 练习页面保持顶部导航可见

## Do's and Don'ts

### Do
- 使用暖棕色系作为主色调
- 保持卡片圆润设计
- 使用柔和阴影营造层次
- 中文标题使用宋体风格

### Don't
- 不要使用纯黑色文字
- 不要使用尖锐的直角设计
- 不要使用过重的阴影
- 不要偏离温暖的品牌调性
