'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { PaletteKey, PALETTES } from '@/lib/types';
import {
  configureMermaid,
  downloadSvg,
  downloadPng,
  healMermaidSyntax,
  prettifySvgArrowheads,
} from '@/lib/mermaid-gpt';
import {
  Download,
  Image as ImageIcon,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RefreshCw,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface PreviewProps {
  code: string;
  palette: PaletteKey;
  isDark: boolean;
}

export const Preview: React.FC<PreviewProps> = ({ code, palette, isDark }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const colors = PALETTES[palette][isDark ? 'dark' : 'light'];

  const renderChart = useCallback(async () => {
    if (!code || !code.trim()) {
      setSvgHtml('');
      setError(null);
      return;
    }

    setIsRendering(true);
    setError(null);

    const themeColors = configureMermaid(palette, isDark);
    const uniqueId = `mermaid-canvas-${Math.random().toString(36).substring(2, 9)}`;

    try {
      // 1. 先尝试直接渲染
      const { svg } = await mermaid.render(uniqueId, code);
      setSvgHtml(svg);
    } catch (primaryErr: any) {
      // 2. 失败后尝试自愈
      try {
        const healed = healMermaidSyntax(code);
        if (healed !== code) {
          const { svg } = await mermaid.render(`${uniqueId}-healed`, healed);
          setSvgHtml(svg);
          setError(null);
          return;
        }
        throw primaryErr;
      } catch (finalErr: any) {
        console.warn('Mermaid render error:', finalErr);
        setError(finalErr.message || '语法解析错误，请检查 Mermaid 代码结构');
      }
    } finally {
      setIsRendering(false);
    }
  }, [code, palette, isDark]);

  useEffect(() => {
    renderChart();
  }, [renderChart]);

  // SVG 挂载后，进行后置样式处理（Open Chevron 箭头、平滑圆角等）
  useEffect(() => {
    if (!containerRef.current || !svgHtml) return;

    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    // 清理内联固定宽高，保证响应式
    svgElement.removeAttribute('height');
    svgElement.style.maxWidth = '100%';
    svgElement.style.height = 'auto';

    // 转换箭头为 ChatGPT 客户端线条箭头
    prettifySvgArrowheads(containerRef.current, colors);
  }, [svgHtml, colors]);

  const handleDownloadSvg = () => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;
    downloadSvg(svgEl, `chatgpt-mermaid-${palette}.svg`);
  };

  const handleDownloadPng = async () => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;
    await downloadPng(svgEl, `chatgpt-mermaid-${palette}.png`, 2.5);
  };

  const handleCopySvg = async () => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;
    try {
      const serialized = new XMLSerializer().serializeToString(svgEl);
      await navigator.clipboard.writeText(serialized);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      className={`flex flex-col h-full bg-white dark:bg-zinc-950 transition-all ${
        isFullscreen ? 'fixed inset-0 z-50' : 'relative'
      }`}
    >
      {/* 预览区顶栏工具条 */}
      <div className="h-10 px-3 border-b border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between bg-white dark:bg-zinc-900/60 shrink-0">
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            预览效果 (ChatGPT 渲染规范)
          </span>
          {isRendering && (
            <span className="flex items-center gap-1 text-[11px] text-zinc-400">
              <RefreshCw className="w-3 h-3 animate-spin" />
              渲染中
            </span>
          )}
        </div>

        {/* 缩放与操作按钮 */}
        <div className="flex items-center gap-1.5">
          {/* 缩放按钮 */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 rounded p-0.5 text-zinc-500 dark:text-zinc-400">
            <button
              onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.15).toFixed(2))))}
              className="p-1 hover:text-zinc-900 dark:hover:text-zinc-100 rounded"
              title="缩小"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="px-1.5 text-[11px] font-mono hover:text-zinc-900 dark:hover:text-zinc-100"
              title="重置 100%"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.15).toFixed(2))))}
              className="p-1 hover:text-zinc-900 dark:hover:text-zinc-100 rounded"
              title="放大"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

          {/* 复制 SVG 代码 */}
          <button
            onClick={handleCopySvg}
            disabled={!svgHtml}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors disabled:opacity-40"
            title="复制 SVG 源码到剪贴板"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? '已复制 SVG' : '复制 SVG'}</span>
          </button>

          {/* 下载 PNG */}
          <button
            onClick={handleDownloadPng}
            disabled={!svgHtml}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors disabled:opacity-40"
            title="导出高清 PNG 图片"
          >
            <ImageIcon className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden sm:inline">PNG</span>
          </button>

          {/* 下载 SVG (重点行动点) */}
          <button
            onClick={handleDownloadSvg}
            disabled={!svgHtml}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 rounded-lg shadow-xs transition-all disabled:opacity-40"
            title="下载矢量 SVG 文件"
          >
            <Download className="w-3.5 h-3.5" />
            <span>下载 SVG</span>
          </button>

          {/* 全屏切换 */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ml-1"
            title={isFullscreen ? '退出全屏' : '全屏查看'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 渲染画布区域 */}
      <div
        className="flex-1 overflow-auto relative p-8 flex items-center justify-center transition-colors bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px]"
        style={{
          backgroundColor: isDark ? colors.canvas : colors.canvas,
        }}
      >
        {error ? (
          <div className="max-w-md p-4 bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-start gap-3 text-rose-800 dark:text-rose-200 text-xs shadow-sm">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold mb-1">图表语法解析失败</div>
              <div className="text-rose-600 dark:text-rose-300 font-mono text-[11px] whitespace-pre-wrap break-all">
                {error}
              </div>
              <div className="mt-2 text-[11px] text-rose-500 dark:text-rose-400">
                💡 提示：可尝试点击左侧编辑栏顶部的 “自愈修复” 自动处理未转义符号。
              </div>
            </div>
          </div>
        ) : (
          <div
            ref={containerRef}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
            }}
            className="w-full flex items-center justify-center select-none"
            dangerouslySetInnerHTML={{ __html: svgHtml }}
          />
        )}
      </div>
    </div>
  );
};
