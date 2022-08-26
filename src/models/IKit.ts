import {RcFile} from "antd/es/upload/interface";

export interface IKit {
    id: number
    amount: number
    name: string
    parameter: number
    pipes?: any[]
    manufacturer?: number
    passport?: string | RcFile
    general_state: string
    pipe_class: string
    pipe_version_name: string
    team_kit?: number
    last_returnable?: boolean
    last_moving_id?: number
}

export const general_state_choose = {
    '2': 'неуд.',
    '3': 'уд.',
    '4': 'хор.',
    '5': 'отл.',
}

export const pipe_class_choose = {
    'ultra': 'Ультра',
    'premium': 'Премиум',
    'class_2': 'Класс 2',
    'class_3': 'Класс 3',
}

export interface ITeamKit {
    id: number
    name: string
    team: number
    kits: IKit[]
}

export interface ITeam {
    id: number
    name: string
    location_name: string
    organization: number
    location?: string
    team_kit: ITeamKit
}

export interface IOrganizationTK {
    id: number
    name: string
    full_name: string
    location: string
    comment?: string
    administrative: boolean
    teams: ITeam[]
}

export const moving_status = {
    create: {status: 'Новый', color: {backgroundColor: 'secondary.light'}},
    sent: {status: 'В пути', color: {backgroundColor: 'warning.light'}},
    received: {status: 'Получен', color: {backgroundColor: 'success.light'}},
    back: {status: 'Возврат', color: {backgroundColor: ''}},
    cancellation: {status: 'Отменен', color: {backgroundColor: 'error.light'}},
}

export interface IMoving {
    id: number
    date_create: string
    amount: number
    from_kit: number
    to_team: number
    sent_kit: number | null
    delivery_date_time: string
    delivery_initiator: string | null
    transfer_basis: string
    creator: number
    creator_name: string
    recipient: number | null
    recipient_name: string | null
    last_status_name: string
    returnable: boolean
    from_kit_name: string
    from_team_kit_name: string
    from_organization_name: string
    to_team_kit_name: string
    to_organization_name: string
}
