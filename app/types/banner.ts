export interface SiteBanner {
  id: number
  name?: string | null
  title?: string | null
  subtitle?: string | null
  url?: string | null
  default_image?: string | null
  tablet_image?: string | null
  mobile_image?: string | null
  background_color?: string | null
  button_title?: string | null
  button_subtitle?: string | null
  button_color?: string | null
  active_from?: string | null
  active_until?: string | null
}
