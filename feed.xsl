<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title><xsl:value-of select="rss/channel/title"/> · RSS</title>
<style>
  :root { --bg:#fafafa; --fg:#1a1a1a; --muted:#6b7280; --accent:#2563eb; --card:#ffffff; --border:#e5e7eb; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#0a0a0a; --fg:#e5e7eb; --muted:#9ca3af; --accent:#60a5fa; --card:#141414; --border:#262626; }
  }
  * { box-sizing:border-box; }
  body { background:var(--bg); color:var(--fg); font-family:"Pretendard",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; line-height:1.7; margin:0; padding:0 20px; word-break:keep-all; }
  .wrap { max-width:720px; margin:0 auto; padding:48px 0; }
  .banner { background:var(--card); border:1px solid var(--border); border-radius:10px; padding:20px 24px; margin-bottom:32px; }
  .banner h1 { font-size:1.3rem; margin:0 0 10px; }
  .banner p { margin:8px 0; color:var(--muted); font-size:.95rem; }
  .banner code { display:inline-block; background:var(--bg); border:1px solid var(--border); border-radius:6px; padding:3px 9px; font-size:.88rem; word-break:break-all; color:var(--fg); }
  a { color:var(--accent); text-decoration:none; }
  a:hover { text-decoration:underline; }
  h2 { font-size:.82rem; color:var(--muted); font-weight:600; margin:32px 0 8px; text-transform:uppercase; letter-spacing:.04em; }
  .item { border-bottom:1px solid var(--border); padding:18px 0; }
  .item:last-child { border-bottom:none; }
  .item a.t { font-size:1.1rem; font-weight:600; }
  .item .date { color:var(--muted); font-size:.83rem; margin:5px 0; }
  .item .desc { color:var(--muted); font-size:.92rem; margin:6px 0 0; }
  .foot { margin-top:40px; color:var(--muted); font-size:.82rem; text-align:center; }
</style>
</head>
<body>
<div class="wrap">
  <div class="banner">
    <h1>📡 <xsl:value-of select="rss/channel/title"/> · RSS 피드</h1>
    <p>이 페이지는 <strong>RSS 피드</strong>입니다. 브라우저로는 이렇게 보이지만, 구독하려면 아래 주소를 RSS 리더(Feedly, Inoreader 등)에 추가하세요. 새 글이 올라오면 리더로 알림이 옵니다.</p>
    <p><code><xsl:value-of select="rss/channel/atom:link/@href"/></code></p>
    <p><a href="{rss/channel/link}">← 블로그로 돌아가기</a></p>
  </div>
  <h2>최근 글</h2>
  <xsl:for-each select="rss/channel/item">
    <div class="item">
      <a class="t" href="{link}"><xsl:value-of select="title"/></a>
      <div class="date"><xsl:value-of select="pubDate"/></div>
      <div class="desc"><xsl:value-of select="description"/></div>
    </div>
  </xsl:for-each>
  <div class="foot"><xsl:value-of select="rss/channel/description"/></div>
</div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
