import React, {useState, useRef, useEffect} from 'react';
import {Collapse} from 'reactstrap';

const items = [
    {
        title: 'North America',
        children: [
            {
                title: 'Canada',
                children: [
                    {
                        title: 'Alberta',
                        children: [
                            {
                                title: 'Calgary',
                                children: [],
                            },
                            {
                                title: 'Edmonton',
                                children: [],
                            },
                            {
                                title: 'Red Deer',
                                children: [],
                            },
                        ],
                    },
                ],
            },
            {
                title: 'United States',
                children: [
                    {
                        title: 'New York',
                        children: [
                            {
                                title: 'New York',
                                children: [],
                            },
                            {
                                title: 'Rochester',
                                children: [],
                            },
                            {
                                title: 'Buffalo',
                                children: [],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        title: 'Europe',
        children: [],
    }
];

const selectedStates = {
    SELECTED: 1,
    PARTIAL: 0.5,
    UNSELECTED: 0,
}

function HierarchyItem(props) {
    const checkboxRef = useRef();
    const {data} = props;
    let {toggleCallback} = props;

    if (!toggleCallback) {
        toggleCallback = () => {
            console.log('default toggleCallback')
        };
    }

    /*
    useEffect(() => {
        checkboxRef.current.indeterminate = true;
    })
*/
    const [isSelected, setIsSelected] = useState(false);
    const [selectedChildrenCount, setSelectedChildrenCount] = useState(0);

    function toggleSelection(event) {
        console.log('toggling');
        toggleCallback(!isSelected);
        setIsSelected(!isSelected);
    }

    const childItems = data.children.map(item => {
        return (
            <HierarchyItem data={item}
                           toggleCallback={(isSelected) => {
                               if (isSelected) {
                                   setSelectedChildrenCount(selectedChildrenCount + 1);
                               } else {
                                   setSelectedChildrenCount(selectedChildrenCount - 1)
                               }
                               console.log('toggleCallback', isSelected, selectedChildrenCount);
                           }}
    />)
        ;
    });

    return (
        <div style={{paddingLeft: '1em'}}>
            <div>
                <input type="checkbox"
                       ref={checkboxRef}
                       onChange={toggleSelection}/>
                <span>{data.title}</span>
                &nbsp;<span>{selectedChildrenCount}</span>
            </div>
            <Collapse isOpen>
                <div style={{paddingLeft: '1em'}}>
                    {childItems}
                </div>
            </Collapse>
        </div>
    )
}

function HierarchyNavigator(props) {
    const {data} = props;
    console.log("data is", data);
    const navigatorItems = data.map(item => {
        return (<HierarchyItem data={item}/>);
    });

    return (
        <div className="hierarchy-navigator">
            {navigatorItems}
            {/*
                <HierarchyItem data={{title: 'North America'}}>
                    <HierarchyItem data={{title: 'Canada'}}>
                        <HierarchyItem data={{title: 'Alberta'}} />
                        <HierarchyItem data={{title: 'Ontario'}} />
                        <HierarchyItem data={{title: 'Quebec'}} />
                    </HierarchyItem>
                    <HierarchyItem data={{title: 'Mexico'}} />
                    <HierarchyItem data={{title: 'United States'}} />
                </HierarchyItem>
            */}
        </div>
    );
}

function App() {
    return (
        <HierarchyNavigator data={items}/>
    );
}

export default App;
