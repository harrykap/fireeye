import React, {useState, useRef, useEffect} from 'react';
import {Collapse} from 'reactstrap';

const items = [
    {
        title: 'North America',
        children: [
            {
                title: 'Canada',
                children:[
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
        ],
    }
];

function HierarchyItem(props) {
    const checkboxRef = useRef();
    const { data } = props;
    /*
    useEffect(() => {
        checkboxRef.current.indeterminate = true;
    })
*/
    const childItems = data.children.map(item => {
       return (<HierarchyItem data={item} />);
    });

    return (
        <div style={{paddingLeft:'1em'}}>
            <div><input type="checkbox" ref={checkboxRef} /> <span>{data.title}</span></div>
            <Collapse isOpen>
                <div style={{paddingLeft: '1em'}}>
                    {childItems}
                </div>
            </Collapse>
        </div>
    )
}

function HierarchyNavigator(props) {
    const { data } = props;
    console.log("data is", data);
    const navigatorItems = data.map(item => {
        return (<HierarchyItem data={item} />);
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
        <HierarchyNavigator data={items} />
    );
}

export default App;
