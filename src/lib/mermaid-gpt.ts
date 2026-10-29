import mermaid from 'mermaid';
import elkLayouts from '@mermaid-js/layout-elk';
import { PaletteKey, PALETTES, ThemeColors } from './types';

let isLayoutRegistered = false;

export function ensureElkRegistered() {
  if (typeof window !== 'undefined' && !isLayoutRegistered) {
    try {
      mermaid.registerLayoutLoaders(elkLayouts);
      isLayoutRegistered = true;
    } catch (e) {
      console.warn('ELK layouts already registered or failed:', e);
    }
  }
}

/**
 * ChatGPT 风格的语法自愈器：
 * 修复 LLM 常见生成的未转义括号、竖线等问题，避免 Mermaid 直接崩溃
 */
export function healMermaidSyntax(rawCode: string): string {
  if (!rawCode || typeof rawCode !== 'string') return '';

  return rawCode
    // 修复 A[文本 (备注)] 变成 A["文本 (备注)"]
    .replace(/(\b[A-Za-z0-9_.-]+)\[([^\]\n]*)\]/g, (match, id, text) => {
      const trimmed = text.trim();
      if (
        (trimmed.includes('(') || trimmed.includes(')') || trimmed.includes('|') || trimmed.includes(':')) &&
        !trimmed.startsWith('"') &&
        !trimmed.endsWith('"')
      ) {
        return `${id}["${trimmed.replace(/"/g, '\\"')}"]`;
      }
      return match;
    })
    // 修复 A{条件 (分支)} 变成 A{"条件 (分支)"}
    .replace(/(\b[A-Za-z0-9_.-]+)\{([^}\n]*)\}/g, (match, id, text) => {
      const trimmed = text.trim();
      if (
        (trimmed.includes('(') || trimmed.includes(')') || trimmed.includes('|') || trimmed.includes(':')) &&
        !trimmed.startsWith('"') &&
        !trimmed.endsWith('"')
      ) {
        return `${id}{"${trimmed.replace(/"/g, '\\"')} "}`;
      }
      return match;
    });
}

/**
 * 转换 SVG 箭头为 ChatGPT 客户端的极简 Open Chevron 线条箭头
 */
export function prettifySvgArrowheads(container: Element, colors: ThemeColors) {
  const o = 4.5 / Math.SQRT2;
  const s = 4 - o;

  const markers = container.querySelectorAll<SVGMarkerElement>(
    'marker[id$="-pointEnd"], marker[id*="-pointEnd_"], marker[id$="-pointStart"], marker[id*="-pointStart_"]'
  );

  markers.forEach((marker) => {
    marker.setAttribute('viewBox', '-5 -5 10 10');
    marker.setAttribute('markerWidth', '9');
    marker.setAttribute('markerHeight', '9');
    marker.setAttribute('refX', '0');
    marker.setAttribute('refY', '0');

    const paths = marker.querySelectorAll('path');
    paths.forEach((path) => {
      path.style.fill = 'none';
      path.style.stroke = colors.line;
      path.style.strokeWidth = '1.25px';
      path.style.strokeLinecap = 'round';
      path.style.strokeLinejoin = 'round';

      if (marker.id.includes('pointEnd')) {
        path.setAttribute('d', `M 0 0 L 4 0 M ${s.toFixed(2)} ${(-o).toFixed(2)} L 4 0 L ${s.toFixed(2)} ${o.toFixed(2)}`);
      } else {
        path.setAttribute('d', `M 0 0 L -4 0 M ${(-s).toFixed(2)} ${(-o).toFixed(2)} L -4 0 L ${(-s).toFixed(2)} ${o.toFixed(2)}`);
      }
    });
  });

  // 增强菱形判定节点为 ChatGPT 式的微虚线质感
  container.querySelectorAll('.node.decision polygon, .node polygon').forEach((poly) => {
    (poly as SVGPolygonElement).style.strokeDasharray = '3 3';
    (poly as SVGPolygonElement).style.stroke = colors.labelBorder;
  });
}

/**
 * 初始化并配置 Mermaid
 */
export function configureMermaid(paletteKey: PaletteKey, isDark: boolean) {
  ensureElkRegistered();

  const palette = PALETTES[paletteKey] ?? PALETTES.blue;
  const colors = isDark ? palette.dark : palette.light;

  const themeCSS = `
    /* 统一现代无衬线字体栈 */
    .node text {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
      font-size: 13.5px !important;
      font-weight: 600 !important;
      letter-spacing: normal !important;
      fill: ${colors.text} !important;
    }
    .edgeLabels text {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
      font-size: 12.5px !important;
      font-weight: 600 !important;
      letter-spacing: -0.05px !important;
      fill: ${colors.text} !important;
    }
    .node tspan[font-weight="normal"],
    .edgeLabels tspan[font-weight="normal"] {
      font-weight: 600 !important;
    }

    /* 连线文字 Badge 胶囊药丸效果 */
    .edgeLabel .label rect {
      rx: 13px !important;
      ry: 13px !important;
      fill: ${colors.decision} !important;
      stroke: ${colors.labelBorder} !important;
      stroke-width: 1px !important;
      opacity: 0.98 !important;
    }

    /* 现代大圆角节点 */
    .node rect {
      rx: 15px !important;
      ry: 15px !important;
      fill: ${colors.node} !important;
      stroke: ${colors.labelBorder} !important;
      stroke-width: 1px !important;
    }

    .node circle,
    .node ellipse,
    .node polygon,
    .node path {
      fill: ${colors.node} !important;
      stroke: ${colors.labelBorder} !important;
      stroke-width: 1px !important;
    }

    /* 关系连线极细圆角微光 */
    .edgePaths .flowchart-link {
      stroke: ${colors.line} !important;
      stroke-width: 1.25px !important;
      stroke-linecap: round !important;
      stroke-linejoin: round !important;
    }

    /* 时序图 Lifeline 优化 */
    .actor {
      rx: 12px !important;
      ry: 12px !important;
      fill: ${colors.node} !important;
      stroke: ${colors.labelBorder} !important;
    }
    .actor-line {
      stroke: ${colors.line} !important;
      stroke-width: 1px !important;
      stroke-dasharray: 4 4 !important;
    }
    .messageLine0, .messageLine1 {
      stroke: ${colors.line} !important;
      stroke-width: 1.2px !important;
    }
    .messageText {
      fill: ${colors.text} !important;
      font-size: 13px !important;
      font-weight: 600 !important;
    }
    .labelBox {
      rx: 8px !important;
      ry: 8px !important;
      fill: ${colors.decision} !important;
      stroke: ${colors.labelBorder} !important;
    }
    .loopText, .loopText > tspan {
      fill: ${colors.text} !important;
      font-weight: 600 !important;
    }
  `;

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    suppressErrorRendering: true,
    theme: 'base',
    layout: 'elk',
    themeCSS,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    themeVariables: {
      darkMode: isDark,
      background: 'transparent',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '14px',
      primaryColor: colors.node,
      primaryTextColor: colors.text,
      primaryBorderColor: colors.labelBorder,
      lineColor: colors.line,
      secondaryColor: colors.decision,
      tertiaryColor: colors.decision,
      nodeBorder: colors.labelBorder,
      nodeTextColor: colors.text,
      mainBkg: colors.node,
      edgeLabelBackground: colors.decision,
      clusterBkg: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
      clusterBorder: colors.line,
      actorBkg: colors.node,
      actorBorder: colors.labelBorder,
      actorTextColor: colors.text,
      actorLineColor: colors.line,
      signalColor: colors.line,
      signalTextColor: colors.text,
      labelBoxBkgColor: colors.decision,
      labelBoxBorderColor: colors.labelBorder,
      labelTextColor: colors.text,
      loopTextColor: colors.text,
    },
    flowchart: { useMaxWidth: false, curve: 'basis' },
    sequence: { useMaxWidth: false },
  });

  return colors;
}

/**
 * 导出 SVG 到本地文件
 */
export function downloadSvg(svgElement: SVGElement, filename = 'mermaid-chart.svg') {
  const clonedSvg = svgElement.cloneNode(true) as SVGElement;
  
  // 确保命名空间存在
  if (!clonedSvg.getAttribute('xmlns')) {
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  if (!clonedSvg.getAttribute('xmlns:xlink')) {
    clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  }

  // 保证样式内联被序列化
  const svgString = new XMLSerializer().serializeToString(clonedSvg);
  const blob = new Blob([`<?xml version="1.0" standalone="no"?>\r\n`, svgString], {
    type: 'image/svg+xml;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 导出 PNG 到本地文件
 */
export async function downloadPng(svgElement: SVGElement, filename = 'mermaid-chart.png', scale = 2) {
  const clonedSvg = svgElement.cloneNode(true) as SVGElement;
  if (!clonedSvg.getAttribute('xmlns')) {
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }

  const svgString = new XMLSerializer().serializeToString(clonedSvg);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const URLObj = window.URL || window.webkitURL || window;
  const blobURL = URLObj.createObjectURL(svgBlob);

  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    const bbox = svgElement.getBoundingClientRect();
    const width = (bbox.width || 800) * scale;
    const height = (bbox.height || 600) * scale;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(scale, scale);
    ctx.drawImage(image, 0, 0, bbox.width || 800, bbox.height || 600);

    const pngUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URLObj.revokeObjectURL(blobURL);
  };
  image.src = blobURL;
}
