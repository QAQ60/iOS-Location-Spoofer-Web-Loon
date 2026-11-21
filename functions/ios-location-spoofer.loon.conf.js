/**
 * Loon 模块生成函数（与 sgmodule 生成同款逻辑）
 * 读取静态 .loon.conf 模板，替换域名与 token 后返回，
 * 让 Loon 用户拿到即开即用的远程脚本 + MITM 配置。
 */
export async function onRequestGet(context) {
  const { request, env } = context;

  const response = await env.ASSETS.fetch(request);
  if (!response.ok) {
    return new Response('Not found', { status: 404 });
  }

  let content = await response.text();

  const url = new URL(request.url);
  const host = request.headers.get('host') || url.host;
  const protocol = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');
  const tVal = url.searchParams.get('token') || '';

  content = content.replace(/你的域名/g, host);
  content = content.replace(/你的Token/g, tVal);

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
