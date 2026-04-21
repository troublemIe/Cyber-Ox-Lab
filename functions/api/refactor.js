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

function normalizeBaseUrl(baseUrl) {
  if (typeof baseUrl !== 'string' || !baseUrl.trim()) {
    return 'https://api.deepseek.com/v1'
  }
  return baseUrl.replace(/\/$/, '')
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function onRequestPost(context) {
  const { request, env } = context
  const deepseekKey = env.DEEPSEEK_KEY || env.DEEPSEEK_API_KEY

  if (!deepseekKey) {
    return jsonResponse(
      { error: 'Missing DeepSeek key: set DEEPSEEK_KEY or DEEPSEEK_API_KEY in Cloudflare Pages env.' },
      500,
    )
  }

  const payload = await request.json().catch(() => null)
  if (!payload?.text || typeof payload.text !== 'string') {
    return jsonResponse({ error: 'Invalid payload: `text` is required.' }, 400)
  }

  const mode = typeof payload.mode === 'string' ? payload.mode : '平级对齐'
  const modeGuide = {
    向上管理: '面向上级，强调风险识别、资源协同与目标对齐。',
    平级对齐: '面向同级，强调协作节奏、信息同步与共识推进。',
    向下兼容: '面向执行层，强调任务拆解、优先级与执行确定性。',
  }

  const systemPrompt =
    '你是资深中文职场表达润色助手。请把输入改写为更专业、礼貌、委婉的表达，保留事实，不要编造。输出仅返回改写结果。'

  const baseUrl = normalizeBaseUrl(env.DEEPSEEK_BASE_URL)
  const targetUrl = `${baseUrl}/chat/completions`

  const deepseekResponse = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${deepseekKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `模式：${mode}\n模式要求：${modeGuide[mode] || modeGuide['平级对齐']}\n原句：${payload.text}`,
        },
      ],
    }),
  })

  if (!deepseekResponse.ok) {
    const detail = await deepseekResponse.text()
    return jsonResponse(
      {
        error: 'DeepSeek request failed',
        detail: detail.slice(0, 600),
      },
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
