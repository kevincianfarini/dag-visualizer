import { useEffect, useState } from 'react';
import './App.css';
import { DagVisualizationComponent } from './components/dag-visualization';
import { Container, Stack } from 'react-bootstrap';
import { DAGInput } from './components/dag-controls';
import { DagElement, DagElementTypes } from './entities/dag-element';
import cytoscape from 'cytoscape';


function App() {

  const [dagText, setDagText] = useState<string>("")
  const [cy, setCy] = useState<cytoscape.Core | null>(null)

  function dagTextUpdated(intput: string) {
    setDagText(intput)
  }

  return (
    <Stack direction='horizontal'>
      <DAGInput onDagUpdated={dagTextUpdated} />
      <Container>
        <DagVisualizationComponent
          dagElements={mapInputToDagElements(dagText)}
          cyRef={(cy: cytoscape.Core) => { setCy(cy) }}
        />
      </Container>
    </Stack>
  );
}

function mapInputToDagElements(input: string): DagElement[] {
  return input.split(/\r?\n/).flatMap((line) => mapTextLineToDagElement(line))
}

function mapTextLineToDagElement(line: string): DagElement[] {
  const ret: DagElement[] = []
  if (line.includes("-->")) {
    const nodes = line.split("-->")
    if (nodes.length === 2 && nodes.every(it => !isEmpty(it))) {
      nodes.forEach((node) => {
        const element = new DagElement(
          node.trim(),
          DagElementTypes.Node,
        )
        ret.push(element)
      })
      ret.push(new DagElement(
        line,
        DagElementTypes.SolidEdge,
        nodes[0].trim(),
        nodes[1].trim()
      ))
    }
  } else if (line.includes("-.->")) {
    const nodes = line.split("-.->")
    if (nodes.length === 2 && nodes.every(it => !isEmpty(it))) {
      nodes.forEach((node) => {
        const element = new DagElement(
          node.trim(),
          DagElementTypes.Node,
        )
        ret.push(element)
      })
      ret.push(new DagElement(
        line,
        DagElementTypes.DottedEdge,
        nodes[0].trim(),
        nodes[1].trim()
      ))
    }
  }
  return ret
}

const isEmpty = function (text: string): boolean {
  return (!text || text.trim() === "");
}

export default App;
