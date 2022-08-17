export interface IAuth {
    username: string
    password: string
    source: string
}

export interface IRole {
    id: number
    name: string
    to_team: string
    to_delivery: string
    to_directory: string
    to_defectoscopy: string
}

export interface IAccount {
    id: number
    username: string
    full_name: string
    organization_name: string
    team_name: string
    job_title: string
    is_superuser: boolean
    role: IRole
}

export interface IAuthResponse {
    key: string
    user: IAccount
}

