
import type { FlowFunction } from "~/waterflow/composables/usePageFlow"

export type TemplateTransitionProps = {
}

export const defaultFlowOut: FlowFunction<TemplateTransitionProps> = (props: {}, resolve, provider) => {

    const tl = useTL()
    const canvas = useCanvas()

    canvas.onChange(provider.getRouteTo())

    canvas.resolveOnChange()

    resolve()

}

export const defaultFlowIn: FlowFunction<TemplateTransitionProps> = ({ }, resolve,) => {
    resolve()
}

export const indexIdFlowIn: FlowFunction<TemplateTransitionProps> = ({ }, resolve,) => {
    resolve()
}

export const flowOutMap = new Map([
    ['default', defaultFlowOut],
])