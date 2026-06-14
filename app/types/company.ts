import type { User } from "./user";
import type { AdList } from "./ad";

export interface Company {
    id: number;
    user: User;
    name: string;
    size: string;
    activity: string;
    intro: string;
    culture: string;
    advantages: string;
    logo: string | null;
    cover: string | null;
    province_name: string;
    city_name: string;
    lat: number;
    long: number;
    address: string;
    tel: string;
    is_tell_public: boolean;
    website: string;
    gallery: string[]; // array of image URLs
    is_profile_public: boolean;
    ads?: AdList[];
}

export interface CompanyList {
    name: string;
    size: string;
    logo: string | null;
    province_name: string;
    city_name: string;
}