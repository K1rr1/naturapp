export type ReportCategory= "skräp" | "trasigt" | "belysning" | "övrigt";

export type ReportStatus = "öppen"|"åtgärdad";

export type Report = {
    id: number;
    lat: number;
    lng: number;
    text: string;
    category: ReportCategory;
    createdBy: string;
    createdAt: string;
    status: ReportStatus;
}