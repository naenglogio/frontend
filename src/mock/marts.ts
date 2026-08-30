export interface Mart {
  id: string;
  name: string;
  distanceKm: number;
  isOpen: boolean;
}

export const MOCK_MARTS: Mart[] = [
  { id: 'm1', name: '이마트 역삼점', distanceKm: 0.8, isOpen: true },
  { id: 'm2', name: '홈플러스 강남점', distanceKm: 1.7, isOpen: true },
  { id: 'm3', name: 'GS25 테헤란로점', distanceKm: 0.3, isOpen: true },
];
