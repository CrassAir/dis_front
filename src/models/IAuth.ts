export interface IAuth {
    username: string
    password: string
    source: string
}

export interface IAccount {
    id: number
    username: string
    token: string
    full_name: string
}