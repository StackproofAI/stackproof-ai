exec(open('fit2.py').read().split('Y=np.arange')[0])
import json
Y=np.arange(1024)[:,None]; X=np.arange(1536)[None,:]
f=json.load(open('fit2.json'))
def loc_iou(gen,p,target,box):
    y0,y1,x0,x1=box; r=raster(gen(p)[1]); return iou(r[y0:y1,x0:x1],target[y0:y1,x0:x1])
st=steel.copy(); st[:430]=False; st[700:]=False
lb=lime.copy(); lb[:560]=False
for name,tg,box in [('steel',st,(500,620,660,876)),('bot',lb,(650,760,660,876))]:
    p=f[name]; best=None
    for rin in range(0,301,10):
        q=list(p); q[4]=rin; v=loc_iou(band,q,tg,box)
        if best is None or v>best[0]: best=(v,rin)
    print(name,'best rin',best); f[name][4]=best[1]
chk_region=(Y>255)&(Y<450)&(X>585)&(X<950); dk=dark&chk_region
p=f['check']; best=None
for e in range(5,35,3):
    for rc in range(6,32,2):
        q=list(p); q[7]=e; q[8]=rc
        try: v=loc_iou(check,q,dk,(255,450,585,950))
        except Exception: continue
        if best is None or v>best[0]: best=(v,e,rc)
print('check best',best); f['check'][7]=best[1]; f['check'][8]=best[2]
# polish check with other params free
p,v=opt(check,f['check'],[2,2,2,2,2,2,1,2,2,2,2],dk); print('check polished',np.round(p,2),v); f['check']=p
json.dump({k:[float(x) for x in v] for k,v in f.items()},open('fit2.json','w'))
