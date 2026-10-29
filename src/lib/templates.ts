export interface TemplateItem {
  name: string;
  desc: string;
  code: string;
}

export const TEMPLATES: TemplateItem[] = [
  {
    name: '服务架构与决策流程',
    desc: '展示典型网关、鉴权以及分支业务链路',
    code: `flowchart TD
    Client[客户端请求] --> Gateway[API 网关路由]
    Gateway --> Auth{鉴权校验}
    
    Auth -- 鉴权成功 --> CacheCheck{缓存命中?}
    Auth -- 鉴权失败 --> Err401[返回 401 Unauthorized]
    
    CacheCheck -- 命中缓存 --> FastResp[直接返回数据]
    CacheCheck -- 未命中 --> CoreService[执行核心业务逻辑]
    
    CoreService --> DB[(主数据库持久化)]
    CoreService --> Redis[(更新缓存集群)]
    CoreService --> Done[响应客户端 200 OK]`,
  },
  {
    name: 'AI Agent 执行状态机',
    desc: '思考、规划、执行工具与反思循环',
    code: `flowchart TD
    UserQuery[用户提出复杂需求] --> IntentParse[意图拆解与规划]
    IntentParse --> ToolCall{需要调用外部工具?}
    
    ToolCall -- 是 --> ExecTool[执行 MCP / API 工具]
    ToolCall -- 否 --> GenAnswer[生成初始答复]
    
    ExecTool --> InspectResult{调用结果符合预期?}
    InspectResult -- 存在异常 --> SelfHeal[触发自愈与重试机制]
    SelfHeal --> ExecTool
    
    InspectResult -- 正常 --> GenAnswer
    GenAnswer --> Review{反思评估质量}
    Review -- 需进一步修正 --> IntentParse
    Review -- 质量通过 --> Deliver[最终交付给用户]`,
  },
  {
    name: '跨部门协作与审批流',
    desc: '展示横向多层级节点与流转判断',
    code: `flowchart LR
    Submit[员工提交项目立项] --> PMReview[项目负责人初审]
    PMReview --> BudgetCheck{预算 > 50 万元?}
    
    BudgetCheck -- 是 --> VPApproval[分管 VP 特批]
    BudgetCheck -- 否 --> FinanceReview[财务合规审核]
    
    VPApproval --> FinanceReview
    FinanceReview --> LegalReview[法务合同归档]
    LegalReview --> ProjectKickoff[项目正式启动]`,
  },
  {
    name: '时序交互 (Sequence)',
    desc: '展示微服务时序图与生命周期',
    code: `sequenceDiagram
    autonumber
    actor User as 用户终端
    participant Web as Next.js Web 前端
    participant API as 后端 API 网关
    participant LLM as AI 大模型服务

    User->>Web: 输入并提交自然语言 Prompt
    Web->>API: 转发流式会话请求
    activate API
    API->>LLM: 构造上下文并请求推理
    activate LLM
    LLM-->>API: SSE 实时分块吐出 Tokens
    API-->>Web: 推送 Mermaid 语法块
    deactivate LLM
    Web->>Web: 客户端实时解析并自愈语法
    Web-->>User: 渲染精美 ChatGPT 风格图表
    deactivate API`,
  },
];
