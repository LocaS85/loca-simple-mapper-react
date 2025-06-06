
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export class GeoCoordinates {
  static toArray(coords: Coordinates): [number, number] {
    return [coords.longitude, coords.latitude];
  }

  static fromArray(coords: [number, number]): Coordinates {
    return {
      longitude: coords[0],
      latitude: coords[1]
    };
  }

  static calculateDistance(point1: [number, number], point2: [number, number]): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.toRadians(point2[1] - point1[1]);
    const dLon = this.toRadians(point2[0] - point1[0]);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(point1[1])) * Math.cos(this.toRadians(point2[1])) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  static calculateBounds(points: [number, number][], padding = 0.01): BoundingBox {
    if (points.length === 0) {
      return { north: 0, south: 0, east: 0, west: 0 };
    }

    let north = points[0][1];
    let south = points[0][1];
    let east = points[0][0];
    let west = points[0][0];

    points.forEach(([lng, lat]) => {
      north = Math.max(north, lat);
      south = Math.min(south, lat);
      east = Math.max(east, lng);
      west = Math.min(west, lng);
    });

    return {
      north: north + padding,
      south: south - padding,
      east: east + padding,
      west: west - padding
    };
  }

  static isValidCoordinate(coords: [number, number]): boolean {
    const [lng, lat] = coords;
    return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
  }

  static formatCoordinate(coord: number, type: 'lat' | 'lng'): string {
    const abs = Math.abs(coord);
    const degrees = Math.floor(abs);
    const minutes = Math.floor((abs - degrees) * 60);
    const seconds = Math.round(((abs - degrees) * 60 - minutes) * 60);
    
    const direction = type === 'lat' 
      ? (coord >= 0 ? 'N' : 'S')
      : (coord >= 0 ? 'E' : 'W');
    
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
