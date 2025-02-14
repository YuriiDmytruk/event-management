export class QueryEventDto {
    category?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
    sortDirection?: 'ASC' | 'DESC';
}