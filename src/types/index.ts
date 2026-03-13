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

export interface CategoryConfig {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Filters {
  category?: string;
  distance?: number; // km
  address?: Address | string;
}

export interface MapConfig {
  center: {
    latitude: number;
    longitude: number;
  };
  zoom: number;
  radius: number;
  categories: CategoryConfig[];
}

export interface MapData {
  [key: string]: MapItem[];
}

export interface PostMessageEvent {
  config: MapConfig;
  mapData: MapData;
  filters: Filters;
}
