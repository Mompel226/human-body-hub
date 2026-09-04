/* ============================================================
   Biology Labs — the topic register
   ------------------------------------------------------------
   THIS IS THE ONLY FILE YOU EDIT WHEN A NEW LAB IS FINISHED.
   Give the topic a `url`, change `status` to "live", done.

   id      unique key
   no      Cambridge 0610 topic number, as taught here
   year    year group
   title   syllabus topic name
   lab     name of the app that covers it
   sys     the system it lights up on the plate (null = none)
   anchor  the organ the label's leader line points to
   side    which column the label sits in: "l" or "r"
   status  "live" | "build" | "planned"
   url     the published lab, or null
   ============================================================ */
window.TOPICS = [
  { id:'digestion',    no:7,  year:'Y10', side:'l', sys:'digestion',    anchor:'o-stomach',
    title:'Human nutrition',        lab:'Digestion Lab',
    blurb:'Diet, teeth, the alimentary canal and the enzymes that break food down.',
    detail:'13 stations · 113 questions',
    status:'live', url:'https://mompel226.github.io/digestion-lab/' },

  { id:'circulation',  no:9,  year:'Y10', side:'l', sys:'circulation',  anchor:'o-heart',
    title:'Transport in animals',   lab:'Circulation Lab',
    blurb:'Double circulation, the heart, blood vessels and what blood carries.',
    status:'planned', url:null },

  { id:'immunity',     no:10, year:'Y10', side:'l', sys:'immunity',     anchor:'o-spleen',
    title:'Diseases and immunity',  lab:'Immunity Lab',
    blurb:'Pathogens, transmission, the body’s defences, antibodies and vaccination.',
    status:'planned', url:null },

  { id:'gas-exchange', no:11, year:'Y10', side:'l', sys:'gas-exchange', anchor:'o-lungs',
    title:'Gas exchange in humans', lab:'Gas Exchange Lab',
    blurb:'Lungs, alveoli, the mechanics of ventilation and the effect of exercise.',
    status:'planned', url:null },

  { id:'respiration',  no:12, year:'Y10', side:'r', sys:'respiration',  anchor:'o-muscles',
    title:'Respiration',            lab:'Respiration Lab',
    blurb:'Aerobic and anaerobic respiration in the cell, lactic acid and oxygen debt.',
    status:'planned', url:null },

  { id:'excretion',    no:13, year:'Y10', side:'r', sys:'excretion',    anchor:'o-urinary',
    title:'Excretion in humans',    lab:'Excretion Lab',
    blurb:'Kidneys, the nephron, urea, and how dialysis stands in for a failed kidney.',
    status:'planned', url:null },

  { id:'coordination', no:14, year:'Y10', side:'r', sys:'coordination', anchor:'o-brain',
    title:'Coordination and response', lab:'Coordination Lab',
    blurb:'Nerves and the reflex arc, the eye, hormones and homeostasis.',
    status:'planned', url:null },

  { id:'drugs',        no:15, year:'Y10', side:'r', sys:'drugs',        anchor:'o-veins',
    title:'Drugs',                  lab:'Drugs & AMR Lab',
    blurb:'Medicinal and recreational drugs, antibiotics and antibiotic resistance.',
    status:'planned', url:null },

  { id:'reproduction', no:16, year:'Y10', side:'r', sys:'reproduction', anchor:'o-uterus',
    title:'Reproduction',           lab:'Reproduction Lab',
    blurb:'The reproductive systems, fertilisation, the fetus, sex hormones and STIs.',
    status:'planned', url:null }
];
