import React, { useEffect, useState } from 'react'
import { dummy_data, email, image } from '../constant/dummy.js'

function InputField() {
    const [data, setData] = useState(dummy_data)
    const [name, setName] = useState('')
    const [selectedNames, setSelectedNames] = useState([]);
    const [filteredData, setFilteredData] = useState(data);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [backspacePressed, setBackspacePressed] = useState(0); // Track backspace key press



    // Update handleInput to use setFilteredData
    function handleInput(value) {
        setName(value);
        const filteredData = data.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
        setFilteredData(filteredData);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown' && focusedIndex < filteredData.length - 1) {
            setFocusedIndex(filteredData[focusedIndex + 1].id);
        }
        else if (e.key === 'ArrowUp' && focusedIndex > -1) {
            setFocusedIndex(filteredData[focusedIndex - 1].id);
        }
        else if (e.key === 'Enter' && focusedIndex > -1) {
            handleNameClick(filteredData[focusedIndex]);
        }
        else if (e.key === 'Backspace' && name === '' && selectedNames.length > 0) {
            if (backspacePressed == 0) {
                setBackspacePressed(backspacePressed + 1)
            }
            else {
                // Backspace pressed with an empty input and selected names exist
                const last_ele = selectedNames[selectedNames.length - 1];
                AddBackToList(last_ele)
                setBackspacePressed(0)
            }
        }
    };


    // Function to highlight matching text
    const highlightMatch = (item, query) => {
        const regex = new RegExp(`(${query})`, 'gi');
        const text = item.name;

        if (regex.test(text)) {
            return (
                <div id={item.id} className={`item ${focusedIndex == item.id ? 'focused-item' : ''}`} onClick={() => handleNameClick(item)}>
                    <img src={image} />
                    <div>
                        {text.split(regex).map((part, index) =>
                            regex.test(part) ? <strong key={index}>{part}</strong> : part
                        )}
                    </div>
                    <div>{email}</div>
                </div>
            );
        }

        return null; // Add this line if you want to handle the case when there is no match
    };



    const handleNameClick = (clickedName) => {
        setSelectedNames([...selectedNames, clickedName]);

        // Remove the selected name from filteredData
        const updatedFilteredData = filteredData.filter(item => item.name !== clickedName.name);
        setFilteredData(updatedFilteredData);
        setName('')
    };

    function handleInput(value) {
        setName(value)
    }

    function AddBackToList(data) {
        setFilteredData([...filteredData, data]);
        // Remove the selected name from filteredData
        const updatedSelectedNames = selectedNames.filter(item => item.name !== data.name);
        setSelectedNames(updatedSelectedNames)

    }

    return (
        <div className='center' >

            <div className='contanier-wrapper'>
                {
                    selectedNames.length > 0 &&
                    <>
                        {selectedNames.map((selectedName, index) => (
                            // <div key={index} className={`selected-name ${(selectedNames.length - 1 == index) && (backspacePressed == 1) && "highlight-item"}`} >
                            //     {selectedName.name} &nbsp; <span onClick={() => AddBackToList(selectedName)}>X</span>
                            // </div>

                            <div key={index} className={`selected-name ${(selectedNames.length - 1 == index) && (backspacePressed == 1) && "highlight-item"}`} >
                                <img src={image} alt='' />
                                <div style={{margin:'8px'}}> {selectedName.name} </div>
                                <div>{email}</div>
                                &nbsp; &nbsp; <span onClick={() => AddBackToList(selectedName)}>X</span>
                            </div>
                        ))}
                    </>
                }
                <input type='text' placeholder='Add user here...' value={name} onChange={(e) => handleInput(e.target.value)} onKeyDown={handleKeyDown} />
            </div>

            {
                name.length > 0 && (
                    <div className='data-table'>
                        {
                            filteredData.map((item, index) => highlightMatch(item, name))
                        }
                    </div>
                )
            }



        </div >
    )
}

export default InputField