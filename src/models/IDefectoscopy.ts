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
