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
    const checkboxRef = useRef();
    const {data} = props;
    let {toggleCallback} = props;

    if (!toggleCallback) {
        toggleCallback = () => {
            console.log('default toggleCallback')
        };
    }

    const [selectedStatus, setSelectedStatus] = useState(SelectedStatus.UNSELECTED);
    const [selectedChildren, setSelectedChildren] = useState([]);

    useEffect(() => {
        setSelectedStatus(props.selectedStatus);
    }, [props.selectedStatus]);

    function toggleSelection() {
        console.log('toggling');
        let newStatus;
        switch (selectedStatus) {
            case SelectedStatus.SELECTED:
                newStatus = SelectedStatus.UNSELECTED;
                break;
            case SelectedStatus.UNSELECTED:
                newStatus = SelectedStatus.SELECTED;
                break;
            case SelectedStatus.PARTIAL:
                newStatus = SelectedStatus.PARTIAL;
                break;
            default:
                newStatus = SelectedStatus.SELECTED;
                break;
        }
        setSelectedStatus(newStatus);
        toggleCallback(data, newStatus);
    }

    const childItems = data.children.map(item => {
        const childSelectedStatus = selectedStatus === SelectedStatus.SELECTED ? SelectedStatus.SELECTED : SelectedStatus.UNSELECTED;
        return (
            <HierarchyItem key={item.title}
                           data={item}
                           selectedStatus={childSelectedStatus}
                           toggleCallback={(childData, childSelectedStatus) => {
                               console.log('toggleCallback', childData, childSelectedStatus);
                               const newSelectedChildren = selectedChildren.slice();
                               switch (childSelectedStatus) {
                                   case SelectedStatus.SELECTED:
                                       newSelectedChildren.push(childData);
                                       break;
                                   case SelectedStatus.UNSELECTED:
                                       const childIndex = newSelectedChildren.findIndex(item => {
                                           return item.title === childData.title
                                       });
                                       newSelectedChildren.splice(childIndex, 1);
                                       break;
                                   default:
                                       break;
                               }
                               setSelectedChildren(newSelectedChildren);
                               let newSelectedStatus;
                               if (newSelectedChildren.length === 0) {
                                   newSelectedStatus = SelectedStatus.UNSELECTED;
                               } else if (newSelectedChildren.length < data.children.length) {
                                   newSelectedStatus = SelectedStatus.PARTIAL;
                               } else {
                                   newSelectedStatus = SelectedStatus.SELECTED;
                               }
                               setSelectedStatus(newSelectedStatus);
                               checkboxRef.current.indeterminate = newSelectedStatus === SelectedStatus.PARTIAL;
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
                       onClick={toggleSelection}/>
                &nbsp; <span>{data.title}</span>
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
    const items = data.map(item => {
        return (<HierarchyItem key={item.title} data={item} selectedStatus={SelectedStatus.UNSELECTED}
                               selectedChildren={[]}/>);
    });

    return (
        <div className="hierarchy-navigator">
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
