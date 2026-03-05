export interface Clipper {
    id: string
    discord_id: string
    username: string
    bank_no: string
    bank_type: string
    total_views: number
    total_earnings: number
    paid_amount: number
    pending_balance: number
    status: string
    created_at: string
}

export interface Campaign {
    id: string
    campaign_name: string
    client_name: string
    total_budget: number
    view_target: number
    cost_per_thousand_views: number
    campaign_material_link: string
    status: string
    total_views_generated: number
    budget_spent: number
    created_at: string
    submissions?: Submission[]
}

export interface Submission {
    id: string
    clipper_id: string
    campaign_name: string
    video_url: string
    status: string
    play_count: number
    like_count: number
    comments_count: number
    share_count: number
    calculated_payout: number
    last_calculated_views: number
    created_at: string
}

export interface PayoutRequest {
    id: string
    clipper_id: string
    amount: number
    status: string
    reason: string
    bank_no: string
    bank_type: string
    created_at: string
}
