import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { db } from './firebase';
import { collection,query, orderBy, onSnapshot } from "firebase/firestore"; 
import * as legend from "d3-svg-legend";

const Graph = () => {

   const ref = useRef();
   const dims = { height: 300, width: 300, radius: 150 };
   const cent = { x: (dims.width / 2 + 5), y: (dims.height / 2 + 5)};

    useEffect(() => {
    
        const svg = d3.select(ref.current)
        .append('svg')
            .attr('width', dims.width + 150)
            .attr('height', dims.height + 150);
            
        const graph = svg.append('g')
                         .attr("transform", `translate(${cent.x}, ${cent.y})`);
        const pie = d3.pie()
                      .sort(null)
                      .value(d => d.cost);// the value we are evaluating to create the pie angles
        const arcPath = d3.arc()
                          .outerRadius(dims.radius)
                          .innerRadius(dims.radius / 2);
        //set random generated colour 
        const colour = d3.scaleOrdinal(d3["schemeSet2"]);

        //legend setup
        const legendGroup = svg.append('g')
                               .attr('transform', `translate(${dims.width + 50}, 10)`)

        const legends = legend.legendColor()
                            .shape('path', d3.symbol().type(d3.symbolSquare)())
                            .shapePadding(10)
                            .scale(colour);

        
        //----------------- Update function -----------------------//
        const update = (data) => {
            // update colour scale domain
            colour.domain(data.map(d => d.name));
            // update legend
            legendGroup.call(legends);
            legendGroup.selectAll('text')
                       .attr('fill', 'white');
            // join enhanced (pie) data to path elements
            const paths = graph.selectAll('path')
                               .data(pie(data));
            // console.log(paths);
            
            //tweens for enter, exit and update
            const arcTweenExit = (d) => {
              var i = d3.interpolate(d.startAngle, d.endAngle);
                return function(t) {
                    d.startAngle = i(t);
                      return arcPath(d);
                };
            }
            const arcTweenEnter = (d) => {
                var i = d3.interpolate(d.endAngle, d.startAngle)
                    return function(t) {
                        d.startAngle = i(t);
                          return arcPath(d);
                    };
            }
            function arcTweenUpdate(d) {
                //console.log(this._current, d);
                // interpolate between the two objects
                var i = d3.interpolate(this._current, d);
                     // update the current prop with new updated data
                     this._current = i(1);
                         return function(t) {
                         // i(t) returns a value of d (data object) which we pass to arcPath
                              return arcPath(i(t));
                         };
            }; 
            // handle the exit selection 
            paths.exit()
                 .transition().duration(750)
                 .attrTween("d", arcTweenExit)
                 .remove();   
            // handle the current DOM path updates
            paths.transition()
                 .duration(750)
                 .attrTween("d", arcTweenUpdate);    
            //enter selection
            paths.enter()
                    .append('path')
                    .attr('class', 'arc')
                    .attr('d', arcPath)
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 3)
                    .attr('fill', d => colour(d.data.name))
                    .each(function(d){ this._current = d })
                    .transition().duration(750).attrTween("d", arcTweenEnter);                 
        } 

        //----------------- Firebase real time updates --------------//
        var data = [];  
        const dataRef = collection(db, "expenseTracker");
        const q = query(dataRef, orderBy("cost"));
        // const querySnapshot = getDocs(q);
        //console.log(querySnapshot.onSnapshot)
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const changes = querySnapshot.docChanges();
            changes.forEach((change) => {
                const doc = {...change.doc.data(), id: change.doc.id};
                // console.log("change type: " +change.type+ "  change id: " + change.doc.id)
                switch (change.type) {
                    case 'added':
                       data.push(doc);
                       break;
                    case 'modified':
                        const index = data.findIndex(item => item.id == doc.id);
                        data[index] = doc;
                        break;
                    case 'removed':
                        data = data.filter(item => item.id !== change.doc.id);
                        break;
                    default:
                        break;
                } 
            });
            update(data);
        });   
            
    }, [])
    return(
     
        
        <div className='canvas'>
            <div ref={ref}>
                
            </div>
        </div>
   
    );
}

export default Graph;

