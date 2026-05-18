
export type PaymentStatus = 'paid' | 'pending' | 'overdue'

export interface Payment {
    id: number
    athlete_id: number
    athlete_name: string
    amount: number
    period_month: number
    period_year: number
    due_date: string
    paid_at?: string
    payment_method?: string
    status: PaymentStatus
    receipt_url?: string
    notes?: string
}

export interface PaymentSummary {
    total_collected: number
    total_pending: number
    total_overdue: number
    overdue_count: number
}