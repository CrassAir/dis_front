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
    nominal_pipe_diameter: number
    weight_foot: number
    reinforcement: boolean
    internal_coating: boolean
    pipe_inner_diameter: number
    lock_outside_diameter: number
    lock_inner_diameter: number
    weight: number
    wall_thickness: number
    length: number
    strength_group: ISubParameter
    size_range: ISubParameter
    lock_thread: ISubParameter
    lock_type: ISubParameter
    pipe_type: IPipeType
}