# -*- coding: utf-8 -*-
"""Which BodyParts3D meshes make up each IGCSE 0610 body system.

Every id is a Foundational Model of Anatomy (FMA) identifier, so each entry is
checkable against the FMA ontology rather than against my judgement.
"""
import json
S = json.load(open('stl_named.json'))
Z = json.load(open('stl_index.json'))

def by_name(*keys, exclude=()):
    out = []
    for k, v in S.items():
        lv = v.lower()
        if any(x in lv for x in keys) and not any(x in lv for x in exclude):
            out.append(k)
    return sorted(out)

BONE_WORDS = ('bone','vertebra','rib','sternum','manubrium','xiphoid','sacrum','coccyx',
              'mandible','maxilla','clavicle','scapula','humerus','radius','ulna','femur',
              'tibia','fibula','patella','hip bone','atlas','axis','sphenoid','ethmoid',
              'vomer','hyoid','carpal','phalanx','tarsal','calcaneus','talus','costal cartilage')
BONE_SKIP  = ('muscle','gingiva','ligament','tendon','disk','joint','nasalis','occipitalis',
              'zygomaticus','sternothyroid','head of','flexor','extensor')

# organ groups: (organ id, display name, [FMA leaf ids], decimation target in triangles)
ORGANS = [
  # ---- context ----------------------------------------------------------
  ('skin',        'Skin',              'context',    ['FMA7163'], 26000),
  ('skeleton',    'Skeleton',          'context',    by_name(*BONE_WORDS, exclude=BONE_SKIP), 70000),

  # ---- T7 digestion -----------------------------------------------------
  ('esophagus',   'Oesophagus',        'digestion',  ['FMA7131'], 2500),
  ('stomach',     'Stomach',           'digestion',  ['FMA7148'], 9000),
  ('duodenum',    'Duodenum',          'digestion',  ['FMA7206'], 5000),
  ('jejunum',     'Jejunum',           'digestion',  ['FMA7207'], 9000),
  ('ileum',       'Ileum',             'digestion',  ['FMA7208'], 9000),
  ('colon',       'Large intestine',   'digestion',  ['FMA14543nsn','FMA76891','FMA76892','FMA76893'], 14000),
  ('rectum',      'Rectum',            'digestion',  ['FMA14544'], 3500),
  ('liver',       'Liver',             'digestion',  ['FMA7197'], 11000),
  ('gallbladder', 'Gall bladder',      'digestion',  ['FMA7202'], 3500),
  ('pancreas',    'Pancreas',          'digestion',  ['FMA7198nsn'], 6000),

  # ---- T9 transport in animals -----------------------------------------
  ('heart',       'Heart',             'circulation', ['FMA7274','FMA7234','FMA7235','FMA7246'], 16000),
  ('aorta',       'Aorta',             'circulation', ['FMA3736','FMA3768','FMA3784'], 6000),
  ('venacava',    'Venae cavae',       'circulation', ['FMA4720','FMA10951'], 4000),
  ('pulmvessels', 'Pulmonary vessels', 'circulation', ['FMA66326','FMA66643'], 9000),
  ('bigarteries', 'Major arteries',    'circulation', ['FMA3941','FMA4058','FMA3953','FMA4694',
                                                       'FMA14765','FMA14766','FMA18806','FMA18807',
                                                       'FMA18809','FMA18810'], 5000),

  # ---- T10 diseases and immunity ---------------------------------------
  ('spleen',      'Spleen',            'immunity',   ['FMA7196'], 5000),
  ('thymus',      'Thymus',            'immunity',   ['FMA71194','FMA71195'], 6000),

  # ---- T11 gas exchange -------------------------------------------------
  ('trachea',     'Trachea',           'gas-exchange', ['FMA7394'], 5000),
  ('bronchi',     'Bronchi',           'gas-exchange', ['FMA7409'], 9000),
  ('lungR',       'Right lung',        'gas-exchange', ['FMA7333','FMA7383','FMA7337'], 12000),
  ('lungL',       'Left lung',         'gas-exchange', ['FMA7370','FMA7371'], 10000),
  ('diaphragm',   'Diaphragm',         'gas-exchange', ['FMA13295'], 9000),

  # ---- T12 respiration (the muscle where it happens) --------------------
  ('quads',       'Thigh muscle',      'respiration', ['FMA38928','FMA38929'], 7000),
  ('calves',      'Calf muscle',       'respiration', ['FMA45957','FMA45958','FMA45960','FMA45961'], 7000),

  # ---- T13 excretion ----------------------------------------------------
  ('kidneys',     'Kidneys',           'excretion',  ['FMA7204','FMA7205'], 9000),
  ('ureters',     'Ureters',           'excretion',  ['FMA15571','FMA15572'], 3000),
  ('bladder',     'Urinary bladder',   'excretion',  ['FMA15900'], 4000),
  ('urethra',     'Urethra',           'excretion',  ['FMA19667'], 2000),
  ('renalvessels','Renal vessels',     'excretion',  ['FMA14752','FMA14753','FMA14335','FMA14336'], 2500),

  # ---- T14 coordination and response -----------------------------------
  ('brain',       'Brain',             'coordination', None, 26000),   # None = expand FMA50801
  ('eyes',        'Eyes',              'coordination', ['FMA12513'], 4000),
  ('opticnerves', 'Optic nerves',      'coordination', ['FMA50875','FMA50878'], 2500),
  ('pituitary',   'Pituitary gland',   'coordination', ['FMA13889'], 1500),
  ('adrenals',    'Adrenal glands',    'coordination', ['FMA15629','FMA15630'], 4000),

  # ---- T16 reproduction (this dataset is a male body) -------------------
  ('testes',      'Testes',            'reproduction', ['FMA7211','FMA7212','FMA18256','FMA18257'], 3000),
  ('prostate',    'Prostate',          'reproduction', ['FMA9600'], 2500),
  ('semvesicles', 'Seminal vesicles',  'reproduction', ['FMA19387','FMA19388'], 2500),
  ('penis',       'Penis',             'reproduction', ['FMA18247','FMA19618'], 4000),
]
