/**
 * Configuração da loja. Troque aqui o nome, avatar e a marca-d'água do header.
 */
export interface StoreConfig {
  /** Nome exibido ao lado do avatar */
  name: string;
  /** URL do avatar circular */
  avatar: string;
  /** Texto/placeholder da marca-d'água gigante no header (sua própria marca) */
  watermarkText: string;
  followers: string;
  productCount: number;
  following: boolean;
  /** Exibe o card "LIVE" sobre a galeria do produto */
  isLive: boolean;
}

export const STORE: StoreConfig = {
  name: "Vitrine de Jade",
  avatar: "https://picsum.photos/seed/vitrine-avatar/200/200",
  watermarkText: "VJ",
  followers: "14.0K",
  productCount: 244,
  following: true,
  isLive: false,
};
