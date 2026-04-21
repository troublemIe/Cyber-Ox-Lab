const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  })
}

async function handleRefactor(request, env) {
  if (!env.DEEPSEEK_API_KEY) {
    return jsonResponse({ error: 'Missing DEEPSEEK_API_KEY in Cloudflare env.' }, 500)
  }

  const body = await request.json().catch(() => null)
  if (!body?.text || typeof body.text !== 'string') {
    return jsonResponse({ error: 'Invalid payload, `text` is required.' }, 400)
  }

  const mode = typeof body.mode === 'string' ? body.mode : '平级对齐'
  const baseUrl = env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1'
  const target = `${baseUrl.replace(/\/$/, '')}/chat/completions`

  const systemPrompt =
    '你是资深中文职场表达润色助手。请把输入改写为更专业、礼貌、委婉的表达，保留事实，不要编造。输出只给改写后的单段中文句子。'

  const modeGuide = {
    向上管理: '面向上级，强调风险识别、资源协同、目标对齐。',
    平级对齐: '面向同级，强调协作节奏、信息同步、共同交付。',
    向下兼容: '面向执行层，强调拆解清晰、优先级明确、可执行性。',
  }

  const deepseekResponse = await fetch(target, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `模式：${mode}\n模式要求：${modeGuide[mode] || modeGuide['平级对齐']}\n原句：${body.text}`,
        },
      ],
    }),
  })

  if (!deepseekResponse.ok) {
    const detail = await deepseekResponse.text()
    return jsonResponse(
      { error: 'DeepSeek request failed', detail: detail.slice(0, 600) },
      deepseekResponse.status,
    )
  }

  const data = await deepseekResponse.json()
  const result = data?.choices?.[0]?.message?.content?.trim()

  if (!result) {
    return jsonResponse({ error: 'Empty response from DeepSeek.' }, 502)
  }

  return jsonResponse({ result })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    if (request.method === 'POST' && url.pathname === '/api/refactor') {
      return handleRefactor(request, env)
    }

    return jsonResponse({ error: 'Not Found' }, 404)
  },
}
