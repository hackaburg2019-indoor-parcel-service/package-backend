
export interface IStation {
    id?: any | string;
    etage: number;
    deviceIp: string;
    stationNumbers: number[];
    stationType: 'car' | 'station';
}