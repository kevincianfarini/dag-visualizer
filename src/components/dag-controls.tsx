import { useState } from "react"

export const DAGInput = (props: { onDagUpdated(input: string): void }) => {
    const [state, setState] = useState<string>("")
    const [isMinimized, setMinimized] = useState<boolean>(false)
    // const sidebarStyle: React.CSSProperties = {
    //     "width": "10vw",
    //     "height": "100vh",
    // }
    // const inputStyle: React.CSSProperties = {
    //     // "width": "max-width",
    //     // "height": "max-height",
    // }
    return <div>
        {!isMinimized ?
            <div>

                <h2>DAG Input</h2>
                <textarea value={state} onChange={e => setState(e.target.value)} />
                <button onClick={() => { props.onDagUpdated(state) }}>Update</button>
            </div>
            : <div />
        }
        <button onClick={() => setMinimized(!isMinimized)}>
            {isMinimized ? "Maximize" : "Minimize"}
        </button>
    </div>
}