export interface ISubParameter {
    id: number
    name: string
}

export interface IPipeType {
    id: number
    name: string
    create_unique_pipe: boolean
}

export interface IParameter {
    id: number
    nominal_pipe_diameter?: number
    weight_foot?: number
    reinforcement: boolean
    internal_coating: boolean
    pipe_inner_diameter?: number
    lock_outside_diameter?: number
    lock_inner_diameter?: number
    weight?: number
    wall_thickness?: number
    length?: number
    strength_group?: number
    size_range?: number
    lock_thread?: number
    lock_type?: number
    pipe_type?: number
    tableData?: any
}

export const BlankParameter: IParameter = {
    id: -1,
    nominal_pipe_diameter: undefined,
    weight_foot: undefined,
    reinforcement: true,
    internal_coating: false,
    pipe_inner_diameter: undefined,
    lock_outside_diameter: undefined,
    lock_inner_diameter: undefined,
    weight: undefined,
    wall_thickness: undefined,
    length: undefined,
    strength_group: 1,
    size_range: undefined,
    lock_thread: undefined,
    lock_type: undefined,
    pipe_type: undefined,
}