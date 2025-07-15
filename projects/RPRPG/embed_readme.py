import os
import markdown

README_MD = 'README.md'
INDEX_HTML = 'index.html'
README_START = '<!-- README_START -->'
README_END = '<!-- README_END -->'

with open(README_MD, 'r', encoding='utf-8') as f:
    md_content = f.read()
html_content = markdown.markdown(md_content)

with open(INDEX_HTML, 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find(README_START)
end = html.find(README_END, start)

if start == -1 or end == -1:
    raise RuntimeError('README markers not found in index.html')

new_html = html[:start + len(README_START)] + '\n' + html_content + '\n' + html[end:]

with open(INDEX_HTML, 'w', encoding='utf-8') as f:
    f.write(new_html)

if os.path.exists('README.html'):
    os.remove('README.html')
