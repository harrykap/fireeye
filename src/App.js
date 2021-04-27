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
                                title: 'New York City',
                                children: [
                                    {
                                        title: 'Manhattan',
                                        children: [],
                                    },
                                    {
                                        title: 'Brooklyn',
                                        children: [],
                                    },
                                    {
                                        title: 'Queens',
                                        children: [],
                                    },
                                    {
                                        title: 'The Bronx',
                                        children: [],
                                    },
                                    {
                                        title: 'Staten Island',
                                        children: [],
                                    },
                                ],
                            },
                            {
                                title: 'Buffalo',
                                children: [],
                            },
                            {
                                title: 'Rochester',
                                children: [],
                            },
                        ],
                    },
                    {
                        title: 'Pennsylvania',
                        children: [
                            {
                                title: 'Philadelphia',
                                children: [],
                            },
                            {
                                title: 'Pittsburgh',
                                children: [],
                            },
                            {
                                title: 'Allentown',
                                children: [],
                            },
                            {
                                title: 'Wilkes-Barre',
                                children: [],
                            },
                        ],
                    },
                ],
            },

        ],
    },
    /*
    {
        title: 'Europe',
        children: [],
    },
    */
];

const SelectedStatus = {
    SELECTED: 1,
    PARTIAL: 0.5,
    UNSELECTED: 0,
}

function HierarchyItem(props) {
    const {data} = props;
    let {toggleCallback} = props;

    if (!toggleCallback) {
        toggleCallback = () => {
            console.log('default toggleCallback')
        };
    }

    const [selectedStatus, setSelectedStatus] = useState(SelectedStatus.UNSELECTED);
    const [selectedChildCount, setSelectedChildCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setSelectedStatus(props.selectedStatus);
    }, [props.selectedStatus]);

    const checkboxRef = useRef();
    useEffect(() => {
        if(selectedStatus === SelectedStatus.PARTIAL) {
            checkboxRef.current.indeterminate = true;
        } else {
            checkboxRef.current.indeterminate = false;
        }
    }, [selectedStatus]);

    function toggleSelection() {
        console.log('toggling');
        let newStatus;
        let newSelectedChildCount;
        switch (selectedStatus) {
            case SelectedStatus.SELECTED:
                newStatus = SelectedStatus.UNSELECTED;
                newSelectedChildCount = 0;
                break;
            case SelectedStatus.UNSELECTED:
                newStatus = SelectedStatus.SELECTED;
                newSelectedChildCount = data.children.length;
                break;
            case SelectedStatus.PARTIAL:
                newStatus = SelectedStatus.SELECTED;
                newSelectedChildCount = data.children.length;
                break;
            default:
                newStatus = SelectedStatus.SELECTED;
                break;
        }
        setSelectedStatus(newStatus);
        setSelectedChildCount(newSelectedChildCount);
        toggleCallback(data, newStatus);
    }

    function toggleIsOpen() {
        setIsOpen(!isOpen);
    }

    const childItems = data.children.map(item => {
        const childSelectedStatus = selectedStatus === SelectedStatus.SELECTED ? SelectedStatus.SELECTED : SelectedStatus.UNSELECTED;
        return (
            <HierarchyItem key={item.title}
                           data={item}
                           selectedStatus={childSelectedStatus}
                           toggleCallback={(childData, childSelectedStatus) => {
                               console.log('toggleCallback', childData, childSelectedStatus);
                               switch (childSelectedStatus) {
                                   case SelectedStatus.SELECTED:
                                       const newSelectedChildCount = selectedChildCount + 1;
                                       setSelectedChildCount(newSelectedChildCount);
                                       if(newSelectedChildCount === data.children.length) {
                                           setSelectedStatus(SelectedStatus.SELECTED);
                                       } else {
                                           setSelectedStatus(SelectedStatus.PARTIAL);
                                           toggleCallback(data, selectedStatus);
                                       }
                                       break;
                                   case SelectedStatus.UNSELECTED:
                                       setSelectedChildCount(selectedChildCount - 1);
                                       break;
                                   case SelectedStatus.PARTIAL:
                                       setSelectedStatus(SelectedStatus.PARTIAL);
                                       toggleCallback(data, selectedStatus);
                                       break;
                                   default:
                                       break;
                               }
                           }}
            />)
            ;
    });

    return (
        <div style={{paddingLeft: '1em'}}>
            <div>
                <input type="checkbox"
                       ref={checkboxRef}
                       checked={selectedStatus === SelectedStatus.SELECTED}
                       onChange={toggleSelection}/>
                &nbsp; <span onClick={toggleIsOpen} style={{cursor:'pointer'}}>{data.title}</span>
            </div>
            <Collapse isOpen={isOpen}>
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
    const items = data.map(item => {
        return (<HierarchyItem key={item.title} data={item} selectedStatus={SelectedStatus.UNSELECTED}
                               selectedChildren={[]}/>);
    });

    return (
        <div style={{backgroundColor: 'blue', color:'white', border:'1px inset white', padding: '1em'}} className="hierarchy-navigator">
            {items}
        </div>
    );
}

function App() {
    return (
        <HierarchyNavigator data={items}/>
    );
}

export default App;
