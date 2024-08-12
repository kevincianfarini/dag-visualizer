import { FormEvent, useState } from "react"
import { Container, Stack } from "react-bootstrap"


export const DAGInput = (props: { onDagUpdated(input: string): void }) => {
    const [state, setState] = useState<string>("")
    const sidebarStyle: React.CSSProperties = {
        // "width": "0vw",
        // "height": "100vh",
    }
    const inputStyle: React.CSSProperties = {
        // "width": "max-width",
        // "height": "max-height",
    }
    return <Stack style={sidebarStyle}>
        <h2>DAG Input</h2>
        <textarea onChange={ e => setState(e.target.value) } />
        <button onClick={ () => { props.onDagUpdated(state) } }>Update</button>
    </Stack>
}