import json,sys,numpy as np
sys.argv=['x']; exec(open('fit2.py').read().split('def iou')[0]); exec(open('check2.py').read())
f=json.load(open(sys.argv[0] if False else 'fit2.json'))
OX,OY=378,172
def d(cmds):
    s=''
    for c in cmds:
        if c[0] in 'ML': s+=f"{c[0]}{c[1][0]-OX:.1f} {c[1][1]-OY:.1f} "
        else: s+=f"A{c[1]:.1f} {c[1]:.1f} 0 0 {c[2]} {c[3][0]-OX:.1f} {c[3][1]-OY:.1f} "
    return s.strip()+'Z'
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 656" role="img" aria-label="Stackproof AI">
  <path id="layer-bottom" fill="#CEF949" d="{d(band(f['bot'])[0])}"/>
  <path id="layer-middle" fill="#75879A" d="{d(band(f['steel'])[0])}"/>
  <path id="layer-top" fill="#CEF949" d="{d(rhomb(f['top'])[0])}"/>
  <path id="check" fill="#040508" d="{d(check2(f['check2'])[0])}"/>
</svg>
'''
open('stackproof-mark-v2.svg','w').write(svg)
