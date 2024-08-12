import cytoscape, { Collection, CollectionReturnValue, NodeCollection, NodeSingular } from 'cytoscape';
import dagre from 'cytoscape-dagre';

import CytoscapeComponent from 'react-cytoscapejs';
import { DagElement } from '../entities/dag-element';
import { convertDagElementsToElementDefinitions } from '../visualization/cytoscape-adapter';
import { useRef, useCallback } from 'react';

const HIGHLIGHT_CLASS_NAME = "highlight"
const DOTTED_CLASS_NAME = "dotted"
const SOLID_CLASS_NAME = "solid"

function addHighlightToNodeAndConnections(collection: Collection): void {
    // Select this manually selected node. 
    collection.addClass(HIGHLIGHT_CLASS_NAME)
    // Unconditionally select all direct prececessors. 
    collection.nodes().incomers().addClass(HIGHLIGHT_CLASS_NAME)
    // Recursively highlight all predecessors that are connected via solid edges. 
    addHighlightToPredecessorNodes(collection.nodes().incomers('node'))
}

function addHighlightToPredecessorNodes(nodes: NodeCollection): void {
    // Given a list of nodes that have already been highlighted, 
    // find each node's incoming edges and nodes connected via a solid line
    // and highlight them. Then recurse. 
    const connectedSolidEdges = nodes.incomers('.solid')
    connectedSolidEdges.addClass(HIGHLIGHT_CLASS_NAME)
    const sourceNodes = connectedSolidEdges.sources()
    sourceNodes.addClass(HIGHLIGHT_CLASS_NAME)
    addHighlightToPredecessorNodes(sourceNodes)
}

function removeHighlightFromNodeAndConnections(collection: Collection): void {
    collection.removeClass(HIGHLIGHT_CLASS_NAME)
    collection.nodes().successors().removeClass(HIGHLIGHT_CLASS_NAME)
    collection.nodes().predecessors().removeClass(HIGHLIGHT_CLASS_NAME)

}

export function DagVisualizationComponent(props: { dagElements: DagElement[], cyRef(cy: cytoscape.Core): void }) {
    cytoscape.use(dagre)

    const cy = useRef<cytoscape.Core | null>(null);
    const setCytoscape = useCallback(
        (ref: cytoscape.Core) => {
            cy.current = ref;
            cy.current.on("select", "node", (event) => {
                const target: Collection[] = event.target
                addHighlightToNodeAndConnections(target[0])
            })
            cy.current.on("unselect", "node", (event) => {
                const target: Collection[] = event.target
                removeHighlightFromNodeAndConnections(target[0])
            })
            props.cyRef(cy.current)


        },
        [cy, props],
    );

    const style: React.CSSProperties = {
        // "background": "gray",
        "width": "max-width",
        "height": "100vh",
    }

    const layout = {
        name: 'dagre',
        nodeDimensionsIncludeLabels: true,
        animate: true,
        rankDir: 'LR'
        // grid: true,
        // directed: true,
    }

    const stylesheet: cytoscape.Stylesheet[] = [
        {
            selector: 'node',
            style: {
                'background-color': 'data(backgroundColor)',
                'label': 'data(id)',
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': '#f4f4f4',
                'target-arrow-color': '#f4f4f4',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                // 'label': 'data(id)'
            }
        },
        {
            selector: `edge.${DOTTED_CLASS_NAME}`,
            style: {
                'line-style': 'dashed'
            }
        },
        {
            selector: `node.${HIGHLIGHT_CLASS_NAME}`,
            style: {
                // 'color': 'red',
                'border-color': 'black',
                'border-width': '2',
                'transition-property': 'border-color border-width',
                'transition-duration': 2,
                'transition-timing-function': 'ease-in'
            }
        },
        {
            selector: `edge.${HIGHLIGHT_CLASS_NAME}`,
            style: {
                // 'label': 'data(id)',
                'line-color': 'black',
                'target-arrow-color': 'black',
                'transition-property': 'line-color target-arrow-color',
                'transition-duration': 2,
                'transition-timing-function': 'ease-in'
            }
        }
    ]

    if (props.dagElements.length === 0) {
        return <div />
    }

    return <CytoscapeComponent
        cy={setCytoscape}
        elements={convertDagElementsToElementDefinitions(props.dagElements)}
        layout={layout}
        style={style}
        // @ts-ignore - Somehow the types seem to be out of date.
        stylesheet={stylesheet}
        autoungrabify={true} // Make sure nodes can't be dragged around as that creates a mess
    ></CytoscapeComponent>
}