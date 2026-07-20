/*
 * Derma-Maze Drug Index
 * Index-level metadata only. No dosing, treatment protocols, diagnosis,
 * pregnancy guidance, monitoring, or book explanations are stored here.
 * Replace or extend these demo records with the final approved drug list.
 */
window.DERMA_MAZE_DRUGS = [
  {
    id: 'mupirocin',
    name: 'Mupirocin',
    class: { ar: 'مضاد بكتيري موضعي', en: 'Topical antibacterial' },
    category: 'antibacterial',
    routes: ['topical'],
    chapters: ['bacterial'],
    featured: true
  },
  {
    id: 'cephalexin',
    name: 'Cephalexin',
    class: { ar: 'سيفالوسبورين', en: 'Cephalosporin' },
    category: 'antibacterial',
    routes: ['oral'],
    chapters: ['bacterial']
  },
  {
    id: 'clindamycin',
    name: 'Clindamycin',
    class: { ar: 'لينكوساميد', en: 'Lincosamide' },
    category: 'antibacterial',
    routes: ['oral', 'topical'],
    chapters: ['bacterial']
  },
  {
    id: 'doxycycline',
    name: 'Doxycycline',
    class: { ar: 'تتراسيكلين', en: 'Tetracycline' },
    category: 'antibacterial',
    routes: ['oral'],
    chapters: ['bacterial']
  },
  {
    id: 'terbinafine',
    name: 'Terbinafine',
    class: { ar: 'مضاد فطريات', en: 'Antifungal' },
    category: 'antifungal',
    routes: ['oral', 'topical'],
    chapters: ['fungal'],
    featured: true
  },
  {
    id: 'fluconazole',
    name: 'Fluconazole',
    class: { ar: 'أزول مضاد للفطريات', en: 'Azole antifungal' },
    category: 'antifungal',
    routes: ['oral'],
    chapters: ['fungal']
  },
  {
    id: 'ketoconazole',
    name: 'Ketoconazole',
    class: { ar: 'أزول مضاد للفطريات', en: 'Azole antifungal' },
    category: 'antifungal',
    routes: ['topical'],
    chapters: ['fungal']
  },
  {
    id: 'acyclovir',
    name: 'Acyclovir',
    class: { ar: 'مضاد فيروسات', en: 'Antiviral' },
    category: 'antiviral',
    routes: ['oral', 'topical'],
    chapters: ['viral'],
    featured: true
  },
  {
    id: 'valacyclovir',
    name: 'Valacyclovir',
    class: { ar: 'مضاد فيروسات', en: 'Antiviral' },
    category: 'antiviral',
    routes: ['oral'],
    chapters: ['viral']
  },
  {
    id: 'permethrin',
    name: 'Permethrin',
    class: { ar: 'مضاد للطفيليات موضعي', en: 'Topical antiparasitic' },
    category: 'antiparasitic',
    routes: ['topical'],
    chapters: ['parasitic'],
    featured: true
  },
  {
    id: 'ivermectin',
    name: 'Ivermectin',
    class: { ar: 'مضاد للطفيليات', en: 'Antiparasitic' },
    category: 'antiparasitic',
    routes: ['oral', 'topical'],
    chapters: ['parasitic']
  },
  {
    id: 'rifampicin',
    name: 'Rifampicin',
    class: { ar: 'مضاد للميكوبكتيريا', en: 'Antimycobacterial' },
    category: 'antimycobacterial',
    routes: ['oral'],
    chapters: ['mycobacterial'],
    featured: true
  },
  {
    id: 'dapsone',
    name: 'Dapsone',
    class: { ar: 'سلفون', en: 'Sulfone' },
    category: 'antimycobacterial',
    routes: ['oral'],
    chapters: ['mycobacterial']
  }
];
