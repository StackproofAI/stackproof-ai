
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
