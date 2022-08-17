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