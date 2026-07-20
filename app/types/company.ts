import type { AdList } from "./ad";

export interface Company {
    id: number;
    name: string;
    slug: string;
    size: string | null;
    activity: string | null;
    intro: string | null;
    culture: string | null;
    advantages: string | null;
    logo: string | null;
    cover: string | null;
    static_map: string | null;
    province_name: string | null;
    city_name: string | null;
    lat: number | null;
    long: number | null;
    address: string | null;
    tel: string | null;
    is_tell_public: number | boolean;
    website: string | null;
    gallery: string[];
    is_profile_public: number | boolean;
    ads?: AdList[];
    is_bookmarked?: boolean;
}

export interface CompanyList {
    id?: number;
    name: string | null;
    slug?: string | null;
    size: string | null;
    logo: string | null;
    province_name: string | null;
    city_name: string | null;
    activity: string | null;
    is_bookmarked?: boolean;
}