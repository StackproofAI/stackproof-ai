import numpy as np, json
from PIL import Image, ImageDraw
im=np.array(Image.open('/root/.claude/uploads/28aae00c-ccca-546e-9b52-203858e5f532/0280e921-image.png').convert('RGB')).astype(int)
G=im[:,:,1]
lime=(G>128)&(im[:,:,2]<140)
steel=(G>70)&(G<=200)&(im[:,:,2]>=100)
dark=G<70
CX=768.0
def rpoly(V,R):
    """rounded polygon -> list of segments: ('L',pt) / ('A',r,sweep,pt) starting point, plus sampled points"""
    n=len(V); V=[np.array(v,float) for v in V]; cmds=[]; pts=[]
    tp=[]
    for i in range(n):
        p,c,q=V[i-1],V[i],V[(i+1)%n]
        u=(p-c)/np.linalg.norm(p-c); w=(q-c)/np.linalg.norm(q-c)
        ang=np.arccos(np.clip(u@w,-1,1)); r=R[i]
        d=r/np.tan(ang/2) if r>0 else 0
        a,b=c+u*d,c+w*d
        cross=(c-p)[0]*(q-c)[1]-(c-p)[1]*(q-c)[0]
        sweep=1 if cross>0 else 0
        tp.append((a,b,r,sweep,c,u,w,ang))
    start=tp[0][1]; cmds.append(('M',start)); 
    for i in list(range(1,n))+[0]:
        a,b,r,sw,c,u,w,ang=tp[i]
        cmds.append(('L',a))
        if r>0:
            cmds.append(('A',r,sw,b))
            # sample arc: center along bisector
            bis=(u+w)/np.linalg.norm(u+w); h=r/np.sin(ang/2); cc=c+bis*h
            a0=np.arctan2(*(a-cc)[::-1]); a1=np.arctan2(*(b-cc)[::-1])
            da=(a1-a0+np.pi)%(2*np.pi)-np.pi
            for t in np.linspace(0,1,16): pts.append(cc+r*np.array([np.cos(a0+da*t),np.sin(a0+da*t)]))
        else: pts.append(a)
    return cmds,pts
def raster(pts,shape=(1024,1536),ss=1):
    img=Image.new('L',(shape[1]*ss,shape[0]*ss),0); ImageDraw.Draw(img).polygon([(x*ss,y*ss) for x,y in pts],fill=1)
    if ss>1: img=img.resize((shape[1],shape[0]),Image.BOX)
    return np.array(img)>0 if ss==1 else np.array(img)>=0.5
def band_V(ya,s,L,t,rin,rout):
    th=np.arctan(s); c,sn=np.cos(th),np.sin(th)
    el=np.array([CX-L,ya-L*s]); er=np.array([CX+L,ya-L*s])
    uL=np.array([-c,-sn]); uR=np.array([c,-sn])   # outward along arms
    nTL=np.array([sn,-c]); nTR=np.array([-sn,-c])
    V=[el+uL*t+nTL*t, [CX,ya-t/c], er+uR*t+nTR*t, er+uR*t-nTR*t, [CX,ya+t/c], el+uL*t-nTL*t]
    return V,[t,rin,t,t,rout,t]
def band(p): V,R=band_V(*p); return rpoly(V,R)
def rhomb(p):
    cy,hw,hh,rs,rt=p; return rpoly([(CX-hw,cy),(CX,cy-hh),(CX+hw,cy),(CX,cy+hh)],[rs,rt,rs,rt])
def check(p):
    x1,y1,x2,y2,x3,y3,w,e,rc,rin,rout=p
    A,B,C=np.array([x1,y1]),np.array([x2,y2]),np.array([x3,y3])
    u1=(B-A)/np.linalg.norm(B-A); u2=(C-B)/np.linalg.norm(C-B)
    nu=lambda u: np.array([u[1],-u[0]]); n1,n2=nu(u1),nu(u2)
    p1=A+n1*w; p2=B+n2*w; t=np.linalg.solve(np.array([u1,-u2]).T,p2-p1)[0]; inner=p1+u1*t
    q1=A-n1*w; q2=B-n2*w; t=np.linalg.solve(np.array([u1,-u2]).T,q2-q1)[0]; outer=q1+u1*t
    Ae=A-u1*e; Ce=C+u2*e
    V=[Ae+n1*w, inner, Ce+n2*w, Ce-n2*w, outer, Ae-n1*w]
    return rpoly(V,[rc,rin,rc,rc,rout,rc])
def iou(a,b): return (a&b).sum()/(a|b).sum()
def opt(gen,p,steps,target,iters=7):
    f=lambda q: iou(raster(gen(q)[1]),target)
    best=f(p)
    for it in range(iters):
        for i in range(len(p)):
            for sgn in (1,-1):
                while True:
                    q=list(p); q[i]+=sgn*steps[i]
                    try: v=f(q)
                    except Exception: break
                    if v>best: best,p=v,q
                    else: break
        steps=[s/2 for s in steps]
    return p,best
Y=np.arange(1024)[:,None]; X=np.arange(1536)[None,:]
res={}
st=steel.copy(); st[:430]=False; st[700:]=False
res['steel'],v=opt(band,[628,0.42,330,50,10,57],[3,.01,6,3,6,6],st); print('steel',np.round(res['steel'],2),v)
lb=lime.copy(); lb[:560]=False
res['bot'],v=opt(band,[774,0.42,335,48,10,59],[3,.01,6,3,6,6],lb); print('bot',np.round(res['bot'],2),v)
chk_region=(Y>255)&(Y<450)&(X>585)&(X<950)
lt=lime.copy(); lt[540:]=False; lt|=dark&chk_region
res['top'],v=opt(rhomb,[351,330,155,40,30],[3,6,6,5,5],lt); print('top',np.round(res['top'],2),v)
dk=dark&chk_region
res['check'],v=opt(check,[642,342,746,403,908,295,31,25,15,2,20],[4,4,4,4,4,4,2,4,4,3,4],dk); print('check',np.round(res['check'],2),v)
json.dump({k:[float(x) for x in v] for k,v in res.items()},open('fit2.json','w'))
