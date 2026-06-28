const rules = [
  { style: "y2k", terms: ["ai", "人工智能", "tool", "saas", "dashboard", "模型", "数据", "自动化"] },
  { style: "art-deco", terms: ["luxury", "hotel", "finance", "premium", "高端", "酒店", "金融", "奢侈"] },
  { style: "minimal", terms: ["wellness", "skin", "calm", "高端", "护肤", "生活方式", "极简"] },
  { style: "pop-art", terms: ["trend", "viral", "consumer", "新品", "爆款", "消费", "流行"] },
  { style: "constructivist", terms: ["manifesto", "行动", "宣言", "增长", "执行", "改变"] },
  { style: "new-typography", terms: ["research", "report", "paper", "研究", "报告", "摘要"] },
  { style: "brutalist", terms: ["warning", "truth", "别", "不要", "真相", "问题"] }
];

export function recommendStyle(text, fallback = "bauhaus") {
  const content = String(text || "").toLowerCase();
  let best = { style: fallback, score: 0 };
  for (const rule of rules) {
    const score = rule.terms.reduce((sum, term) => sum + (content.includes(term.toLowerCase()) ? 1 : 0), 0);
    if (score > best.score) best = { style: rule.style, score };
  }
  return best.style;
}
