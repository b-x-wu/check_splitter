import React, { useState, useEffect } from 'react'
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
    const [itemName, setItemName] = useState('')
    const [itemPrice, setItemPrice] = useState(0)
    const [dinerIds, setDinerIds] = useState([])

    const handleItemNameChange = (event) => {
        event.preventDefault()
        setItemName(event.target.value)
    }

    const handleItemPriceChange = (event) => {
        event.preventDefault()
        setItemPrice(parseFloat(event.target.value))
    }

    const handleAddDinerId = (event) => {
        event.preventDefault()
        if (event.target.value === '') {
            return
        }

        const newDinerId = parseInt(event.target.value)
        if (dinerIds.includes(newDinerId)) {
            return
        }

        const dinerIdsClone = dinerIds.slice()
        dinerIdsClone.push(newDinerId)
        setDinerIds(dinerIdsClone)
    }

    const handleAddItem = (event) => {
        event.preventDefault()
        props.onAddItem(event, itemName, itemPrice, dinerIds)
        setDinerIds([])
        setItemName('')
        setItemPrice(0)
    }

    return (
        <>
            Item Input
            <form>
                <input type={"text"} value={itemName} onChange={handleItemNameChange}></input>
                <input type={"number"} value={itemPrice} onChange={handleItemPriceChange}></input>
                <select onChange={handleAddDinerId} value={""}>
                    <option defaultValue={""} hidden>Who's paying for this?</option>
                    {props.dinerNames.map((dinerName, idx) => <option value={idx} key={idx}>{dinerName}</option>)}
                </select>
                <button onClick={handleAddItem}>Add Item</button>
            </form>
            <ul>
                {dinerIds.map((dinerId) => <li key={dinerId}>{props.dinerNames[dinerId]}</li>)}
            </ul>
            <button onClick={props.onChangeAppState}>Input Tip/Tax</button>
            <div>
                Added Items
                {props.items.map((item, idx) => {
                    return(
                        <div key={idx}>
                            {item.name} (${item.price}) - {item.dinerIds.map((dinerId) => props.dinerNames[dinerId]).join(', ')}
                        </div>
                    )
                })}
            </div>
        </>
    )
}

const TipTaxInput = (props) => {
    return(
        <>
            Tip: <input type={"number"} onChange={props.onChangeTip}></input>
            Tax: <input type={"number"} onChange={props.onChangeTax}></input>
            <button onClick={props.onChangeAppState}>View Results</button>
        </>
    )
}

const ResultsDisplay = (props) => {
    const [results, setResults] = useState([])

    useEffect(() => {
        async function getResults() {
            const check = {
                items: props.items,
                diners: props.dinerNames.map((dinerName, idx) => ({ name: dinerName, id: idx })),
                tip: props.tip / 100,
                tax: props.tax / 100
            }
            const response = await fetch('http://localhost:3000/api/split', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(check)
            })
            const responseBody = await response.json()
            console.log(responseBody)
            setResults(responseBody.data.diners)
        }
        getResults()
    }, [])

    return (
        <>
            {results.length === 0 ? "Loading" : results.map((diner) => <div key={diner.id}>
                {diner.name} owes ${Math.floor(100 * diner.owes) / 100} for {diner.items.map((item) => item.name).join(', ')}
            </div>)}
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
    const [items, setItems] = useState([])
    const [tip, setTip] = useState(0)
    const [tax, setTax] = useState(0)

    const handleAddDinerName = (event, dinerName) => {
        event.preventDefault()
        if (dinerName !== '') {
            const dinerNamesClone = dinerNames.slice()
            dinerNamesClone.push(dinerName)
            setDinerNames(dinerNamesClone)
        }
    }

    const handleAddItem = (event, name, price, dinerIds) => {
        event.preventDefault()
        // assume dinerIds are unique
        if (price !== '' && name !== 0 && dinerIds.length !== 0) {
            const itemsClone = JSON.parse(JSON.stringify(items))
            const newItem = {
                name,
                price,
                dinerIds
            }
            itemsClone.push(newItem)
            setItems(itemsClone)
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
            currentAppState = <ItemInput
                onChangeAppState={() => { setAppState('tip-tax-input') }}
                onAddItem={handleAddItem}
                dinerNames={dinerNames}
                items={items}
            />
            break
        case 'tip-tax-input':
            currentAppState = <TipTaxInput
                onChangeAppState={() => { setAppState('results-display') }}
                onChangeTip={(event) => { setTip(parseFloat(event.target.value)) }}
                onChangeTax={(event) => { setTax(parseFloat(event.target.value)) }}
            />
            break
        case 'results-display':
            currentAppState = <ResultsDisplay 
                onChangeAppState={() => { setAppState('diner-name-input') }}
                dinerNames={dinerNames}
                items={items}
                tip={tip}
                tax={tax}
            />
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
