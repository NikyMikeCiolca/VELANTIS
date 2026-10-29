export type Genero = 'mujer' | 'hombre' | 'unisex';
export type Prenda = 'camisas' | 'camisetas' | 'abrigos' | 'chaquetas' | 'pantalones' | 'vestidos' | 'sudaderas';
export type Medida = 'pecho' | 'cintura' | 'cadera' | 'largo' | 'manga' | 'entrepierna';

export interface SizeEntry {
  label: string;
  /** Medidas en cm de la prenda tendida. */
  measures: Partial<Record<Medida, number>>;
}

export interface Product {
  id: string;
  /** Único. Es lo que va en la URL: /producto/camisa-oversize */
  slug: string;
  ref: string;
  name: string;
  /** Precio de referencia en euros (la compra se hace en tienda). */
  price: number;
  genero: Genero;
  prenda: Prenda;
  season: string;
  description: string;
  colors: { name: string; hex: string }[];
  materials: { fiber: string; percent: number }[];
  care: string[];
  sizes: SizeEntry[];
  media: {
    /**
     * Hoja de fotogramas (sprite) de la prenda girando, renderizada desde el modelo 3D.
     * Los fotogramas van en horizontal: el primero es de perfil y el último casi de frente.
     * Si falta, el perchero dibuja una silueta provisional.
     */
    rackSprite?: { src: string; frames: number; width: number; height: number };
    /** Modelo 3D optimizado para el visor (paso 6). Opcional hasta que exista. */
    glb?: string;
  };
  availability: 'en-tienda' | 'proximamente';
}

// ---------- Etiquetas y validación ----------

export const GENERO_LABEL: Record<Genero, string> = { mujer: 'Mujer', hombre: 'Hombre', unisex: 'Unisex' };

export const PRENDA_LABEL: Record<Prenda, string> = {
  camisas: 'Camisas',
  camisetas: 'Camisetas',
  abrigos: 'Abrigos',
  chaquetas: 'Chaquetas',
  pantalones: 'Pantalones',
  vestidos: 'Vestidos',
  sudaderas: 'Sudaderas',
};

export const MEDIDA_LABEL: Record<Medida, string> = {
  pecho: 'Pecho',
  cintura: 'Cintura',
  cadera: 'Cadera',
  largo: 'Largo',
  manga: 'Manga',
  entrepierna: 'Entrepierna',
};

/** Type guard: convierte un string cualquiera de la URL en un Genero válido. */
export function isGenero(value: string | undefined): value is Genero {
  return value === 'mujer' || value === 'hombre' || value === 'unisex';
}