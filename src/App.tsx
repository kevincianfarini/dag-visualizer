import { useState } from 'react';
import './App.css';
import { DagVisualizationComponent } from './components/dag-visualization';
import { DAGInput } from './components/dag-controls';
import { DagElement, DagElementTypes } from './entities/dag-element';

function App() {
  const [dagText, setDagText] = useState<string>("")
  function dagTextUpdated(intput: string) {
    setDagText(intput)
  }
  return (
    <div>
      <DAGInput onDagUpdated={dagTextUpdated} />
      <DagVisualizationComponent dagElements={mapInputToDagElements(dagText)} />
    </div>
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
