'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Editor } from '@/components/Editor';
import { Preview } from '@/components/Preview';
import { PaletteKey } from '@/lib/types';
import { TEMPLATES } from '@/lib/templates';

export default function Home() {
  const [code, setCode] = useState<string>(TEMPLATES[0].code);
  const [palette, setPalette] = useState<PaletteKey>('blue');
  const [isDark, setIsDark] = useState<boolean>(false);

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${isDark ? 'dark' : ''}`}>
      {/* 顶栏控制中心 */}
      <Header
        palette={palette}
        setPalette={setPalette}
        isDark={isDark}
        setIsDark={setIsDark}
        onSelectTemplate={(newCode) => setCode(newCode)}
      />

      {/* 主工作区：左侧编辑器 + 右侧 ChatGPT 风格实时预览 */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* 左侧代码编辑 */}
        <section className="w-full md:w-[42%] lg:w-[38%] h-1/2 md:h-full shrink-0">
          <Editor
            code={code}
            onChange={setCode}
            onReset={() => setCode(TEMPLATES[0].code)}
          />
        </section>

        {/* 右侧实时渲染与 SVG 导出 */}
        <section className="w-full md:w-[58%] lg:w-[62%] h-1/2 md:h-full">
          <Preview code={code} palette={palette} isDark={isDark} />
        </section>
      </main>
    </div>
  );
}
