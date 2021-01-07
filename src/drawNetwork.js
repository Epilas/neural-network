const d3 = require("d3");

function percToColor(percentage, maxHue = 110, minHue = 0) {
    const hue = percentage * (maxHue - minHue) + minHue;
    return `hsl(${hue}, 100%, 50%)`;
}

export function drawNetwork(net, width, height, nodeSize)  {

var svg = d3.select(".neuralNetwork").html("").append("svg")
    .attr("width", width)
    .attr("height", height);

    var netSize = net.sizes;

    var xdist = width / netSize.length;

    // create node locations
    var nodes = netSize.map((layerSize,numLayer) => {
      return (
          [...Array(layerSize)].map((a,numNode) => 
             {
              return {
                x:(numLayer + 0.5) * xdist,
                y: (numNode)*(height/(layerSize+1)) + (height/(layerSize+1)),
                bias: net.bias[numLayer][numNode].toFixed(3)
              }
             }
          )
      );
    });

    // autogenerate links
    var links = netSize.slice(0, -1).map((layerSize, index) => {
      const nextLayerSize = netSize[index+1]
      return (
          [...Array(nextLayerSize)].map((a,node) => {
              return (
                  [...Array(layerSize)].map((w,weight) => {
                    return {source: [
                      (index + 0.5) * xdist, //x
                      (weight)*(height/(layerSize+1)) + (height/(layerSize+1)) //y
                    ], target: [
                      (index +1+ 0.5) * xdist, //x
                      (node)*(height/(nextLayerSize+1)) + (height/(nextLayerSize+1)) //y 
                    ], value: net.weights[index][node][weight]}
                  })
              )
          })
      );
    })

    let linkList = [];

    links.forEach(layer => {
      layer.forEach( nodes => {
        nodes.forEach( weight => {
          linkList.push(weight);
        })
      })
    })

    // draw links
    // eslint-disable-next-line no-unused-vars
    var link = svg.selectAll(".link")
        .data(linkList)
        .enter().append("line")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source[0]; })
        .attr("y1", function(d) { return d.source[1]; })
        .attr("x2", function(d) { return d.target[0]; })
        .attr("y2", function(d) { return d.target[1]; })
        .style("stroke-width", function(d) { return 3*(1/(1+Math.exp(-d.value))+0.1); });
    
    link.append("text")
        .attr("dx", "-1.2em")
        .attr("dy", ".35em")
        .text(function(d) { return d.value; });

    var myText =  svg.selectAll(".node")
    .data(linkList)
    .enter().append("g")
    .attr("transform", function(d) {
        return "translate(" + (d.source[0]+(d.target[0]-d.source[0])/2) + "," + (d.source[1]+(d.target[1]-d.source[1])/2) + ")"; }
    );

    myText.append("text")
        .attr("dx", "-1.2em")
        .attr("dy", ".35em")
        .attr("font-size", "8px")
        .text(function(d) { return d.value.toFixed(3); });

    // draw nodes
    let nodeList = [];

    nodes.forEach(layer => {
      layer.forEach( n => {
        nodeList.push(n);
      })
    })

    var node = svg.selectAll(".node")
      .data(nodeList)
      .enter().append("g")
      .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")"; }
      );

      node.append("circle")
      .attr("class", "node")
      .attr("r", nodeSize)
      .style("fill", function(d) { 
          return percToColor((Number(d.bias)+1)/2); 
      });



    node.append("text")
        .attr("dx", "-1.2em")
        .attr("dy", ".35em")
        .text(function(d) { return d.bias; });
}