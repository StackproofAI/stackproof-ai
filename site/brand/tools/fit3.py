exec(open('fit2.py').read().split('Y=np.arange')[0])
import json
Y=np.arange(1024)[:,None]; X=np.arange(1536)[None,:]
f1=json.load(open('fit.json'))
res={}
st=steel.copy(); st[:430]=False; st[700:]=False
_,ya,s,L,R,t=f1['steel']; res['steel'],v=opt(band,[ya,s,L,t,0,R+t],[2,.005,4,2,4,4],st); print('steel',np.round(res['steel'],2),v)
lb=lime.copy(); lb[:560]=False
_,ya,s,L,R,t=f1['bot']; res['bot'],v=opt(band,[ya,s,L,t,0,R+t],[2,.005,4,2,4,4],lb); print('bot',np.round(res['bot'],2),v)
chk_region=(Y>255)&(Y<450)&(X>585)&(X<950)
lt=lime.copy(); lt[540:]=False; lt|=dark&chk_region
_,cy,hw,hh,r=f1['top']; a=np.arctan(hh/hw)
res['top'],v=opt(rhomb,[cy,hw+r/np.sin(a),hh+r/np.cos(a),r,r],[2,4,4,4,4],lt); print('top',np.round(res['top'],2),v)
dk=dark&chk_region
x1,y1,x2,y2,x3,y3,w=f1['check']
res['check'],v=opt(check,[x1,y1,x2,y2,x3,y3,w,w,w,0.5,w],[3,3,3,3,3,3,2,3,3,3,3],dk); print('check',np.round(res['check'],2),v)
json.dump({k:[float(x) for x in v] for k,v in res.items()},open('fit2.json','w'))
