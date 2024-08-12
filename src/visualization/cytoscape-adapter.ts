import cytoscape from "cytoscape";
import ColorHash from 'color-hash'
import { DagElement, DagElementTypes } from "../entities/dag-element";

const DOTTED_CLASS_NAME = "dotted"
const SOLID_CLASS_NAME = "solid"

export function convertDagElementToElementDefinition(dagElement: DagElement): cytoscape.ElementDefinition {
    const colorHash = new ColorHash()
    const backgroundColor = dagElement.colorKey !== undefined ? colorHash.rgb(dagElement.colorKey) : "gray"
    var className = ''
    if (dagElement.type === DagElementTypes.DottedEdge) {
        className = DOTTED_CLASS_NAME
    } else if (dagElement.type === DagElementTypes.SolidEdge) {
        className = SOLID_CLASS_NAME
    }
    return {
        classes: className,
        data: {
            id: dagElement.id,
            source: dagElement.source,
            target: dagElement.target,
            backgroundColor: backgroundColor,
        },
    }
}

export function convertDagElementsToElementDefinitions(dagElements: DagElement[]): cytoscape.ElementDefinition[] {
    return dagElements.map(convertDagElementToElementDefinition)
}
