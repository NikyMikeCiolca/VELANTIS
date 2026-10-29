import { Product, SizeEntry } from '../interfaces/product.interface';

// ---------- Tablas de medidas reutilizables (cm) ----------
const TOP_SIZES: SizeEntry[] = [
  { label: 'S', measures: { pecho: 100, largo: 68, manga: 61 } },
  { label: 'M', measures: { pecho: 104, largo: 70, manga: 62 } },
  { label: 'L', measures: { pecho: 108, largo: 72, manga: 63 } },
  { label: 'XL', measures: { pecho: 112, largo: 74, manga: 64 } },
];
const COAT_SIZES: SizeEntry[] = [
  { label: 'S', measures: { pecho: 108, largo: 112, manga: 62 } },
  { label: 'M', measures: { pecho: 112, largo: 114, manga: 63 } },
  { label: 'L', measures: { pecho: 116, largo: 116, manga: 64 } },
];
const DRESS_SIZES: SizeEntry[] = [
  { label: 'S', measures: { pecho: 88, cintura: 70, largo: 118 } },
  { label: 'M', measures: { pecho: 92, cintura: 74, largo: 120 } },
  { label: 'L', measures: { pecho: 96, cintura: 78, largo: 122 } },
];
const PANTS_SIZES: SizeEntry[] = [
  { label: 'S', measures: { cintura: 76, cadera: 98, entrepierna: 78 } },
  { label: 'M', measures: { cintura: 80, cadera: 102, entrepierna: 79 } },
  { label: 'L', measures: { cintura: 84, cadera: 106, entrepierna: 80 } },
  { label: 'XL', measures: { cintura: 88, cadera: 110, entrepierna: 81 } },
];

const CARE_COTTON = ['Lavar a 30 °C', 'No usar lejía', 'Planchar a temperatura media', 'No usar secadora'];
const CARE_WOOL = ['Lavar en seco', 'No usar lejía', 'Planchar a baja temperatura'];
const CARE_TECH = ['Lavar a 30 °C', 'No usar suavizante', 'No planchar', 'Secar al aire'];

const SEASON = 'Colección 01 / 2027';

export const PRODUCTS: readonly Product[] = [
  // ---------------- MUJER ----------------
  {
    id: 'vl-001', slug: 'camisa-oversize', ref: 'VL-001', name: 'Camisa oversize', price: 49.95,
    genero: 'mujer', prenda: 'camisas', season: SEASON,
    description: 'Camisa de corte amplio en popelín, con caída suave y cuello clásico. Pensada para llevarse abierta o abotonada.',
    colors: [{ name: 'Blanco', hex: '#fafafa' }, { name: 'Azul cielo', hex: '#b7d6ff' }],
    materials: [{ fiber: 'Algodón', percent: 100 }],
    care: CARE_COTTON, sizes: TOP_SIZES,
    media: {}, availability: 'en-tienda',
  },
  {
    id: 'vl-014', slug: 'abrigo-largo', ref: 'VL-014', name: 'Abrigo largo', price: 129.95,
    genero: 'mujer', prenda: 'abrigos', season: SEASON,
    description: 'Abrigo de línea recta en paño de lana, con solapas anchas y cierre oculto.',
    colors: [{ name: 'Gris perla', hex: '#d9dbde' }, { name: 'Carbón', hex: '#2b2c2e' }],
    materials: [{ fiber: 'Lana', percent: 70 }, { fiber: 'Poliamida', percent: 30 }],
    care: CARE_WOOL, sizes: COAT_SIZES,
    media: {}, availability: 'en-tienda',
  },
  {
    id: 'vl-021', slug: 'vestido-satinado', ref: 'VL-021', name: 'Vestido satinado', price: 69.95,
    genero: 'mujer', prenda: 'vestidos', season: SEASON,
    description: 'Vestido midi de acabado satinado con tirantes finos y caída en bies.',
    colors: [{ name: 'Aqua', hex: '#7ed3c7' }, { name: 'Marfil', hex: '#f2efe8' }],
    materials: [{ fiber: 'Poliéster reciclado', percent: 100 }],
    care: CARE_TECH, sizes: DRESS_SIZES,
    media: {}, availability: 'proximamente',
  },

  // ---------------- HOMBRE ----------------
  {
    id: 'vl-027', slug: 'camiseta-corte-recto', ref: 'VL-027', name: 'Camiseta de corte recto', price: 19.95,
    genero: 'hombre', prenda: 'camisetas', season: SEASON,
    description: 'Camiseta de punto denso con cuello redondo reforzado. Un básico de corte limpio.',
    colors: [{ name: 'Blanco', hex: '#fafafa' }, { name: 'Gris niebla', hex: '#c9ccd1' }],
    materials: [{ fiber: 'Algodón orgánico', percent: 100 }],
    care: CARE_COTTON, sizes: TOP_SIZES,
    media: { rackSprite: { src: '/imgs/rack-sprite.webp', frames: 12, width: 400, height: 500 }, glb: 'models/camiseta-corte-recto.glb' }, availability: 'en-tienda',
  },
  {
    id: 'vl-030', slug: 'camisa-lino', ref: 'VL-030', name: 'Camisa de lino', price: 45.95,
    genero: 'hombre', prenda: 'camisas', season: SEASON,
    description: 'Camisa de manga larga en lino lavado, ligera y con el arrugado natural del tejido.',
    colors: [{ name: 'Arena', hex: '#e6dccb' }, { name: 'Azul cielo', hex: '#b7d6ff' }],
    materials: [{ fiber: 'Lino', percent: 85 }, { fiber: 'Algodón', percent: 15 }],
    care: CARE_COTTON, sizes: TOP_SIZES,
    media: {}, availability: 'en-tienda',
  },
  {
    id: 'vl-038', slug: 'pantalon-pinzas', ref: 'VL-038', name: 'Pantalón de pinzas', price: 59.95,
    genero: 'hombre', prenda: 'pantalones', season: SEASON,
    description: 'Pantalón de tiro medio con pinzas y pernera recta, en sarga de algodón.',
    colors: [{ name: 'Carbón', hex: '#2b2c2e' }, { name: 'Arena', hex: '#e6dccb' }],
    materials: [{ fiber: 'Algodón', percent: 97 }, { fiber: 'Elastano', percent: 3 }],
    care: CARE_COTTON, sizes: PANTS_SIZES,
    media: {}, availability: 'en-tienda',
  },

  // ---------------- UNISEX ----------------
  {
    id: 'vl-045', slug: 'sudadera-capucha', ref: 'VL-045', name: 'Sudadera con capucha', price: 49.95,
    genero: 'unisex', prenda: 'sudaderas', season: SEASON,
    description: 'Sudadera de felpa gruesa con capucha doble y bolsillo canguro. Una sola tabla de tallas.',
    colors: [{ name: 'Gris niebla', hex: '#c9ccd1' }, { name: 'Aqua', hex: '#7ed3c7' }],
    materials: [{ fiber: 'Algodón', percent: 80 }, { fiber: 'Poliéster reciclado', percent: 20 }],
    care: CARE_COTTON, sizes: TOP_SIZES,
    media: {}, availability: 'en-tienda',
  },
  {
    id: 'vl-052', slug: 'chaqueta-ligera', ref: 'VL-052', name: 'Chaqueta ligera', price: 79.95,
    genero: 'unisex', prenda: 'chaquetas', season: SEASON,
    description: 'Chaqueta cortavientos con acabado mate, cuello alto y bolsillos con cremallera.',
    colors: [{ name: 'Carbón', hex: '#2b2c2e' }, { name: 'Azul cielo', hex: '#b7d6ff' }],
    materials: [{ fiber: 'Nailon reciclado', percent: 100 }],
    care: CARE_TECH, sizes: TOP_SIZES,
    media: {}, availability: 'proximamente',
  },
];