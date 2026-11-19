exec(open('fit2.py').read().split('Y=np.arange')[0])
import json
Y=np.arange(1024)[:,None]; X=np.arange(1536)[None,:]
f=json.load(open('fit2.json'))
def check2(p):
    x1,y1,x2,y2,x3,y3,w,xl,xr,rc,rin,rout=p
    A,B,C=np.array([x1,y1]),np.array([x2,y2]),np.array([x3,y3])
    u1=(B-A)/np.linalg.norm(B-A); u2=(C-B)/np.linalg.norm(C-B)
    nu=lambda u: np.array([u[1],-u[0]]); n1,n2=nu(u1),nu(u2)
    def isect(p1,d1,p2,d2): t=np.linalg.solve(np.array([d1,-d2]).T,p2-p1)[0]; return p1+d1*t
    inner=isect(A+n1*w,u1,B+n2*w,u2); outer=isect(A-n1*w,u1,B-n2*w,u2)
    vert=np.array([0.,1.])
    V=[isect(A+n1*w,u1,np.array([xl,0.]),vert), inner, isect(C+n2*w,u2,np.array([xr,0.]),vert),
       isect(C-n2*w,u2,np.array([xr,0.]),vert), outer, isect(A-n1*w,u1,np.array([xl,0.]),vert)]
    return rpoly(V,[rc,rin,rc,rc,rout,rc])
chk_region=(Y>255)&(Y<450)&(X>585)&(X<950); dk=dark&chk_region
c=f['check']
p0=c[:7]+[602,937,14,2,29]
p,v=opt(check2,p0,[2,2,2,2,2,2,1,2,2,3,2,3],dk); print('check2',np.round(p,2),v)
f['check2']=[float(x) for x in p]
json.dump(f,open('fit2.json','w'))
open('check2.py','w').write(open('fit5.py').read().split('chk_region')[0].split("f=json.load(open('fit2.json'))")[1])
