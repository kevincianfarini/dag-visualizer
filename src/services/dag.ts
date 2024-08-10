import { DagElement, DagElementTypes } from "../entities/dag-element";

export async function getDag(): Promise<DagElement[]> {
    const response = await fetch(process.env.PUBLIC_URL + "/dag.mermaid")
    const data = await response.text()
    return data.split(/\r?\n/).flatMap((line) => mapTextLineToDagElement(line) )
}

function mapTextLineToDagElement(line: string): DagElement[] {
    const ret: DagElement[] = []
    if (line.includes("-->")) {
        const nodes = line.split(" --> ")
        console.log(nodes)
        nodes.forEach((node) => {
            const element = new DagElement(
               node,
               DagElementTypes.Node,
            )
            ret.push(element)
        })
        ret.push(new DagElement(
            line, 
            DagElementTypes.SolidEdge,
            nodes[0],
            nodes[1]
        ))
    } else if (line.includes("-.->")) {
        const nodes = line.split(" -.-> ")
        console.log(nodes)
        nodes.forEach((node) => {
            const element = new DagElement(
               node,
               DagElementTypes.Node,
            )
            ret.push(element)
        })
        ret.push(new DagElement(
            line, 
            DagElementTypes.DottedEdge,
            nodes[0],
            nodes[1]
        ))
    }
    return ret
}