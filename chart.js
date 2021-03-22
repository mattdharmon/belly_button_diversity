function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    let sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    let metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    let PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("li")
        .attr('class', 'list-group-item')
        .text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample_id) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data)
    // 3. Create a letiable that holds the samples array. 
    const samples = data.samples;

    // 4. Create a letiable that filters the samples for the object with the desired sample number.
    const sample = samples.filter(_ => _.id == sample_id)[0];

    //  5. Create a letiable that holds the first sample in the array.


    // 6. Create letiables that hold the otu_ids, otu_labels, and sample_values.
    const otuIds = sample.otu_ids;
    const otuLabels = sample.otu_labels;
    const sampleValues = sample.sample_values;


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    const yticks = otuIds
      .slice(0,10)
      .map(_ => `OTU ${_}`)
      .reverse();

    console.log(yticks.length)

    // 8. Create the trace for the bar chart. 
    const barData = [{
      x: sampleValues.slice(0, 10)
        .reverse(),
      y: yticks,
      text: otuLabels.slice(0, 10)
        .reverse(),
      type: 'bar',
      orientation: 'h'
    }];

    // 9. Create the layout for the bar chart. 
    const barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      yaxis: {ticks: yticks},
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

    // Bubble Chart

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample'
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Guage

        
    let metadata = data.metadata.filter(_ => _.id == sample_id)[0];
    console.log(metadata)
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: metadata.wfreq,
      title: { text: "Belly Button Washing Frequency<br><sub>Scrubs per Week</sub>" },
      type: "indicator",
      mode: "gauge+number",
      delta: { reference: 0 },
      gauge: { 
        axis: { range: [0, 10], nticks: 6 },
        bar: { color: 'black' },
        steps: [
          {range: [0, 2], color: 'red'},
          {range: [2, 4], color: 'orange'},
          {range: [4, 6], color: 'yellow'},
          {range: [6, 8], color: 'lightgreen'},
          {range: [8, 10], color: 'green'},
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      margin: { t: 0, b: 0 },
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
