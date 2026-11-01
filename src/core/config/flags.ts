/**
 * Central Feature Flags Configuration
 *
 * Seluruh toggle fitur eksperimental atau gating rilis dipusatkan di sini
 * dalam bentuk konstanta boolean.
 */

export const FEATURE_FLAGS = {
  /**
   * Kunci sementara buku Iqro > 1 (Iqro 2 s/d 6).
   * - false: Hanya Iqro 1 yang aktif dan dapat dimainkan. Buku Iqro 2+ terkunci dengan badge "Segera Hadir".
   * - true: Mengaktifkan seluruh buku Iqro yang tersedia sesuai progression pemain.
   */
  ENABLE_IQRO_BEYOND_1: false,

  /**
   * Mengaktifkan studio rekaman audio resmi qari di lingkungan development.
   */
  ENABLE_DEV_STUDIO: true,
} as const;

/**
 * Shorthand export untuk kemudahan import langsung
 */
export const ENABLE_IQRO_BEYOND_1 = FEATURE_FLAGS.ENABLE_IQRO_BEYOND_1;
export const ENABLE_DEV_STUDIO = FEATURE_FLAGS.ENABLE_DEV_STUDIO;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;
