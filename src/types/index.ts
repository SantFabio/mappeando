export interface MapItem {
  _id?: string;
  name?: string;
  region?: string;
  fullAddress?: string;
  schedule?: string;
  hasSelectionProcess?: string;
  isRemote?: string;
  availableSeatsOnsite?: string | number;
  availableSeatsRemote?: string | number;
  phone?: string;
  email?: string;
  observations?: string;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  latitude?: number;
  longitude?: number;
}

export interface Address {
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface Filters {
  category?: 'all' | 'categoryA' | 'categoryB' | 'categoryC';
  distance?: number; // km
  address?: Address | string;
}

export interface MapData {
  categoryA: MapItem[];
  categoryB: MapItem[];
  categoryC: MapItem[];
}

export interface PostMessageEvent {
  mapData: MapData;
  filters: Filters;
}
