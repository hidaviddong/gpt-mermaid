'use client';

import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Wand2, Terminal } from 'lucide-react';
import { healMermaidSyntax } from '@/lib/mermaid-gpt';

interface EditorProps {
  code: string;
  onChange: (val: string) => void;
  onReset: () => void;
}

export const Editor: React.FC<EditorProps> = ({ code, onChange, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [healedNotice, setHealedNotice] = useState(false);

  const lines = code.split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAutoHeal = () => {
    const fixed = healMermaidSyntax(code);
    if (fixed !== code) {
      onChange(fixed);
      setHealedNotice(true);
      setTimeout(() => setHealedNotice(false), 2500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
      {/* 编辑器顶栏 */}
      <div className="h-10 px-3 border-b border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between bg-white dark:bg-zinc-900/60 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            Mermaid 代码
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            {lines.length} 行
          </span>
        </div>

        <div className="flex items-center gap-1">
          {healedNotice && (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 transition-opacity">
              语法已修正 ✓
            </span>
          )}

          <button
            onClick={handleAutoHeal}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="自动修复括号与转义语法"
          >
            <Wand2 className="w-3 h-3 text-sky-500" />
            <span>自愈修复</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? '已复制' : '复制'}</span>
          </button>

          <button
            onClick={onReset}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="重置为默认"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 文本输入区域 + 行号 */}
      <div className="relative flex-1 flex overflow-hidden font-mono text-xs leading-relaxed">
        {/* 行号栏 */}
        <div className="w-10 py-3 select-none text-right pr-2 text-zinc-300 dark:text-zinc-700 bg-zinc-100/50 dark:bg-zinc-900/30 border-r border-zinc-200/50 dark:border-zinc-800/40 font-mono text-[11px] shrink-0">
          {lines.map((_, i) => (
            <div key={i} className="h-5">
              {i + 1}
            </div>
          ))}
        </div>

        {/* 核心编辑域 */}
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="flex-1 w-full h-full p-3 resize-none bg-transparent text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-0 font-mono text-xs leading-5 tracking-tight"
          placeholder="在此输入 Mermaid 代码，如:
flowchart TD
  A[开始] --> B{判断}
  B -- 是 --> C[结束]
  B -- 否 --> A"
        />
      </div>
    </div>
  );
};
