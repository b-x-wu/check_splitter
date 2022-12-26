import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

const DinerNameInput = (props) => {
    const [dinerName, setDinerName] = useState('')

    const handleDinerNameChange = (event) => {
        setDinerName(event.target.value)
    }

    // TODO: implement a way to remove diner names

    return (
        <>
            Diner Name Input
            <ul>
                {props.dinerNames.map((dinerName, idx) => <li key={idx}>{dinerName}</li>)}
            </ul>
            <form>
                <input type={"text"} onChange={handleDinerNameChange} value={dinerName}></input>
                <button onClick={(event) => {
                    props.onAddDinerName(event, dinerName)
                    setDinerName('')
                }}>Add Diner</button>
            </form>
            <button onClick={props.onChangeAppState}>Input Items</button>
        </>
    )
}

const ItemInput = (props) => {
    return (
        <>
            Item Input
            <button onClick={props.onChangeAppState}>View Results</button>
        </>
    )
}

const ResultsDisplay = (props) => {
    return (
        <>
            Results Display
            <button onClick={props.onChangeAppState}>Reset</button>
        </>
    )
}

const ErrorDisplay = (props) => {
    return (
        <>
            Error Display
            <button onClick={props.onChangeAppState}>Reset</button>
        </>
    )
}

const App = () => {
    const [appState, setAppState] = useState('diner-name-input')
    const [dinerNames, setDinerNames] = useState([])

    const handleAddDinerName = (event, dinerName) => {
        event.preventDefault()
        if (dinerName !== '') {
            const dinerNamesClone = dinerNames.slice()
            dinerNamesClone.push(dinerName)
            setDinerNames(dinerNamesClone)
        }
    }

    let currentAppState;
    switch (appState) {
        case 'diner-name-input':
            currentAppState = <DinerNameInput 
                onChangeAppState={() => { setAppState('item-input') }} 
                onAddDinerName={handleAddDinerName} 
                dinerNames={dinerNames}
            />
            break
        case 'item-input':
            currentAppState = <ItemInput onChangeAppState={() => { setAppState('results-display') }} />
            break
        case 'results-display':
            currentAppState = <ResultsDisplay onChangeAppState={() => { setAppState('diner-name-input') }} />
            break
        default:
            currentAppState = <ErrorDisplay onChangeAppState={() => { setAppState('diner-name-input') }} />
            break
    }

    return (
        <>
            {currentAppState}
        </>
    )
}

const root = createRoot(document.getElementById('root'))
root.render(<React.StrictMode><App /></React.StrictMode>)
