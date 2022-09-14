export interface IDefectoscopy {
    id: number
    date_create: string
    doc_number: string
    organization: number
    date_defectoscopy_start?: string
    date_defectoscopy_end?: string
    location: string
    application_number: string
    kit: number
    standarts: number[]
    contract: string | null
    tools: number[]
    defectoscopist: number
    lom_count: number
    pipe_count: number
    kit_count: number
}

export interface IStandarts {
    id: number
    name: string
    type_procedure: string
}

export interface IConventions {
    id: number
    name: string
    full_name: string
}

export interface IPipe {
    id: number
    serial_number: string
    wall_thickness: number
    length: number
    pipe_body_class: string
    lock_connection_class: string
    comment: string | null
    report: number
    internal_coatings: number
    curvature: number
    emc: number
    outer_diameter: number
    mpd: number
    nipple_outside_diameter: number
    nipple_chamfer_diameter: number
    nipple_location_of_the_key: number
    nipple_inner_diameter: number
    nipple_length: number | null
    nipple_hard_alloy_welding_min: number
    nipple_mpd_lock_connection: number
    nipple_state: number
    coupling_outside_diameter: number
    coupling_chamfer_diameter: number
    coupling_shoulder_width: number
    coupling_taper_groove_diameter: number
    coupling_depth_conical_undercut: number
    coupling_key_installation_location: number
    coupling_class: string
    coupling_hard_alloy_welding_min: number
    coupling_mpd_threaded_connection: number
    coupling_state: number
}

export const class_choices = {
    ultra: 'Ультра',
    premium: 'Премиум',
    class_2: 'Класс 2',
    class_3: 'Класс 3',
    lom: 'Лом',
    otbrak: 'Отбрак',
}