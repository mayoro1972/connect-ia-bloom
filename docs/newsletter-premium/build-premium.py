from pathlib import Path
from lxml import html, etree

base = Path(__file__).resolve().parent
source = base / 'newsletter-content.html'
root = html.fromstring(source.read_text())
for element in list(root.xpath('./style | ./script')):
    root.remove(element)
article = root.find('article')
article.remove(article.find('header'))
header = html.fromstring('''<header class="newspaper-header">
  <div class="edition-line"><span>Abidjan · Côte d’Ivoire</span><time datetime="2026-09-11">Vendredi 11 septembre 2026</time><span>Édition hebdomadaire</span></div>
  <div class="masthead"><div class="masthead-name">Transfer<em>AI</em> <span>Le Journal</span></div><div class="masthead-side">Les idées, les outils et les pratiques qui font avancer les métiers en Afrique.</div></div>
  <div class="masthead-caption"><span>Intelligence artificielle · Métiers · Souveraineté</span><span>Éducation &amp; EdTech IA</span></div>
</header>''')
article.insert(0, header)
content = article.find("div[@class='ta-content']")
for element in list(content)[:4]:
    content.remove(element)
hero = html.fromstring('''<section class="front-page">
  <div><p class="ta-kicker">Le dossier de la semaine / Formateurs professionnels</p><h1>Former mieux.<br><em>Protéger l’essentiel.</em></h1><p class="ta-intro">Du cours au quiz, l’IA peut enrichir vos formations. Notre méthode pour l’adapter aux réalités du terrain et garder la maîtrise de vos données.</p></div>
  <nav class="issue-menu" aria-label="Dans cette édition"><p>Dans cette édition</p><a href="#editorial"><span>01</span>L’éditorial de Marius AYORO</a><a href="#terrain"><span>02</span>Des solutions pour les formateurs</a><a href="#gouvernance"><span>03</span>Données, souveraineté &amp; ARTCI</a></nav>
</section>''')
content.insert(0, hero)
editorial = content.find("section[@class='ta-editorial']")
editorial.set('id','editorial')
prose = etree.Element('div', {'class':'editorial-prose'})
for element in list(editorial):
    prose.append(element)
figure = html.fromstring('''<figure class="founder-photo"><img src="https://www.transferai.ci/assets/team-marius-DLn2j3sv.jpg" width="200" height="242" alt="Marius AYORO, fondateur de TransferAI"><figcaption>Marius AYORO<span>Fondateur de TransferAI</span></figcaption></figure>''')
editorial.append(figure)
editorial.append(prose)
lead = content.find("div[@class='ta-lead']")
idx = content.index(lead)
feature = etree.Element('section', {'class':'feature-layout','id':'outil'})
content.insert(idx,feature)
feature.append(lead)
case = etree.Element('aside', {'class':'field-case'})
case.append(html.fromstring('<p class="ta-kicker">Le cas pratique</p>'))
for element in list(content)[idx+1:idx+4]:
    case.append(element)
feature.append(case)
solutions = content.xpath("section[@aria-label='Solutions aux difficultés du secteur']")[0]
solutions.set('id','terrain')
grid = etree.Element('div',{'class':'solutions-grid'})
for element in solutions.findall("div[@class='ta-solution']"):
    grid.append(element)
solutions.append(grid)
for section in content.findall('section'):
    heading = section.find('h2')
    if heading is not None:
        title = ''.join(heading.itertext())
        if title == 'Du support à l’exercice vérifié': section.set('class','ta-section ta-method')
        if title == 'À adapter à votre prochain cours': section.set('class','ta-section prompt-section')
        if title == 'Mesurez ce que vous gagnez vraiment': section.set('class','ta-section measure-section')
        if title == 'Un chapitre, un test, un cadre clair':
            section.set('class','ta-section closing-section')
            text = etree.Element('div')
            for el in list(section)[:-1]: text.append(el)
            section.insert(0,text)
gov = content.find("section[@class='ta-section ta-governance']")
gov.set('id','gouvernance')
banner = etree.Element('header',{'class':'governance-banner'})
heading_group = etree.Element('div')
for element in list(gov)[:2]: heading_group.append(element)
banner.append(heading_group)
banner.append(html.fromstring('<div class="governance-stamp">GOUVERNANCE<br>DES DONNÉES<br>AFRIQUE</div>'))
gov.insert(0,banner)
briefs = etree.Element('div',{'class':'governance-briefs'})
children = list(gov)
legal = etree.Element('div')
sovereign = etree.Element('div')
for el in children[2:5]: legal.append(el)
for el in children[5:7]: sovereign.append(el)
briefs.extend([legal,sovereign])
gov.insert(2,briefs)
serialized = html.tostring(root,encoding='unicode',method='html')
css = (base/'premium.css').read_text()
page = '<!doctype html>\n<html lang="fr-CI"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>TransferAI — Le Journal | 11 septembre 2026</title><style>'+css+'</style></head><body>'+serialized+'</body></html>'
(base/'newsletter-complete.html').write_text(page)
(base/'newsletter-premium.html').write_text(page)
print('Journal premium généré, contenu complet conservé.')
