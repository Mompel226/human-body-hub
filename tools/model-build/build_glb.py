import json, os, sys, numpy as np, trimesh, manifest
from resolve import resolve
trimesh.util.log.setLevel(60)

Z = json.load(open('stl_index.json'))
COLOUR = {  # sensible anatomical base colours; the viewer lights them further
 'skin':(214,176,152,70), 'skeleton':(232,226,208,255),
 'esophagus':(212,150,140,255),'stomach':(206,116,104,255),'duodenum':(214,140,116,255),
 'jejunum':(214,150,124,255),'ileum':(210,146,120,255),'colon':(200,156,120,255),
 'rectum':(190,130,110,255),'liver':(140,60,58,255),'gallbladder':(120,150,86,255),
 'pancreas':(214,178,120,255),
 'heart':(176,44,44,255),'aorta':(196,60,54,255),'venacava':(72,96,160,255),
 'pulmvessels':(150,80,120,255),'bigarteries':(190,64,58,255),'vessels':(182,58,64,255),
 'spleen':(122,66,96,255),'thymus':(216,182,150,255),
 'trachea':(196,196,206,255),'bronchi':(186,188,200,255),
 'lungR':(226,150,150,255),'lungL':(226,150,150,255),'diaphragm':(196,110,96,255),
 'muscle-arm':(172,62,54,255),'muscle-trunk':(178,66,58,255),
 'muscle-abdomen':(174,64,56,255),'muscle-leg':(168,58,52,255),
 'intercostals':(186,84,72,255),
 'kidneys':(140,66,54,255),'ureters':(206,196,180,255),'bladder':(214,200,176,255),
 'urethra':(206,196,180,255),'renalvessels':(178,70,66,255),
 'brain':(214,186,180,255),'eyes':(240,240,238,255),'opticnerves':(228,226,206,255),
 'pituitary':(196,150,146,255),'adrenals':(214,190,140,255),
 'testes':(200,168,150,255),'prostate':(178,140,132,255),
 'semvesicles':(190,158,146,255),'penis':(206,168,152,255),
}

def load_group(ids):
    parts=[]
    for i in ids:
        p='stl/%s.stl'%i
        if not os.path.exists(p) or os.path.getsize(p)<200: continue
        try: m=trimesh.load(p, process=False)
        except Exception as e: print('   !! load fail',i,e); continue
        if isinstance(m, trimesh.Scene): m=m.dump(concatenate=True)
        parts.append(m)
    if not parts: return None
    return trimesh.util.concatenate(parts)

def decimate(m, target):
    m.merge_vertices()
    if len(m.faces) <= target: return m
    try:
        return m.simplify_quadric_decimation(face_count=target)
    except TypeError:
        return m.simplify_quadric_decimation(target)

scene = trimesh.Scene()
rows=[]; total_faces=0
for oid, name, system, ids, target in manifest.ORGANS:
    if ids is None: ids = resolve('FMA50801')
    ids=[i for i in ids if i in Z]
    m = load_group(ids)
    if m is None:
        print('SKIP %s (no meshes)'%oid); continue
    before=len(m.faces)
    m = decimate(m, target)
    m.merge_vertices(); m.fix_normals()
    c = COLOUR.get(oid,(200,200,200,255))
    m.visual = trimesh.visual.TextureVisuals(material=trimesh.visual.material.PBRMaterial(
        name=oid, baseColorFactor=[c[0]/255,c[1]/255,c[2]/255,c[3]/255],
        metallicFactor=0.0, roughnessFactor=0.62,
        alphaMode='BLEND' if c[3]<255 else 'OPAQUE', doubleSided=True))
    node = '%s__%s' % (system, oid)
    scene.add_geometry(m, node_name=node, geom_name=node)
    total_faces += len(m.faces)
    rows.append((system, oid, name, len(ids), before, len(m.faces)))
    print('  %-13s %-13s %3d src  %8d -> %6d tris' % (system, oid, len(ids), before, len(m.faces)))

b = scene.bounds
print('\nscene bounds (mm):', np.round(b,1).tolist())
print('size:', np.round(b[1]-b[0],1).tolist())
print('total triangles: %d across %d organ groups' % (total_faces, len(rows)))
data = scene.export(file_type='glb')
open('body.glb','wb').write(data)
print('body.glb %.2f MB' % (len(data)/1e6))
json.dump([{'system':r[0],'organ':r[1],'name':r[2],'meshes':r[3],'tris':r[5]} for r in rows],
          open('body_manifest.json','w'), indent=1)
