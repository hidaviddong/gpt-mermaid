'use client';

import React from 'react';
import { PaletteKey, PALETTES } from '@/lib/types';
import { TEMPLATES } from '@/lib/templates';
import { Moon, Sun, Sparkles, FileCode, Check } from 'lucide-react';

interface HeaderProps {
  palette: PaletteKey;
  setPalette: (p: PaletteKey) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  onSelectTemplate: (code: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  palette,
  setPalette,
  isDark,
  setIsDark,
  onSelectTemplate,
}) => {
  const [templateOpen, setTemplateOpen] = React.useState(false);

  return (
    <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 flex items-center justify-between z-20 shrink-0">
      {/* 左侧 Logo 与标题 */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/20">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
              ChatGPT Mermaid Studio
            </span>
            <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/50">
              ELK Layout
            </span>
          </div>
        </div>
      </div>

      {/* 右侧工具栏 */}
      <div className="flex items-center gap-2.5">
        {/* 预设模板选择器 */}
        <div className="relative">
          <button
            onClick={() => setTemplateOpen(!templateOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800"
          >
            <FileCode className="w-3.5 h-3.5 text-zinc-400" />
            <span>范例模板</span>
          </button>

          {templateOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setTemplateOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-64 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl shadow-zinc-950/10 z-40">
                <div className="px-3 py-1.5 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                  选择预设流程模板
                </div>
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.name}
                    onClick={() => {
                      onSelectTemplate(tmpl.code);
                      setTemplateOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors flex flex-col gap-0.5"
                  >
                    <span className="font-medium text-zinc-900 dark:text-zinc-200">
                      {tmpl.name}
                    </span>
                    <span className="text-[11px] text-zinc-400 line-clamp-1">
                      {tmpl.desc}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 颜色主题选择器 (ChatGPT 调色板) */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800">
          {(Object.keys(PALETTES) as PaletteKey[]).map((key) => {
            const p = PALETTES[key];
            const isSelected = palette === key;
            return (
              <button
                key={key}
                onClick={() => setPalette(key)}
                title={p.name}
                className={`relative px-2 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: p.light.accent }}
                />
                <span className="hidden sm:inline text-[11px]">{p.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* 明暗模式切换 */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors"
          title={isDark ? '切换到浅色模式' : '切换到深色模式'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
        </button>
      </div>
    </header>
  );
};
