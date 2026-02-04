import type { Metadata } from "next";
import { Bangers, ZCOOL_KuaiLe, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

// 配置字体 - 精确匹配 demo3.html
const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bangers",
  display: "swap",
});

const zcoolKuaiLe = ZCOOL_KuaiLe({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-zcool",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Double兔 - 七龙珠主题个人作品集",
  description: "VibeCoding 爱好者 | 用七龙珠的热情敲代码 | 极简主义信徒",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${bangers.variable} ${zcoolKuaiLe.variable} ${notoSansSC.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
