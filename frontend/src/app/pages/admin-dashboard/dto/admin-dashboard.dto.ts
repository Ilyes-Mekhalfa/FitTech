export interface DashboardDTO{
    annexName : string
    totalMembers: number;
    activeClasses: number;
    liveCapacity: number;
    monthlyRevenue: number;
    revenueTrend: number[];
    memberMix: {
        premium: number;
        standard: number;
        vip: number;
    };
    trending_up: number
}