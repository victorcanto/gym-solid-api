type Coordinate = {
    latitude: number;
    longitude: number;
};

export function getDistanceBetweenCoordinates(
    from: Coordinate,
    to: Coordinate
): number {
    const distance = haversine(
        from.latitude,
        from.longitude,
        to.latitude,
        to.longitude
    );
    return distance;
}

function haversine(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const earthRadiusKm = 6371;

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) *
            Math.cos(degreesToRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
}

function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}
