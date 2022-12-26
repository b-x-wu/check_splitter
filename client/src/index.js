import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

const DinerNameInput = (props) => {
    return (
        <>
            Diner Name Input
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

    let currentAppState;
    switch (appState) {
        case 'diner-name-input':
            currentAppState = <DinerNameInput onChangeAppState={() => { setAppState('item-input') }} />
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
root.render(<App />)
