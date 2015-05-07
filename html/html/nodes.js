(function() {
    var width  = 700;
    var height = 800;

    var color = d3.scale.category20();

    var force = d3.layout.force()
    .charge(-1000)
    .linkDistance(50)
    .size([width, height]);

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("");

  var svg = d3.select(".cont1").append("svg")
    .attr("width", width)
    .attr("height", height);

  d3.json("nodes_links.json", function(error, graph) {
    force
    .nodes(graph.nodes)
    .links(graph.links)
    .start();

  var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", function(d) { return Math.sqrt(d.vulnerability); });

  var expected_ports = [1,2,3];
  var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 10)
    //.style("fill", function(d) { return color(d.Open_Ports); })
      .style("fill", function(d) { 
          return getColorByPorts(d.Ports.split("|"),expected_ports);	
    ; })
    //.on("mouseover", function(){return color("red"); }) //doesn't work
    .call(force.drag);

  var tip = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

  var bigtip = d3.select("body").append("div")   
    .attr("class", "bigtip")               
    .style("opacity", 0);

  /* on click, pop up a larger menu with colored dots related to service vulnerability*/
  node.on("mouseover", function(d) {
    d3.select(this).transition().duration(200).style("stroke", "red")
    tip.transition()        
    .duration(200)      
    .style("opacity", 1.0);     
  tip.html(  
    d.Address + "<br/>" + 
    d.OS + "<br/>"

    )  
    .style("left", (d3.event.pageX) + "px")     
    .style("top", (d3.event.pageY - 28) + "px");    
  })
  .on("mouseout", function(d){
    //d3.select(this).transition().duration(200).style("fill", function(d) { return color(d.OS); })
  })
  .on("mouseout", function(d) {
    d3.select(this).transition().duration(200).style("stroke", "white")								
    tip.transition()        
    .duration(500)      
    .style("opacity", 0);   
  })
  .on("dblclick",function(d){
    //stuff... maybe undo the "click"
    d3.select(this).transition().duration(200)
    .attr("r", 10)
    //.style("fill", function(d) { return color(d.OS); })
    .style("fill", function(d) {return getColorByPorts(d.Ports.split("|"),expected_ports);})	
    tip.transition()
    .duration(200)
    .style("opacity", 1)
    bigtip.transition()
    .duration(2000)
    .style("opacity", 0)
    .style("visibility", "hidden");

  })
  .on("click", function(d) {
    d3.select(this).transition().duration(200)
    .attr("r",25)
    .style("fill", "red")
    tip.transition()
    .duration(200)
    .style("opacity", 0)
    bigtip.transition()
    .duration(200)
    .style("opacity", 1.0)
    .style("visibility", "visible");
  bigtip.html( 
				"IP: " + d.Address + "<br/>" +	
				"OS: " + d.OS + "<br/>" + 
				"# of Open Ports: " + d.Open_Ports + "<br/>" + 
				"Ports: " + d.Ports.split("|")	+ "<br/>" +
				"more to come..." + "<br/>"
				)
				.style("left", (d3.event.pageX) + "px")     
				.style("top", (d3.event.pageY - 28) + "px");    
  });

  force.on("tick", function(d) {
    link.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
  });

  d3.on("click", function(d) {
    bigtip.transition()
    .duration(200)
    .style("opacity", 0)
  });
});

function getColorByPorts(a1,a2) {
  a3 = [];
  colr = "";
  for (i = 0; i < a1.length; i++) {
    if (a2.indexOf(parseInt(a1[i])) == -1) {
      a3.push(a1[i]);
    }
  }
  if (a3.length > 0) {
    colr = "#d62728"//"red";
  }
  else {
    colr = "#1f77b4"//"blue";
  }
  return colr; 
//return "red";
}

})();
