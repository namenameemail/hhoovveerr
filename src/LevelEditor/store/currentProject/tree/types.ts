export interface Tree {
    div: DivById;
    rootDivId: DivId;
    activeDivId: DivId | null;
}

export type DivById = Record<DivId, Div | undefined>
export type DivId = string;

export type Div = {
    id: DivId;
    positionParameters: DivPositionParameters;
    styleParameters: DivStyleParameters;
    behaviorParameters: DivBehaviorParameters;
    children: DivId[];
    parent?: DivId;
}

export type DivPositionParameters = {
    startPoint: Vec2NumberUnit;
    size: Vec2NumberUnit;
    angle: number;
}

export type DivStyleParameters = {
    color?: string
    borderWidth?: NumberUnit
    borderRadius?: NumberUnit
    borderStyle?: string
    borderColor?: string
    zIndex?: number
    blendMode?: string

    text?: string
    textPosition?: Vec2NumberUnit
    fontSize?: NumberUnit
    fontId?: number
    fontStyle?: string
    fontWeight?: string
    textColour?: string
    textShadowXYOffset?: Vec2NumberUnit
    textShadowBlur?: NumberUnit
    textShadowColor?: string

    shadowXYOffset?: Vec2NumberUnit
    shadowSpread?: NumberUnit
    shadowBlur?: NumberUnit
    shadowColor?: string
    shadowInset?: boolean

    backgroundImageId?: number
    backgroundRepeat?: string
    backgroundPosition?: string
    backgroundSize?: string
}

export type DivBehaviorParameters = {
    // условие видимости
    visibilityConditions?: Condition
    // isVisible?: boolean

    stopClickPropagation?: boolean

    // настройки открытия закрытия
    openEvent: InteractionEvent
    closeEvent: InteractionEvent
    isOpen?: boolean // всегда открыт
    // openConditions?: Condition

// COLLECTABLE
    isCollectable: boolean
    collectableParameters: CollectableParameters

// RECEIVER
    isReceiver: boolean
    receiverParameters: ReceiverParameters

// TEMPLATE
    isTemplate: boolean
    templateParameters: TemplateParameters
}

export type CollectableParameters = {
    inventorySize: Vec2NumberUnit
    collectEvent: InteractionEvent
    name?: string
}

export type ReceivableCollectableParameters = DivPositionParameters & {

}
export type ReceiverParameters = {
    receiveEvent: InteractionEvent
    receivableCollectables: DivId[]
    receivableCollectablesParameters: {
        [id: DivId]: ReceivableCollectableParameters | undefined
    }
}

export type TemplateParameters = {
    randomColor?: boolean
}


export type Vec = [number, number]
export type Vec2NumberUnit = [NumberUnit, NumberUnit]
export type NumberUnit = [number, SizeUnit]
export type BgSize = [NumberUnit | 'cover' | 'contain' | 'auto', NumberUnit | 'auto' | undefined]

export enum SizeUnit {
    px = 'px',
    pc = '%',
    vw = 'vw',
    vh = 'vh',
    em = 'em',
}

export enum ConditionType {
    oneOf = 'oneOf',
    every = 'every',
    no = 'no',
    path = 'path'
}

export type Condition = {
    type: ConditionType
    array: string
}

export enum InteractionEvent {
    mouseEnter = 'mouseEnter',
    mouseLeave = 'mouseLeave',
    click = 'click',
    doubleClick = 'doubleClick',
}
