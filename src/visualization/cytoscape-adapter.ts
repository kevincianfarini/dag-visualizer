import cytoscape, { Css } from "cytoscape";
import ColorHash from 'color-hash'
import { DagElement, DagElementTypes } from "../entities/dag-element";

const DOTTED_CLASS_NAME = "dotted"

export function convertDagElementToElementDefinition(dagElement: DagElement): cytoscape.ElementDefinition {
    const colorHash = new ColorHash()
    const backgroundColor = dagElement.colorKey !== undefined ? colorHash.rgb(dagElement.colorKey) : "gray"
    console.log(dagElement.type)
    return {
        classes: `${dagElement.type == DagElementTypes.DottedEdge ? DOTTED_CLASS_NAME : ''}`,
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
