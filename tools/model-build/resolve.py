import json, collections
NAME={}
for line in open('parts.txt', encoding='utf-8', errors='replace'):
    p=line.rstrip('\n').split('\t')
    if len(p)>=2: NAME[p[0]]=p[1]
STL=json.load(open('stl_index.json'))

kids=collections.defaultdict(list)
first=True
for line in open('composite.txt', encoding='utf-8', errors='replace'):
    if first: first=False; continue
    p=line.rstrip('\n').split('\t')
    if len(p)>=3: kids[p[0]].append(p[2])

def resolve(fid, seen=None, depth=0):
    """Return the available STL leaves that make up this structure."""
    seen = seen or set()
    if fid in seen or depth>6: return []
    seen.add(fid)
    if fid in STL: return [fid]
    out=[]
    for k in kids.get(fid, []):
        out += resolve(k, seen, depth+1)
    return out

if __name__=='__main__':
    import sys
    for fid in sys.argv[1:]:
        leaves = resolve(fid)
        mb = sum(STL.get(l,0) for l in leaves)/1e6
        print('%-10s %-34s %3d parts  %6.1f MB' % (fid, NAME.get(fid,'?')[:34], len(leaves), mb))
