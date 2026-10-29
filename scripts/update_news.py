#!/usr/bin/env python3
"""Fetch BTS headlines from Google News RSS; only trusted publisher domains are shown."""
import datetime as dt
import email.utils
import json
import pathlib
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

ROOT=pathlib.Path(__file__).resolve().parents[1]
QUERY='BTS OR Bangtan OR Jungkook OR Jimin OR "j-hope" OR "Kim Namjoon" when:7d'
FEED='https://news.google.com/rss/search?q='+urllib.parse.quote(QUERY)+'&hl=pt-BR&gl=BR&ceid=BR:pt-419'
ALLOWED=('billboard.com.br','billboard.com','rollingstone.com','rollingstone.com.br','gshow.globo.com','g1.globo.com','folha.uol.com.br','reuters.com','apnews.com','soompi.com','koreaherald.com','yonhapnews.co.kr','nme.com','theguardian.com')
def main():
    req=urllib.request.Request(FEED,headers={'User-Agent':'Mozilla/5.0 BTS-Fan-News/1.0'})
    with urllib.request.urlopen(req,timeout=25) as res:
        xml=res.read(2_000_000)
    feed=ET.fromstring(xml)
    now=dt.datetime.now(dt.timezone.utc)
    items=[]
    seen=set()
    for node in feed.findall('./channel/item'):
        title=(node.findtext('title') or '').strip()
        link=(node.findtext('link') or '').strip()
        source=node.find('source')
        source_name=(source.text or '').strip() if source is not None else ''
        source_url=source.attrib.get('url','') if source is not None else ''
        domain=(urllib.parse.urlparse(source_url).hostname or '').lower().removeprefix('www.')
        if not domain or not any(domain==a or domain.endswith('.'+a) for a in ALLOWED): continue
        if not re.search(r'\bBTS\b|bangtan|jungkook|jimin|j-hope|namjoon|taehyung|yoongi|seokjin|kim taehyung|kim seokjin',title,re.I):continue
        try: published=email.utils.parsedate_to_datetime(node.findtext('pubDate')).astimezone(dt.timezone.utc)
        except (ValueError,TypeError):continue
        if published>now or (now-published).days>7:continue
        if title in seen:continue
        seen.add(title)
        items.append({'title':title[:180],'url':link,'source':source_name[:50],'published':published.isoformat()})
    items.sort(key=lambda x:x['published'],reverse=True)
    if not items: raise RuntimeError('No trusted recent headlines: preserving existing news.json')
    path=ROOT/'news.json'
    path.write_text(json.dumps({'updatedAt':now.isoformat(),'items':items[:12]},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
if __name__=='__main__':main()
