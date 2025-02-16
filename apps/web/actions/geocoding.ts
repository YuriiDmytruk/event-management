'use server'

import { AddressSuggestion } from "../types/address-suggestion";

const NOMINATIM_API_URL = process.env.NEXT_NOMINATIM_API_URL;

export async function fetchAddressSuggestionsAction(input: string): Promise<AddressSuggestion[]> {
    if (input.length < 3) return [];

    try {
        const url = new URL(`${NOMINATIM_API_URL}/search`);
        url.searchParams.set('q', input);
        url.searchParams.set('format', 'json');
        url.searchParams.set('limit', '5');

        const response = await fetch(url.toString());
        
        if (!response.ok) {
            throw new Error('Failed to fetch address suggestions');
        }

        const data = await response.json();

        return data.map((result: any) => ({
            label: result.display_name,
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon)
        }));
    } catch (error) {
        console.error('Error fetching address suggestions:', error);
        return [];
    }
}

export async function fetchAddressFromCoordinatesAction(lat: number, lon: number): Promise<string | null> {
    try {
        const url = new URL(`${NOMINATIM_API_URL}/reverse`);
        url.searchParams.set('lat', lat.toString());
        url.searchParams.set('lon', lon.toString());
        url.searchParams.set('format', 'json');

        const response = await fetch(url.toString());
        
        if (!response.ok) {
            throw new Error('Failed to fetch address from coordinates');
        }

        const data = await response.json();
        return data.display_name;
    } catch (error) {
        console.error('Error fetching address from coordinates:', error);
        return null;
    }
}