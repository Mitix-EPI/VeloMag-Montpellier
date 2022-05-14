export interface Stations {
    last_updated: number;
    ttl:          number;
    data:         Data;
}

export interface Data {
    stations: Station[];
}

export interface Station {
    station_id: string;
    name:       string;
    lat:        number | null;
    lon:        number | null;
    capacity:   number;
}
