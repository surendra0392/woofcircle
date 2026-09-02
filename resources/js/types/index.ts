import { LucideIcon } from 'lucide-react';
export interface Auth {
    user: User;
}
export interface BreadcrumbItem {
    title: string;
    href: string;
}
export interface NavGroup {
    title: string;
    items: NavItem[];
}
export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles?: string[];
}
export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    flash: { success: string | null; error: string | null; warning: string | null; info: string | null };
    settings: {
        site_name: string;
        site_description: string;
        site_logo: string;
        site_logo_url: string;
        site_favicon: string;
        site_favicon_url: string;
        contact_address: string;
        contact_email: string;
        contact_phone: string;
        seo_meta_title: string;
        seo_meta_description: string;
        seo_keywords: string;
        social_facebook: string;
        social_instagram: string;
        social_twitter: string;
        [key: string]: string;
    };
    litters?: Litter[];
    user_location?: {
        city_id?: number;
        name?: string;
        latitude?: number;
        longitude?: number;
        distance?: number;
    } | null;
    [key: string]: unknown;
}
export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    avatar_url?: string | null;
    roles?: string[];
    email_verified_at: string | null;
    karma_points?: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}
export interface Breed {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    history?: string | null;
    temperament?: string | null;
    origin?: string | null;
    life_span?: string | null;
    male_height?: string | null;
    female_height?: string | null;
    male_weight?: string | null;
    female_weight?: string | null;
    size?: string | null;
    coat_type?: string | null;
    energy_level?: string | null;
    image_url: string | null;
    breed_group?: string | null;
}
export interface State {
    id: number;
    name: string;
    slug: string;
}
export interface City {
    id: number;
    name: string;
    slug: string;
    state_id: number;
}
export interface LitterImage {
    id: number;
    litter_id: number;
    image_url: string;
    image_type: string;
    sort_order: number;
}
export interface Litter {
    id: number;
    user_id: number;
    breed_id: number;
    title: string;
    slug: string;
    description: string;
    price: string | null;
    price_min: string | null;
    price_max: string | null;
    age: string | null;
    kci_registered: boolean;
    sire_name: string | null;
    dam_name: string | null;
    state_id: number;
    city_id: number;
    status: string;
    is_negotiable: boolean;
    is_vaccinated: boolean;
    is_champion: boolean;
    awards_count: number;
    is_available: boolean;
    is_approved: boolean;
    is_premium?: boolean;
    featured_image_url: string | null;
    breed?: Breed;
    state?: State;
    city?: City;
    images?: LitterImage[];
    profile?: BreederProfile;
    breeder_name?: string;
    breeder_location?: string;
    average_rating?: number;
    reviews_count?: number;
    reviews?: Review[];
    created_at: string;
    updated_at: string;
}
export interface GalleryImage {
    id: number;
    image_url: string;
    caption?: string;
}
export interface BreederProfile {
    id: number;
    user_id: number;
    kennel_name: string;
    name?: string;
    slug: string;
    description: string | null;
    phone: string | null;
    email: string | null;
    facebook_url: string | null;
    instagram_url: string | null;
    twitter_url: string | null;
    youtube_url: string | null;
    state_id: number;
    city_id: number;
    address: string | null;
    logo_url: string | null;
    is_verified: boolean;
    is_active: boolean;
    state?: State;
    city?: City;
    litters?: Litter[];
    gallery?: GalleryImage[];
    average_rating?: number;
    reviews_count?: number;
    reviews?: Review[];
    experience_years?: number | null;
    created_at: string;
}
export interface Review {
    id: number;
    user_id: number;
    rating: number;
    comment: string | null;
    user?: User;
    created_at: string;
}
export interface Pet {
    id: number;
    user_id: number;
    breed_id: number;
    name: string;
    gender: 'male' | 'female';
    date_of_birth: string | null;
    color: string | null;
    microchip_number: string | null;
    profile_image_url: string | null;
    is_champion: boolean;
    awards_count: number;
    notes: string | null;
    breed?: Breed;
}
export interface DirectoryItem {
    id: number;
    name?: string;
    business_name?: string;
    clinic_name?: string;
    shop_name?: string;
    organization_name?: string;
    kennel_name?: string;
    location?: string;
    slug: string;
    description: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    state_id?: number;
    city_id?: number;
    logo_url?: string | null;
    featured_image_url?: string | null;
    is_verified?: boolean;
    average_rating?: number;
    reviews_count?: number;
    reviews?: Review[];
    services?: string[] | { name: string }[];
    specialties?: string[] | { name: string }[];
    breeds?: string[] | { name: string }[];
    opening_hours?: string;
    starting_price?: string | number;
    city?: City;    
    facebook_url?: string | null;
    instagram_url?: string | null;
    twitter_url?: string | null;
    youtube_url?: string | null;
    state?: State;
    is_sponsored?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}
export interface AdoptionListing {
    id: number;
    title: string;
    slug: string;
    description: string;
    breed_id: number;
    age: string | null;
    gender: string | null;
    fee: string | number | null;
    state_id: number;
    city_id: number;
    is_vaccinated: boolean;
    is_available: boolean;
    is_approved: boolean;
    is_champion: boolean;
    awards_count: number;
    featured_image_url: string | null;
    breed?: Breed;
    state?: State;
    city?: City;
    profile_type?: string | null;
    profile?: any;
    profile_url?: string;
    breeder_name?: string;
    breeder_location?: string;
    average_rating?: number;
    reviews_count?: number;
    reviews?: Review[];
    user_id: number;
    user?: User;
    status: string;
    created_at: string;
    updated_at: string;
}
export interface Stud {
    id: number;
    user_id: number;
    breed_id: number;
    title: string;
    slug: string;
    description: string;
    fee: string | null;
    age: string | null;
    is_vaccinated: boolean;
    kci_registered: boolean;
    is_champion: boolean;
    awards_count: number;
    sire_name: string | null;
    dam_name: string | null;
    featured_image_url: string | null;
    is_available: boolean;
    is_approved: boolean;
    breed?: Breed;
    state?: State;
    city?: City;
    profile?: BreederProfile;
    breeder_name?: string;
    breeder_location?: string;
    average_rating?: number;
    reviews_count?: number;
    reviews?: Review[];
    created_at: string;
    updated_at: string;
}
export interface Event {
    id: number;
    title: string;
    slug: string;
    description: string;
    location: string;
    venue_name?: string;
    event_date: string;
    start_date?: string;
    event_time: string | null;
    featured_image_url: string | null;
    is_active: boolean;
    created_at: string;
}
export interface Article {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    featured_image_url: string | null;
    image_url?: string | null;
    category?: { name: string; slug: string };
    author?: { name: string; email?: string };
    is_published: boolean;
    published_at: string | null;
    created_at: string;
}
export interface Activity {
    id: number;
    type: 'medical' | 'vaccination';
    title: string;
    date: string;
    pet_name: string;
}
export interface UpcomingEvent {
    id: number;
    type: 'appointment' | 'vaccination';
    title: string;
    date: string;
    pet_name: string;
}
export interface CommunityGallery {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    image_url: string;
    user_id: number;
    user?: User;
    created_at: string;
}

export interface MessageAttachment {
    id: number;
    message_id: number;
    file_path: string;
    file_name: string;
    mime_type: string;
    size: number;
    created_at: string;
    updated_at: string;
}

export interface Message {
    id: number;
    conversation_id: number;
    user_id: number;
    body: string | null;
    created_at: string;
    updated_at: string;
    sender?: User;
    attachments?: MessageAttachment[];
}

export interface Conversation {
    id: number;
    created_at: string;
    updated_at: string;
    users?: User[];
    messages?: Message[];
}
