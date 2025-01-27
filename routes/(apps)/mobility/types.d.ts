interface Promotion {
    id: number;
    name: string;
}

interface MobilityData {
    id: number | null;
    studentId: string;
    firstName: string;
    lastName: string;
    startDate: string | null;
    endDate: string | null;
    weeksCount: number | null;
    destinationCountry: string | null;
    destinationName: string | null;
    mobilityStatus: string;
    promotionId: number;
    promotionName: string;
  }
  